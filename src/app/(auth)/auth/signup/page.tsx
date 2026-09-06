import { Suspense } from 'react';
import SignupForm from './SignupForm';
import { AuthShowcaseVisual } from '@/components/auth/AuthShowcaseVisual';


export default function SignupPage() {
  return (
    <div className="w-full max-w-6xl mx-auto my-auto rounded-[32px] sm:rounded-[40px] bg-[#FAF6F0] p-4 sm:p-6 lg:p-7 shadow-[0_24px_64px_-12px_rgba(89,62,46,0.14)] border border-[#BF9B7A]/30 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      {/* Left Column: Premium Registration Form Card */}
      <div className="lg:col-span-6 flex flex-col justify-between p-4 sm:p-8">
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-[#705849] text-xs">Loading registration portal...</div>}>
          <SignupForm />
        </Suspense>
      </div>

      {/* Right Column: Visual Showcase Display with Floating Glassmorphic Cards */}
      <div className="lg:col-span-6 flex flex-col justify-center">
        <AuthShowcaseVisual />
      </div>
    </div>
  );
}
