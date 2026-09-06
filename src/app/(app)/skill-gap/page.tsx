import { getAuthenticatedUser } from '@/lib/auth';
import SkillGapClient from './SkillGapClient';

export const dynamic = 'force-dynamic';

export default async function SkillGapPage() {
  const user = await getAuthenticatedUser();
  return <SkillGapClient user={user} />;
}