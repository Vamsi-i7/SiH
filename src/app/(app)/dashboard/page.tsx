import { getAuthenticatedUser } from '@/lib/auth';
import DashboardClient from './DashboardClient';


export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  return <DashboardClient user={{ ...user, email: user.email }} />;
}
