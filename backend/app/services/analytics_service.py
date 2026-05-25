from datetime import datetime, timedelta, timezone

from motor.motor_asyncio import AsyncIOMotorDatabase


async def dashboard_summary(db: AsyncIOMotorDatabase, user_id: str | None = None) -> dict:
    speaker_query = {"created_by": user_id} if user_id else {}
    history_query = {"recognized_by": user_id} if user_id else {}
    total_speakers = await db.speakers.count_documents(speaker_query)
    total_attempts = await db.history.count_documents(history_query)
    recent_uploads = await db.history.find(history_query).sort("timestamp", -1).limit(5).to_list(length=5)
    recent_speakers = await db.speakers.find(speaker_query).sort("updated_at", -1).limit(5).to_list(length=5)
    success_ratio = 0.0
    if total_attempts:
        matched = await db.history.count_documents({**history_query, "predicted_speaker": {"$ne": "Unknown"}})
        success_ratio = round((matched / total_attempts) * 100, 2)

    activity = []
    for days_back in range(6, -1, -1):
        day = (datetime.now(timezone.utc) - timedelta(days=days_back)).date()
        start = datetime.combine(day, datetime.min.time(), tzinfo=timezone.utc)
        end = start + timedelta(days=1)
        activity.append({"day": day.isoformat(), "attempts": await db.history.count_documents({**history_query, "timestamp": {"$gte": start, "$lt": end}})})

    return {"total_registered_speakers": total_speakers, "recognition_attempts": total_attempts, "accuracy": success_ratio, "recent_uploads": recent_uploads, "recent_speakers": recent_speakers, "activity": activity, "system_status": "operational"}


async def admin_metrics(db: AsyncIOMotorDatabase) -> dict:
    users = await db.users.count_documents({})
    speakers = await db.speakers.count_documents({})
    history = await db.history.count_documents({})
    errors = await db.history.count_documents({"predicted_speaker": "Unknown"})
    return {"users": users, "speakers": speakers, "recognitions": history, "unknown_matches": errors, "model_accuracy": round(((history - errors) / history) * 100, 2) if history else 0.0}


async def list_users(db: AsyncIOMotorDatabase) -> list[dict]:
    items = []
    async for user in db.users.find({}).sort("created_at", -1):
        items.append({"id": str(user["_id"]), "username": user.get("username"), "email": user.get("email"), "role": user.get("role", "user"), "created_at": user.get("created_at")})
    return items


async def delete_user(db: AsyncIOMotorDatabase, user_id: str) -> None:
    from bson import ObjectId

    await db.users.delete_one({"_id": ObjectId(user_id)})


async def delete_history_record(db: AsyncIOMotorDatabase, record_id: str) -> None:
    from bson import ObjectId

    await db.history.delete_one({"_id": ObjectId(record_id)})
