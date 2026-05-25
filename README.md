# Speaker Recognition Platform

Modern full-stack speaker recognition app built with React, Tailwind CSS, FastAPI, MongoDB, and SpeechBrain ECAPA-TDNN embeddings.

## What it includes

- JWT authentication
- Voice sample enrollment with multi-file upload and browser recording
- Speaker recognition with confidence and similarity scoring
- Waveform, spectrogram, and MFCC previews
- History, analytics, and admin control pages
- Dockerized local deployment

## Project layout

- [frontend](frontend) - React/Vite/Tailwind UI
- [backend](backend) - FastAPI + MongoDB + SpeechBrain APIs

## Local setup

### Backend

```bash
cd backend
copy .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

### Database

Run MongoDB locally or use Atlas. Update `backend/.env` accordingly.

## Docker

```bash
docker compose up --build
```

This starts MongoDB, the FastAPI backend, and the React frontend.

## API endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /speaker/enroll`
- `POST /speaker/recognize`
- `GET /speaker/history`
- `DELETE /speaker/{id}`
- `GET /analytics/dashboard`
- `GET /admin/metrics`
- `GET /admin/users`
- `DELETE /admin/users/{id}`
- `DELETE /admin/recordings/{id}`
- `POST /admin/retrain`

## SpeechBrain approach

The app uses the pretrained `speechbrain/spkrec-ecapa-voxceleb` model to generate speaker embeddings. Enrollment stores centroid embeddings per speaker, and recognition compares incoming embeddings against stored profiles using cosine similarity.
