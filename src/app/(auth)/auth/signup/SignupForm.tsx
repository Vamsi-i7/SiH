'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  X
} from 'lucide-react';
import { KarmayogiHorizontalLogo, KarmayogiEmblemIcon } from '@/components/auth/KarmayogiEmblem';

interface SignupFormProps {
  onStepChange?: (step: 1 | 2) => void;
}

export default function SignupForm({ onStepChange }: SignupFormProps) {
  const router = useRouter();

  // Current Step (1 or 2)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form Fields - Step 1
  const [centerState, setCenterState] = useState<'Center' | 'State'>('Center');
  const [ministry, setMinistry] = useState('Ministry of Statistics and Programme Implementation (MoSPI)');
  const [organisation, setOrganisation] = useState('National Sample Survey Office (NSSO) - Field Operations Division');
  const [designation, setDesignation] = useState('Field Investigator (FI)');
  const [email, setEmail] = useState('');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  // Form Fields - Step 2
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [parichayId, setParichayId] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const organisations = [
    'National Sample Survey Office (NSSO) - Field Operations Division',
    'National Statistical Systems Training Academy (NSSTA)',
    'Central Statistics Office (CSO)',
    'Data Quality Assurance Division (DQAD)',
    'Survey Design and Research Division (SDRD)',
    'Computer Centre (MoSPI)',
  ];

  const getDesignations = () => {
    if (organisation.includes('Field Operations') || organisation.includes('NSSO')) {
      return [
        'Field Investigator (FI)',
        'Senior Statistical Officer (SSO)',
        'Assistant Director (FOD)',
      ];
    }
    if (organisation.includes('NSSTA')) {
      return [
        'Faculty / Course Director',
        'Deputy Director (Training)',
        'Senior Statistical Trainer',
      ];
    }
    if (organisation.includes('CSO') || organisation.includes('Computer Centre')) {
      return [
        'Junior Statistical Officer (JSO)',
        'Senior Statistical Officer (SSO)',
        'System Analyst / Programmer',
        'Joint Director',
      ];
    }
    return [
      'Junior Statistical Officer (JSO)',
      'Senior Statistical Officer (SSO)',
      'Additional Director General (ADG)',
    ];
  };

  // 1. Send Verification OTP to Government Email
  const handleSendOtp = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid official government email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', identifier: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to dispatch verification code');
        return;
      }

      setOtpSent(true);
      setOtpMessage(data.message || 'OTP dispatched to government inbox');
      setOtpValue(data.demoOtp || '123456');
    } catch {
      setError('Error communicating with National Directory verification services');
    } finally {
      setLoading(false);
    }
  };

  // 2. Validate Step 1 and proceed to Step 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter your official government email address');
      return;
    }
    setError(null);
    setCurrentStep(2);
    if (onStepChange) onStepChange(2);
  };

  // 3. Complete Registration
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full officer name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          centerState,
          ministry,
          organisation,
          designation,
          email: email.trim(),
          name: name.trim(),
          phone: phone.trim(),
          parichayId: parichayId.trim() || `JPID-2024-${Date.now().toString().slice(-4)}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Registration failed. Please try again or contact your MDO administrator.');
    } finally {
      setLoading(false);
    }
  };

  const isFieldRole = designation.includes('Investigator') || organisation.includes('Field');
  const isTrainerRole = designation.includes('Faculty') || organisation.includes('NSSTA');

  // Intelligent Go Back handler
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#BF9B7A]/40 bg-white hover:bg-[#FAF6F0] text-xs font-semibold text-chart-5 shadow-2xs transition-all hover:scale-102 active:scale-98 group cursor-pointer"
              title="Go back to previous page"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#555934] group-hover:-translate-x-0.5 transition-transform" />
              <span>Go Back</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#BF9B7A]/25 bg-white/70 hover:bg-white text-[11px] font-medium text-muted-foreground hover:text-[#2d1f17] transition-all"
              title="Go to Home"
            >
              <span>Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#BF9B7A]/40 bg-white/80 backdrop-blur-xs text-[11px] font-semibold text-chart-5 shadow-2xs">
              <KarmayogiEmblemIcon className="h-4 w-4" />
              <span>MoSPI • NSSTA</span>
            </div>
            <button
              type="button"
              onClick={handleGoBack}
              className="lg:hidden h-7 w-7 rounded-full bg-white border border-[#BF9B7A]/40 text-chart-5 flex items-center justify-center shadow-2xs hover:bg-[#FAF6F0] cursor-pointer"
              title="Close and go back"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Official Karmayogi Bharat Horizontal Logo Lockup */}
        <div className="mb-4">
          <KarmayogiHorizontalLogo className="h-9 sm:h-11 w-auto" />
        </div>

        {/* Heading */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d1f17] tracking-tight font-sans">
            Create an account
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Official government statistical workforce onboarding & FRAC competency profile
          </p>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => {
              setCurrentStep(1);
              if (onStepChange) onStepChange(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentStep === 1
                ? 'bg-[#555934] text-white shadow-xs'
                : 'bg-white/80 text-muted-foreground border border-[#BF9B7A]/30'
            }`}
          >
            1. Cadre & Organization
          </button>
          <button
            type="button"
            onClick={() => {
              if (email.includes('@')) {
                setCurrentStep(2);
                if (onStepChange) onStepChange(2);
              }
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentStep === 2
                ? 'bg-[#555934] text-white shadow-xs'
                : 'bg-white/80 text-muted-foreground border border-[#BF9B7A]/30'
            }`}
          >
            2. Profile & Competencies
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 flex items-start gap-2 text-xs text-[#8C5B3E] bg-[#8C5B3E]/10 border border-[#8C5B3E]/20 rounded-xl p-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CADRE, MINISTRY & EMAIL */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedToStep2} className="space-y-3.5">
            {/* Center / State */}
            <div>
              <label className="block text-xs font-semibold text-chart-5 mb-1 ml-1">
                Jurisdiction <span className="text-red-500">*</span>
              </label>
              <div className="inline-flex p-1 rounded-full bg-[#F2E6D8]/60 border border-[#BF9B7A]/30">
                <button
                  type="button"
                  onClick={() => setCenterState('Center')}
                  className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${
                    centerState === 'Center' ? 'bg-white text-[#2d1f17] shadow-xs' : 'text-muted-foreground'
                  }`}
                >
                  Central Ministry
                </button>
                <button
                  type="button"
                  onClick={() => setCenterState('State')}
                  className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${
                    centerState === 'State' ? 'bg-white text-[#2d1f17] shadow-xs' : 'text-muted-foreground'
                  }`}
                >
                  State DES
                </button>
              </div>
            </div>

            {/* Ministry */}
            <div>
              <label className="block text-xs font-semibold text-chart-5 mb-1 ml-1">
                Ministry/Department <span className="text-red-500">*</span>
              </label>
              <select
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                className="w-full h-11 px-4 text-xs sm:text-sm border border-[#BF9B7A]/35 rounded-2xl bg-white text-[#2d1f17] focus:ring-2 focus:ring-[#555934] focus:outline-none"
                required
              >
                <option value="Ministry of Statistics and Programme Implementation (MoSPI)">
                  Ministry of Statistics and Programme Implementation (MoSPI)
                </option>
                <option value="Ministry of Personnel, Public Grievances and Pensions (DoPT)">
                  Ministry of Personnel, Public Grievances and Pensions (DoPT)
                </option>
                <option value="Ministry of Finance">Ministry of Finance</option>
                <option value="Ministry of Agriculture and Farmers Welfare">Ministry of Agriculture and Farmers Welfare</option>
              </select>
            </div>

            {/* Organisation */}
            <div>
              <label className="block text-xs font-semibold text-chart-5 mb-1 ml-1">
                Organisation <span className="text-red-500">*</span>
              </label>
              <select
                value={organisation}
                onChange={(e) => {
                  setOrganisation(e.target.value);
                  setTimeout(() => {
                    const opts = getDesignations();
                    if (opts.length > 0) setDesignation(opts[0]);
                  }, 10);
                }}
                className="w-full h-11 px-4 text-xs sm:text-sm border border-[#BF9B7A]/35 rounded-2xl bg-white text-[#2d1f17] focus:ring-2 focus:ring-[#555934] focus:outline-none"
                required
              >
                {organisations.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-chart-5 mb-1 ml-1">
                Cadre / Designation <span className="text-red-500">*</span>
              </label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full h-11 px-4 text-xs sm:text-sm border border-[#BF9B7A]/35 rounded-2xl bg-white text-[#2d1f17] focus:ring-2 focus:ring-[#555934] focus:outline-none"
                required
              >
                {getDesignations().map((desig) => (
                  <option key={desig} value={desig}>
                    {desig}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Box with Send OTP */}
            <div className="rounded-2xl border border-[#BF9B7A]/35 p-3.5 bg-white space-y-2.5 shadow-xs">
              <label className="block text-xs font-semibold text-chart-5">
                Official Government Email <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@mospi.gov.in"
                  className="flex-1 h-11 px-4 text-xs sm:text-sm border border-[#BF9B7A]/30 rounded-xl bg-[#FAF6F0]/50 text-[#2d1f17] focus:ring-2 focus:ring-[#555934] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || !email.includes('@')}
                  className="px-4 h-11 rounded-xl bg-[#555934] hover:bg-primary-dark text-white text-xs font-semibold shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Sending...' : otpSent ? 'OTP Sent ✓' : 'Send OTP'}
                </button>
              </div>

              {otpSent && (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <span>{otpMessage || 'OTP dispatched! Simulation code:'}</span>
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                    123456
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-full bg-[#F8C858] hover:bg-[#ebb83b] text-[#2d1f17] text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>Continue to Step 2</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* STEP 2: PROFILE & FRAC COMPETENCIES */}
        {currentStep === 2 && (
          <form onSubmit={handleCompleteRegistration} className="space-y-3.5 animate-in fade-in">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                if (onStepChange) onStepChange(1);
              }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[#555934] font-semibold mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Cadre Selection</span>
            </button>

            {/* OTP Entry */}
            <div>
              <label className="block text-xs font-semibold text-chart-5 mb-1 ml-1">
                Enter 6-Digit Email OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="123456"
                className="w-full h-11 px-4 font-mono text-center tracking-[0.3em] text-base font-bold border border-[#BF9B7A]/40 rounded-2xl bg-white text-[#2d1f17] focus:ring-2 focus:ring-[#555934]"
                required
              />
            </div>

            {/* Officer Name */}
            <div>
              <label className="block text-xs font-semibold text-chart-5 mb-1 ml-1">
                Full Officer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Smt. Sunita Devi / Shri Amit Sharma"
                className="w-full h-11 px-4 text-xs sm:text-sm border border-[#BF9B7A]/35 rounded-2xl bg-white text-[#2d1f17] focus:ring-2 focus:ring-[#555934]"
                required
              />
            </div>

            {/* Phone & Parichay ID in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-chart-5 mb-1 ml-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone"
                  className="w-full h-11 px-4 text-xs sm:text-sm border border-[#BF9B7A]/35 rounded-2xl bg-white text-[#2d1f17] focus:ring-2 focus:ring-[#555934]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-chart-5 mb-1 ml-1">
                  Parichay / Employee ID
                </label>
                <input
                  type="text"
                  value={parichayId}
                  onChange={(e) => setParichayId(e.target.value)}
                  placeholder="JPID-2024-XXXX"
                  className="w-full h-11 px-4 text-xs sm:text-sm font-mono border border-[#BF9B7A]/35 rounded-2xl bg-white text-[#2d1f17] focus:ring-2 focus:ring-[#555934]"
                />
              </div>
            </div>

            {/* FRAC COMPETENCY ALLOCATION PREVIEW */}
            <div className="p-3.5 rounded-2xl border border-[#BF9B7A]/35 bg-[#FAF6F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#555934] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>FRAC Competency Framework Auto-Mapping</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#555934]/12 text-[#555934]">
                  Mission Karmayogi
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Allocating competencies for <strong className="text-[#2d1f17]">{designation}</strong> ({organisation}):
              </p>

              <div className="space-y-1.5 pt-0.5">
                {isFieldRole && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2d1f17]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#555934] shrink-0" />
                      <span>Census Boundary Demarcation & Listing (Schedule 0.0)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2d1f17]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#555934] shrink-0" />
                      <span>CAPI Tablet Operations & Sync Protocols</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2d1f17]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#555934] shrink-0" />
                      <span>Household Consumption Recall Probing (Hindi-First)</span>
                    </div>
                  </>
                )}

                {isTrainerRole && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2d1f17]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#555934] shrink-0" />
                      <span>Statistical Pedagogy & Assessment Formulation</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2d1f17]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#555934] shrink-0" />
                      <span>Curriculum Gap Identification (NSSTA Induction)</span>
                    </div>
                  </>
                )}

                {!isFieldRole && !isTrainerRole && (
                  <>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2d1f17]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#555934] shrink-0" />
                      <span>Statistical Scrutiny & Outlier Detection</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#2d1f17]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#555934] shrink-0" />
                      <span>Multi-Stage Sampling Design & DEFF Variance</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#F8C858] hover:bg-[#ebb83b] text-[#2d1f17] text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? (
                'Approving Credentials...'
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Complete Official Registration</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-[#BF9B7A]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-[#555934] hover:underline">
            Sign in here
          </Link>
        </p>

        <a href="#help" onClick={(e) => { e.preventDefault(); alert("Ministry of Statistics & Programme Implementation (MoSPI) Helpline: 1800-111-555"); }} className="text-[11px] text-muted-foreground hover:underline">
          Nodal Helpdesk
        </a>
      </div>
    </div>
  );
}
