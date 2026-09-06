import { getAuthenticatedUser } from '@/lib/auth';
import PathwaysClient from './PathwaysClient';


export default async function PathwaysPage() {
  const user = await getAuthenticatedUser();
  return <PathwaysClient user={user} />;
}