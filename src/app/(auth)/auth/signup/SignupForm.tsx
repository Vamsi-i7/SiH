'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email.endsWith('@mospi.gov.in') && !email.endsWith('@nssta.gov.in') && !email.endsWith('@gov.in')) {
      setError('Please use your official government email address (@mospi.gov.in, @nssta.gov.in, @gov.in).');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // Save user profile in Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        uid: user.uid,
        email,
        name,
        role: 'learner',
        organization_id: 'org-mospi',
        preferred_language: 'en',
        createdAt: new Date().toISOString(),
      });

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'learner',
        organization_id: 'org-mospi',
      };
      document.cookie = `firebase_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=604800`;

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
        <label htmlFor="name" className="text-sm font-medium text-slate-700 text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full h-11 rounded-lg border border-slate-300 border-gray-200 bg-white bg-white px-3.5 text-sm text-slate-900 text-gray-900 placeholder:text-slate-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-blue-600 focus:border-transparent transition"
          placeholder="e.g. Rajesh Kumar"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-slate-700 text-gray-700">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-11 rounded-lg border border-slate-300 border-gray-200 bg-white bg-white px-3.5 text-sm text-slate-900 text-gray-900 placeholder:text-slate-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-blue-600 focus:border-transparent transition"
          placeholder="you@mospi.gov.in"
        />
        <p className="text-xs text-slate-500 text-gray-500">Official government email address required</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-slate-700 text-gray-700">
          {t('password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full h-11 rounded-lg border border-slate-300 border-gray-200 bg-white bg-white px-3.5 text-sm text-slate-900 text-gray-900 placeholder:text-slate-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-blue-600 focus:border-transparent transition"
          placeholder="Minimum 8 characters"
        />
      </div>

      {error && (
        <div className="text-xs text-rose-700 text-rose-600 bg-rose-50 bg-rose-50/60 border border-rose-200 border-rose-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-lg bg-blue-700 hover:bg-blue-800 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-sm transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
