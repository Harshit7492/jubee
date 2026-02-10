import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, ArrowLeft, User, HelpCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import jubeeLogo from '@/assets/jubee-logo.png';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  questions?: Array<{ phase: string; items: string[] }>;
}

interface CrossExaminerToolChatProps {
  onBack: () => void;
  sessionId?: string;
  initialMessages?: Message[];
  sessionTitle?: string;
}

export function CrossExaminerToolChat({ onBack, sessionId, initialMessages = [], sessionTitle }: CrossExaminerToolChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
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
      const aiResponse = generateCrossExamResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        questions: aiResponse.questions
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateCrossExamResponse = (input: string) => {
    return {
      content: 'I\'ve prepared a strategic cross-examination framework to expose the witness\'s inconsistencies:',
      questions: [
        {
          phase: 'Phase 1: Establishing Credibility Issues',
          items: [
            'You stated in your examination-in-chief that you witnessed the incident at 9:30 PM. Is that correct?',
            'Can you tell the court what the weather conditions were at that time?',
            'Was there adequate street lighting at the location?',
            'From what distance were you observing the incident?',
            'Were you wearing spectacles or any visual aids?'
          ]
        },
        {
          phase: 'Phase 2: Exposing Timeline Inconsistencies',
          items: [
            'In your FIR statement dated [Date], you mentioned the time as 9:00 PM. Can you explain the 30-minute discrepancy?',
            'You stated you immediately called the police. What time did you make that call?',
            '[Show call records] These records show you called police at 10:15 PM. How do you explain this delay?',
            'Were you doing anything else during this time between the incident and calling police?'
          ]
        },
        {
          phase: 'Phase 3: Challenging Identification',
          items: [
            'You claim you could clearly see and identify the accused from 50 feet away. Correct?',
            'You mentioned it was 9:30 PM in December. Would you agree it was dark?',
            'If the nearest street light was non-functional, how could you see clearly?',
            'Had you ever met the accused before this incident?',
            'Is it not true that you only saw a silhouette and not actual features?'
          ]
        }
      ]
    };
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4]/20 to-[#06B6D4]/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#06B6D4]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Cross-Examiner</h1>
                <p className="text-xs text-muted-foreground">AI-assisted cross-examination preparation</p>
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
              <div className="w-20 h-20 bg-gradient-to-br from-[#06B6D4]/20 to-[#06B6D4]/10 rounded-2xl flex items-center justify-center mb-6">
                <img src={jubeeLogo} alt="Jubee" className="w-11 h-11 object-contain" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Cross-Examination Assistant
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Prepare strategic cross-examination questions to expose inconsistencies and challenge witness testimony
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-[#06B6D4] transition-all">
                  <HelpCircle className="w-8 h-8 text-[#06B6D4] mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Hostile Witnesses</h3>
                  <p className="text-sm text-muted-foreground">Prepare questions for witnesses turning hostile</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-[#06B6D4] transition-all">
                  <HelpCircle className="w-8 h-8 text-[#06B6D4] mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Inconsistencies</h3>
                  <p className="text-sm text-muted-foreground">Expose contradictions in testimony</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-[#06B6D4] transition-all">
                  <HelpCircle className="w-8 h-8 text-[#06B6D4] mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Expert Witnesses</h3>
                  <p className="text-sm text-muted-foreground">Challenge technical testimony</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-[#06B6D4] transition-all">
                  <HelpCircle className="w-8 h-8 text-[#06B6D4] mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Evidence Testing</h3>
                  <p className="text-sm text-muted-foreground">Question reliability of evidence</p>
                </div>
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
                      : 'bg-gradient-to-br from-[#06B6D4] to-[#0891B2]'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <img src={jubeeLogo} alt="Jubee" className="w-6 h-6 object-contain" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-4 rounded-2xl max-w-full ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {message.questions && message.questions.length > 0 && (
                        <div className="mt-4 space-y-4">
                          {message.questions.map((phase, index) => (
                            <div key={index} className="p-4 bg-background border border-[#06B6D4]/30 rounded-xl">
                              <h4 className="font-semibold text-[#06B6D4] mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#06B6D4]/20 flex items-center justify-center text-xs">
                                  {index + 1}
                                </span>
                                {phase.phase}
                              </h4>
                              <div className="space-y-2">
                                {phase.items.map((question, qIdx) => (
                                  <div key={qIdx} className="flex gap-3 text-sm">
                                    <span className="text-[#06B6D4] font-semibold flex-shrink-0">Q{qIdx + 1}.</span>
                                    <span className="text-foreground">{question}</span>
                                  </div>
                                ))}
                              </div>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl flex items-center justify-center">
                    <img src={jubeeLogo} alt="Jubee" className="w-6 h-6 object-contain" />
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
              placeholder="Describe the witness testimony and inconsistencies you want to challenge..."
              className="w-full h-14 pl-6 pr-14 text-base bg-card border-2 border-border rounded-2xl focus:border-[#06B6D4] text-foreground"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
