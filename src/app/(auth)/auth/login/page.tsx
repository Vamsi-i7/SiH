import { Suspense } from 'react';
import LoginForm from './LoginForm';
import { AuthShowcaseVisual } from '@/components/auth/AuthShowcaseVisual';


export default function LoginPage() {
  return (
    <div className="w-full max-w-6xl mx-auto my-auto rounded-[32px] sm:rounded-[40px] bg-[#FAF6F0] p-4 sm:p-6 lg:p-7 shadow-[0_24px_64px_-12px_rgba(89,62,46,0.14)] border border-[#BF9B7A]/30 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
      {/* Left Column: Premium Login Form Card */}
      <div className="lg:col-span-6 flex flex-col justify-between p-4 sm:p-8">
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-[#705849] text-xs">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right Column: Visual Showcase Display with Floating Glassmorphic Cards */}
      <div className="lg:col-span-6 flex flex-col justify-center">
        <AuthShowcaseVisual />
      </div>
    </div>
  );
}
