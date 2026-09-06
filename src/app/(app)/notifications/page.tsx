import { NotificationsClient } from './NotificationsClient';

export const metadata = {
  title: 'Notifications — StatVidya',
  description: 'View and manage all system and competency notifications.',
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
