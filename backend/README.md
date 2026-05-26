# Backend

FastAPI service for the Speaker Recognition app.

## Run

```bash
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Notes

- Uses MongoDB for users, speakers, and recognition history.
- Uses SpeechBrain ECAPA-TDNN embeddings for enrollment and recognition.
- Returns waveform, spectrogram, and MFCC previews as base64 images.
