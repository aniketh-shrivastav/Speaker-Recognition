import { NavLink } from "react-router-dom";

export function AppChrome() {
  return (
    <div className="mb-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl lg:hidden">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          Speaker AI
        </div>
        <div className="text-lg font-semibold text-white">
          Voice Intelligence
        </div>
      </div>
      <div className="flex gap-2 text-sm">
        <NavLink
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200"
          to="/dashboard"
        >
          App
        </NavLink>
      </div>
    </div>
  );
}
