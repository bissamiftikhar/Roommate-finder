import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, Mail, Heart, Shield, Check } from 'lucide-react';
import { notificationsApi } from '../services/api';
import { toast } from 'sonner@2.0.3';

interface Notification {
  notification_id: string;
  student_id: string;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsApi.getNotifications();
      setNotifications(response.data.notifications || []);
    } catch (error: any) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(
        notifications.map((notif) =>
          notif.notification_id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error: any) {
      console.error('Failed to mark as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      for (const notif of notifications.filter(n => !n.is_read)) {
        await notificationsApi.markAsRead(notif.notification_id);
      }
      setNotifications(
        notifications.map((notif) => ({ ...notif, is_read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error: any) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'match_request':
        return <Mail className="w-5 h-5" />;
      case 'match_accepted':
        return <Heart className="w-5 h-5" />;
      case 'new_message':
        return <Bell className="w-5 h-5" />;
      case 'admin_action':
        return <Shield className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'match_request':
        return 'bg-blue-100 text-blue-600';
      case 'match_accepted':
        return 'bg-green-100 text-green-600';
      case 'new_message':
        return 'bg-purple-100 text-purple-600';
      case 'admin_action':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <Check className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No Notifications</h3>
          <p className="text-gray-500 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.notification_id}
              className={`${!notification.is_read ? 'border-l-4 border-l-blue-600 bg-blue-50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${getIconColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notification.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <Button
                          onClick={() => handleMarkAsRead(notification.notification_id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Check className="w-4 h-4" />
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
