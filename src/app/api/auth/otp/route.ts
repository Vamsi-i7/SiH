import { NextRequest, NextResponse } from 'next/server';
import { DEMO_PERSONAS, getDemoPersonaByEmail } from '@/lib/demoPersonas';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, identifier, otp, cadre, role, name } = body;

    if (!identifier) {
      return NextResponse.json({ error: 'Email or Mobile number is required' }, { status: 400 });
    }

    // 1. Action: Request OTP
    if (action === 'request') {
      const isPhone = /^[6-9]\d{9}$/.test(identifier.trim());
      const isGovEmail = identifier.includes('@') && (
        identifier.endsWith('.gov.in') ||
        identifier.endsWith('@nic.in') ||
        identifier.endsWith('@mospi.gov.in') ||
        identifier.endsWith('@nsso.gov.in') ||
        identifier.endsWith('@nssta.gov.in')
      );

      // In simulation mode, accept any 10-digit phone or email, but give realistic response
      return NextResponse.json({
        success: true,
        channel: isPhone ? 'mobile' : 'email',
        isGovernmentDomain: isGovEmail,
        message: isPhone 
          ? `6-digit OTP dispatched to mobile +91-${identifier.slice(0, 2)}••••••${identifier.slice(8)}`
          : isGovEmail
          ? `6-digit OTP dispatched to verified government inbox ${identifier}`
          : `6-digit OTP dispatched to official inbox ${identifier}`,
        demoOtp: '123456', // Simulation bypass OTP
        expiresIn: 300, // 5 minutes
      });
    }

    // 2. Action: Verify OTP
    if (action === 'verify') {
      if (!otp || otp.length < 4) {
        return NextResponse.json({ error: 'Please enter a valid 6-digit OTP' }, { status: 400 });
      }

      // Check if identifier matches known demo persona
      let persona = getDemoPersonaByEmail(identifier);
      if (!persona) {
        // If phone or new email, determine cadre from phone/identifier or default to Sunita Devi (Field Investigator)
        if (identifier.includes('9876') || identifier.toLowerCase().includes('sunita')) {
          persona = DEMO_PERSONAS[1]; // Sunita Devi
        } else if (identifier.includes('9123') || identifier.toLowerCase().includes('amit')) {
          persona = DEMO_PERSONAS[0]; // Amit Sharma
        } else {
          // Construct an authentic official government profile
          persona = {
            id: `user-${Date.now()}`,
            name: name || (identifier.includes('@') ? identifier.split('@')[0].replace('.', ' ') : 'Statistical Officer'),
            email: identifier.includes('@') ? identifier : `${identifier}@mospi.gov.in`,
            role: (role as 'learner' | 'trainer' | 'admin') || 'learner',
            organization_id: 'org-mospi',
            cadre: cadre || 'NSSO Field Operations Division',
            designation: 'Field Investigator (FOD)',
            preferred_language: 'hi',
            department: 'NSSO Field Operations Division',
          };
        }
      }

      const response = NextResponse.json({
        success: true,
        message: 'OTP Verification Successful',
        user: persona,
      });

      response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(persona)), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        sameSite: 'lax',
      });

      response.cookies.set('locale', persona.preferred_language || 'en', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: false,
        sameSite: 'lax',
      });

      return response;
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
