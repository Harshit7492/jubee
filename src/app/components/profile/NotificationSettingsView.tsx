import { useState } from 'react';
import { Bell } from 'lucide-react';

export function NotificationSettingsView() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-[22px] font-bold text-foreground">Notification Settings</h3>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-6">
        {/* Email Notifications */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            
            {/* Toggle Switch */}
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                emailNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* WhatsApp Notifications */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-1">WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
            </div>
            
            {/* Toggle Switch */}
            <button
              onClick={() => setWhatsappNotifications(!whatsappNotifications)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                whatsappNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  whatsappNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">💡 Note:</span> You can customize notification preferences for different types of alerts including case updates, reminders, and system notifications.
          </p>
        </div>
      </div>
    </div>
  );
}