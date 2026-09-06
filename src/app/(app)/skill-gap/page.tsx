import { getAuthenticatedUser } from '@/lib/auth';
import SkillGapClient from './SkillGapClient';


export default async function SkillGapPage() {
  const user = await getAuthenticatedUser();
  return <SkillGapClient user={user} />;
}