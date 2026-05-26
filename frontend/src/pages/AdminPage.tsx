import { useEffect, useState } from "react";
import { Shield, RefreshCw, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";

import { analyticsApi, speakerApi } from "@/api/endpoints";
import { AppChrome } from "@/components/AppChrome";
import { PageShell } from "@/components/PageShell";
import { SectionTitle } from "@/components/SectionTitle";
import { StatCard } from "@/components/StatCard";
import type { AdminMetrics } from "@/types";

export function AdminPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<
    Array<{
      id: string;
      username: string;
      email: string;
      role: string;
      created_at: string;
    }>
  >([]);

  const refresh = async () => {
    const [metricData, userData] = await Promise.all([
      analyticsApi.adminMetrics(),
      analyticsApi.adminUsers(),
    ]);
    setMetrics(metricData);
    setUsers(userData);
  };

  useEffect(() => {
    refresh().catch(() => toast.error("Failed to load admin data"));
  }, []);

  const retrain = async () => {
    await analyticsApi.retrain();
    toast.success("Retraining task started");
  };

  return (
    <PageShell>
      <div className="p-6">
        <AppChrome />
        <SectionTitle
          eyebrow="Admin control"
          title="Admin Panel"
          subtitle="Manage users, review system health, and trigger model refresh operations."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Users"
            value={metrics?.users ?? 0}
            subtitle="Registered accounts"
            accent
          />
          <StatCard
            title="Speakers"
            value={metrics?.speakers ?? 0}
            subtitle="Speaker profiles"
          />
          <StatCard
            title="Recognitions"
            value={metrics?.recognitions ?? 0}
            subtitle="Processed requests"
          />
          <StatCard
            title="Model accuracy"
            value={`${metrics?.model_accuracy ?? 0}%`}
            subtitle="Current estimate"
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                <Users className="h-5 w-5 text-cyan-300" /> Users
              </div>
              <button
                onClick={() =>
                  refresh().catch(() => toast.error("Refresh failed"))
                }
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                >
                  <div>
                    <div className="font-medium text-white">
                      {user.username}
                    </div>
                    <div className="text-sm text-slate-400">
                      {user.email} · {user.role}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await analyticsApi.adminDeleteUser(user.id);
                      toast.success("User deleted");
                      refresh();
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                <Shield className="h-5 w-5 text-cyan-300" /> Operations
              </div>
              <button
                onClick={retrain}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-medium text-slate-950"
              >
                <RefreshCw className="h-4 w-4" /> Retrain model
              </button>
            </div>
            <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
              The app uses VoiceCore embeddings, so retraining rebuilds speaker
              centroids from stored enrollment samples instead of training a
              custom deep model from scratch.
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
