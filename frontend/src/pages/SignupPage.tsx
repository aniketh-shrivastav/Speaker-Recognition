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
  const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const validateEmail = (v: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(v);
  };

  const validatePassword = (p: string) => {
    if (p.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(p)) return 'Include at least one uppercase letter';
    if (!/[0-9]/.test(p)) return 'Include at least one number';
    if (!/[^A-Za-z0-9]/.test(p)) return 'Include at least one symbol';
    return '';
  };

  const runValidation = (nextForm = form) => {
    const e = { username: '', email: '', password: '', confirmPassword: '' };
    if (!nextForm.username || nextForm.username.trim().length < 2) e.username = 'Username must be 2+ characters';
    if (!nextForm.email || !validateEmail(nextForm.email)) e.email = 'Enter a valid email address';
    e.password = validatePassword(nextForm.password || '');
    if (nextForm.password !== nextForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return e;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const e = runValidation();
    if (e.username || e.email || e.password || e.confirmPassword) {
      toast.error('Fix the highlighted fields');
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
        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <div>
            <input required minLength={2} maxLength={50} aria-invalid={!!errors.username} aria-describedby="username-error" className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${errors.username ? 'border-rose-400 bg-rose-900/10' : 'border-white/10 bg-white/5'} focus:border-cyan-400/40`} placeholder="Username" value={form.username} onChange={(event) => { const next = { ...form, username: event.target.value }; setForm(next); runValidation(next); }} />
            {errors.username && <div id="username-error" className="mt-1 text-xs text-rose-300">{errors.username}</div>}
          </div>

          <div>
            <input required type="email" aria-invalid={!!errors.email} aria-describedby="email-error" className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${errors.email ? 'border-rose-400 bg-rose-900/10' : 'border-white/10 bg-white/5'} focus:border-cyan-400/40`} placeholder="Email" value={form.email} onChange={(event) => { const next = { ...form, email: event.target.value }; setForm(next); runValidation(next); }} />
            {errors.email && <div id="email-error" className="mt-1 text-xs text-rose-300">{errors.email}</div>}
          </div>

          <div>
            <input required type="password" minLength={8} aria-invalid={!!errors.password} aria-describedby="password-error" className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${errors.password ? 'border-rose-400 bg-rose-900/10' : 'border-white/10 bg-white/5'} focus:border-cyan-400/40`} placeholder="Password" value={form.password} onChange={(event) => { const next = { ...form, password: event.target.value }; setForm(next); runValidation(next); }} />
            <div className="h-2 overflow-hidden rounded-full bg-white/10 mt-2">
              <div className="h-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400" style={{ width: `${(score / 4) * 100}%` }} />
            </div>
            {errors.password && <div id="password-error" className="mt-1 text-xs text-rose-300">{errors.password}</div>}
          </div>

          <div>
            <input required type="password" aria-invalid={!!errors.confirmPassword} aria-describedby="confirm-error" className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${errors.confirmPassword ? 'border-rose-400 bg-rose-900/10' : 'border-white/10 bg-white/5'} focus:border-cyan-400/40`} placeholder="Confirm password" value={form.confirmPassword} onChange={(event) => { const next = { ...form, confirmPassword: event.target.value }; setForm(next); runValidation(next); }} />
            {errors.confirmPassword && <div id="confirm-error" className="mt-1 text-xs text-rose-300">{errors.confirmPassword}</div>}
          </div>

          <button disabled={loading || Object.values(errors).some(Boolean)} className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:opacity-60">
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
