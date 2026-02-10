import { Home, FileText, Gavel, Calendar, Bell, Radio, Search, FileSearch, PenTool, Scale, Moon, Sun, BookOpen, Sparkles, FolderOpen, Clock, MessageSquare, FileCode, Languages, LogOut, ChevronLeft, ChevronRight, Newspaper, User, Settings, NotebookPen } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useState } from 'react';
import jubeeLogo from '@/assets/jubee-logo.png';
import { SearchWithDropdown } from '@/app/components/ui/search-with-dropdown';

// Recent activity items (mock data - in production this would come from a store/context)
const recentActivities = [
  { id: 1, tool: 'Legal Research', query: 'Section 138 NI Act precedents', timestamp: '2 hours ago', icon: Search },
  { id: 2, tool: 'AI Drafting', query: 'Bail application draft', timestamp: '5 hours ago', icon: FileText },
  { id: 3, tool: 'Jubee Bhasha', query: 'Hindi to English judgment', timestamp: 'Yesterday', icon: Languages },
  { id: 4, tool: 'Jubee Counsel', query: 'Contract review and edits', timestamp: '2 days ago', icon: PenTool },
];

const navigation = [
  { name: 'Home', icon: Sparkles, id: 'research-board', active: true },
  { name: 'My Space', icon: FolderOpen, id: 'myspace' },
  { name: 'My Cases', icon: Gavel, id: 'cases' },
  { name: 'My Diary', icon: BookOpen, id: 'diary' },
  { name: 'Verbatim', icon: NotebookPen, id: 'note-taking' },
];

interface JubeeSidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout?: () => void;
  onClearSession?: () => void;
}

export function JubeeSidebar({ activeView, onNavigate, onLogout, onClearSession }: JubeeSidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sidebarRecommendations = [
    { id: '1', text: 'Section 138 NI Act precedents', category: 'Legal Research' },
    { id: '2', text: 'Bail application format', category: 'Templates' },
    { id: '3', text: 'Recent Supreme Court judgments', category: 'Case Law' },
    { id: '4', text: 'Arbitration Act Section 9', category: 'Legal Research' },
    { id: '5', text: 'Criminal appeal draft', category: 'Templates' },
    { id: '6', text: 'Defamation case precedents', category: 'Case Law' },
    { id: '7', text: 'Delhi High Court orders', category: 'Court Orders' },
    { id: '8', text: 'Contract drafting guidelines', category: 'Templates' },
  ];
  
  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-card h-full flex flex-col border-r border-sidebar-border transition-all duration-300`}>
      {/* Logo */}
      <div className="border-b border-sidebar-border pt-[20px] pr-[12px] pb-[20px] pl-[20px]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-3">
            <button 
              onClick={() => {
                onClearSession?.();
                onNavigate('home');
                // Force navigation to home page
                window.location.pathname = '/';
              }}
              className="flex items-center gap-3 px-[-2px] py-[0px] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center">
                <img src={jubeeLogo} alt="Jubee.ai Logo" className="w-11 h-11 object-contain" />
              </div>
              <div className="text-left">
                <h1 className="text-foreground font-bold text-lg">JUBEE</h1>
              </div>
            </button>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center">
              <img src={jubeeLogo} alt="Jubee.ai Logo" className="w-11 h-11 object-contain" />
            </div>
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="px-3 pb-3">
        {!isCollapsed ? (
          <button
            onClick={() => onNavigate('recent-activity')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-200 group ${
              activeView === 'recent-activity'
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                : 'bg-accent/50 hover:bg-accent border-border/50 hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className={`w-4 h-4 ${activeView === 'recent-activity' ? 'text-primary-foreground' : 'text-primary'}`} />
              <span className={`text-sm font-semibold ${activeView === 'recent-activity' ? 'text-primary-foreground' : 'text-foreground'}`}>
                Recent Activity
              </span>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              activeView === 'recent-activity' 
                ? 'bg-white/20 text-primary-foreground'
                : 'text-muted-foreground bg-primary/10'
            }`}>
              {recentActivities.length}
            </span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('recent-activity')}
            className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 group ${
              activeView === 'recent-activity'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'hover:bg-accent'
            }`}
            title="Recent Activity"
          >
            <Clock className={`w-5 h-5 ${activeView === 'recent-activity' ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/50">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          if (!isCollapsed) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
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
          } else {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                    : 'hover:bg-accent'
                  }
                `}
                title={item.name}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </button>
            );
          }
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-4 pt-4 pb-2 border-t border-sidebar-border">
        {/* Legal Updates Button */}
        {!isCollapsed ? (
          <button
            onClick={() => onNavigate('legal-updates')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-4 transition-all duration-200 group relative ${
              activeView === 'legal-updates'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'bg-accent/50 hover:bg-accent border border-border hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <Newspaper className={`w-5 h-5 ${activeView === 'legal-updates' ? 'text-primary-foreground' : 'text-[#D97706] dark:text-[#FBBF24]'}`} />
              <span className={`text-sm font-semibold ${activeView === 'legal-updates' ? 'text-primary-foreground' : 'text-foreground'}`}>
                Legal Updates
              </span>
            </div>
            {/* Notification Dot */}
            <div className="w-2 h-2 rounded-full bg-[#D97706] dark:bg-[#FBBF24] shadow-lg shadow-[#D97706]/50 dark:shadow-[#FBBF24]/50 animate-pulse" />
          </button>
        ) : (
          <button
            onClick={() => onNavigate('legal-updates')}
            className={`w-full flex items-center justify-center p-3 rounded-xl mb-4 transition-all duration-200 relative ${
              activeView === 'legal-updates'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'hover:bg-accent'
            }`}
            title="Legal Updates"
          >
            <Newspaper className={`w-5 h-5 ${activeView === 'legal-updates' ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            {/* Notification Dot */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D97706] dark:bg-[#FBBF24] shadow-lg shadow-[#D97706]/50 dark:shadow-[#FBBF24]/50 animate-pulse" />
          </button>
        )}

        {/* Alerts Button */}
        {!isCollapsed ? (
          <button
            onClick={() => onNavigate('alerts')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-4 transition-all duration-200 group relative ${
              activeView === 'alerts'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'bg-accent/50 hover:bg-accent border border-border hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${activeView === 'alerts' ? 'text-primary-foreground' : 'text-[#D97706] dark:text-[#FBBF24]'}`} />
              <span className={`text-sm font-semibold ${activeView === 'alerts' ? 'text-primary-foreground' : 'text-foreground'}`}>
                Alerts
              </span>
            </div>
            {/* Notification Dot */}
            <div className="w-2 h-2 rounded-full bg-[#D97706] dark:bg-[#FBBF24] shadow-lg shadow-[#D97706]/50 dark:shadow-[#FBBF24]/50 animate-pulse" />
          </button>
        ) : (
          <button
            onClick={() => onNavigate('alerts')}
            className={`w-full flex items-center justify-center p-3 rounded-xl mb-4 transition-all duration-200 relative ${
              activeView === 'alerts'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'hover:bg-accent'
            }`}
            title="Alerts"
          >
            <Bell className={`w-5 h-5 ${activeView === 'alerts' ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            {/* Notification Dot */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D97706] dark:bg-[#FBBF24] shadow-lg shadow-[#D97706]/50 dark:shadow-[#FBBF24]/50 animate-pulse" />
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border relative px-[16px] py-[12px]">
        {!isCollapsed ? (
          <>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
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

            {/* Profile Menu Popup */}
            {showProfileMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                
                {/* Popup Menu */}
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-all text-left"
                  >
                    <Settings className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Profile Settings</span>
                  </button>
                  <div className="border-t border-border" />
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Logout</span>
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-accent cursor-pointer transition-all mb-2"
              title="Profile"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">VW</span>
              </div>
            </button>

            {/* Profile Menu Popup for Collapsed View */}
            {showProfileMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                
                {/* Popup Menu */}
                <div className="absolute bottom-full left-2 mb-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-all text-left"
                  >
                    <Settings className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Profile Settings</span>
                  </button>
                  <div className="border-t border-border" />
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Logout</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
}