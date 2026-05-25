from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from time import perf_counter
from typing import Any

from bson import ObjectId
from fastapi import HTTPException, UploadFile, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config import get_settings
from app.ml.speechbrain_service import cosine_similarity, embedding_from_audio_file, mean_embedding
from app.utils.audio import ensure_supported_file, mfcc_image, secure_filename, spectrogram_image, waveform_image


async def save_upload(upload: UploadFile, folder: Path) -> Path:
    settings = get_settings()
    if not upload.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing filename")

    filename = secure_filename(upload.filename)
    destination = folder / f"{int(datetime.now(timezone.utc).timestamp() * 1000)}_{filename}"
    content = await upload.read()
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File exceeds upload limit")
    destination.write_bytes(content)
    ensure_supported_file(destination)
    return destination


async def enroll_speaker(
    db: AsyncIOMotorDatabase,
    speaker_name: str,
    user_id: str,
    files: list[UploadFile],
) -> dict:
    settings = get_settings()
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one audio sample is required")

    saved_files: list[dict[str, Any]] = []
    embeddings: list[list[float]] = []

    for file in files:
        saved_path = await save_upload(file, upload_dir)
        embedding = embedding_from_audio_file(str(saved_path))
        embeddings.append(embedding)
        saved_files.append(
            {
                "path": str(saved_path),
                "original_name": file.filename,
                "created_at": datetime.now(timezone.utc),
            }
        )

    speakers = db.speakers
    existing = await speakers.find_one({"speaker_name": speaker_name, "created_by": user_id})
    base_embeddings = existing.get("embeddings", []) if existing else []
    combined_embeddings = base_embeddings + embeddings
    profile_embedding = mean_embedding(combined_embeddings)

    now = datetime.now(timezone.utc)
    speaker_doc = {
        "speaker_name": speaker_name,
        "audio_files": (existing.get("audio_files", []) if existing else []) + saved_files,
        "embeddings": combined_embeddings,
        "embedding_vector": profile_embedding,
        "sample_count": len(combined_embeddings),
        "created_by": user_id,
        "created_at": existing["created_at"] if existing else now,
        "updated_at": now,
    }

    if existing:
        await speakers.update_one({"_id": existing["_id"]}, {"$set": speaker_doc})
        speaker_id = str(existing["_id"])
    else:
        result = await speakers.insert_one(speaker_doc)
        speaker_id = str(result.inserted_id)

    return {"id": speaker_id, "speaker_name": speaker_name, "sample_count": len(combined_embeddings), "created_by": user_id, "created_at": speaker_doc["created_at"], "updated_at": now, "audio_files": speaker_doc["audio_files"], "embedding_vector": profile_embedding}


async def recognize_speaker(db: AsyncIOMotorDatabase, audio_file: UploadFile, user_id: str) -> dict:
    settings = get_settings()
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    saved_path = await save_upload(audio_file, upload_dir)

    start = perf_counter()
    query_embedding = embedding_from_audio_file(str(saved_path))
    speakers = await db.speakers.find({}).to_list(length=500)

    best_match = {"speaker_name": "Unknown", "confidence": 0.0, "similarity": 0.0, "speaker_id": None}
    for speaker in speakers:
        candidate_embedding = speaker.get("embedding_vector") or mean_embedding(speaker.get("embeddings", []))
        if not candidate_embedding:
            continue
        similarity = cosine_similarity(query_embedding, candidate_embedding)
        if similarity > best_match["similarity"]:
            best_match = {"speaker_name": speaker["speaker_name"], "confidence": max(0.0, min(1.0, (similarity + 1) / 2)), "similarity": similarity, "speaker_id": str(speaker["_id"])}

    threshold = 0.35
    if best_match["similarity"] < threshold:
        best_match = {"speaker_name": "Unknown", "confidence": 0.0, "similarity": best_match["similarity"], "speaker_id": None}

    elapsed_ms = (perf_counter() - start) * 1000
    history_doc = {
        "uploaded_audio": str(saved_path),
        "uploaded_filename": audio_file.filename,
        "predicted_speaker": best_match["speaker_name"],
        "speaker_id": best_match["speaker_id"],
        "confidence": round(float(best_match["confidence"]), 4),
        "similarity_percentage": round(float(best_match["similarity"] * 100), 2),
        "recognition_time_ms": round(elapsed_ms, 2),
        "timestamp": datetime.now(timezone.utc),
        "recognized_by": user_id,
        "waveform_image": waveform_image(str(saved_path)),
        "spectrogram_image": spectrogram_image(str(saved_path)),
        "mfcc_image": mfcc_image(str(saved_path)),
    }
    inserted = await db.history.insert_one(history_doc)
    history_doc["id"] = str(inserted.inserted_id)
    return history_doc


async def list_history(db: AsyncIOMotorDatabase, user_id: str, page: int, page_size: int, search: str | None, speaker: str | None) -> dict:
    query: dict[str, Any] = {"recognized_by": user_id}
    if speaker:
        query["predicted_speaker"] = speaker
    if search:
        query["$or"] = [{"uploaded_filename": {"$regex": search, "$options": "i"}}, {"predicted_speaker": {"$regex": search, "$options": "i"}}]

    total = await db.history.count_documents(query)
    cursor = db.history.find(query).sort("timestamp", -1).skip((page - 1) * page_size).limit(page_size)
    items = []
    async for item in cursor:
        item["id"] = str(item["_id"])
        items.append(item)
    return {"items": items, "total": total, "page": page, "page_size": page_size}


async def delete_speaker(db: AsyncIOMotorDatabase, speaker_id: str, user_id: str, admin: bool = False) -> None:
    speaker = await db.speakers.find_one({"_id": ObjectId(speaker_id)})
    if not speaker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Speaker not found")
    if not admin and speaker.get("created_by") != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to delete this speaker")

    for audio in speaker.get("audio_files", []):
        path = audio.get("path")
        if path and os.path.exists(path):
            os.remove(path)
    await db.speakers.delete_one({"_id": speaker["_id"]})


async def recompute_models(db: AsyncIOMotorDatabase) -> dict:
    speakers = await db.speakers.find({}).to_list(length=2000)
    updated = 0
    for speaker in speakers:
        embeddings = speaker.get("embeddings", [])
        embedding_vector = mean_embedding(embeddings)
        await db.speakers.update_one({"_id": speaker["_id"]}, {"$set": {"embedding_vector": embedding_vector, "sample_count": len(embeddings), "updated_at": datetime.now(timezone.utc)}})
        updated += 1
    return {"retrained_speakers": updated}
