import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Search, FileText, Languages, Type, PenTool, Scale, MessageSquare, Upload, Download, Plus, Loader2, User, Bot } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { ResearchTool } from '@/app/components/research-tools/ResearchTool';
import { DraftingTool } from '@/app/components/research-tools/DraftingTool';
import { TranslationTool } from '@/app/components/research-tools/TranslationTool';
import { TypingTool } from '@/app/components/research-tools/TypingTool';
import { DraftsmanTool } from '@/app/components/research-tools/DraftsmanTool';
import { SITool } from '@/app/components/research-tools/SITool';
import { CrossExaminerTool } from '@/app/components/research-tools/CrossExaminerTool';
import jubeeLogo from '@/assets/jubee-logo.png';

interface ResearchBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ToolType = 'chat' | 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const tools = [
  {
    id: 'research' as ToolType,
    name: 'Legal Research',
    icon: Search,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    id: 'drafting' as ToolType,
    name: 'Author',
    icon: FileText,
    color: 'text-[#F59E0B]',
    bgColor: 'bg-[#F59E0B]/10'
  },
  {
    id: 'translation' as ToolType,
    name: 'Jubee Bhasha',
    icon: Languages,
    color: 'text-[#8B5CF6]',
    bgColor: 'bg-[#8B5CF6]/10'
  },
  {
    id: 'typing' as ToolType,
    name: 'Steno',
    icon: Type,
    color: 'text-[#10B981]',
    bgColor: 'bg-[#10B981]/10'
  },
  {
    id: 'draftsman' as ToolType,
    name: 'Jubee Counsel',
    icon: PenTool,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  },
  {
    id: 'si' as ToolType,
    name: 'SI Analysis',
    icon: Scale,
    color: 'text-[#F97316]',
    bgColor: 'bg-[#F97316]/10'
  },
  {
    id: 'cross-examiner' as ToolType,
    name: 'Jubee Probe',
    icon: MessageSquare,
    color: 'text-[#06B6D4]',
    bgColor: 'bg-[#06B6D4]/10'
  }
];

export function ResearchBoardModal({ isOpen, onClose }: ResearchBoardModalProps) {
  const [activeTool, setActiveTool] = useState<ToolType>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [draftsmanInitialContent, setDraftsmanInitialContent] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset draftsman initial content when switching away from draftsman
  useEffect(() => {
    if (activeTool !== 'draftsman') {
      setDraftsmanInitialContent(undefined);
    }
  }, [activeTool]);

  const handleSendMessage = async () => {
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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you need help with: "${inputValue}". I can assist you with various legal tasks. Would you like me to help you with research, drafting, translation, or any other specialized tool? Please select a tool from above or describe what you need.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleToolSelect = (toolId: ToolType) => {
    setActiveTool(toolId);
    if (toolId !== 'chat') {
      // Add a message indicating tool activation
      const toolMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Switching to ${tools.find(t => t.id === toolId)?.name}. You can now use this specialized tool for your legal work.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, toolMessage]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Research Board</h2>
              <p className="text-sm text-muted-foreground">AI-Powered Legal Intelligence Suite</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tools Navigation */}
        <div className="bg-secondary/50 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => handleToolSelect('chat')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTool === 'chat'
                  ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat Mode
            </button>
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    activeTool === tool.id
                      ? `${tool.bgColor} ${tool.color} shadow-lg`
                      : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tool.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTool === 'chat' ? (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-2xl">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground mb-3">What can I do for you?</h3>
                      <p className="text-muted-foreground text-lg mb-8">
                        Choose a specialized tool above or ask me anything in the chat
                      </p>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tools.slice(0, 4).map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <button
                              key={tool.id}
                              onClick={() => handleToolSelect(tool.id)}
                              className="p-5 bg-card hover:bg-accent border border-border rounded-xl text-left transition-all group"
                            >
                              <div className={`w-10 h-10 ${tool.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <Icon className={`w-5 h-5 ${tool.color}`} />
                              </div>
                              <h4 className="font-bold text-foreground mb-1">{tool.name}</h4>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-gradient-to-br from-primary/10 to-primary/5'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-5 h-5" />
                          ) : (
                            <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                          )}
                        </div>
                        <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block p-4 rounded-2xl max-w-2xl ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                          <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                        </div>
                        <div className="flex-1">
                          <div className="inline-block p-4 rounded-2xl bg-muted">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-border bg-card px-6 py-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-3">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything or describe your legal task..."
                      className="flex-1 h-12 bg-input-background border-border focus:border-primary focus:ring-primary text-foreground"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="h-12 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold shadow-lg shadow-primary/30"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    AI-generated content may have inaccuracies. Always verify legal information.
                  </p>
                </div>
              </div>
            </>
          ) : activeTool === 'research' ? (
            <ResearchTool onBack={() => setActiveTool('chat')} />
          ) : activeTool === 'drafting' ? (
            <DraftingTool 
              onBack={() => setActiveTool('chat')} 
              onToolChange={(tool, initialContent) => {
                if (tool === 'draftsman' && initialContent) {
                  setDraftsmanInitialContent(initialContent);
                }
                setActiveTool(tool);
              }}
            />
          ) : activeTool === 'translation' ? (
            <TranslationTool onBack={() => setActiveTool('chat')} />
          ) : activeTool === 'typing' ? (
            <TypingTool onBack={() => setActiveTool('chat')} />
          ) : activeTool === 'draftsman' ? (
            <DraftsmanTool onBack={() => setActiveTool('chat')} initialContent={draftsmanInitialContent} />
          ) : activeTool === 'si' ? (
            <SITool onBack={() => setActiveTool('chat')} />
          ) : activeTool === 'cross-examiner' ? (
            <CrossExaminerTool onBack={() => setActiveTool('chat')} />
          ) : null}
        </div>
      </div>
    </div>
  );
}