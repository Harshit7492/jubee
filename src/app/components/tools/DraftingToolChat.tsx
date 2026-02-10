import { useState, useRef, useEffect } from 'react';
import { Send, FileText, Download, ArrowLeft, User, Copy, CheckCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  draftDocument?: { title: string; content: string };
}

interface DraftingToolChatProps {
  onBack: () => void;
  sessionId?: string;
  initialMessages?: Message[];
  sessionTitle?: string;
}

export function DraftingToolChat({ onBack, sessionId, initialMessages = [], sessionTitle }: DraftingToolChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
      const aiResponse = generateDraftingResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        draftDocument: aiResponse.draftDocument
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateDraftingResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('bail') || lowerInput.includes('anticipatory')) {
      return {
        content: 'I\'ll draft an anticipatory bail application under Section 438 CrPC. Here\'s the complete draft:',
        draftDocument: {
          title: 'Anticipatory Bail Application',
          content: `IN THE COURT OF SESSIONS JUDGE AT [DISTRICT]

CRIMINAL MISC. APPLICATION NO. ___ OF 2026
U/S 438 Cr.P.C.

[Applicant Name] ... Applicant

VERSUS

State of [State] & Anr. ... Respondents

APPLICATION FOR ANTICIPATORY BAIL

Most Respectfully Showeth:

1. That the applicant apprehends arrest in connection with FIR No. ___ dated ___ registered at P.S. ___ for offences punishable under Section 420 IPC.

2. That the applicant is a law-abiding citizen with deep roots in the community, having permanent residence at [Address] and has no criminal antecedents whatsoever.

3. That the allegations are false, frivolous and motivated to settle personal scores.

GROUNDS FOR GRANTING ANTICIPATORY BAIL:

A. Deep roots in community
B. No flight risk
C. False implication
D. Settled law on Section 438

PRAYER

In the light of facts & circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to grant anticipatory bail to the applicant.

AND PASS ANY OTHER ORDER...

Place: [City]                                            (Advocate for Applicant)
Date: [Date]`
        }
      };
    } else if (lowerInput.includes('notice') || lowerInput.includes('legal notice')) {
      return {
        content: 'I\'ve drafted a comprehensive legal notice. Review and customize as needed:',
        draftDocument: {
          title: 'Legal Notice',
          content: `LEGAL NOTICE UNDER SECTION 80 CPC

To,
[Recipient Name]
[Address]

Dear Sir/Madam,

SUBJECT: LEGAL NOTICE

I, [Your Name], through my advocate, do hereby serve upon you this legal notice for the following reasons:

1. FACTS OF THE CASE:
   [Brief description of the dispute]

2. LEGAL GROUNDS:
   [Relevant sections and laws]

3. DEMAND:
   You are hereby called upon to [specific demand] within 15 days from the receipt of this notice.

4. CONSEQUENCES:
   Failing which, my client shall be constrained to initiate appropriate legal proceedings against you.

Take Notice thereof.

Yours faithfully,

[Advocate Name]
Advocate for Notice Sender
Date: [Date]`
        }
      };
    }
    
    return {
      content: 'I can help you draft various legal documents. Please specify:\n\n• Bail Applications\n• Legal Notices\n• Written Submissions\n• Pleadings\n• Affidavits\n• Petitions\n\nWhat would you like to draft?',
      draftDocument: undefined
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
              <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">AI Drafting</h1>
                <p className="text-xs text-muted-foreground">Draft pleadings, notices, and submissions</p>
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
        <div className="max-w-4xl mx-auto w-full px-6 py-8">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/10 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-[#F59E0B]" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                AI Legal Drafting
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Generate professional legal documents with AI assistance
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl w-full">
                {[
                  'Bail Applications',
                  'Legal Notices',
                  'Written Submissions',
                  'Affidavits',
                  'Petitions',
                  'Counter Affidavits'
                ].map((doc) => (
                  <button
                    key={doc}
                    className="p-4 bg-card border border-border hover:border-[#F59E0B] hover:bg-[#F59E0B]/5 rounded-xl transition-all text-sm font-medium text-foreground"
                  >
                    {doc}
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
                      : 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-4 rounded-2xl max-w-full ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {message.draftDocument && (
                        <div className="mt-4 p-4 bg-background border border-border rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#F59E0B]" />
                              {message.draftDocument.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopy(message.draftDocument!.content, message.id)}
                                className="p-2 hover:bg-accent rounded-lg transition-all"
                              >
                                {copiedId === message.id ? (
                                  <CheckCheck className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>
                              <button className="p-2 hover:bg-accent rounded-lg transition-all">
                                <Download className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg max-h-80 overflow-y-auto">
                            <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">
                              {message.draftDocument.content}
                            </pre>
                          </div>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
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
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe the legal document you need to draft..."
              className="w-full h-14 pl-6 pr-14 text-base bg-card border-2 border-border rounded-2xl focus:border-[#F59E0B] text-foreground"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
