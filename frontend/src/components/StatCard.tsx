import { cn } from '@/lib/cn';

export function StatCard({ title, value, subtitle, accent = false }: { title: string; value: string | number; subtitle?: string; accent?: boolean }) {
  return (
    <div className={cn('rounded-3xl border p-5 backdrop-blur-xl', accent ? 'border-cyan-400/30 bg-cyan-400/10' : 'border-white/10 bg-white/5')}>
      <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{title}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      {subtitle ? <div className="mt-2 text-sm text-slate-300">{subtitle}</div> : null}
    </div>
  );
}
