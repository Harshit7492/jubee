import { useState } from 'react';
import { Search, Upload, FileText, Download, Loader2, CheckCircle2, ArrowLeft, Filter, ExternalLink, X, Send } from 'lucide-react';
import jubeeLogo from '@/assets/jubee-logo.png';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, Tab } from '@/app/components/ui/tabs';
import { ToolNavigation } from '@/app/components/research-tools/ToolNavigation';

interface ResearchToolProps {
  onBack: () => void;
  onToolChange?: (tool: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'psi' | 'cross-examiner') => void;
  activeTool?: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'psi' | 'cross-examiner';
}

interface SearchResult {
  id: string;
  title: string;
  citation: string;
  court: string;
  date: string;
  summary: string;
  relevance: number;
  url: string;
}

export function ResearchTool({ onBack, onToolChange, activeTool }: ResearchToolProps) {
  const [researchType, setResearchType] = useState<'issue' | 'fact' | 'citation'>('issue');
  const [query, setQuery] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCourts, setSelectedCourts] = useState<string[]>(['all']);

  // AI Chat states
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    text: string;
    isAI: boolean;
    timestamp: Date;
  }>>([]);

  const courts = ['Supreme Court of India', 'Delhi High Court'];

  const handleSearch = async () => {
    if (!query.trim() && !uploadedFile) return;

    setIsSearching(true);
    setResults([]);

    // Simulate search
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Union of India vs. Azadi Bachao Andolan',
          citation: '(2003) 263 ITR 706 (SC)',
          court: 'Supreme Court of India',
          date: '07/10/2003',
          summary: 'This landmark judgment dealt with the interpretation of Double Taxation Avoidance Agreement (DTAA) between India and Mauritius. The court held that tax residency certificates issued by Mauritian authorities are sufficient proof...',
          relevance: 95,
          url: '#'
        },
        {
          id: '2',
          title: 'Vodafone International Holdings BV vs. Union of India',
          citation: '(2012) 6 SCC 613',
          court: 'Supreme Court of India',
          date: '20/01/2012',
          summary: 'The Supreme Court ruled on the indirect transfer of shares and the retrospective application of tax laws. This case is significant for international taxation and foreign investment in India...',
          relevance: 88,
          url: '#'
        },
        {
          id: '3',
          title: 'K.P. Varghese vs. Income Tax Officer',
          citation: '(1981) 4 SCC 173',
          court: 'Supreme Court of India',
          date: '18/12/1981',
          summary: 'This judgment clarified the principles regarding the assessment of unexplained cash credits under Section 68 of the Income Tax Act. The burden of proof lies on the assessee...',
          relevance: 76,
          url: '#'
        }
      ];

      setResults(mockResults);
      setIsSearching(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: chatInput,
      isAI: false,
      timestamp: new Date()
    }]);

    setChatInput('');
    setIsAITyping(true);

    setTimeout(() => {
      setIsAITyping(false);
      const aiResponse = "I can help you with legal research queries, explain case law, or assist with finding relevant precedents. What would you like to know?";

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isAI: true,
        timestamp: new Date()
      }]);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tool Navigation Chips */}
      {onToolChange && activeTool && (
        <ToolNavigation activeTool={activeTool} onToolChange={onToolChange} />
      )}

      {/* Tool Header */}
      <div className="bg-secondary/50 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="w-9 h-9 hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-xl font-bold text-foreground">Legal Research</h3>
          </div>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Search Input */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-bold text-foreground mb-3">
              Research Query
            </label>
            <div className="flex gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={
                  researchType === 'issue'
                    ? 'e.g., Validity of retrospective tax amendments'
                    : researchType === 'fact'
                      ? 'e.g., Cases involving tax evasion in real estate transactions'
                      : 'e.g., (2012) 6 SCC 613'
                }
                className="flex-1 h-12 bg-input-background border-border focus:border-primary focus:ring-primary text-foreground"
              />
              <Button
                onClick={handleSearch}
                disabled={(!query.trim() && !uploadedFile) || isSearching}
                className="h-12 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold shadow-lg shadow-primary/30"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Upload Case Document */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-bold text-foreground mb-3">
              Upload Case Document (Optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-all cursor-pointer">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="research-file-upload"
              />
              <label htmlFor="research-file-upload" className="cursor-pointer">
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">
                      Click to upload case documents for context-aware research
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Court Filters */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by Courts
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCourts(['all'])}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCourts.includes('all')
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
              >
                All Courts
              </button>
              {courts.map((court) => (
                <button
                  key={court}
                  onClick={() => {
                    if (selectedCourts.includes('all')) {
                      setSelectedCourts([court]);
                    } else if (selectedCourts.includes(court)) {
                      setSelectedCourts(selectedCourts.filter(c => c !== court));
                    } else {
                      setSelectedCourts([...selectedCourts, court]);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCourts.includes(court) && !selectedCourts.includes('all')
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                >
                  {court}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-foreground">
                  Found {results.length} Relevant Judgments
                </h4>
                <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                  Sorted by Relevance
                </Badge>
              </div>

              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h5 className="text-lg font-bold text-foreground mb-2">{result.title}</h5>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-primary text-primary-foreground font-semibold">
                          {result.citation}
                        </Badge>
                        <Badge variant="outline" className="border-border text-muted-foreground font-semibold">
                          {result.court}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-medium">{result.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{result.relevance}%</div>
                        <div className="text-xs text-muted-foreground font-semibold">Relevance</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed mb-4">{result.summary}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="border-border hover:bg-accent font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Judgment
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="border-border hover:bg-accent font-semibold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="py-16 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <h4 className="text-lg font-bold text-foreground mb-2">Searching Legal Databases...</h4>
              <p className="text-muted-foreground">
                Scanning SC/HC websites, legal repositories, and case databases
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat - Only show when results are available */}
      {results.length > 0 && (
        <>
          {/* Jubee AI Chat - Floating Button */}
          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group ${showAIChat ? 'scale-0' : 'scale-100'
              }`}
          >
            <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
          </button>

          {/* Jubee AI Chat Panel */}
          <div className={`fixed top-0 right-0 h-full w-[400px] bg-background border-l-[0.5px] border-border shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${showAIChat ? 'translate-x-0' : 'translate-x-full'
            }`}>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b-[0.5px] border-border bg-gradient-to-r from-[#1E3A8A]/5 to-transparent flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center overflow-hidden">
                    <img src={jubeeLogo} alt="Jubee" className="w-6 h-6 object-contain" />
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
                  onClick={() => setShowAIChat(false)}
                  className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your research assistant for legal queries and case analysis
              </p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center mb-4 overflow-hidden">
                    <img src={jubeeLogo} alt="Jubee" className="w-10 h-10 object-contain" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Start a conversation</h4>
                  <p className="text-xs text-muted-foreground max-w-[280px]">
                    Ask me about case law, legal precedents, or research queries
                  </p>
                  <div className="mt-6 space-y-2 w-full max-w-[280px]">
                    <button
                      onClick={() => setChatInput("Explain the key points of this judgment")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      Explain the key points of this judgment
                    </button>
                    <button
                      onClick={() => setChatInput("Find similar cases on this topic")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      Find similar cases on this topic
                    </button>
                    <button
                      onClick={() => setChatInput("Summarize the legal principles")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      Summarize the legal principles
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
                          <img src={jubeeLogo} alt="Jubee" className="w-5 h-5 object-contain" />
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
                        <img src={jubeeLogo} alt="Jubee" className="w-5 h-5 object-contain" />
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
            <div className="px-4 py-4 border-t-[0.5px] border-border bg-background flex-shrink-0">
              <div className="relative">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask Jubee about research..."
                  className="w-full h-11 pl-4 pr-12 text-sm bg-muted/50 border-[0.5px] border-border focus:border-primary rounded-xl text-foreground"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  size="icon"
                  className="absolute right-1.5 top-1.5 h-8 w-8 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}