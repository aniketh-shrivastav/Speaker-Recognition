from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongo import get_db
from app.dependencies import require_admin
from app.services.analytics_service import admin_metrics, delete_history_record, delete_user, list_users
from app.services.speaker_service import recompute_models

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/metrics")
async def metrics(db: AsyncIOMotorDatabase = Depends(get_db), current_user: dict = Depends(require_admin)):
    return await admin_metrics(db)


@router.get("/users")
async def users(db: AsyncIOMotorDatabase = Depends(get_db), current_user: dict = Depends(require_admin)):
    return await list_users(db)


@router.delete("/users/{user_id}")
async def remove_user(user_id: str, db: AsyncIOMotorDatabase = Depends(get_db), current_user: dict = Depends(require_admin)):
    await delete_user(db, user_id)
    return {"message": "User deleted successfully"}


@router.delete("/recordings/{record_id}")
async def remove_recording(record_id: str, db: AsyncIOMotorDatabase = Depends(get_db), current_user: dict = Depends(require_admin)):
    await delete_history_record(db, record_id)
    return {"message": "Recording deleted successfully"}


@router.post("/retrain")
async def retrain(db: AsyncIOMotorDatabase = Depends(get_db), current_user: dict = Depends(require_admin)):
    return await recompute_models(db)
