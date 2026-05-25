from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongo import get_db
from app.dependencies import get_current_user
from app.services.analytics_service import dashboard_summary

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def dashboard(db: AsyncIOMotorDatabase = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return await dashboard_summary(db, current_user["id"])
