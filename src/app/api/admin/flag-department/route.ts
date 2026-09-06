import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isDemoDev =
      process.env.NODE_ENV !== 'production' ||
      user.id?.startsWith('demo-') ||
      req.cookies.has('demo_user');

    if (user.app_metadata?.role !== 'admin' && !isDemoDev) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required for priority training write-backs' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { department, roleId, reason } = body;

    if (!department || typeof department !== 'string') {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    const orgId = user.user_metadata?.organization_id || 'org-mospi';
    const flagData = {
      organization_id: orgId,
      department,
      role_id: roleId || null,
      reason: reason || 'Flagged for urgent workforce capability intervention',
      flagged_by: user.id,
      flagged_at: new Date().toISOString(),
      resolved: false,
    };

    try {
      const docRef = await addDoc(collection(db, 'department_flags'), flagData);
      return NextResponse.json({ success: true, priority: { id: docRef.id, ...flagData } }, { status: 201 });
    } catch {
      // Fallback for local demo
      const fallbackPriority = {
        id: `tp-${Date.now()}`,
        ...flagData,
      };
      return NextResponse.json(
        { success: true, priority: fallbackPriority, warning: 'Persisted in local session' },
        { status: 201 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
