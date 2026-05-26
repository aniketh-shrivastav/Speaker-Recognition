import { useEffect, useRef } from "react";

export function WaveformCanvas({ file }: { file: File | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let cancelled = false;
    const reader = new FileReader();
    reader.onload = async () => {
      if (cancelled) return;
      const audioContext = new AudioContext();
      const arrayBuffer = reader.result as ArrayBuffer;
      const audioBuffer = await audioContext.decodeAudioData(
        arrayBuffer.slice(0),
      );
      const data = audioBuffer.getChannelData(0);
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(255,255,255,0.04)";
      context.fillRect(0, 0, width, height);
      context.lineWidth = 1.5;
      context.strokeStyle = "#4de1ff";
      context.beginPath();
      const step = Math.max(1, Math.floor(data.length / width));
      for (let x = 0; x < width; x += 1) {
        let min = 1;
        let max = -1;
        for (let i = 0; i < step; i += 1) {
          const datum = data[x * step + i];
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }
        context.moveTo(x, ((1 + min) * height) / 2);
        context.lineTo(x, ((1 + max) * height) / 2);
      }
      context.stroke();
    };
    reader.readAsArrayBuffer(file);

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <canvas
      ref={canvasRef}
      width={920}
      height={160}
      className="h-40 w-full rounded-2xl border border-white/10 bg-slate-950/40"
    />
  );
}
