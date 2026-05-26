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
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (v: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(v);
  };

  const runValidation = (nextForm = form) => {
    const e = { email: '', password: '' };
    if (!nextForm.email || !validateEmail(nextForm.email)) e.email = 'Enter a valid email';
    if (!nextForm.password || nextForm.password.length < 6) e.password = 'Enter your password (min 6 chars)';
    setErrors(e);
    return e;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const e = runValidation();
    if (e.email || e.password) {
      toast.error('Fix the highlighted fields');
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.login({ email: form.email, password: form.password });
      setAuth(data.access_token, data.user);
      toast.success('Welcome back');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.response?.data?.message || 'Login failed';
      toast.error(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 text-slate-100">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-panel p-8 shadow-glow backdrop-blur-xl">
        <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Authentication</div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Login</h1>
        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <div>
            <input required type="email" aria-invalid={!!errors.email} aria-describedby="login-email-error" className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${errors.email ? 'border-rose-400 bg-rose-900/10' : 'border-white/10 bg-white/5'} focus:border-cyan-400/40`} placeholder="Email" value={form.email} onChange={(event) => { const next = { ...form, email: event.target.value }; setForm(next); runValidation(next); }} />
            {errors.email && <div id="login-email-error" className="mt-1 text-xs text-rose-300">{errors.email}</div>}
          </div>

          <div>
            <input required type="password" aria-invalid={!!errors.password} aria-describedby="login-password-error" className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${errors.password ? 'border-rose-400 bg-rose-900/10' : 'border-white/10 bg-white/5'} focus:border-cyan-400/40`} placeholder="Password" value={form.password} onChange={(event) => { const next = { ...form, password: event.target.value }; setForm(next); runValidation(next); }} />
            {errors.password && <div id="login-password-error" className="mt-1 text-xs text-rose-300">{errors.password}</div>}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input checked={form.remember} type="checkbox" onChange={(event) => setForm({ ...form, remember: event.target.checked })} />
            Remember me
          </label>
          <button disabled={loading || Object.values(errors).some(Boolean)} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:opacity-60">
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
