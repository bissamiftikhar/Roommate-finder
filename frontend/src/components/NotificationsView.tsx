import { useState } from 'react';
import { Notification } from '../App';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, Mail, Heart, Shield, Check } from 'lucide-react';

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'match_request',
    message: 'Sarah Johnson sent you a match request',
    timestamp: '2024-01-20T10:00:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'match_accepted',
    message: 'Mike Chen accepted your match request',
    timestamp: '2024-01-19T15:30:00Z',
    read: false,
  },
  {
    id: '3',
    type: 'new_message',
    message: 'You have a new message from Lisa Park',
    timestamp: '2024-01-19T14:00:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'match_request',
    message: 'Emma Wilson sent you a match request',
    timestamp: '2024-01-18T11:20:00Z',
    read: true,
  },
];

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleMarkAsRead = (id: string) => {
    // Mock API call - replace with your backend
    // fetch(`/api/notifications/${id}/read`, { method: 'POST' })

    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    // Mock API call - replace with your backend
    // fetch(`/api/notifications/read-all`, { method: 'POST' })

    setNotifications(
      notifications.map((notif) => ({ ...notif, read: true }))
    );
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match_request':
        return <Mail className="w-5 h-5" />;
      case 'match_accepted':
        return <Heart className="w-5 h-5" />;
      case 'new_message':
        return <Bell className="w-5 h-5" />;
      case 'admin_action':
        return <Shield className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'match_request':
        return 'bg-blue-100 text-blue-600';
      case 'match_accepted':
        return 'bg-green-100 text-green-600';
      case 'new_message':
        return 'bg-purple-100 text-purple-600';
      case 'admin_action':
        return 'bg-red-100 text-red-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No notifications yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${
                !notification.read ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(
                      notification.type
                    )}`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <p className={!notification.read ? '' : 'text-muted-foreground'}>
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <Badge variant="default" className="ml-2">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                      {!notification.read && (
                        <Button
                          onClick={() => handleMarkAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
