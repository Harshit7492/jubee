import { useState } from 'react';
import { ArrowLeft, User, Bell, Shield, CreditCard, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { PersonalInformationView } from '@/app/components/profile/PersonalInformationView';
import { NotificationSettingsView } from '@/app/components/profile/NotificationSettingsView';
import { SecurityView } from '@/app/components/profile/SecurityView';
import { SubscriptionView } from '@/app/components/profile/SubscriptionView';
import { JubeeFooter } from '@/app/components/JubeeFooter';
import { useTheme } from '@/app/contexts/ThemeContext';

interface ProfileViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
}

const profileNavigation = [
  { name: 'Personal Information', icon: User, id: 'personal' },
  { name: 'Notification Settings', icon: Bell, id: 'notifications' },
  { name: 'Security & Privacy', icon: Shield, id: 'security' },
  { name: 'Subscription Model', icon: CreditCard, id: 'subscription' },
];

export function ProfileView({ onBack, onNavigate, onLogout }: ProfileViewProps) {
  const [activeSection, setActiveSection] = useState('personal');
  const { theme, toggleTheme } = useTheme();

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInformationView />;
      case 'notifications':
        return <NotificationSettingsView />;
      case 'security':
        return <SecurityView />;
      case 'subscription':
        return <SubscriptionView />;
      default:
        return <PersonalInformationView />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Profile Sidebar */}
      <aside className="w-64 bg-card h-screen flex flex-col border-r border-sidebar-border transition-colors duration-300">
        {/* Back Button Header */}
        <div className="p-6 border-b border-sidebar-border">
          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-accent text-foreground font-semibold h-12"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Main Menu
          </Button>
        </div>

        {/* Profile Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {profileNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group
                  ${isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'}`} />
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Helper Info */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="p-3 bg-primary/10 rounded-xl">
            <p className="text-xs text-foreground font-semibold mb-1">⚙️ Settings</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Customize your Jubee experience and manage your account security.
            </p>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-sidebar-border">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Theme</span>
            <button
              onClick={toggleTheme}
              className="relative w-16 h-8 bg-accent rounded-full flex items-center transition-all duration-300 border border-border hover:border-primary group"
              aria-label="Toggle theme"
            >
              <div className={`absolute w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${
                theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
              }`}>
                {theme === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <div className="flex items-center justify-between w-full px-2">
                <Sun className={`w-3.5 h-3.5 transition-opacity ${theme === 'light' ? 'opacity-0' : 'opacity-50'}`} />
                <Moon className={`w-3.5 h-3.5 transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-50'}`} />
              </div>
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive/30 cursor-pointer transition-all group"
          >
            <LogOut className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Logout</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {renderSection()}
        </div>
        {/* {onNavigate && <JubeeFooter onNavigate={onNavigate} />} */}
      </div>
    </div>
  );
}