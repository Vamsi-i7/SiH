'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SignupForm() {
  const router = useRouter();
  const t = useTranslations('auth');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('error'));
        return;
      }

      // Automatically persist demo session in cookie for instant onboarding access
      const persona = {
        id: data.user?.id || 'demo-new-user',
        name,
        email,
        role: 'learner',
        organization_id: 'org-mospi',
        preferred_language: 'en',
      };
      document.cookie = `demo_user=${encodeURIComponent(JSON.stringify(persona))}; path=/; max-age=604800`;
      document.cookie = `locale=en; path=/; max-age=31536000`;

      router.push('/onboarding');
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full h-11 rounded-md border border-border bg-card px-3.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          placeholder="e.g. Rajesh Kumar"
        />
      </div>

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
          className="w-full h-11 rounded-md border border-border bg-card px-3.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          placeholder="you@mospi.gov.in"
        />
        <p className="text-xs text-muted-foreground">Official government email address required</p>
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
          minLength={8}
          className="w-full h-11 rounded-md border border-border bg-card px-3.5 text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          placeholder="Minimum 8 characters"
        />
      </div>

      {error && (
        <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-md bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-semibold shadow-xs transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Creating account...</span>
          </span>
        ) : (
          t('signup')
        )}
      </button>
    </form>
  );
}
