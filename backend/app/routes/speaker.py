from fastapi import APIRouter, Depends, File, Form, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongo import get_db
from app.dependencies import get_current_user
from app.services.speaker_service import delete_speaker, enroll_speaker, list_history, recognize_speaker

router = APIRouter(prefix="/speaker", tags=["Speaker"])


@router.post("/enroll")
async def enroll(
    speaker_name: str = Form(...),
    files: list[UploadFile] = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return await enroll_speaker(db, speaker_name, current_user["id"], files)


@router.post("/recognize")
async def recognize(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return await recognize_speaker(db, file, current_user["id"])


@router.get("/history")
async def history(
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
    speaker: str | None = None,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return await list_history(db, current_user["id"], page, page_size, search, speaker)


@router.delete("/{speaker_id}")
async def remove_speaker(
    speaker_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    await delete_speaker(db, speaker_id, current_user["id"], admin=current_user.get("role") == "admin")
    return {"message": "Speaker deleted successfully"}
