import { getAuthenticatedUser } from '@/lib/auth';
import AssignmentsClient from './AssignmentsClient';

export const dynamic = 'force-dynamic';

export default async function AssignmentsPage() {
  await getAuthenticatedUser();
  return <AssignmentsClient />;
}
