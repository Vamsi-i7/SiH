'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(t('error'));
        return;
      }

      router.push('/dashboard');
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(t('error'));
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-11 rounded-md border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition text-[16px]"
          placeholder="you@mospi.gov.in"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          {t('password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full h-11 rounded-md border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition text-[16px]"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
          />
          <span className="text-xs">Remember me</span>
        </label>
        <a
          href="#"
          className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
        >
          {t('forgotPassword')}
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-md bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-semibold shadow-sm transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin outline-none" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Verifying...</span>
          </span>
        ) : (
          t('login')
        )}
      </button>

      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-accent" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-card px-3 text-muted-foreground">Or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-11 flex items-center justify-center gap-2.5 rounded-md border border-border bg-card hover:bg-secondary text-foreground text-sm font-semibold shadow-sm transition disabled:opacity-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h9.96c-.26 1.37-1.04 2.53-2.21 3.31v2.77h1.78c.43-1.4 1.07-2.35 1.88-3.01 1.09-.94 1.88-2.23 2.21-3.77-.5 1.07-1.4 1.88-2.58 2.45z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-7.46-2.52 2.22C6.93 13.37 5.57 12.5 5.57 10.92 5.57 9.34 6.63 8 8.1 8c1.39 0 2.44.87 2.91 2.13l1.34-1.34C13.13 6.46 12.49 6 11.75 6c-.49 0-.96.18-1.34.48L6.75 8.39c.68.67 1.58 1.08 2.61 1.08 1.03 0 1.99-.41 2.58-1.08l2.52 2.22C16.97 10.54 14.49 13.37 12 23z" fill="#34A853" />
          <path d="M5.57 14.5c0-.59.15-1.14.43-1.62l2.52-2.22C8.96 10.78 10.02 10.5 11.08 10.5c.49 0 .96.18 1.34.48l1.34-1.34C13.13 8.56 12.49 8.18 11.75 8.18c-.49 0-.96.18-1.34.48L6.75 10.39c-.68.67-1.58 1.08-2.61 1.08-1.03 0-1.99-.41-2.58-1.08l-2.52 2.22C2.21 12.86 2.36 13.18 2.52 13.77c.26 1.07.85 1.94 1.74 2.58z" fill="#FBBC05" />
          <path d="M12 6.58c1.62 0 3.06.56 4.21 1.64l2.52-2.22C16.97 4.04 14.49 1.37 12 1.37c-2.49 0-4.97 2.83-4.97 6.58 0 1.46.38 2.84 1.02 3.99l2.52 2.22c1.15-1.08 2.6-1.64 4.21-1.64z" fill="#EA4335" />
        </svg>
        <span>{t('google')}</span>
      </button>

      <p className="text-center text-xs text-muted-foreground pt-1">
        {t('noAccount')}{' '}
        <a href="/auth/signup" className="font-semibold text-primary hover:text-primary-dark">
          {t('signup')}
        </a>
      </p>
    </form>
  );
}
