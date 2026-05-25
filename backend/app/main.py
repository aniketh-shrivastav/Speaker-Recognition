from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database.mongo import close_mongo, get_database
from app.routes.admin import router as admin_router
from app.routes.analytics import router as analytics_router
from app.routes.auth import router as auth_router
from app.routes.speaker import router as speaker_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    for folder in (settings.upload_dir, settings.model_dir):
        Path(folder).mkdir(parents=True, exist_ok=True)
    await get_database().command("ping")
    yield
    await close_mongo()


settings = get_settings()
app = FastAPI(title="Speaker Recognition API", description="FastAPI backend for SpeechBrain-powered speaker recognition", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(speaker_router)
app.include_router(analytics_router)
app.include_router(admin_router)


@app.get("/")
async def root():
    return {"message": "Speaker Recognition API is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
