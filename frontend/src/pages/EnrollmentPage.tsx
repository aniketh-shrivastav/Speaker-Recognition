import { useMemo, useState } from 'react';
import { Upload, Mic, LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { speakerApi } from '@/api/endpoints';
import { AppChrome } from '@/components/AppChrome';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { WaveformCanvas } from '@/components/WaveformCanvas';

export function EnrollmentPage() {
  const [speakerName, setSpeakerName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waveFile, setWaveFile] = useState<File | null>(null);

  const canSubmit = useMemo(() => speakerName.trim().length > 0 && files.length > 0, [speakerName, files]);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const list = Array.from(incoming);
    setFiles((current) => [...current, ...list]);
    setWaveFile(list[0] ?? null);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
      setFiles((current) => [...current, file]);
      setWaveFile(file);
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.start();
    setRecording(true);
    setTimeout(() => {
      recorder.stop();
      setRecording(false);
    }, 4500);
  };

  const submit = async () => {
    setLoading(true);
    try {
      await speakerApi.enroll({ speaker_name: speakerName, files });
      toast.success('Speaker enrolled');
      setSpeakerName('');
      setFiles([]);
      setWaveFile(null);
    } catch (error) {
      toast.error('Enrollment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="p-6">
        <AppChrome />
        <SectionTitle eyebrow="Speaker profile" title="Enrollment" subtitle="Upload or record multiple samples, preview the waveform, and save a new speaker profile." />
        <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <input value={speakerName} onChange={(event) => setSpeakerName(event.target.value)} placeholder="Speaker name" className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none" />
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-400/30 bg-cyan-400/5 px-6 py-8 text-center transition hover:bg-cyan-400/10">
              <Upload className="h-6 w-6 text-cyan-300" />
              <span className="mt-3 text-white">Drag and drop audio or click to upload</span>
              <span className="mt-1 text-sm text-slate-400">WAV, MP3, FLAC</span>
              <input hidden type="file" accept="audio/*" multiple onChange={(event) => handleFiles(event.target.files)} />
            </label>
            <button onClick={startRecording} className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
              {recording ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />} {recording ? 'Recording...' : 'Record from browser'}
            </button>
            <button disabled={!canSubmit || loading} onClick={submit} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-medium text-slate-950 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save speaker profile'}
            </button>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              {files.map((file) => <div key={file.name} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">{file.name}</div>)}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 text-lg font-semibold text-white">Waveform preview</div>
            <WaveformCanvas file={waveFile} />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {['Audio preview', 'File validation', 'Progress tracking'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
