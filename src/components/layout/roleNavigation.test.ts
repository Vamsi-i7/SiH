import { describe, it, expect } from 'vitest';
import {
  getNavigationForRole,
  getRoleIdentity,
  getRoleFooterData,
} from './roleNavigation';

describe('roleNavigation', () => {
  it('returns learner-exclusive navigation items', () => {
    const items = getNavigationForRole('learner');
    const hrefs = items.map((i) => i.href);

    expect(hrefs).toContain('/dashboard');
    expect(hrefs).toContain('/skill-gap');
    expect(hrefs).toContain('/assignments');
    expect(hrefs).toContain('/pathways');
    expect(hrefs).toContain('/profile');

    // Learners must NOT see trainer tools
    expect(hrefs).not.toContain('/documents');
    expect(hrefs).not.toContain('/review-queue');
    expect(hrefs).not.toContain('/mcq-generator');
  });

  it('returns trainer-exclusive faculty studio navigation items', () => {
    const items = getNavigationForRole('trainer');
    const hrefs = items.map((i) => i.href);

    expect(hrefs).toContain('/dashboard');
    expect(hrefs).toContain('/documents');
    expect(hrefs).toContain('/mcq-generator');
    expect(hrefs).toContain('/review-queue');
    expect(hrefs).toContain('/assignments');

    // Trainers must NOT see personal learner learning pathways
    expect(hrefs).not.toContain('/pathways');
  });

  it('returns admin-exclusive national executive navigation items', () => {
    const items = getNavigationForRole('admin');
    const hrefs = items.map((i) => i.href);

    expect(hrefs).toContain('/dashboard');
    expect(hrefs).toContain('/skill-gap');
    expect(hrefs).toContain('/assignments');

    // Admins must NOT see trainer content generation tools
    expect(hrefs).not.toContain('/mcq-generator');
    expect(hrefs).not.toContain('/review-queue');
  });

  it('returns role identity headers and badge tags', () => {
    const learnerId = getRoleIdentity('learner');
    expect(learnerId.title).toBe('StatVidya');
    expect(learnerId.subtitle).toContain('MoSPI');

    const trainerId = getRoleIdentity('trainer');
    expect(trainerId.subtitle).toContain('NSSTA');

    const adminId = getRoleIdentity('admin');
    expect(adminId.subtitle).toContain('Executive');
  });

  it('returns role status footers', () => {
    const learnerFooter = getRoleFooterData('learner');
    expect(learnerFooter.badge).toContain('CAPI');

    const trainerFooter = getRoleFooterData('trainer');
    expect(trainerFooter.badge).toContain('Vector');

    const adminFooter = getRoleFooterData('admin');
    expect(adminFooter.badge).toContain('Statutory');
  });
});
