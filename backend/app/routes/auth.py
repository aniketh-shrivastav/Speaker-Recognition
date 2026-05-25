from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongo import get_db
from app.schemas.auth import UserCreate, UserLogin
from app.services.auth_service import login_user, register_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
async def register(payload: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await register_user(db, payload)


@router.post("/login")
async def login(payload: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await login_user(db, payload)
