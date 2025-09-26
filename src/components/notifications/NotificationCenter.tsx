import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Check, 
  X, 
  MoreVertical,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  Zap,
  DollarSign,
  Cog,
  Clock,
  AlertTriangle as Alert
} from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';

const notificationIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
  consumption: Zap,
  cost: DollarSign,
  system: Cog,
  reminder: Clock,
  alert: Alert
};

const notificationColors = {
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  success: 'text-green-500'
};

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotificationStore();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'consumption' | 'cost' | 'system' | 'reminder'>('all');

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'consumption':
      case 'cost':
      case 'system':
      case 'reminder':
        return notification.category === filter;
      default:
        return true;
    }
  });

  // removed unused getCategoryCount

  const getUnreadCategoryCount = (category: string) => {
    return notifications.filter(n => n.category === category && !n.read).length;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
              >
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  All Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('unread')}>
                  Unread Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearAllNotifications}>
                  Clear All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="consumption">
              Usage
              {getUnreadCategoryCount('consumption') > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {getUnreadCategoryCount('consumption')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cost">
              Cost
              {getUnreadCategoryCount('cost') > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {getUnreadCategoryCount('cost')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="system">
              System
              {getUnreadCategoryCount('system') > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {getUnreadCategoryCount('system')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reminder">
              Reminders
              {getUnreadCategoryCount('reminder') > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {getUnreadCategoryCount('reminder')}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <ScrollArea className="h-96">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                  <p className="text-sm">
                    {filter === 'unread' 
                      ? 'All caught up!' 
                      : 'You\'ll see notifications here when they arrive'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredNotifications.map((notification) => {
                    const IconComponent = notificationIcons[notification.type] || notificationIcons[notification.category] || Bell;
                    const colorClass = notificationColors[notification.type] || 'text-muted-foreground';
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-colors ${
                          notification.read 
                            ? 'bg-muted/50 border-muted' 
                            : 'bg-background border-border shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${colorClass}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${
                                  notification.read ? 'text-muted-foreground' : 'text-foreground'
                                }`}>
                                  {notification.title}
                                </h4>
                                <p className={`text-sm mt-1 ${
                                  notification.read ? 'text-muted-foreground' : 'text-muted-foreground'
                                }`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeNotification(notification.id)}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {notification.actionUrl && notification.actionText && (
                              <div className="mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    window.location.href = notification.actionUrl!;
                                    if (!notification.read) {
                                      markAsRead(notification.id);
                                    }
                                  }}
                                >
                                  {notification.actionText}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
