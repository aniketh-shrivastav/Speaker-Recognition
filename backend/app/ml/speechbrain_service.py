from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

import numpy as np
import torch

_cache_root = Path(__file__).resolve().parents[2] / "trained_models" / "huggingface_cache"
_cache_root.mkdir(parents=True, exist_ok=True)
os.environ.setdefault("HF_HOME", str(_cache_root))
os.environ.setdefault("HUGGINGFACE_HUB_CACHE", str(_cache_root / "hub"))

from speechbrain.inference.speaker import EncoderClassifier
from speechbrain.utils.fetching import LocalStrategy

from app.config import get_settings
from app.utils.audio import load_audio


@lru_cache
def get_encoder() -> EncoderClassifier:
    settings = get_settings()
    savedir = Path(settings.model_dir) / "speechbrain" / "spkrec-ecapa-voxceleb"
    savedir.mkdir(parents=True, exist_ok=True)
    return EncoderClassifier.from_hparams(source=settings.speechbrain_source, savedir=str(savedir), local_strategy=LocalStrategy.COPY)


def embedding_from_audio_file(path: str) -> list[float]:
    waveform, _ = load_audio(path)
    encoder = get_encoder()
    tensor = encoder.encode_batch(torch.from_numpy(np.expand_dims(waveform, axis=0)).float())
    embedding = tensor.squeeze().detach().cpu().numpy().astype(np.float32)
    return embedding.tolist()


def cosine_similarity(left: list[float], right: list[float]) -> float:
    left_vector = np.array(left, dtype=np.float32)
    right_vector = np.array(right, dtype=np.float32)
    denominator = np.linalg.norm(left_vector) * np.linalg.norm(right_vector)
    if denominator == 0:
        return 0.0
    return float(np.dot(left_vector, right_vector) / denominator)


def mean_embedding(embeddings: list[list[float]]) -> list[float]:
    if not embeddings:
        return []
    return np.mean(np.array(embeddings, dtype=np.float32), axis=0).astype(np.float32).tolist()
