import { ArrowLeft, Search, Clock, MessageSquare, FileText, Languages, PenTool, Calendar, Trash2, Eye, FileSearch, Scale } from 'lucide-react';
import { useState, useRef } from 'react';
import { SearchWithDropdown } from '@/app/components/ui/search-with-dropdown';

// Tool categories for chip filters
const allTools = [
  { id: 'Legal Research', name: 'Legal Research', icon: Search, color: 'text-blue-500' },
  { id: 'AI Drafting', name: 'AI Drafting', icon: FileText, color: 'text-orange-500' },
  { id: 'Jubee Bhasha', name: 'Jubee Bhasha', icon: Languages, color: 'text-purple-500' },
  { id: 'Jubee Counsel', name: 'Jubee Counsel', icon: PenTool, color: 'text-pink-500' },
  { id: 'Cross-Examiner', name: 'Cross-Examiner', icon: MessageSquare, color: 'text-cyan-500' },
];

// Tool categories with "All" option for filtering
const toolCategories = [
  { id: 'all', name: 'All Tools', icon: FileSearch, color: 'text-primary' },
  ...allTools
];

// Extended mock data for recent activities
const recentSessions = [
  { 
    id: 1, 
    title: 'Section 138 NI Act precedents', 
    tool: 'Legal Research', 
    toolIcon: Search,
    timestamp: '2 hours ago',
    date: 'Jan 15',
    preview: 'Researching dishonored cheque cases under Negotiable Instruments Act...',
    starred: false,
    color: 'text-blue-500'
  },
  { 
    id: 2, 
    title: 'Bail application draft', 
    tool: 'AI Drafting', 
    toolIcon: FileText,
    timestamp: '5 hours ago',
    date: 'Jan 15',
    preview: 'Draft bail application for anticipatory bail in Section 420 IPC case...',
    starred: true,
    color: 'text-orange-500'
  },
  { 
    id: 3, 
    title: 'Hindi to English judgment translation', 
    tool: 'Jubee Bhasha', 
    toolIcon: Languages,
    timestamp: 'Yesterday',
    date: 'Jan 14',
    preview: 'Translated High Court judgment from Hindi to English...',
    starred: false,
    color: 'text-purple-500'
  },
  { 
    id: 4, 
    title: 'Contract review and edits', 
    tool: 'Jubee Counsel', 
    toolIcon: PenTool,
    timestamp: '2 days ago',
    date: 'Jan 13',
    preview: 'Reviewed and edited service agreement contract with AI assistance...',
    starred: false,
    color: 'text-pink-500'
  },
  { 
    id: 5, 
    title: 'Defamation case research', 
    tool: 'Legal Research', 
    toolIcon: Search,
    timestamp: '3 days ago',
    date: 'Jan 12',
    preview: 'Researching recent Supreme Court judgments on defamation...',
    starred: true,
    color: 'text-blue-500'
  },
  { 
    id: 6, 
    title: 'Witness cross-examination prep', 
    tool: 'Cross-Examiner', 
    toolIcon: MessageSquare,
    timestamp: '4 days ago',
    date: 'Jan 11',
    preview: 'Prepared cross-examination questions for hostile witness...',
    starred: false,
    color: 'text-cyan-500'
  },
  { 
    id: 7, 
    title: 'Trademark infringement notice', 
    tool: 'AI Drafting', 
    toolIcon: FileText,
    timestamp: '5 days ago',
    date: 'Jan 10',
    preview: 'Drafted cease and desist notice for trademark violation...',
    starred: false,
    color: 'text-orange-500'
  },
  { 
    id: 8, 
    title: 'Property deed translation', 
    tool: 'Jubee Bhasha', 
    toolIcon: Languages,
    timestamp: '1 week ago',
    date: 'Jan 8',
    preview: 'Translated property documents from Gujarati to English...',
    starred: false,
    color: 'text-purple-500'
  },
];

interface RecentActivityViewProps {
  onBack: () => void;
  onSelectSession: (sessionId: string, toolName: string, title: string) => void;
}

export function RecentActivityView({ onBack, onSelectSession }: RecentActivityViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions, setSessions] = useState(recentSessions);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const searchRecommendations = [
    { id: '1', text: 'Legal Research', category: 'Tool' },
    { id: '2', text: 'AI Drafting', category: 'Tool' },
    { id: '3', text: 'Jubee Bhasha', category: 'Tool' },
    { id: '4', text: 'Section 138 NI Act', category: 'Recent' },
    { id: '5', text: 'Bail application', category: 'Recent' },
    { id: '6', text: 'Cross-examination', category: 'Recent' },
    { id: '7', text: 'Defamation case', category: 'Recent' },
    { id: '8', text: 'Contract review', category: 'Recent' },
  ];

  // Filter by tool and search query
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTool = selectedTool === 'all' || session.tool === selectedTool;
    
    return matchesSearch && matchesTool;
  });

  const toggleStar = (id: number) => {
    setSessions(sessions.map(s => 
      s.id === id ? { ...s, starred: !s.starred } : s
    ));
  };

  const deleteSession = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
    setActiveMenu(null);
  };

  const groupedSessions = {
    today: filteredSessions.filter(s => s.timestamp.includes('hour')),
    yesterday: filteredSessions.filter(s => s.timestamp === 'Yesterday'),
    previous7Days: filteredSessions.filter(s => s.timestamp.includes('day') && s.timestamp !== 'Yesterday'),
    older: filteredSessions.filter(s => s.timestamp.includes('week')),
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust the multiplier for faster/slower scrolling
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold text-foreground">Recent Activity</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          {/* Search Bar */}
          <div className="mb-4">
            <SearchWithDropdown
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search your activity..."
              recommendations={searchRecommendations}
              inputClassName="py-3 pl-10 pr-4"
            />
          </div>

          {/* Tool Filter Chips */}
          <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {toolCategories.map((tool) => {
              const isSelected = selectedTool === tool.id;
              const toolCount = tool.id === 'all' 
                ? sessions.length 
                : sessions.filter(s => s.tool === tool.id).length;

              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card hover:bg-accent border border-border hover:border-primary/30'
                  }`}
                >
                  <span className={`text-xs font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {tool.name}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                    isSelected 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {toolCount}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No activity found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery ? 'Try adjusting your search terms' : 'Start using Jubee tools to see your activity here'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Today */}
              {groupedSessions.today.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Today
                  </h2>
                  <div className="space-y-4">
                    {groupedSessions.today.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        toggleStar={toggleStar}
                        deleteSession={deleteSession}
                        onSelectSession={onSelectSession}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday */}
              {groupedSessions.yesterday.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Yesterday
                  </h2>
                  <div className="space-y-4">
                    {groupedSessions.yesterday.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        toggleStar={toggleStar}
                        deleteSession={deleteSession}
                        onSelectSession={onSelectSession}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Previous 7 Days */}
              {groupedSessions.previous7Days.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Previous 7 Days
                  </h2>
                  <div className="space-y-4">
                    {groupedSessions.previous7Days.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        toggleStar={toggleStar}
                        deleteSession={deleteSession}
                        onSelectSession={onSelectSession}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Older */}
              {groupedSessions.older.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Older
                  </h2>
                  <div className="space-y-4">
                    {groupedSessions.older.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        toggleStar={toggleStar}
                        deleteSession={deleteSession}
                        onSelectSession={onSelectSession}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SessionCardProps {
  session: typeof recentSessions[0];
  activeMenu: number | null;
  setActiveMenu: (id: number | null) => void;
  toggleStar: (id: number) => void;
  deleteSession: (id: number) => void;
  onSelectSession: (sessionId: string, toolName: string, title: string) => void;
}

function SessionCard({ session, activeMenu, setActiveMenu, toggleStar, deleteSession, onSelectSession }: SessionCardProps) {
  const Icon = session.toolIcon;

  return (
    <div 
      onClick={() => onSelectSession(session.id.toString(), session.tool, session.title)}
      className="group relative bg-card border border-border hover:border-primary/30 rounded-xl p-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Tool Icon */}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br from-${session.color.split('-')[1]}-500/10 to-${session.color.split('-')[1]}-500/5 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${session.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {session.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {session.date}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSession(session.id.toString(), session.tool, session.title);
                }}
                className="p-2 hover:bg-accent rounded-lg transition-all"
                title="View"
              >
                <Eye className="w-4 h-4 text-primary" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                className="p-2 hover:bg-accent rounded-lg transition-all"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {session.preview}
          </p>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${session.color} bg-${session.color.split('-')[1]}-500/10 px-2 py-1 rounded-md`}>
              {session.tool}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {session.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}