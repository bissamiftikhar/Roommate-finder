import { useState } from 'react';
import { User } from '../App';
import { Sidebar } from './Sidebar';
import { ProfileView } from './ProfileView';
import { PreferencesView } from './PreferencesView';
import { SearchView } from './SearchView';
import { MatchesView } from './MatchesView';
import { RequestsView } from './RequestsView';
import { ChatView } from './ChatView';
import { NotificationsView } from './NotificationsView';
import { AdminUsersView } from './AdminUsersView';
import { AdminReportsView } from './AdminReportsView';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export type DashboardView = 
  | 'profile' 
  | 'preferences' 
  | 'search' 
  | 'matches' 
  | 'requests' 
  | 'chat' 
  | 'notifications'
  | 'admin-users'
  | 'admin-reports';

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<DashboardView>('profile');

  const renderView = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileView user={user} />;
      case 'preferences':
        return <PreferencesView user={user} />;
      case 'search':
        return <SearchView currentUser={user} />;
      case 'matches':
        return <MatchesView currentUser={user} />;
      case 'requests':
        return <RequestsView currentUser={user} />;
      case 'chat':
        return <ChatView currentUser={user} />;
      case 'notifications':
        return <NotificationsView />;
      case 'admin-users':
        return <AdminUsersView />;
      case 'admin-reports':
        return <AdminReportsView />;
      default:
        return <ProfileView user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}
