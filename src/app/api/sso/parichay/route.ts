import { NextRequest, NextResponse } from 'next/server';
import { getDemoPersonaByEmail, DEMO_PERSONAS } from '@/lib/demoPersonas';

export const dynamic = 'force-dynamic';

/**
 * NIC Jan-Parichay / MeriPehchaan Government SSO Mock Adapter
 * Simulates OIDC auth callback & JWT assertion exchange as specified in PRD §15.2
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email') || 'sunita.devi@nsso.gov.in';
  const lang = request.nextUrl.searchParams.get('lang') as 'en' | 'hi' | null;

  const persona = getDemoPersonaByEmail(email) || DEMO_PERSONAS[1]; // default Sunita Devi (NSSO FOD)

  // Map to authentic Parichay Jan-Identity structure
  const parichayUser = {
    id: persona.id,
    name: persona.name,
    email: persona.email,
    role: persona.role,
    organization_id: persona.organization_id,
    cadre: persona.cadre,
    designation: persona.designation,
    preferred_language: lang || persona.preferred_language || 'hi',
    department: persona.department,
    parichay_id: persona.id === 'demo-sunita' ? 'JPID-2024-FI-001' : 
                 persona.id === 'demo-amit' ? 'JPID-2024-JSO-002' :
                 persona.id === 'demo-priya' ? 'JPID-2024-TR-003' : 'JPID-2024-AD-004',
    auth_provider: 'NIC_PARICHAY_OIDC',
    auth_time: new Date().toISOString(),
  };

  const response = NextResponse.redirect(new URL('/dashboard', request.url));

  // Set demo_user cookie for middleware & client hydration
  response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(parichayUser)), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: false,
    sameSite: 'lax',
  });

  response.cookies.set('locale', parichayUser.preferred_language, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: 'lax',
  });

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, parichayId, otp } = body;

    const persona = (email && getDemoPersonaByEmail(email)) || DEMO_PERSONAS[1];

    const parichayPayload = {
      sub: persona.id,
      name: persona.name,
      email: persona.email,
      role: persona.role,
      organization_id: persona.organization_id,
      cadre: persona.cadre,
      designation: persona.designation,
      preferred_language: persona.preferred_language,
      department: persona.department,
      parichay_id: parichayId || 'JPID-2024-GOV-AUTH',
      aud: 'statvidya-sih26101',
      iss: 'https://parichay.nic.in',
      verified_otp: !!otp,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Jan-Parichay SSO Authentication Verified',
      user: parichayPayload,
    });

    response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(parichayPayload)), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid Parichay payload' }, { status: 400 });
  }
}
