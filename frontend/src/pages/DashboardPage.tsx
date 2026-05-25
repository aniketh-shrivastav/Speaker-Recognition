import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { analyticsApi } from '@/api/endpoints';
import { AppChrome } from '@/components/AppChrome';
import { PageShell } from '@/components/PageShell';
import { SectionTitle } from '@/components/SectionTitle';
import { StatCard } from '@/components/StatCard';
import type { DashboardSummary } from '@/types';

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    analyticsApi.dashboard().then(setSummary).catch(() => setSummary(null));
  }, []);

  return (
    <PageShell>
      <div className="p-6">
        <AppChrome />
        <SectionTitle eyebrow="Overview" title="Dashboard" subtitle="Monitor speaker enrollment, recognition activity, and system health from a single control surface." />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Registered speakers" value={summary?.total_registered_speakers ?? 0} subtitle="Speaker profiles in the database" accent />
          <StatCard title="Recognition attempts" value={summary?.recognition_attempts ?? 0} subtitle="Uploads processed by the model" />
          <StatCard title="Model accuracy" value={`${summary?.accuracy ?? 0}%`} subtitle="Share of non-unknown matches" />
          <StatCard title="System status" value={summary?.system_status ?? 'Loading'} subtitle="Backend and database health" />
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 text-lg font-semibold text-white">Recognition activity</div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary?.activity ?? []}>
                  <defs>
                    <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4de1ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4de1ff" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16 }} />
                  <Area type="monotone" dataKey="attempts" stroke="#4de1ff" fill="url(#activityFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-semibold text-white">Recent uploads</div>
            <div className="mt-4 space-y-3">
              {summary?.recent_uploads?.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="font-medium text-white">{item.predicted_speaker}</div>
                  <div className="mt-1 text-xs text-slate-400">Confidence {item.confidence.toFixed(2)}</div>
                  <div className="mt-1 text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
