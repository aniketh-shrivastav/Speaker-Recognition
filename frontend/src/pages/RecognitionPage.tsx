import { useState } from "react";
import { LoaderCircle, Mic, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { speakerApi } from "@/api/endpoints";
import { AppChrome } from "@/components/AppChrome";
import { LoadingDots } from "@/components/LoadingDots";
import { PageShell } from "@/components/PageShell";
import { SectionTitle } from "@/components/SectionTitle";
import type { RecognitionRecord } from "@/types";

export function RecognitionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecognitionRecord | null>(null);

  const startRecording = async () => {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const recordedFile = new File([blob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        setFile(recordedFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setRecording(true);
      setTimeout(() => {
        recorder.stop();
        setRecording(false);
      }, 4500);
    } catch (error) {
      setRecording(false);
      toast.error("Microphone access denied");
    }
  };

  const recognize = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const data = await speakerApi.recognize(file);
      setResult(data);
      toast.success("Recognition complete");
    } catch (error: any) {
      const responseData = error?.response?.data;
      const message =
        responseData?.detail ||
        responseData?.message ||
        (typeof responseData === "string" ? responseData : null) ||
        error?.message ||
        "Recognition failed";
      toast.error(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="p-6">
        <AppChrome />
        <SectionTitle
          eyebrow="Identify voice"
          title="Recognition"
          subtitle="Upload unknown audio, run speaker identification, and inspect the model output with visual diagnostics."
        />
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-400/30 bg-cyan-400/5 px-6 py-10 text-center transition hover:bg-cyan-400/10">
              <Upload className="h-6 w-6 text-cyan-300" />
              <span className="mt-3 text-white">Upload unknown audio</span>
              <span className="mt-1 text-sm text-slate-400">
                WAV, MP3, FLAC
              </span>
              <input
                hidden
                type="file"
                accept="audio/*"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <button
              onClick={startRecording}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            >
              {recording ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {recording ? "Recording..." : "Record from browser"}
            </button>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
              {file ? file.name : "No file selected"}
            </div>
            <button
              onClick={recognize}
              disabled={!file || loading}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-medium text-slate-950 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Run recognition"}
            </button>
            {loading ? (
              <div className="mt-4">
                <LoadingDots label="Extracting embeddings" />
              </div>
            ) : null}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Predicted
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {result?.predicted_speaker ?? "Waiting"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Confidence
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {result ? `${(result.confidence * 100).toFixed(1)}%` : "--"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Time
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {result
                    ? `${result.recognition_time_ms.toFixed(0)} ms`
                    : "--"}
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {[
                { title: "Waveform", src: result?.waveform_image },
                { title: "Spectrogram", src: result?.spectrogram_image },
                { title: "MFCC", src: result?.mfcc_image },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-slate-950/40 p-3"
                >
                  <div className="mb-2 text-sm text-slate-300">
                    {item.title}
                  </div>
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="h-48 w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-500">
                      No visualization yet
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
