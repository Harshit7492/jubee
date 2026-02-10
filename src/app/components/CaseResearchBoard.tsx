import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, FileText, Languages, PenTool, MessageSquare, Scale, BookOpen, Send, User, Bot, Loader2, FileCheck, Gavel, FolderOpen, Bell, Type, FileSearch, Radio } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ResearchTool } from '@/app/components/research-tools/ResearchTool';
import { DraftingTool } from '@/app/components/research-tools/DraftingTool';
import { TranslationTool } from '@/app/components/research-tools/TranslationTool';
import { DraftsmanTool } from '@/app/components/research-tools/DraftsmanTool';
import { CrossExaminerTool } from '@/app/components/research-tools/CrossExaminerTool';
import { TypingTool } from '@/app/components/research-tools/TypingTool';
import { SITool } from '@/app/components/research-tools/SITool';
import { PreCheckWorkflow } from '@/app/components/research-tools/PreCheckWorkflow';
import { PrecedentRadarWorkflow } from '@/app/components/precedent-radar/PrecedentRadarWorkflow';
import { WorkspaceQuote, WORKSPACE_QUOTES } from '@/app/components/WorkspaceQuote';
import { ChevronRight } from 'lucide-react';

type ToolType = 'chat' | 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner' | 'precheck' | 'precedent';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface CaseData {
  caseNumber: string;
  title: string;
}

interface CaseResearchBoardProps {
  caseData: CaseData;
  onBack: () => void;
  onNavigate?: (view: string) => void;
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

export function CaseResearchBoard({ caseData, onNavigate }: CaseResearchBoardProps) {
  const [activeTool, setActiveTool] = useState<ToolType>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [draftsmanInitialContent, setDraftsmanInitialContent] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Removed automatic scroll to bottom - let users scroll naturally

  // Reset draftsman initial content when switching away from draftsman
  useEffect(() => {
    if (activeTool !== 'draftsman') {
      setDraftsmanInitialContent(undefined);
    }
  }, [activeTool]);

  const handleToolSelection = (toolId: ToolType) => {
    // All tools work inline - no navigation
    if (toolId !== 'chat') {
      setMessages([]);
      setActiveTool(toolId);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

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
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('research') || lowerQuery.includes('case') || lowerQuery.includes('precedent')) {
      return `I can help you research legal cases for ${caseData.caseNumber}. Click on "Legal Research" tool to search through Supreme Court and High Court judgments specific to this case.`;
    } else if (lowerQuery.includes('draft') || lowerQuery.includes('pleading') || lowerQuery.includes('notice')) {
      return `I can assist with drafting legal documents for ${caseData.caseNumber}. Use the "AI Drafting" tool to create case-specific pleadings, notices, or written submissions.`;
    } else if (lowerQuery.includes('translate')) {
      return `I can help translate documents for ${caseData.caseNumber}. The "Translation" tool provides context-aware translations for legal terminology.`;
    } else if (lowerQuery.includes('cross') || lowerQuery.includes('question')) {
      return `I can help prepare cross-examination questions for ${caseData.caseNumber}. Use the "Cross-Examiner" tool to develop strategic questions.`;
    } else {
      return `I understand you're asking about: "${query}" for case ${caseData.caseNumber}.\n\nI have 7 specialized tools available:\n\n1. Legal Research - Find relevant cases and precedents\n2. AI Drafting - Create case-specific legal documents\n3. Translation - Translate legal content\n4. Draftsman - Edit with AI suggestions\n5. Cross-Examiner - Prepare cross-examination\n6. Case Analyzer - Analyze this case's strengths\n7. Precedent Finder - Find similar cases\n\nWhich tool would you like to use?`;
    }
  };

  const renderContent = () => {
    switch (activeTool) {
      case 'research':
        return <ResearchTool onBack={() => setActiveTool('chat')} onToolChange={setActiveTool} activeTool={activeTool} />;
      case 'drafting':
        return <DraftingTool 
          onBack={() => setActiveTool('chat')} 
          onToolChange={(tool, initialContent) => {
            if (tool === 'draftsman' && initialContent) {
              setDraftsmanInitialContent(initialContent);
            }
            setActiveTool(tool);
          }} 
          activeTool={activeTool} 
        />;
      case 'translation':
        return <TranslationTool onBack={() => setActiveTool('chat')} onToolChange={setActiveTool} activeTool={activeTool} />;
      case 'draftsman':
        return <DraftsmanTool onBack={() => setActiveTool('chat')} onToolChange={setActiveTool} activeTool={activeTool} initialContent={draftsmanInitialContent} />;
      case 'cross-examiner':
        return <CrossExaminerTool onBack={() => setActiveTool('chat')} onToolChange={setActiveTool} activeTool={activeTool} />;
      case 'si':
        return <SITool onBack={() => setActiveTool('chat')} onToolChange={setActiveTool} activeTool={activeTool} />;
      case 'precedent':
        return <PrecedentRadarWorkflow onBack={() => setActiveTool('chat')} onToolChange={setActiveTool} activeTool={activeTool} />;
      case 'typing':
        return <TypingTool onBack={() => setActiveTool('chat')} onToolChange={setActiveTool} activeTool={activeTool} />;
      case 'precheck':
        return <PreCheckWorkflow onBack={() => setActiveTool('chat')} onToolChange={setActiveTool} activeTool={activeTool} />;
      default:
        return (
          <div className="flex-1 flex flex-col h-full bg-background">
            {/* Show welcome screen if no messages yet */}
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col px-8 py-8">
                <div className="w-full max-w-4xl mx-auto space-y-8">
                  {/* Workspace Quote */}
                  <WorkspaceQuote quotes={WORKSPACE_QUOTES.case} />

                  {/* What can I help you with? Header */}
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-foreground">
                      What can I help you with?
                    </h1>
                  </div>

                  {/* Large Centered Input */}
                  <div className="relative">
                    <div className="relative flex items-center">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Ask about legal research, drafting, analysis..."
                        className="w-full h-14 pl-5 pr-14 bg-card border-2 border-border focus:border-primary rounded-2xl text-base shadow-lg hover:shadow-xl transition-all duration-300"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-xl"
                        disabled={!inputValue.trim()}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Tool Cards Grid - Same as ResearchBoardView */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tools.map((tool) => (
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
                </div>
              </div>
            ) : (
              <>
                {/* Header with title */}
                <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
                  <div className="max-w-5xl mx-auto px-8 py-4">
                    <h2 className="text-xl font-bold text-foreground">Case Research Assistant</h2>
                    <p className="text-sm text-muted-foreground">{caseData.caseNumber} • Powered by AI</p>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
                    {messages.map((message, index) => (
                      <div key={message.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        {/* Message Bubble */}
                        <div className={`flex gap-5 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {/* AI Avatar */}
                          {message.type === 'ai' && (
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                                <Sparkles className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Message Content */}
                          <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block px-5 py-4 rounded-2xl shadow-sm ${
                              message.type === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border border-border'
                            }`}>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 px-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          {/* User Avatar */}
                          {message.type === 'user' && (
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                              <User className="w-6 h-6 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator - Enhanced */}
                    {isTyping && (
                      <div className="flex gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="w-6 h-6 text-white animate-pulse" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="inline-block px-5 py-4 rounded-2xl bg-card border border-border shadow-sm">
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Fixed Chat Input - Enhanced */}
                <div className="fixed bottom-0 left-64 right-0 border-t border-border bg-background/95 backdrop-blur-sm z-10">
                  <div className="max-w-5xl mx-auto px-8 py-6">
                    <div className="flex items-end gap-4">
                      <div className="flex-1 relative">
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
                          className="w-full h-14 pl-5 pr-14 bg-card border-2 border-border focus:border-primary rounded-2xl text-base shadow-sm hover:shadow-md transition-all duration-300"
                        />
                        <Button
                          onClick={handleSendMessage}
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-xl"
                          disabled={!inputValue.trim()}
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return renderContent();
}