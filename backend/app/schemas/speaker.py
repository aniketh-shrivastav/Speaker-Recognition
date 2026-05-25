from datetime import datetime

from pydantic import BaseModel, Field


class SpeakerBase(BaseModel):
    speaker_name: str = Field(min_length=1, max_length=80)


class SpeakerOut(BaseModel):
    id: str
    speaker_name: str
    audio_files: list[dict]
    sample_count: int
    created_by: str
    created_at: datetime
    updated_at: datetime


class RecognitionOut(BaseModel):
    id: str
    predicted_speaker: str
    confidence: float
    similarity_percentage: float
    recognition_time_ms: float
    timestamp: datetime
    uploaded_audio: str
    waveform_image: str | None = None
    spectrogram_image: str | None = None
    mfcc_image: str | None = None
