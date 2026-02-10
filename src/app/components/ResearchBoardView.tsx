import { useState, useRef, useEffect } from 'react';
import { Sparkles, User, Send, ChevronRight, Search, Scale, MessageSquare, Radio, PenTool, FileText, Languages, Type, FileSearch } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ResearchTool } from '@/app/components/research-tools/ResearchTool';
import { DraftingTool } from '@/app/components/research-tools/DraftingTool';
import { TranslationView } from '@/app/components/TranslationView';
import { TypingTool } from '@/app/components/research-tools/TypingTool';
import { DraftsmanTool } from '@/app/components/research-tools/DraftsmanTool';
import { SITool } from '@/app/components/research-tools/SITool';
import { CrossExaminerTool } from '@/app/components/research-tools/CrossExaminerTool';
import { PreCheckWorkflow } from '@/app/components/research-tools/PreCheckWorkflow';
import { PrecedentRadarView } from '@/app/components/PrecedentRadarView';
import { JudgeSelectionModal } from '@/app/components/JudgeSelectionModal';
import { CourtSelectionModal } from '@/app/components/CourtSelectionModal';
import { WorkspaceQuote, WORKSPACE_QUOTES } from '@/app/components/WorkspaceQuote';
import jubeeLogo from '@/assets/jubee-logo.png';
import calendarIcon from '@/assets/calendar-icon.png';

type ToolType = 'chat' | 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner' | 'precheck' | 'precedent';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  toolOptions?: typeof tools;
  judgeChips?: Array<{ id: string; name: string; gender: 'Mr.' | 'Ms.' }>;
  courtChips?: Array<{ id: string; name: string }>;
}

interface SessionData {
  id: string;
  toolName: string;
  title: string;
}

interface ResearchBoardViewProps {
  sessionData: SessionData | null;
  onClearSession: () => void;
  onNavigate?: (view: string) => void;
  resetToDefault?: boolean;
}

const tools = [
  {
    id: 'research' as ToolType,
    name: 'Legal Research',
    icon: Search,
    description: 'Precedents, analysed and prioritised.',
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    id: 'si' as ToolType,
    name: 'SI Analysis',
    icon: Scale,
    description: 'Precedents analysed. Arguments evaluated.',
    color: 'text-[#F97316]',
    bgColor: 'bg-[#F97316]/10'
  },
  {
    id: 'cross-examiner' as ToolType,
    name: 'Jubee Probe',
    icon: MessageSquare,
    description: 'Statements tested. Reliability assessed.',
    color: 'text-[#8B5CF6]',
    bgColor: 'bg-[#8B5CF6]/10'
  },
  {
    id: 'precedent' as ToolType,
    name: 'Jubee Radar',
    icon: Radio,
    description: 'Professionally curated legal updates.',
    color: 'text-[#06B6D4]',
    bgColor: 'bg-[#06B6D4]/10'
  },
  {
    id: 'draftsman' as ToolType,
    name: 'Jubee Counsel',
    icon: PenTool,
    description: 'Drafts that withstand scrutiny.',
    color: 'text-[#EC4899]',
    bgColor: 'bg-[#EC4899]/10'
  },
  {
    id: 'drafting' as ToolType,
    name: 'Author',
    icon: FileText,
    description: 'From facts to form. Drafted for professional reliance.',
    color: 'text-[#F59E0B]',
    bgColor: 'bg-[#F59E0B]/10'
  },
  {
    id: 'translation' as ToolType,
    name: 'Jubee Bhasha',
    icon: Languages,
    description: 'Accurate legal translation across languages.',
    color: 'text-[#A855F7]',
    bgColor: 'bg-[#A855F7]/10'
  },
  {
    id: 'typing' as ToolType,
    name: 'Steno',
    icon: Type,
    description: 'Exact words. Proper record.',
    color: 'text-[#10B981]',
    bgColor: 'bg-[#10B981]/10'
  },
  {
    id: 'precheck' as ToolType,
    name: 'Scrutiny',
    icon: FileSearch,
    description: 'Prepared for Institutional scrutiny.',
    color: 'text-[#FF9900]',
    bgColor: 'bg-[#FF9900]/10'
  }
];

export function ResearchBoardView({ sessionData, onClearSession, onNavigate, resetToDefault }: ResearchBoardViewProps) {
  const [activeTool, setActiveTool] = useState<ToolType>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0 && !sessionData && (activeTool === 'chat' || activeTool === null)) {
      const welcomeMessage: Message = {
        id: '0',
        type: 'ai',
        content: "Hello! I'm your Legal Research Assistant. I have access to powerful research and drafting tools to help you with your legal work. Choose a tool below to get started, or ask me anything!",
        timestamp: new Date(),
        toolOptions: tools
      };
      setMessages([welcomeMessage]);
    }
  }, [activeTool, sessionData]);

  // Reset to default state when resetToDefault changes
  useEffect(() => {
    if (resetToDefault) {
      setActiveTool('chat');
      setMessages([]);
      setInputValue('');
      setIsTyping(false);
    }
  }, [resetToDefault]);

  const handleToolSelection = (toolId: ToolType) => {
    // All tools work inline - no navigation
    if (toolId !== 'chat') {
      setMessages([]);
      setActiveTool(toolId);
    }
  };

  const handleJudgeSelection = (selectedJudges: Array<{ id: string; name: string; gender: 'Mr.' | 'Ms.' }>) => {
    setIsJudgeModalOpen(false);
    
    if (selectedJudges.length > 0) {
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '',
        timestamp: new Date(),
        judgeChips: selectedJudges
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handleCourtSelection = (selectedCourts: Array<{ id: string; name: string }>) => {
    setIsCourtModalOpen(false);
    
    if (selectedCourts.length > 0) {
      const courtMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '',
        timestamp: new Date(),
        courtChips: selectedCourts
      };
      setMessages(prev => [...prev, courtMessage]);
      
      setTimeout(() => {
        setIsJudgeModalOpen(true);
      }, 800);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const lowerInput = inputValue.toLowerCase();
    
    if (lowerInput.includes('judge') || lowerInput.includes('justice') || lowerInput.includes('bench')) {
      setIsJudgeModalOpen(true);
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputValue,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      return;
    }

    if (lowerInput.includes('court') || lowerInput.includes('format') || lowerInput.includes('typing')) {
      setIsCourtModalOpen(true);
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputValue,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        toolOptions: aiResponse.showTools ? tools : undefined
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): { content: string; showTools: boolean } => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('research') || lowerQuery.includes('case') || lowerQuery.includes('precedent') || lowerQuery.includes('judgment')) {
      return {
        content: 'I can help you research legal cases and precedents from Supreme Court of India and Delhi High Court. Click on "Legal Research" tool above to start searching, or tell me what specific case or legal issue you\'re looking for.',
        showTools: false
      };
    } else if (lowerQuery.includes('si') || lowerQuery.includes('strength') || lowerQuery.includes('psi') || lowerQuery.includes('asi')) {
      return {
        content: 'I can analyze the strength of legal precedents and arguments using the SI Analysis tool. This provides both Precedent Strength Index (PSI) and Argument Strength Index (ASI). Click "SI Analysis" above to begin.',
        showTools: false
      };
    } else if (lowerQuery.includes('draft') || lowerQuery.includes('draftsman') || lowerQuery.includes('write')) {
      return {
        content: 'I have two powerful drafting tools:\n\n• **Jubee Counsel** - AI-assisted editing with intelligent suggestions and copilot chat\n• **AI Drafting Hub** - Create legal documents from templates\n\nWhich would you prefer to use?',
        showTools: false
      };
    } else if (lowerQuery.includes('help') || lowerQuery.includes('what can') || lowerQuery.includes('show tool')) {
      return {
        content: 'Here are all the tools I have access to. Click any tool below to get started:',
        showTools: true
      };
    } else {
      return {
        content: `I understand you're asking about: "${query}"\n\nI have 8 specialized legal tools to assist you. Would you like me to show you all available tools, or can you tell me more about what you need help with?`,
        showTools: true
      };
    }
  };

  const renderContent = () => {
    if (activeTool === 'research') {
      return <ResearchTool onBack={() => setActiveTool(null)} />;
    }

    if (activeTool === 'drafting') {
      return <DraftingTool onBack={() => setActiveTool(null)} />;
    }

    if (activeTool === 'translation') {
      return <TranslationView onBack={() => setActiveTool(null)} />;
    }

    if (activeTool === 'typing') {
      return <TypingTool onBack={() => setActiveTool(null)} />;
    }

    if (activeTool === 'draftsman') {
      return <DraftsmanTool onBack={() => setActiveTool(null)} />;
    }

    if (activeTool === 'si') {
      return <SITool onBack={() => setActiveTool(null)} />;
    }

    if (activeTool === 'cross-examiner') {
      return <CrossExaminerTool onBack={() => setActiveTool(null)} />;
    }

    if (activeTool === 'precheck') {
      return <PreCheckWorkflow onBack={() => setActiveTool(null)} />;
    }

    if (activeTool === 'precedent') {
      return <PrecedentRadarView onBack={() => setActiveTool(null)} />;
    }

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-card border-b border-border px-[24px] py-[20px] h-[90px] flex items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-foreground">Home</h3>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">
            {/* Workspace Quote */}
            <WorkspaceQuote quotes={WORKSPACE_QUOTES.home} />
            
            {messages.map((message) => (
              <div key={message.id} className="flex gap-4 items-start">
                {message.type === 'user' && (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-muted">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                )}
                
                <div className="flex-1 space-y-4">
                  {message.courtChips && message.courtChips.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {message.courtChips.map((court) => (
                        <div
                          key={court.id}
                          className="bg-primary/10 border-[0.5px] border-primary/30 text-primary px-4 py-2 rounded-xl text-sm font-medium"
                        >
                          {court.name}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.judgeChips && message.judgeChips.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {message.judgeChips.map((judge) => (
                        <div
                          key={judge.id}
                          className="bg-primary/10 border-[0.5px] border-primary/30 text-primary px-4 py-2 rounded-xl text-sm font-medium"
                        >
                          Hon'ble {judge.gender} Justice {judge.name}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.toolOptions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {message.toolOptions.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => handleToolSelection(tool.id)}
                          className="group bg-card border-[0.5px] border-border hover:border-primary rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 ${tool.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <tool.icon className={`w-5 h-5 ${tool.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                {tool.name}
                              </h3>
                              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                {tool.description}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
                  <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1">
                  <div className="bg-card border-[0.5px] border-border rounded-2xl p-6 inline-block">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0 bg-background border-t border-border">
          <div className="max-w-5xl mx-auto px-8 py-0">
            <div className="bg-card border-[0.5px] border-border rounded-xl shadow-lg my-2">
              <div className="flex items-center gap-3 p-3">
                <div className="flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask me anything or choose a tool above..."
                    className="h-12 px-4 rounded-xl border-0 bg-background focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {renderContent()}
      
      <JudgeSelectionModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        onConfirm={handleJudgeSelection}
      />

      <CourtSelectionModal
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
        onConfirm={handleCourtSelection}
      />
    </div>
  );
}