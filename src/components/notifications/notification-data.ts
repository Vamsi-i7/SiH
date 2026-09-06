import { Notification } from './types';

export const LEARNER_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-l-1',
    title: 'New assessment assigned',
    message: 'You have been assigned the Problem Solving & Logical Reasoning competency test.',
    timestamp: '10 minutes ago',
    read: false,
    type: 'assessment',
    href: '/assignments',
    role: 'learner',
  },
  {
    id: 'n-l-2',
    title: 'Learning pathway updated',
    message: 'Your recommended learning pathway has been updated based on your recent skill gaps.',
    timestamp: '1 hour ago',
    read: false,
    type: 'learning',
    href: '/pathways',
    role: 'learner',
  },
  {
    id: 'n-l-3',
    title: 'Assessment completed',
    message: 'Your assessment result for Decision Making & Prioritization is now ready to review.',
    timestamp: 'Yesterday',
    read: true,
    type: 'achievement',
    href: '/assignments',
    role: 'learner',
  },
  {
    id: 'n-l-4',
    title: 'Annual Training Calendar published',
    message: 'NSSTA official 2026-27 training schedule and course catalogue have been uploaded.',
    timestamp: '2 days ago',
    read: true,
    type: 'announcement',
    href: '/documents',
    role: 'learner',
  },
];

export const TRAINER_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-t-1',
    title: 'Learner cohort needs attention',
    message: '3 trainees in Field Survey module scored below Level 2 proficiency threshold.',
    timestamp: '25 minutes ago',
    read: false,
    type: 'system',
    href: '/review-queue',
    role: 'trainer',
  },
  {
    id: 'n-t-2',
    title: 'New training module published',
    message: 'Advanced Sampling Methods course material is now live in the document repository.',
    timestamp: '2 hours ago',
    read: false,
    type: 'learning',
    href: '/documents',
    role: 'trainer',
  },
  {
    id: 'n-t-3',
    title: 'Assessment completion report available',
    message: 'Batch Q3 competency evaluation report is generated and ready for faculty review.',
    timestamp: 'Yesterday',
    read: true,
    type: 'achievement',
    href: '/mcq-generator',
    role: 'trainer',
  },
  {
    id: 'n-t-4',
    title: 'Faculty curriculum meeting',
    message: 'Mission Karmayogi FRAC curriculum review alignment scheduled for Friday at 3:00 PM.',
    timestamp: '3 days ago',
    read: true,
    type: 'announcement',
    role: 'trainer',
  },
];

export const ADMIN_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-a-1',
    title: 'Workforce competency gap detected',
    message: 'Critical gap identified in GIS & Spatial Analysis across NSSO Field Division.',
    timestamp: '15 minutes ago',
    read: false,
    type: 'assessment',
    href: '/skill-gap',
    role: 'admin',
  },
  {
    id: 'n-a-2',
    title: 'Training effectiveness report updated',
    message: 'Mid-year competency uplift metrics across all 6 cadres are ready for review.',
    timestamp: '3 hours ago',
    read: false,
    type: 'system',
    href: '/admin/analytics',
    role: 'admin',
  },
  {
    id: 'n-a-3',
    title: 'Department analytics refreshed',
    message: 'Quarterly workforce readiness index updated to 78% across 4,000+ personnel.',
    timestamp: '1 day ago',
    read: true,
    type: 'announcement',
    href: '/admin/analytics',
    role: 'admin',
  },
  {
    id: 'n-a-4',
    title: 'Cadre compliance audit passed',
    message: 'FRAC standard compliance reached 94% across all MoSPI attached offices.',
    timestamp: '2 days ago',
    read: true,
    type: 'achievement',
    href: '/admin/analytics',
    role: 'admin',
  },
];

/**
 * Returns initial notification dataset based on user role.
 * Defaults to learner notifications.
 */
export function getInitialNotifications(role?: string): Notification[] {
  switch (role?.toLowerCase()) {
    case 'trainer':
      return [...TRAINER_NOTIFICATIONS];
    case 'admin':
      return [...ADMIN_NOTIFICATIONS];
    case 'learner':
    default:
      return [...LEARNER_NOTIFICATIONS];
  }
}

/**
 * Extensible data-fetcher designed for future Supabase integration.
 * When real Supabase `notifications` table is connected, replace this mock
 * implementation with a query without needing to modify the UI components:
 *
 * ```ts
 * const supabase = getSupabaseBrowserClient();
 * const { data, error } = await supabase
 *   .from('notifications')
 *   .select('*')
 *   .eq('user_id', userId)
 *   .order('created_at', { ascending: false });
 * ```
 */
export async function fetchNotifications(
  _userId?: string,
  role?: string
): Promise<Notification[]> {
  return getInitialNotifications(role);
}
