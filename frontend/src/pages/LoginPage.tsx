import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authApi } from '@/api/endpoints';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.login({ email: form.email, password: form.password });
      setAuth(data.access_token, data.user);
      toast.success('Welcome back');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-slate-100">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-panel p-8 shadow-glow backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Authentication</div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Login</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400/40" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400/40" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input checked={form.remember} type="checkbox" onChange={(event) => setForm({ ...form, remember: event.target.checked })} />
            Remember me
          </label>
          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-300">
          Need an account? <Link to="/signup" className="text-cyan-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
