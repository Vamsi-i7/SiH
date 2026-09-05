import { getAuthenticatedUser } from '@/lib/auth';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  await getAuthenticatedUser();
  return <ProfileClient />;
}

