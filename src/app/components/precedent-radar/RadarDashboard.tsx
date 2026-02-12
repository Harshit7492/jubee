import { useState } from 'react';
import { Radio, Plus, Bell, BellOff, Edit, Copy, Trash2, ChevronRight, Activity, ChevronLeft, X, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import { WorkspaceQuote, WORKSPACE_QUOTES } from '@/app/components/WorkspaceQuote';
import jubeeLogo from '@/assets/jubee-logo.png';

export interface RadarItem {
  id: string;
  proposition: string;
  jurisdictions: string[];
  status: 'active' | 'inactive';
  notificationsEnabled: boolean;
  casesIntercepted: number;
  articlesIntercepted: number;
  createdAt: Date;
  lastActivity?: Date;
}

interface RadarDashboardProps {
  radars: RadarItem[];
  onCreateNew: () => void;
  onSelectRadar: (radarId: string) => void;
  onToggleStatus: (radarId: string) => void;
  onToggleNotifications: (radarId: string) => void;
  onEdit: (radarId: string) => void;
  onDuplicate: (radarId: string) => void;
  onDelete: (radarId: string) => void;
  onBack?: () => void;
}

export function RadarDashboard({
  radars,
  onCreateNew,
  onSelectRadar,
  onToggleStatus,
  onToggleNotifications,
  onEdit,
  onDuplicate,
  onDelete,
  onBack
}: RadarDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // AI Chat states
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; text: string; isAI: boolean; timestamp: Date }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  const activeRadars = radars.filter(r => r.status === 'active');
  const inactiveRadars = radars.filter(r => r.status === 'inactive');
  const totalIntercepted = radars.reduce((sum, r) => sum + r.casesIntercepted, 0);

  const filteredRadars = filter === 'all' ? radars : filter === 'active' ? activeRadars : inactiveRadars;

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      text: chatInput,
      isAI: false,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAITyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I can help you refine your radar propositions to get more relevant case matches. Would you like suggestions for improvement?",
        "Your active radars are monitoring multiple jurisdictions. I can help you optimize the search criteria for better results.",
        "Based on your radar history, I notice some patterns. Would you like me to suggest additional case law areas to monitor?",
        "I can help you understand why certain cases are being intercepted and how to adjust your radar parameters."
      ];

      const aiMessage = {
        id: `ai-${Date.now()}`,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        isAI: true,
        timestamp: new Date()
      };

      setIsAITyping(false);
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header - Simplified Horizontal Style */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center gap-4">
            {/* Back Button with Page Title */}
            {onBack && (
              <>
                <Button
                  onClick={onBack}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-accent"
                >
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </Button>
                <div className="w-px h-5 bg-border" />
              </>
            )}

            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Jubee Radar</h1>
            </div>

            {/* Create Button */}
            <Button
              onClick={onCreateNew}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Radar
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-8 py-4 bg-accent/20 border-t border-border">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total:</span>
              <span className="text-sm font-bold text-foreground">{radars.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active:</span>
              <span className="text-sm font-bold text-primary">{activeRadars.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Inactive:</span>
              <span className="text-sm font-bold text-foreground">{inactiveRadars.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cases Intercepted:</span>
              <span className="text-sm font-bold text-foreground">{totalIntercepted}</span>
            </div>

            <div className="flex-1" />

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                    filter === tab.value
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground border border-border"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Radar List */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Workspace Quote */}
        <div className="max-w-6xl mb-6">
          <WorkspaceQuote quotes={WORKSPACE_QUOTES.radar} />
        </div>

        {filteredRadars.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Radio className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No Radars Found</h3>
            <p className="text-sm text-muted-foreground mb-6">Create your first radar to start monitoring case laws</p>
            <Button
              onClick={onCreateNew}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Radar
            </Button>
          </div>
        ) : (
          <div className="space-y-4 max-w-6xl">
            {filteredRadars.map((radar) => (
              <div
                key={radar.id}
                className={cn(
                  "bg-card border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer",
                  radar.status === 'active'
                    ? "border-primary/40 hover:border-primary ring-2 ring-primary/10"
                    : "border-border hover:border-border"
                )}
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {/* Radar Icon - Simplified */}
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                      radar.status === 'active'
                        ? "bg-primary/10"
                        : "bg-accent"
                    )}>
                      <Radio className={cn(
                        "w-5 h-5",
                        radar.status === 'active' ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            {/* Status Dot */}
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              radar.status === 'active' ? "bg-primary animate-pulse" : "bg-muted-foreground/40"
                            )} />
                            <span className={cn(
                              "text-[10px] font-semibold uppercase tracking-wide",
                              radar.status === 'active' ? "text-primary" : "text-muted-foreground"
                            )}>
                              {radar.status === 'active' ? 'Live' : 'Inactive'}
                            </span>
                            {radar.casesIntercepted > 0 && (
                              <>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-[10px] font-semibold text-primary">
                                  {radar.casesIntercepted} new
                                </span>
                              </>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {radar.proposition}
                          </h3>
                          <p className="text-[11px] text-muted-foreground">
                            {radar.createdAt.toLocaleDateString()}
                            {radar.lastActivity && ` • ${radar.lastActivity.toLocaleDateString()}`}
                          </p>
                        </div>

                        {/* Notification Toggle - Minimal */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleNotifications(radar.id);
                          }}
                          className={cn(
                            "w-7 h-7 rounded-md flex items-center justify-center transition-all flex-shrink-0",
                            radar.notificationsEnabled
                              ? "text-primary hover:bg-primary/10"
                              : "text-muted-foreground/40 hover:bg-accent"
                          )}
                        >
                          {radar.notificationsEnabled ? (
                            <Bell className="w-3.5 h-3.5" />
                          ) : (
                            <BellOff className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Jurisdictions - Compact */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {radar.jurisdictions.slice(0, 3).map((jurisdiction, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-accent text-muted-foreground font-medium"
                          >
                            {jurisdiction}
                          </span>
                        ))}
                        {radar.jurisdictions.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-accent text-muted-foreground font-medium">
                            +{radar.jurisdictions.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Actions - Streamlined */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRadar(radar.id);
                          }}
                          size="sm"
                          className="h-7 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                        >
                          View Cases
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(radar.id);
                          }}
                          size="sm"
                          variant="ghost"
                          className={cn(
                            "h-7 text-xs font-semibold",
                            radar.status === 'active'
                              ? "border-yellow-500/30 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/5"
                              : "border-primary/30 text-primary hover:bg-primary/5"
                          )}
                        >
                          {radar.status === 'active' ? 'Pause' : 'Activate'}
                        </Button>

                        <div className="flex-1" />

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(radar.id);
                          }}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(radar.id);
                          }}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active indicator bar */}
                {radar.status === 'active' && (
                  <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary animate-pulse" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Chat Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group ${showChat ? 'scale-0' : 'scale-100'
          }`}
      >
        <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      </button>

      {/* AI Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-background border-l-[0.5px] border-border shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${showChat ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* Chat Header */}
        <div className="px-6 py-4 border-b-[0.5px] border-border bg-gradient-to-r from-[#1E3A8A]/5 to-transparent flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center overflow-hidden">
                <img src={jubeeLogo} alt="Jubee" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Jubee</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Ask me about radar optimization, case monitoring, or legal research strategies
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center mb-4 overflow-hidden">
                <img src={jubeeLogo} alt="Jubee" className="w-10 h-10" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Start a conversation</h4>
              <p className="text-xs text-muted-foreground max-w-[280px]">
                Ask me about radar propositions, jurisdiction selection, or case relevance optimization
              </p>
              <div className="mt-6 space-y-2 w-full max-w-[280px]">
                <button
                  onClick={() => setChatInput("How can I improve my radar?")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  How can I improve my radar?
                </button>
                <button
                  onClick={() => setChatInput("Explain case interception criteria")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  Explain case interception criteria
                </button>
                <button
                  onClick={() => setChatInput("Suggest jurisdiction coverage")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  Suggest jurisdiction coverage
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isAI ? 'items-start' : 'items-end flex-row-reverse'}`}
                >
                  {message.isAI && (
                    <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src={jubeeLogo} alt="Jubee" className="w-5 h-5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[280px] rounded-2xl px-4 py-3 ${message.isAI
                      ? 'bg-muted border-[0.5px] border-border'
                      : 'bg-[#1E3A8A] text-white'
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-[10px] mt-1.5 ${message.isAI ? 'text-muted-foreground' : 'text-white/70'}`}>
                      {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isAITyping && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={jubeeLogo} alt="Jubee" className="w-5 h-5" />
                  </div>
                  <div className="bg-muted border-[0.5px] border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#1E3A8A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#1E3A8A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#1E3A8A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="px-6 py-4 border-t-[0.5px] border-border bg-background flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChatMessage();
                }
              }}
              placeholder="Ask about your radars..."
              className="flex-1 px-4 py-2.5 bg-muted border-[0.5px] border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={!chatInput.trim() || isAITyping}
              className="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}