import { useState } from 'react';
import { ArrowLeft, FileText, Bell, Calendar, Home, Sparkles, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { DashboardView } from '@/app/components/DashboardView';
import { CauseListsView } from '@/app/components/CauseListsView';
import { RemindersView } from '@/app/components/RemindersView';
import { CalendarView } from '@/app/components/CalendarView';

interface MyDiaryViewProps {
  onBack: () => void;
  onNavigateToResearchBoard?: () => void;
  onNavigate?: (view: string) => void;
  onLogout?: () => void;
}

const diaryNavigation = [
  { name: 'Daily Board', icon: Home, id: 'daily-board' },
  { name: 'Cause Lists', icon: FileText, id: 'cause-lists' },
  { name: 'Reminders', icon: Bell, id: 'reminders' },
  { name: 'Calendar', icon: Calendar, id: 'calendar' },
];

export function MyDiaryView({ onBack, onNavigateToResearchBoard, onNavigate, onLogout }: MyDiaryViewProps) {
  const [activeSection, setActiveSection] = useState('daily-board');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'daily-board':
        return <DashboardView onNavigate={(view) => setActiveSection(view)} />;
      case 'cause-lists':
        return <CauseListsView />;
      case 'reminders':
        return <RemindersView />;
      case 'calendar':
        return <CalendarView />;
      default:
        return <DashboardView onNavigate={(view) => setActiveSection(view)} />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* My Diary Sidebar */}
      <aside className={`bg-card h-screen fixed left-0 top-0 flex flex-col border-r border-sidebar-border transition-all duration-300 z-20 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Back Button Header */}
        <div className="p-6 border-b border-sidebar-border">
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-3">
              <Button
                onClick={onBack}
                variant="ghost"
                className="flex-1 justify-start gap-3 hover:bg-accent text-foreground font-semibold h-12"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Main Menu
              </Button>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                title="Back to Main Menu"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>

        {/* Section Title */}
        {!isCollapsed && (
          <div className="px-6 py-4 border-b border-sidebar-border">
            <h2 className="text-lg font-bold text-foreground">My Diary</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your schedule and reminders
            </p>
          </div>
        )}

        {/* My Diary Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {diaryNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                title={isCollapsed ? item.name : undefined}
                className={`
                  w-full flex items-center gap-3 rounded-xl transition-all duration-200 font-medium group
                  ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
                  ${isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'}`} />
                {!isCollapsed && <span className="text-sm">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Helper Info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="p-3 bg-primary/10 rounded-xl">
              <p className="text-xs text-foreground font-semibold mb-1">📅 My Diary</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track your cause lists, set reminders, and manage your legal calendar all in one place.
              </p>
            </div>
          </div>
        )}

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-sidebar-border">
          {!isCollapsed ? (
            <>
              <button
                onClick={() => onNavigate && onNavigate('profile')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent cursor-pointer transition-all group mb-2"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">VW</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-foreground text-sm font-semibold truncate text-left">Vipul Wadhwa</p>
                  <p className="text-muted-foreground text-xs truncate text-left">vipul@lawfirm.com</p>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive/30 cursor-pointer transition-all group"
              >
                <LogOut className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => onNavigate && onNavigate('profile')}
                className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="Profile"
              >
                <span className="text-white text-sm font-bold">VW</span>
              </button>

              {/* Logout Button - Collapsed */}
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive/30 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-destructive" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {renderSection()}
      </div>
    </div>
  );
}