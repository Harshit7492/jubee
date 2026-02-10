import { useState, useRef, useEffect } from 'react';
import { Send, Search, BookOpen, ArrowLeft, User, ExternalLink, Scale } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  cases?: Array<{ name: string; citation: string; summary: string }>;
}

interface ResearchToolChatProps {
  onBack: () => void;
  sessionId?: string;
  initialMessages?: Message[];
  sessionTitle?: string;
}

export function ResearchToolChat({ onBack, sessionId, initialMessages = [], sessionTitle }: ResearchToolChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Skip auto-scroll on initial mount with initialMessages
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToBottom();
  }, [messages]);

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
      const aiResponse = generateResearchResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        cases: aiResponse.cases
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateResearchResponse = (input: string) => {
    return {
      content: 'I found relevant Supreme Court precedents on this topic. Here are the key cases:',
      cases: [
        {
          name: 'Rangappa v. Sri Mohan',
          citation: '(2010) 11 SCC 441',
          summary: 'Landmark judgment establishing burden of proof in Section 138 NI Act cases. Once dishonor is proved, burden shifts to the accused.'
        },
        {
          name: 'Kumar Exports v. Sharma Carpets',
          citation: '(2009) 2 SCC 513',
          summary: 'Clarified the limitation period for filing complaints under Section 138 of the Negotiable Instruments Act.'
        },
        {
          name: 'M.M.T.C. Ltd. v. Medchl Chemicals',
          citation: '(2002) 1 SCC 234',
          summary: 'Explained the statutory presumption under Section 139 regarding consideration for cheque issuance.'
        }
      ]
    };
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-5">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Legal Research</h1>
                <p className="text-xs text-muted-foreground">Search SC/HC judgments and legal databases</p>
              </div>
            </div>
          </div>
          {sessionTitle && (
            <div className="text-sm text-muted-foreground">
              Session: <span className="font-medium text-foreground">{sessionTitle}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full px-6 py-8">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Legal Research Assistant
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Search through Supreme Court and High Court databases for relevant precedents
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-primary transition-all">
                  <BookOpen className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Supreme Court</h3>
                  <p className="text-sm text-muted-foreground">Access latest SC judgments and precedents</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-primary transition-all">
                  <Scale className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">High Courts</h3>
                  <p className="text-sm text-muted-foreground">Search across all HC databases</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-primary transition-all">
                  <ExternalLink className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Citations</h3>
                  <p className="text-sm text-muted-foreground">Find cases by citation or party name</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 justify-center">
                {['Section 138 NI Act', 'Bail jurisprudence', 'Anticipatory bail', 'Evidence Act'].map((query) => (
                  <button
                    key={query}
                    onClick={() => setInputValue(query)}
                    className="px-4 py-2 bg-card border border-border hover:border-primary hover:bg-primary/5 rounded-lg text-sm font-medium text-foreground transition-all"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-br from-primary to-primary/80'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Search className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-4 rounded-2xl max-w-full ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {message.cases && message.cases.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {message.cases.map((caseItem, index) => (
                            <div key={index} className="p-4 bg-background border border-border rounded-xl hover:border-primary transition-all">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <h4 className="font-semibold text-foreground">{caseItem.name}</h4>
                                <button className="p-1 hover:bg-accent rounded transition-all">
                                  <ExternalLink className="w-4 h-4 text-primary" />
                                </button>
                              </div>
                              <p className="text-xs font-mono text-primary mb-2">{caseItem.citation}</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{caseItem.summary}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
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
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Search for cases, sections, or legal topics..."
              className="w-full h-14 pl-6 pr-14 text-base bg-card border-2 border-border rounded-2xl focus:border-primary text-foreground"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}