import { useState, useRef, useEffect } from 'react';
import { Send, Upload, PenTool, ArrowLeft, User, FileText, X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachment?: { name: string; type: string; size: string };
  review?: {
    critical: string[];
    moderate: string[];
    suggestions: string[];
  };
}

interface DraftsmanToolChatProps {
  onBack: () => void;
  sessionId?: string;
  initialMessages?: Message[];
  sessionTitle?: string;
}

export function DraftsmanToolChat({ onBack, sessionId, initialMessages = [], sessionTitle }: DraftsmanToolChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: uploadedFile 
        ? `I've uploaded a document for review: ${uploadedFile.name}` 
        : inputValue,
      timestamp: new Date(),
      attachment: uploadedFile ? {
        name: uploadedFile.name,
        type: uploadedFile.type,
        size: `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFile(null);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateDraftsmanResponse();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        review: aiResponse.review
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2500);
  };

  const generateDraftsmanResponse = () => {
    return {
      content: '✅ **Contract Review Complete**\n\nI\'ve analyzed your service agreement and identified several areas for improvement:',
      review: {
        critical: [
          'Clause 4.2 - Payment Terms: Ambiguous payment schedule. Recommend specific dates and milestone-based payments.',
          'Clause 7 - Termination: No cure period mentioned before termination for breach.',
          'Clause 9 - Liability Cap: Missing limitation of liability clause exposing both parties to unlimited damages.'
        ],
        moderate: [
          'Clause 3 - Scope of Services: Too vague, should include detailed deliverables',
          'Clause 10 - Dispute Resolution: Add arbitration clause before litigation'
        ],
        suggestions: [
          'Add Force Majeure clause to protect against unforeseen circumstances',
          'Include confidentiality obligations for both parties',
          'Add intellectual property rights clause defining ownership'
        ]
      }
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
              <div className="w-10 h-10 bg-gradient-to-br from-[#EC4899]/20 to-[#EC4899]/10 rounded-xl flex items-center justify-center">
                <PenTool className="w-5 h-5 text-[#EC4899]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Jubee Counsel</h1>
                <p className="text-xs text-muted-foreground">AI-assisted contract review and editing</p>
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
              <div className="w-20 h-20 bg-gradient-to-br from-[#EC4899]/20 to-[#EC4899]/10 rounded-2xl flex items-center justify-center mb-6">
                <PenTool className="w-10 h-10 text-[#EC4899]" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                AI Contract Draftsman
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Upload contracts and legal documents for AI-powered review, editing, and suggestions
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
                <div className="p-5 bg-card border border-border rounded-xl text-left">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Critical Issues</h3>
                  <p className="text-sm text-muted-foreground">Identify legal risks and gaps</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-xl text-left">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Improvements</h3>
                  <p className="text-sm text-muted-foreground">Enhance clarity and enforceability</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-xl text-left">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Best Practices</h3>
                  <p className="text-sm text-muted-foreground">Align with industry standards</p>
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
                      : 'bg-gradient-to-br from-[#EC4899] to-[#DB2777]'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <PenTool className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-4 rounded-2xl max-w-full ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {message.attachment && (
                        <div className="mt-3 p-3 bg-background/50 rounded-xl flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#EC4899]" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{message.attachment.name}</p>
                            <p className="text-xs text-muted-foreground">{message.attachment.size}</p>
                          </div>
                        </div>
                      )}

                      {message.review && (
                        <div className="mt-4 space-y-3">
                          {/* Critical Issues */}
                          {message.review.critical.length > 0 && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                              <h4 className="font-semibold text-red-500 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Critical Issues
                              </h4>
                              <ul className="space-y-2">
                                {message.review.critical.map((issue, idx) => (
                                  <li key={idx} className="text-sm text-foreground flex gap-2">
                                    <span className="text-red-500 flex-shrink-0">•</span>
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Moderate Issues */}
                          {message.review.moderate.length > 0 && (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                              <h4 className="font-semibold text-yellow-600 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Moderate Issues
                              </h4>
                              <ul className="space-y-2">
                                {message.review.moderate.map((issue, idx) => (
                                  <li key={idx} className="text-sm text-foreground flex gap-2">
                                    <span className="text-yellow-600 flex-shrink-0">•</span>
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.review.suggestions.length > 0 && (
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                              <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Suggestions for Enhancement
                              </h4>
                              <ul className="space-y-2">
                                {message.review.suggestions.map((suggestion, idx) => (
                                  <li key={idx} className="text-sm text-foreground flex gap-2">
                                    <span className="text-green-600 flex-shrink-0">•</span>
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
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
                  <div className="w-10 h-10 bg-gradient-to-br from-[#EC4899] to-[#DB2777] rounded-xl flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-white" />
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
          {uploadedFile && (
            <div className="mb-3 p-3 bg-card border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#EC4899]" />
                <div>
                  <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="p-1 hover:bg-accent rounded-lg transition-all"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}
          
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Upload a contract for review or ask for editing suggestions..."
              className="w-full h-14 pl-6 pr-28 text-base bg-card border-2 border-border rounded-2xl focus:border-[#EC4899] text-foreground"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <div className="absolute right-2 top-2 flex items-center gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-xl hover:bg-[#EC4899]/10 text-[#EC4899]"
              >
                <Upload className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !uploadedFile || isTyping}
                size="icon"
                className="h-10 w-10 rounded-xl bg-[#EC4899] hover:bg-[#EC4899]/90 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}