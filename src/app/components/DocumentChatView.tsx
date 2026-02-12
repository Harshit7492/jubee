import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, FileText, Eye, Download, Send, User, Bot } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import jubeeLogo from '@/assets/jubee-logo.png';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  size: string;
  folder: string;
}

interface CaseData {
  caseNumber: string;
  title: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface DocumentChatViewProps {
  document: Document;
  caseData: CaseData;
  onBack: () => void;
}

export function DocumentChatView({ document, caseData, onBack }: DocumentChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `I've loaded **${document.name}** from case ${caseData.caseNumber}. I've analyzed the document and I'm ready to answer your questions.\n\n**Document Summary:**\n- File Type: ${document.type.toUpperCase()}\n- Size: ${document.size}\n- Uploaded: ${document.uploadedDate}\n\nYou can ask me questions about the contents, request summaries, or ask me to explain specific sections.`,
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
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
      const aiResponse = generateResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateResponse = (input: string) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('summary') || lowerInput.includes('summarize')) {
      return `**Document Summary:**\n\nThis ${document.name} contains:\n\n1. **Background:** The petition seeks interim relief under Section 9 of the Arbitration and Conciliation Act, 1996.\n\n2. **Key Arguments:**\n   - Petitioner claims breach of contract by the Respondent\n   - Non-payment of dues amounting to ₹2.5 Crores\n   - Arbitration clause exists in the agreement dated 15/03/2024\n\n3. **Relief Sought:**\n   - Appointment of arbitrator\n   - Interim injunction restraining respondent from alienating assets\n   - Award of costs\n\n4. **Supporting Documents:** 12 annexures including contract agreement, email correspondence, and payment records.\n\nWould you like me to elaborate on any specific section?`;
    } else if (lowerInput.includes('parties') || lowerInput.includes('who')) {
      return `**Parties to the Case:**\n\n**Petitioner/Applicant:**\n- Easy Handling LLC\n- Registered Office: Dubai, UAE\n- Represented by: Adv. Ramesh Sharma\n\n**Respondent:**\n- Pradhaan Air Express Pvt. Ltd.\n- Registered Office: New Delhi, India\n- Represented by: Adv. Suresh Kumar & Associates\n\n**Nature of Relationship:** Commercial contract for logistics services signed on 15/03/2024.`;
    } else if (lowerInput.includes('relief') || lowerInput.includes('prayer')) {
      return `**Relief/Prayer Sought:**\n\n1. **Primary Relief:**\n   - Appoint a sole arbitrator to adjudicate the disputes\n   - Direct the Respondent to maintain status quo regarding assets\n\n2. **Interim Relief:**\n   - Restrain the Respondent from creating third-party rights over assets worth ₹5 Crores\n   - Direct the Respondent to deposit ₹1 Crore in an escrow account\n\n3. **Ancillary Relief:**\n   - Award costs of litigation\n   - Grant any other relief deemed fit by this Hon'ble Court\n\nThe Court has granted partial interim relief as per Order dated 10/01/2026.`;
    }

    return `Based on the ${document.name}, I can provide information about:\n\n• The factual background and timeline\n• Legal grounds and cited precedents\n• Arguments made by both parties\n• Relief sought and orders passed\n• Key dates and events\n\nWhat specific aspect would you like to know more about?`;
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-base font-semibold">Back</span>
            </button>
            <div className="h-6 w-px bg-border" />
            <h2 className="text-lg font-bold text-foreground">{document.name}</h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">{document.name}</h1>
                <p className="text-xs text-muted-foreground">
                  Case: {caseData.caseNumber} • {document.size} • {document.uploadedDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-lg gap-2">
                <Eye className="w-4 h-4" />
                View PDF
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-6 py-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gradient-to-br from-primary to-primary/80'
                  }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                  )}
                </div>
                <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-4 rounded-2xl max-w-full ${message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-3">Quick Questions:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Summarize this document',
                  'Who are the parties?',
                  'What relief is sought?',
                  'Key dates and timeline'
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => setInputValue(question)}
                    className="px-3 py-2 bg-card border border-border hover:border-primary hover:bg-card/80 rounded-lg text-sm text-foreground transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask questions about this document..."
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