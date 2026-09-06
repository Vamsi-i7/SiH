import type { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  Target,
  ClipboardCheck,
  Flag,
  UserCircle,
  FileText,
  Brain,
  BarChart3,
  Building2,
  TrendingUp,
  Layers,
  type LucideIcon,
} from 'lucide-react';

export interface RoleNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'default' | 'accent' | 'warning' | 'success';
}

export const LEARNER_NAV_ITEMS: RoleNavItem[] = [
  {
    href: '/dashboard',
    label: 'nav.dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/skill-gap',
    label: 'nav.skillGap',
    icon: Target,
  },
  {
    href: '/assignments',
    label: 'nav.assessment',
    icon: ClipboardCheck,
    badge: '3 Drills',
    badgeType: 'accent',
  },
  {
    href: '/pathways',
    label: 'nav.pathways',
    icon: Flag,
  },
  {
    href: '/profile',
    label: 'nav.profile',
    icon: UserCircle,
  },
];

export const TRAINER_NAV_ITEMS: RoleNavItem[] = [
  {
    href: '/dashboard',
    label: 'Faculty Command Desk',
    icon: LayoutDashboard,
  },
  {
    href: '/documents',
    label: 'nav.documents',
    icon: FileText,
    badge: '6 Manuals',
    badgeType: 'default',
  },
  {
    href: '/mcq-generator',
    label: 'nav.mcqGenerator',
    icon: Brain,
  },
  {
    href: '/review-queue',
    label: 'nav.reviewQueue',
    icon: ClipboardCheck,
    badge: '14 QA',
    badgeType: 'warning',
  },
  {
    href: '/assignments',
    label: 'Trainee Error Analytics',
    icon: Layers,
  },
];

export const ADMIN_NAV_ITEMS: RoleNavItem[] = [
  {
    href: '/dashboard',
    label: 'Workforce Command',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard#correlation',
    label: 'Scrutiny Correlation',
    icon: TrendingUp,
    badge: 'r=-0.84',
    badgeType: 'accent',
  },
  {
    href: '/dashboard#regional-offices',
    label: 'Regional Office Health',
    icon: Building2,
    badge: '2 Flagged',
    badgeType: 'warning',
  },
  {
    href: '/skill-gap',
    label: 'National Competency Matrix',
    icon: Target,
  },
  {
    href: '/assignments',
    label: 'Statutory Assessment Audit',
    icon: BarChart3,
  },
];

export function getNavigationForRole(role: UserRole = 'learner'): RoleNavItem[] {
  switch (role) {
    case 'trainer':
      return TRAINER_NAV_ITEMS;
    case 'admin':
      return ADMIN_NAV_ITEMS;
    case 'learner':
    default:
      return LEARNER_NAV_ITEMS;
  }
}

export function getRoleIdentity(role: UserRole = 'learner') {
  switch (role) {
    case 'trainer':
      return {
        title: 'StatVidya',
        subtitle: 'NSSTA Faculty Studio',
        emblemTag: 'NSSTA • MoSPI',
        themeColor: '#8C5B3E',
        roleLabel: 'Faculty Trainer',
      };
    case 'admin':
      return {
        title: 'StatVidya',
        subtitle: 'Executive Command Desk',
        emblemTag: 'MoSPI HQ • ADG',
        themeColor: '#2d1f17',
        roleLabel: 'Policy Administrator',
      };
    case 'learner':
    default:
      return {
        title: 'StatVidya',
        subtitle: 'MoSPI Capacity Building',
        emblemTag: 'Civil Services • FOD',
        themeColor: '#555934',
        roleLabel: 'Cadre Officer',
      };
  }
}

export function getRoleFooterData(role: UserRole = 'learner') {
  switch (role) {
    case 'trainer':
      return {
        title: 'Curriculum Vector DB',
        subtitle: '6 Manuals • 1,276 Chunks',
        badge: 'Vector Engine Active',
      };
    case 'admin':
      return {
        title: 'National Governance',
        subtitle: 'Cabinet Protocol Sync',
        badge: 'Statutory NSC Certified',
      };
    case 'learner':
    default:
      return {
        title: 'CAPI Offline Engine',
        subtitle: 'IndexedDB Encrypted Cache',
        badge: 'CAPI Synchronized',
      };
  }
}
