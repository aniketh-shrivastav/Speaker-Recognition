from __future__ import annotations

import base64
import io
from pathlib import Path

import librosa
import librosa.display
import matplotlib
import matplotlib.pyplot as plt
import numpy as np

matplotlib.use("Agg")


SUPPORTED_EXTENSIONS = {".wav", ".mp3", ".flac", ".m4a", ".aac", ".ogg"}


def ensure_supported_file(path: Path) -> None:
    if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        raise ValueError("Unsupported audio format. Use WAV, MP3, FLAC, M4A, AAC, or OGG.")


def load_audio(path: str, target_sr: int = 16000) -> tuple[np.ndarray, int]:
    waveform, sample_rate = librosa.load(path, sr=target_sr, mono=True)
    if waveform.size == 0:
        raise ValueError("Audio file is empty or unreadable.")
    return waveform.astype(np.float32), sample_rate


def audio_features(path: str, target_sr: int = 16000) -> dict[str, np.ndarray]:
    waveform, sample_rate = load_audio(path, target_sr)
    mfcc = librosa.feature.mfcc(y=waveform, sr=sample_rate, n_mfcc=20)
    chroma = librosa.feature.chroma_stft(y=waveform, sr=sample_rate)
    contrast = librosa.feature.spectral_contrast(y=waveform, sr=sample_rate)
    zcr = librosa.feature.zero_crossing_rate(waveform)
    mel = librosa.feature.melspectrogram(y=waveform, sr=sample_rate)
    return {"waveform": waveform, "mfcc": mfcc, "chroma": chroma, "contrast": contrast, "zcr": zcr, "mel": mel}


def _plot_to_data_uri(fig: plt.Figure) -> str:
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", bbox_inches="tight", facecolor="#08111f")
    plt.close(fig)
    buffer.seek(0)
    encoded = base64.b64encode(buffer.read()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"


def waveform_image(path: str) -> str:
    data = audio_features(path)
    waveform = data["waveform"]
    fig, ax = plt.subplots(figsize=(10, 2.5), facecolor="#08111f")
    ax.set_facecolor("#08111f")
    ax.plot(waveform, color="#7dd3fc", linewidth=1)
    ax.set_title("Waveform", color="#e5eef7")
    ax.tick_params(colors="#9db2c7")
    for spine in ax.spines.values():
        spine.set_color("#1f2c3d")
    return _plot_to_data_uri(fig)


def spectrogram_image(path: str) -> str:
    waveform, sample_rate = load_audio(path)
    stft = librosa.stft(waveform)
    db = librosa.amplitude_to_db(np.abs(stft), ref=np.max)
    fig, ax = plt.subplots(figsize=(10, 2.5), facecolor="#08111f")
    ax.set_facecolor("#08111f")
    img = librosa.display.specshow(db, sr=sample_rate, x_axis="time", y_axis="hz", ax=ax, cmap="magma")
    ax.set_title("Spectrogram", color="#e5eef7")
    ax.tick_params(colors="#9db2c7")
    for spine in ax.spines.values():
        spine.set_color("#1f2c3d")
    fig.colorbar(img, ax=ax, format="%+2.0f dB")
    return _plot_to_data_uri(fig)


def mfcc_image(path: str) -> str:
    waveform, sample_rate = load_audio(path)
    mfcc = librosa.feature.mfcc(y=waveform, sr=sample_rate, n_mfcc=20)
    fig, ax = plt.subplots(figsize=(10, 2.5), facecolor="#08111f")
    ax.set_facecolor("#08111f")
    img = librosa.display.specshow(mfcc, sr=sample_rate, x_axis="time", ax=ax, cmap="coolwarm")
    ax.set_title("MFCC", color="#e5eef7")
    ax.tick_params(colors="#9db2c7")
    for spine in ax.spines.values():
        spine.set_color("#1f2c3d")
    fig.colorbar(img, ax=ax)
    return _plot_to_data_uri(fig)


def secure_filename(name: str) -> str:
    safe = "".join(char if char.isalnum() or char in {".", "-", "_"} else "_" for char in name)
    return safe or "audio.wav"
