import { getAuthenticatedUser } from '@/lib/auth';
import AssignmentsClient from './AssignmentsClient';


export default async function AssignmentsPage() {
  await getAuthenticatedUser();
  return <AssignmentsClient />;
}
