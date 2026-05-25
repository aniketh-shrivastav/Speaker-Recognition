import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authApi } from '@/api/endpoints';
import { useAuthStore } from '@/store/authStore';

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function SignupPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const score = useMemo(() => passwordScore(form.password), [form.password]);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.register({ username: form.username, email: form.email, password: form.password });
      setAuth(data.access_token, data.user);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-slate-100">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-panel p-8 shadow-glow backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Create account</div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Signup</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400/40" placeholder="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400/40" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400/40" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400" style={{ width: `${(score / 4) * 100}%` }} />
          </div>
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400/40" placeholder="Confirm password" type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-300">
          Already registered? <Link to="/login" className="text-cyan-300">Login</Link>
        </p>
      </div>
    </div>
  );
}
