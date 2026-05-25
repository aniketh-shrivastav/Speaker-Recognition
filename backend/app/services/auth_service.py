from datetime import datetime, timezone

from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.auth import UserCreate, UserLogin
from app.utils.security import create_access_token, hash_password, verify_password


async def register_user(db: AsyncIOMotorDatabase, payload: UserCreate) -> dict:
    users = db.users
    existing = await users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = {
        "username": payload.username,
        "email": payload.email.lower(),
        "password": hash_password(payload.password),
        "role": payload.role or "user",
        "created_at": datetime.now(timezone.utc),
    }
    result = await users.insert_one(user)
    token = create_access_token(subject=str(result.inserted_id), role=user["role"])
    return {"id": str(result.inserted_id), "username": user["username"], "email": user["email"], "role": user["role"], "access_token": token}


async def login_user(db: AsyncIOMotorDatabase, payload: UserLogin) -> dict:
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(subject=str(user["_id"]), role=user.get("role", "user"))
    return {"id": str(user["_id"]), "username": user["username"], "email": user["email"], "role": user.get("role", "user"), "access_token": token}
