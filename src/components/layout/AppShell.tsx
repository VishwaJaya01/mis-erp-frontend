import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NotificationBar } from './NotificationBar';

interface AppShellProps {
  children: ReactNode;
  activePage: string;
  breadcrumbs?: string[];
}

export function AppShell({
  children,
  activePage,
  breadcrumbs = [],
}: AppShellProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activePage={activePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          breadcrumbs={breadcrumbs}
          onNotificationClick={() => setNotificationOpen(true)}
          unreadCount={7}
        />
        <main
          className="flex-1 overflow-auto"
          data-app-content
          style={{ padding: 'var(--content-padding, 1.5rem)' }}
        >
          {children}
        </main>
      </div>
      <NotificationBar
        open={notificationOpen}
        onOpenChange={setNotificationOpen}
      />
    </div>
  );
}
