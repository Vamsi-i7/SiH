'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  RefreshCw, 
  KeyRound, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  X
} from 'lucide-react';
import { KarmayogiHorizontalLogo, KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';

export default function LoginForm() {
  const router = useRouter();

  // Auth Mode: 'otp' | 'password' (matching reference with smooth pill switcher)
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

  // Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('7K9P2');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpInfoMessage, setOtpInfoMessage] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput('');
  };

  // 1. Handle Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your 10-digit mobile number or official government email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', identifier: identifier.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to dispatch OTP');
        return;
      }

      setOtpSent(true);
      setOtpInfoMessage(data.message || 'OTP dispatched to registered credentials');
      setOtpValue(data.demoOtp || '123456');
    } catch {
      setError('Network error connecting to official authentication service');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue.trim()) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          identifier: identifier.trim(),
          otp: otpValue.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid OTP');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Failed to complete verification');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter credentials');
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setError('Invalid security Captcha code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const persona = identifier.toLowerCase().includes('sunita') ? 'demo-sunita' : 'demo-amit';
      const email = persona === 'demo-sunita' ? 'sunita.devi@nsso.gov.in' : 'amit.sharma@mospi.gov.in';
      router.push(`/api/sso/demo-persona?email=${encodeURIComponent(email)}`);
    } catch {
      setError('Authentication failed');
      setLoading(false);
    }
  };

  // 4. Parichay SSO Login Simulation
  const handleParichaySignIn = (personaEmail: string) => {
    setLoading(true);
    router.push(`/api/sso/parichay?email=${encodeURIComponent(personaEmail)}`);
  };

  // 5. Intelligent Go Back handler
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="w-full flex flex-col justify-between h-full">
      <div>
        {/* Top Navigation Row: Go Back + Home + MoSPI Emblem Pill + Mobile Close */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#BF9B7A]/40 bg-white hover:bg-[#FAF6F0] text-xs font-semibold text-[#593E2E] shadow-2xs transition-all hover:scale-102 active:scale-98 group cursor-pointer"
              title="Go back to previous page"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#555934] group-hover:-translate-x-0.5 transition-transform" />
              <span>Go Back</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#BF9B7A]/25 bg-white/70 hover:bg-white text-[11px] font-medium text-[#705849] hover:text-[#2d1f17] transition-all"
              title="Go to Home"
            >
              <span>Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#BF9B7A]/40 bg-white/80 backdrop-blur-xs text-[11px] font-semibold text-[#593E2E] shadow-2xs">
              <KarmayogiEmblemIcon className="h-4 w-4" />
              <span>MoSPI • NSSTA</span>
            </div>
            <button
              type="button"
              onClick={handleGoBack}
              className="lg:hidden h-7 w-7 rounded-full bg-white border border-[#BF9B7A]/40 text-[#593E2E] flex items-center justify-center shadow-2xs hover:bg-[#FAF6F0] cursor-pointer"
              title="Close and go back"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Official Karmayogi Bharat Horizontal Logo Lockup */}
        <div className="mb-4">
          <KarmayogiHorizontalLogo className="h-10 sm:h-12 w-auto" />
        </div>

        {/* Editorial Heading */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d1f17] tracking-tight font-sans">
            Welcome back
          </h1>
          <p className="text-xs text-[#705849] mt-1">
            Sign in with government-approved credentials or Parichay SSO
          </p>
        </div>

        {/* Pill Mode Switcher (Login with OTP vs Login with Password) */}
        <div className="inline-flex p-1 rounded-full bg-[#F2E6D8]/70 border border-[#BF9B7A]/30 mb-6 w-full max-w-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all text-center ${
              authMode === 'otp'
                ? 'bg-white text-[#2d1f17] shadow-sm'
                : 'text-[#705849] hover:text-[#2d1f17]'
            }`}
          >
            Login with OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setError('');
              setOtpSent(false);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all text-center ${
              authMode === 'password'
                ? 'bg-white text-[#2d1f17] shadow-sm'
                : 'text-[#705849] hover:text-[#2d1f17]'
            }`}
          >
            Password & Captcha
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 flex items-start gap-2 text-xs text-[#8C5B3E] bg-[#8C5B3E]/10 border border-[#8C5B3E]/20 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE A: LOGIN WITH OTP                                                    */}
        {/* ========================================================================= */}
        {authMode === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#593E2E] mb-1.5 ml-1">
                    Email / Mobile number
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Mobile number or you@mospi.gov.in"
                    className="w-full h-12 px-5 rounded-2xl bg-white border border-[#BF9B7A]/35 text-sm text-[#2d1f17] placeholder:text-[#705849]/50 focus:ring-2 focus:ring-[#555934] focus:outline-none transition shadow-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#F8C858] hover:bg-[#ebb83b] active:scale-[0.99] text-[#2d1f17] text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Requesting OTP...</span>
                    </span>
                  ) : (
                    <>
                      <span>Request OTP</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 bg-white/80 p-5 rounded-2xl border border-[#BF9B7A]/30 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#555934] flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Enter 6-Digit OTP</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[#705849] hover:text-[#2d1f17] text-[11px] underline"
                  >
                    Change
                  </button>
                </div>

                <p className="text-xs text-[#705849] leading-relaxed">
                  {otpInfoMessage}
                </p>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="123456"
                    className="w-full h-12 tracking-[0.4em] text-center font-mono text-lg font-bold border border-[#BF9B7A]/50 rounded-2xl bg-white text-[#2d1f17] focus:outline-none focus:ring-2 focus:ring-[#555934]"
                    required
                  />
                  <div className="flex items-center justify-between mt-1.5 text-[11px]">
                    <span className="text-emerald-700 font-medium">Demo Auto-Fill: 123456</span>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      className="text-[#555934] hover:underline font-semibold"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#F8C858] hover:bg-[#ebb83b] text-[#2d1f17] text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Verifying...' : 'Verify & Proceed to Dashboard'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE B: LOGIN WITH PASSWORD & CAPTCHA                                     */}
        {/* ========================================================================= */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#593E2E] mb-1.5 ml-1">
                Email / Government ID
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@mospi.gov.in"
                className="w-full h-12 px-5 rounded-2xl bg-white border border-[#BF9B7A]/35 text-sm text-[#2d1f17] placeholder:text-[#705849]/50 focus:ring-2 focus:ring-[#555934] focus:outline-none transition shadow-xs"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="text-xs font-semibold text-[#593E2E]">
                  Password
                </label>
                <a href="#" className="text-[11px] text-[#555934] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 px-5 rounded-2xl bg-white border border-[#BF9B7A]/35 text-sm text-[#2d1f17] placeholder:text-[#705849]/50 focus:ring-2 focus:ring-[#555934] focus:outline-none transition shadow-xs"
                required
              />
            </div>

            {/* Captcha */}
            <div className="pt-1">
              <label className="block text-xs font-semibold text-[#593E2E] mb-1.5 ml-1">
                Security Captcha
              </label>
              <div className="flex items-center gap-2">
                <div className="h-11 px-4 bg-[#F2E6D8]/60 border border-[#BF9B7A]/40 rounded-2xl flex items-center justify-center font-mono text-base font-bold tracking-widest text-[#2d1f17] select-none shadow-inner">
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="h-11 w-11 border border-[#BF9B7A]/35 rounded-2xl flex items-center justify-center text-[#593E2E] hover:bg-[#F2E6D8]/50 transition-colors"
                  title="Refresh Captcha"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                  placeholder="Enter text"
                  maxLength={5}
                  className="flex-1 h-11 px-4 text-sm border border-[#BF9B7A]/35 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#555934] uppercase tracking-wider bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#F8C858] hover:bg-[#ebb83b] text-[#2d1f17] text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Divider (Matching Reference "or continue with") */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#BF9B7A]/25" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#FAF6F0] px-3 text-[#705849] font-medium">or continue with</span>
          </div>
        </div>

        {/* Pill Provider Buttons (Matching Apple/Google Pill Buttons in Reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleParichaySignIn('sunita.devi@nsso.gov.in')}
            className="h-11 px-4 rounded-full border border-[#BF9B7A]/35 bg-white hover:bg-[#F2E6D8]/40 text-[#2d1f17] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors group cursor-pointer"
          >
            <div className="h-5 w-5 rounded-full bg-[#EA892B] flex items-center justify-center text-white shrink-0 text-[10px]">
              <KeyRound className="h-3 w-3" />
            </div>
            <span>Parichay SSO (NIC)</span>
          </button>

          <button
            type="button"
            onClick={() => handleParichaySignIn('amit.sharma@mospi.gov.in')}
            className="h-11 px-4 rounded-full border border-[#BF9B7A]/35 bg-white hover:bg-[#F2E6D8]/40 text-[#2d1f17] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors group cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-[#555934]" />
            <span>MoSPI Intranet SSO</span>
          </button>
        </div>

        {/* SIH 26101 EVALUATOR 1-CLICK PERSONA CHIPS */}
        <div className="mt-6 pt-4 border-t border-dashed border-[#BF9B7A]/30">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-[#593E2E] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#555934]" />
              <span>SIH Evaluator Fast-Track:</span>
            </span>
            <span className="text-[10px] text-[#705849]">1-click role test</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <a
              href="/api/sso/demo-persona?email=sunita.devi%40nsso.gov.in&lang=hi"
              className="p-2 rounded-xl bg-white border border-[#BF9B7A]/30 hover:border-[#555934] hover:bg-[#F2E6D8]/30 transition-all text-center group shadow-2xs"
            >
              <div className="h-6 w-6 rounded-full bg-[#555934] text-white flex items-center justify-center mx-auto text-[9px] font-bold">
                SD
              </div>
              <p className="text-[11px] font-bold text-[#2d1f17] mt-1 group-hover:text-[#555934] truncate">
                Sunita Devi
              </p>
              <p className="text-[9px] text-[#705849] truncate">NSSO (Hindi)</p>
            </a>

            <a
              href="/api/sso/demo-persona?email=amit.sharma%40mospi.gov.in&lang=en"
              className="p-2 rounded-xl bg-white border border-[#BF9B7A]/30 hover:border-[#555934] hover:bg-[#F2E6D8]/30 transition-all text-center group shadow-2xs"
            >
              <div className="h-6 w-6 rounded-full bg-[#BF9B7A] text-white flex items-center justify-center mx-auto text-[9px] font-bold">
                AS
              </div>
              <p className="text-[11px] font-bold text-[#2d1f17] mt-1 group-hover:text-[#555934] truncate">
                Amit Sharma
              </p>
              <p className="text-[9px] text-[#705849] truncate">SSS JSO</p>
            </a>

            <a
              href="/api/sso/demo-persona?email=priya.verma%40nssta.gov.in&lang=en"
              className="p-2 rounded-xl bg-white border border-[#BF9B7A]/30 hover:border-[#555934] hover:bg-[#F2E6D8]/30 transition-all text-center group shadow-2xs"
            >
              <div className="h-6 w-6 rounded-full bg-[#8C5B3E] text-white flex items-center justify-center mx-auto text-[9px] font-bold">
                PV
              </div>
              <p className="text-[11px] font-bold text-[#2d1f17] mt-1 group-hover:text-[#555934] truncate">
                Dr. Priya
              </p>
              <p className="text-[9px] text-[#705849] truncate">NSSTA Faculty</p>
            </a>

            <a
              href="/api/sso/demo-persona?email=rajesh.kumar%40mospi.gov.in&lang=en"
              className="p-2 rounded-xl bg-white border border-[#BF9B7A]/30 hover:border-[#555934] hover:bg-[#F2E6D8]/30 transition-all text-center group shadow-2xs"
            >
              <div className="h-6 w-6 rounded-full bg-[#593E2E] text-white flex items-center justify-center mx-auto text-[9px] font-bold">
                RK
              </div>
              <p className="text-[11px] font-bold text-[#2d1f17] mt-1 group-hover:text-[#555934] truncate">
                Rajesh Kumar
              </p>
              <p className="text-[9px] text-[#705849] truncate">Director</p>
            </a>
          </div>
        </div>
      </div>

      {/* Footer (Matching Reference Style) */}
      <div className="mt-8 pt-4 border-t border-[#BF9B7A]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#705849]">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-bold text-[#555934] hover:underline">
            Register here
          </Link>
        </p>

        <a href="#help" onClick={(e) => { e.preventDefault(); alert("Ministry of Statistics & Programme Implementation (MoSPI) Helpline: 1800-111-555"); }} className="text-[11px] text-[#705849] hover:underline">
          Nodal Helpdesk
        </a>
      </div>
    </div>
  );
}
