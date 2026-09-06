import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      centerState,
      ministry,
      organisation,
      designation,
      email,
      name,
      phone,
      parichayId,
    } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid official email address is required' }, { status: 400 });
    }

    // Determine role and cadre based on designation and organization
    let role: 'learner' | 'trainer' | 'admin' = 'learner';
    let cadre = 'NSSO Field Operations Division';
    let preferredLanguage: 'en' | 'hi' = 'en';

    const desigLower = (designation || '').toLowerCase();
    const orgLower = (organisation || '').toLowerCase();

    if (desigLower.includes('investigator') || orgLower.includes('field') || orgLower.includes('fod')) {
      role = 'learner';
      cadre = 'NSSO Field Operations Division';
      preferredLanguage = 'hi'; // Field investigators are Hindi-first as per PRD §6.1
    } else if (desigLower.includes('faculty') || orgLower.includes('nssta') || desigLower.includes('director (training)')) {
      role = 'trainer';
      cadre = 'NSSTA Faculty';
      preferredLanguage = 'en';
    } else if (desigLower.includes('general') || desigLower.includes('adg') || desigLower.includes('director')) {
      role = 'admin';
      cadre = 'MoSPI Headquarters Leadership';
      preferredLanguage = 'en';
    } else {
      // Junior Statistical Officer / SSS Cadre
      role = 'learner';
      cadre = 'Subordinate Statistical Service (SSS)';
      preferredLanguage = 'en';
    }

    const registeredUser = {
      id: `user-${Date.now()}`,
      name: name || (email.split('@')[0].replace('.', ' ') || 'Statistical Officer'),
      email,
      phone: phone || '',
      role,
      organization_id: orgLower.includes('nsso') ? 'org-nsso' : orgLower.includes('nssta') ? 'org-nssta' : 'org-mospi',
      cadre,
      designation: designation || 'Statistical Officer',
      preferred_language: preferredLanguage,
      department: organisation || 'MoSPI',
      ministry: ministry || 'Ministry of Statistics and Programme Implementation',
      center_state: centerState || 'Center',
      parichay_id: parichayId || `JPID-2024-${Date.now().toString().slice(-4)}`,
      registered_at: new Date().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      message: 'Official Government Credential Approved & Profile Created',
      user: registeredUser,
    });

    // Set demo_user cookie for instant authentication
    response.cookies.set('demo_user', encodeURIComponent(JSON.stringify(registeredUser)), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: 'lax',
    });

    response.cookies.set('locale', preferredLanguage, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to process official registration' }, { status: 500 });
  }
}
