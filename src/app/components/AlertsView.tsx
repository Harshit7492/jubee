import { useState } from 'react';
import { Bell, CheckCircle2, X, Clock, AlertCircle, Info, CheckCircle, Radio, Badge, Gavel, Calendar, FileText, FileCheck, Sparkles, XCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { JubeeFooter } from '@/app/components/JubeeFooter';
import { Tab, Tabs } from './ui/tabs';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  category: 'case' | 'hearing' | 'document' | 'system' | 'pre-check';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    category: 'hearing',
    title: 'Upcoming Hearing Tomorrow',
    message: 'Ram Kumar vs State of Delhi - Hearing scheduled at Delhi High Court at 10:30 AM',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: '2',
    type: 'success',
    category: 'pre-check',
    title: 'Scrutiny Completed',
    message: 'Document scrutiny for "Sharma vs Municipal Corporation" has been completed. 2 defects found.',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
  },
  {
    id: '3',
    type: 'error',
    category: 'document',
    title: 'Missing Annexure Detected',
    message: 'Annexure A-3 mentioned in petition but not found in uploaded files for case CRL.M.C. 4523/2025',
    timestamp: new Date(Date.now() - 10800000),
    read: false,
  },
  {
    id: '4',
    type: 'info',
    category: 'case',
    title: 'New Case Added',
    message: 'Successfully added new case: "Verma Enterprises vs State Tax Department"',
    timestamp: new Date(Date.now() - 14400000),
    read: true,
  },
  {
    id: '5',
    type: 'warning',
    category: 'hearing',
    title: 'Hearing Date Changed',
    message: 'Hearing for "Kumar vs State" rescheduled from Jan 30 to Feb 5, 2026',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
  },
  {
    id: '6',
    type: 'info',
    category: 'system',
    title: 'New Feature Available',
    message: 'AI-powered Cross Examiner tool is now available in your Research Board',
    timestamp: new Date(Date.now() - 172800000),
    read: true,
  },
  {
    id: '7',
    type: 'success',
    category: 'document',
    title: 'Document OCR Completed',
    message: 'OCR processing completed for 15 documents in "Property Dispute Bundle"',
    timestamp: new Date(Date.now() - 259200000),
    read: true,
  },
  {
    id: '8',
    type: 'warning',
    category: 'case',
    title: 'Limitation Period Alert',
    message: 'Filing limitation expires in 5 days for appeal in "Singh vs Revenue Department"',
    timestamp: new Date(Date.now() - 345600000),
    read: true,
  }
];

export function AlertsView() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'case':
        return <Gavel className="w-4 h-4" />;
      case 'hearing':
        return <Calendar className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'pre-check':
        return <FileCheck className="w-4 h-4" />;
      case 'system':
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-500/10 dark:border-green-500/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-500/10 dark:border-yellow-500/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20';
      case 'info':
        return 'border-primary/20 bg-primary/5';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex-1 h-screen overflow-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-foreground text-[22px] font-bold flex items-center gap-2">
                  Alerts
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white border-0 font-semibold">
                      {unreadCount} New
                    </Badge>
                  )}
                </h1>
                <p className="text-muted-foreground text-sm mt-0.5">Important updates and alerts</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="border-primary/30 text-primary hover:bg-primary/10 font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 mr-0.5" />
                Mark All as Read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <Tabs className="mt-6">
            <Tab
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All Notifications ({notifications.length})
            </Tab>
            <Tab
              active={filter === 'unread'}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Tab>
          </Tabs>
        </div>
      </header>

      {/* Notifications List */}
      <div className="px-8 py-8">
        {filteredNotifications.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {filter === 'unread' ? 'All Caught Up!' : 'No Notifications'}
              </h2>
              <p className="text-muted-foreground">
                {filter === 'unread'
                  ? 'You have no unread notifications at the moment.'
                  : 'You have no notifications yet. We\'ll notify you about important updates.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 transition-all hover:bg-accent/50 ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-sm font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <Badge
                          // variant="outline"
                          className="border-border text-muted-foreground text-xs font-medium flex items-center gap-1.5 flex-shrink-0"
                        >
                          {getCategoryIcon(notification.category)}
                          <span className="capitalize">{notification.category}</span>
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTimestamp(notification.timestamp)}
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* <JubeeFooter /> */}
    </div>
  );
}