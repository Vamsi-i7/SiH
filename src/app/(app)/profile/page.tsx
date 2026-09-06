import { getAuthenticatedUser } from '@/lib/auth';
import ProfileClient from './ProfileClient';


export default async function ProfilePage() {
  const user = await getAuthenticatedUser();
  return <ProfileClient user={user} />;
}

