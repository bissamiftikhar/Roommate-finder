import { User } from '../App';
import { DashboardView } from './Dashboard';
import { Button } from './ui/button';
import { 
  Users, 
  User as UserIcon, 
  Settings, 
  Search, 
  Heart, 
  Mail, 
  MessageSquare, 
  Bell, 
  LogOut,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  user: User;
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onLogout: () => void;
}

export function Sidebar({ user, currentView, onViewChange, onLogout }: SidebarProps) {
  const isAdmin = user.role === 'admin';

  const studentMenuItems = [
    { id: 'profile' as DashboardView, label: 'My Profile', icon: UserIcon },
    { id: 'preferences' as DashboardView, label: 'Preferences', icon: Settings },
    { id: 'search' as DashboardView, label: 'Search', icon: Search },
    { id: 'matches' as DashboardView, label: 'Matches', icon: Heart },
    { id: 'requests' as DashboardView, label: 'Requests', icon: Mail },
    { id: 'chat' as DashboardView, label: 'Chat', icon: MessageSquare },
    { id: 'notifications' as DashboardView, label: 'Notifications', icon: Bell },
  ];

  const adminMenuItems = [
    { id: 'admin-users' as DashboardView, label: 'Manage Users', icon: Shield },
    { id: 'admin-reports' as DashboardView, label: 'Reports', icon: AlertTriangle },
    { id: 'notifications' as DashboardView, label: 'Notifications', icon: Bell },
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1>RoommateMatch</h1>
            <p className="text-xs text-muted-foreground">{user.role === 'admin' ? 'Admin' : 'Student'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
