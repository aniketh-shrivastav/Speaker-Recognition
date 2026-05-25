import { NavLink } from 'react-router-dom';

import { useAuthStore } from '@/store/authStore';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-xl px-3 py-2 text-sm transition ${isActive ? 'bg-white/10 text-white shadow-glow' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`;

export function PageShell({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-bg text-slate-100">
      <div className="fixed inset-0 -z-10 bg-aurora opacity-80" />
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 flex-col rounded-3xl border border-white/10 bg-panel p-4 shadow-glow backdrop-blur-xl lg:flex">
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Speaker AI</div>
            <div className="mt-2 text-xl font-semibold">Voice Intelligence</div>
            <p className="mt-2 text-sm text-slate-400">Enrollment, recognition, analytics, and model control in one dashboard.</p>
          </div>
          <nav className="flex flex-1 flex-col gap-2">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/enroll" className={linkClass}>Enrollment</NavLink>
            <NavLink to="/recognize" className={linkClass}>Recognition</NavLink>
            <NavLink to="/history" className={linkClass}>History</NavLink>
            <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          </nav>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <div className="font-medium text-white">Signed in</div>
            <div className="mt-1">{user?.username}</div>
            <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
              <span>{user?.role}</span>
              <button onClick={logout} className="text-cyan-300 transition hover:text-white">Logout</button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-panelStrong shadow-glow backdrop-blur-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
