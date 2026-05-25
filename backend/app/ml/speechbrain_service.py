from __future__ import annotations

from functools import lru_cache

import numpy as np
from speechbrain.inference.speaker import EncoderClassifier

from app.config import get_settings
from app.utils.audio import load_audio


@lru_cache
def get_encoder() -> EncoderClassifier:
    settings = get_settings()
    return EncoderClassifier.from_hparams(source=settings.speechbrain_source)


def embedding_from_audio_file(path: str) -> list[float]:
    waveform, _ = load_audio(path)
    encoder = get_encoder()
    tensor = encoder.encode_batch(np.expand_dims(waveform, axis=0))
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
