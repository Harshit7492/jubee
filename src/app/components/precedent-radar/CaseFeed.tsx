import { useState } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, BookOpen, MessageSquare, Download, SortAsc, Filter, ChevronDown, Save, FileDown, X, Send, FileText, BookmarkPlus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';
import { JudgmentWorkspace } from '@/app/components/precedent-radar/JudgmentWorkspace';
import { MySpaceSaveDialog } from '@/app/components/MySpaceSaveDialog';
import { toast } from 'sonner';
import jubeeLogo from '@/assets/jubee-logo.png';

interface CaseItem {
  id: string;
  title: string;
  citation: string;
  court: string;
  date: Date;
  bench: 'Single Judge' | 'Division Bench' | 'Full Bench' | 'Constitution Bench';
  benchStrength: number;
  relevance: number;
  summary: string;
  tags: string[];
  feedback?: 'up' | 'down';
}

interface ArticleItem {
  id: string;
  title: string;
  author: string;
  publication: string;
  date: Date;
  relevance: number;
  summary: string;
  tags: string[];
  url?: string;
  feedback?: 'up' | 'down';
}

type ContentType = 'cases' | 'articles';

interface CaseFeedProps {
  radarId: string;
  proposition: string;
  onBack: () => void;
  onRefineRadar: () => void;
  onRefineJurisdictions?: () => void;
}

export function CaseFeed({ radarId, proposition, onBack, onRefineRadar, onRefineJurisdictions }: CaseFeedProps) {
  const [contentType, setContentType] = useState<ContentType>('cases');
  const [sortBy, setSortBy] = useState<'recency' | 'bench' | 'relevance'>('recency');
  const [selectedCourt, setSelectedCourt] = useState<string>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFormat, setSaveFormat] = useState<'pdf' | 'doc'>('pdf');
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // AI Chat states
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string; text: string; isAI: boolean; timestamp: Date}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  
  const [cases, setCases] = useState<CaseItem[]>([
    {
      id: '1',
      title: 'ABC Corporation v. XYZ Bank Limited',
      citation: '2024 SCC OnLine Del 1234',
      court: 'Delhi High Court',
      date: new Date('2024-01-15'),
      bench: 'Division Bench',
      benchStrength: 2,
      relevance: 96,
      summary: 'The Court held that invocation of bank guarantee can be stayed under Section 9 of the Arbitration Act 1996 when there is a prima facie case of fraud or irretrievable injustice. The Division Bench emphasized that the threshold for granting such interim relief is high and requires cogent evidence.',
      tags: ['Section 9', 'Bank Guarantee', 'Interim Relief', 'Arbitration']
    },
    {
      id: '2',
      title: 'State Bank of India v. Rahul Enterprises',
      citation: '(2024) 1 SCC 567',
      court: 'Supreme Court of India',
      date: new Date('2024-01-20'),
      bench: 'Constitution Bench',
      benchStrength: 5,
      relevance: 98,
      summary: 'This landmark Constitution Bench judgment clarified the principles governing stay of invocation of bank guarantees. The Court laid down comprehensive guidelines on when courts can interfere with unconditional bank guarantees, balancing contractual sanctity with principles of equity.',
      tags: ['Bank Guarantee', 'Section 9', 'Constitutional Law', 'Landmark Judgment']
    },
    {
      id: '3',
      title: 'Tech Solutions Pvt. Ltd. v. Infrastructure Development Corp',
      citation: '2024 SCC OnLine Del 1567',
      court: 'Delhi High Court',
      date: new Date('2024-01-25'),
      bench: 'Single Judge',
      benchStrength: 1,
      relevance: 89,
      summary: 'Single Judge held that mere pendency of arbitration proceedings is not sufficient ground to stay invocation of bank guarantee. The applicant must demonstrate special equities or fraud to warrant such extraordinary interim relief under Section 9.',
      tags: ['Section 9', 'Bank Guarantee', 'Single Judge', 'Arbitration']
    },
    {
      id: '4',
      title: 'National Highway Authority v. Construction Co.',
      citation: '2024 SCC OnLine SC 234',
      court: 'Supreme Court of India',
      date: new Date('2024-02-01'),
      bench: 'Division Bench',
      benchStrength: 2,
      relevance: 94,
      summary: 'The Supreme Court reiterated that bank guarantees are independent of underlying contracts and beneficiaries are entitled to invoke them. Stay can only be granted in exceptional circumstances where fraud is established or invocation would cause irretrievable harm.',
      tags: ['Bank Guarantee', 'Section 9', 'Fraud', 'Exceptional Circumstances']
    },
    {
      id: '5',
      title: 'Omega Builders v. DMRC Limited',
      citation: '2024 SCC OnLine Del 1789',
      court: 'Delhi High Court',
      date: new Date('2024-02-03'),
      bench: 'Division Bench',
      benchStrength: 2,
      relevance: 91,
      summary: 'Division Bench granted interim relief staying invocation of bank guarantee after finding prima facie evidence of fraudulent invocation. The Court held that the balance of convenience favored the applicant and irreparable harm would be caused if the guarantee was invoked pending arbitration.',
      tags: ['Section 9', 'Fraud', 'Balance of Convenience', 'Bank Guarantee']
    }
  ]);

  const [articles, setArticles] = useState<ArticleItem[]>([
    {
      id: 'a1',
      title: 'Balancing Contractual Sanctity and Judicial Intervention in Bank Guarantee Disputes',
      author: 'Dr. Priya Sharma',
      publication: 'Indian Journal of Arbitration Law',
      date: new Date('2024-01-10'),
      relevance: 95,
      summary: 'This comprehensive article examines the evolving jurisprudence on bank guarantees under Section 9 of the Arbitration Act. The author analyzes recent Supreme Court and High Court decisions, discussing the delicate balance between honoring contractual obligations and preventing irretrievable injustice through judicial intervention.',
      tags: ['Bank Guarantee', 'Section 9', 'Judicial Intervention', 'Analysis'],
      url: 'https://example.com/article1'
    },
    {
      id: 'a2',
      title: 'Fraud Exception in Bank Guarantee Invocation: A Critical Analysis',
      author: 'Adv. Rajesh Kumar',
      publication: 'Supreme Court Cases Journal',
      date: new Date('2024-01-18'),
      relevance: 93,
      summary: 'An in-depth exploration of the fraud exception to the independence principle in bank guarantees. This article provides practical insights on establishing prima facie fraud and analyzes landmark judgments that have shaped the current legal framework for interim relief under arbitration proceedings.',
      tags: ['Fraud', 'Bank Guarantee', 'Arbitration', 'Legal Analysis'],
      url: 'https://example.com/article2'
    },
    {
      id: 'a3',
      title: 'Section 9 Remedies and Bank Guarantees: Recent Trends',
      author: 'Prof. Anil Mehta',
      publication: 'Delhi Law Review',
      date: new Date('2024-01-22'),
      relevance: 88,
      summary: 'This article tracks recent trends in Section 9 applications seeking stay on invocation of bank guarantees. The author examines the threshold for granting such relief and discusses how courts are increasingly scrutinizing applications to prevent misuse of the arbitration remedy.',
      tags: ['Section 9', 'Bank Guarantee', 'Trends', 'Case Law'],
      url: 'https://example.com/article3'
    },
    {
      id: 'a4',
      title: 'Irretrievable Injustice Standard in Bank Guarantee Cases',
      author: 'Adv. Meera Desai',
      publication: 'Arbitration Quarterly India',
      date: new Date('2024-01-28'),
      relevance: 90,
      summary: 'A focused examination of the irretrievable injustice standard applied by Indian courts when considering interim relief against bank guarantee invocation. The article provides detailed analysis of what constitutes irretrievable injustice and how practitioners can effectively argue this ground.',
      tags: ['Irretrievable Injustice', 'Bank Guarantee', 'Interim Relief', 'Practice Guide'],
      url: 'https://example.com/article4'
    }
  ]);

  const handleArticleFeedback = (articleId: string, feedback: 'up' | 'down') => {
    setArticles(articles.map(a => 
      a.id === articleId ? { ...a, feedback: a.feedback === feedback ? undefined : feedback } : a
    ));
  };

  const handleFeedback = (caseId: string, feedback: 'up' | 'down') => {
    setCases(cases.map(c => 
      c.id === caseId ? { ...c, feedback: c.feedback === feedback ? undefined : feedback } : c
    ));
  };

  // Get unique courts list
  const courts = ['all', ...Array.from(new Set(cases.map(c => c.court)))];

  const handleSaveClick = (format: 'doc' | 'pdf') => {
    setShowSaveDropdown(false);
    setSaveFormat(format);
    setShowSaveDialog(true);
  };

  const handleSaveToMySpace = (folderPath: string, fileName: string, format: 'pdf' | 'doc') => {
    toast.success(`Saved to My Space`, {
      description: `${fileName} saved in ${folderPath} as ${format.toUpperCase()}`
    });
    setShowSaveDialog(false);
  };

  const handleExport = (format: 'pdf' | 'word') => {
    setShowExportMenu(false);
    toast.success(`Exported as ${format.toUpperCase()}`, {
      description: `Case feed is being downloaded as ${format === 'word' ? 'Word' : 'PDF'} document`
    });
  };

  const filteredCases = cases.filter(c => 
    selectedCourt === 'all' || c.court === selectedCourt
  );

  const sortedCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'recency':
        return b.date.getTime() - a.date.getTime();
      case 'bench':
        return b.benchStrength - a.benchStrength;
      case 'relevance':
        return b.relevance - a.relevance;
      default:
        return 0;
    }
  });

  const groupedByCourt = courts.slice(1).map(court => ({
    court,
    cases: sortedCases.filter(c => c.court === court)
  })).filter(group => group.cases.length > 0);

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
        "This case shows high relevance to your radar proposition. Would you like me to explain which specific legal principles align with your monitoring criteria?",
        "I notice the intercepted cases are focusing on specific aspects of your proposition. Should I help you analyze the pattern?",
        "Based on these cases, I can suggest refinements to improve the accuracy of future interceptions. Would that be helpful?",
        "The relevance scores indicate strong matches. I can help you identify key citations or arguments for your brief preparation."
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
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center gap-4 mb-4">
            {/* Back Button with Page Title */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="text-base">←</span>
              <span className="text-sm font-semibold">Back</span>
            </button>
            <div className="w-px h-5 bg-border" />
            
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground mb-1">Intercepted Content</h1>
              <p className="text-sm text-muted-foreground line-clamp-1">{proposition}</p>
            </div>
          </div>

          {/* Tabs for Cases and Articles */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
              <button
                onClick={() => setContentType('cases')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  contentType === 'cases'
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Cases ({cases.length})
              </button>
              <button
                onClick={() => setContentType('articles')}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  contentType === 'articles'
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Articles ({articles.length})
              </button>
            </div>
          </div>

          {/* Controls - Only show for Cases */}
          {contentType === 'cases' && (
            <div className="flex items-center gap-3">
              {/* Court Filter */}
              <div className="relative">
                <select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="pl-10 pr-10 py-2.5 bg-background border-2 border-border rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer hover:bg-accent transition-colors"
                >
                  <option value="all">All Courts ({filteredCases.length})</option>
                  {courts.slice(1).map(court => {
                    const count = cases.filter(c => c.court === court).length;
                    return <option key={court} value={court}>{court} ({count})</option>;
                  })}
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="pl-10 pr-10 py-2.5 bg-background border-2 border-border rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer hover:bg-accent transition-colors"
                >
                  <option value="recency">Sort by: Newest First</option>
                  <option value="bench">Sort by: Bench Strength</option>
                  <option value="relevance">Sort by: Relevance</option>
                </select>
                <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              <div className="flex-1" />

              {/* Save Button with Dropdown */}
              <div className="relative">
                <Button
                  onClick={() => setShowSaveDropdown(!showSaveDropdown)}
                  variant="outline"
                  className="border-2 border-border hover:bg-accent font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                {showSaveDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-card border-2 border-border rounded-xl shadow-xl z-50 overflow-hidden">
                    <button
                      onClick={() => handleSaveClick('doc')}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      Save as DOC
                    </button>
                    <div className="h-px bg-border" />
                    <button
                      onClick={() => handleSaveClick('pdf')}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      Save as PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Export Button with Dropdown */}
              <div className="relative">
                <Button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  variant="outline"
                  className="border-2 border-border hover:bg-accent font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                {showExportMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-card border-2 border-border rounded-xl shadow-xl z-50 overflow-hidden">
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export as PDF
                    </button>
                    <div className="h-px bg-border" />
                    <button
                      onClick={() => handleExport('word')}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export as Word
                    </button>
                  </div>
                )}
              </div>

              {/* Refine Radar */}
              <Button
                onClick={onRefineRadar}
                variant="outline"
                className="border-2 border-yellow-500/50 text-yellow-600 dark:text-yellow-500 hover:bg-yellow-500/10 font-semibold"
              >
                Unsatisfied? Refine Radar
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Case Feed */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-6xl space-y-8">
          {contentType === 'cases' ? (
            <>
              {groupedByCourt.map(({ court, cases: courtCases }) => (
                <div key={court} className="space-y-4">
                  {/* Court Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-border" />
                    <h2 className="text-sm font-bold text-primary uppercase tracking-wide px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                      {court} ({courtCases.length})
                    </h2>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  {/* Cases */}
                  {courtCases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="bg-card border-2 border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge
                                variant="outline"
                                className="border-primary/30 text-primary bg-primary/5 text-xs font-bold"
                              >
                                {caseItem.bench}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-border text-muted-foreground text-xs font-semibold"
                              >
                                {caseItem.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-1 leading-snug">
                              {caseItem.title}
                            </h3>
                            <p className="text-sm text-muted-foreground font-mono">{caseItem.citation}</p>
                          </div>

                          {/* Relevance Score */}
                          <div className="ml-4 flex flex-col items-end gap-1">
                            <div className="text-xs text-muted-foreground font-semibold">Relevance</div>
                            <div className="text-2xl font-bold text-primary">{caseItem.relevance}%</div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-accent/30 border border-border rounded-lg p-4 mb-4">
                          <p className="text-sm text-foreground leading-relaxed">
                            {caseItem.summary}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {caseItem.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs border-border text-muted-foreground bg-accent/50 hover:border-primary/30 hover:text-primary transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Primary Action */}
                        <div className="mb-3">
                          <Button
                            onClick={() => setSelectedCaseId(caseItem.id)}
                            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold h-10"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Read Full Judgement
                          </Button>
                        </div>

                        {/* Feedback Ribbon */}
                        <div className="relative bg-gradient-to-r from-[#1E3A8A]/5 via-accent/30 to-[#1E3A8A]/5 border-[0.5px] border-[#1E3A8A]/20 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Feedback
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleFeedback(caseItem.id, 'up')}
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-all",
                                    caseItem.feedback === 'up'
                                      ? "bg-[#1E3A8A] text-white shadow-md"
                                      : "bg-accent/50 text-muted-foreground hover:bg-[#1E3A8A]/10 hover:text-[#1E3A8A]"
                                  )}
                                  title="Relevant precedent"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleFeedback(caseItem.id, 'down')}
                                  className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-all relative",
                                    caseItem.feedback === 'down'
                                      ? "bg-red-500 text-white shadow-md"
                                      : "bg-accent/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                                  )}
                                  title="Not relevant"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="text-[10px] text-muted-foreground/70 italic">
                              Research only • Cannot integrate into Case Workflow
                            </div>
                          </div>

                          {/* Refinement Prompt Overlay */}
                          {caseItem.feedback === 'down' && (
                            <div className="absolute inset-0 bg-[#1E3A8A]/95 backdrop-blur-xl rounded-lg flex items-center justify-center z-10 animate-in fade-in duration-200">
                              <div className="text-center px-6 py-5">
                                <p className="text-sm font-bold text-white mb-1">
                                  Is this case irrelevant?
                                </p>
                                <p className="text-xs text-white/80 mb-4">
                                  Help Jubee recalibrate your radar.
                                </p>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    onClick={onRefineRadar}
                                    size="sm"
                                    className="bg-white text-[#1E3A8A] hover:bg-white/90 font-semibold shadow-lg h-9"
                                  >
                                    Refine Radar Content
                                  </Button>
                                  {onRefineJurisdictions && (
                                    <Button
                                      onClick={onRefineJurisdictions}
                                      size="sm"
                                      variant="outline"
                                      className="border-white/30 text-white hover:bg-white/10 font-semibold h-9"
                                    >
                                      Re-evaluate Jurisdictions
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <>
              {articles.map(article => (
                <div
                  key={article.id}
                  className="bg-card border-2 border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            variant="outline"
                            className="border-primary/30 text-primary bg-primary/5 text-xs font-bold"
                          >
                            Article
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-border text-muted-foreground text-xs font-semibold"
                          >
                            {article.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1 leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono">{article.publication}</p>
                      </div>

                      {/* Relevance Score */}
                      <div className="ml-4 flex flex-col items-end gap-1">
                        <div className="text-xs text-muted-foreground font-semibold">Relevance</div>
                        <div className="text-2xl font-bold text-primary">{article.relevance}%</div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-accent/30 border border-border rounded-lg p-4 mb-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs border-border text-muted-foreground bg-accent/50 hover:border-primary/30 hover:text-primary transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Primary Action */}
                    <div className="mb-3">
                      <Button
                        onClick={() => window.open(article.url, '_blank')}
                        className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold h-10"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Full Article
                      </Button>
                    </div>

                    {/* Feedback Ribbon */}
                    <div className="relative bg-gradient-to-r from-[#1E3A8A]/5 via-accent/30 to-[#1E3A8A]/5 border-[0.5px] border-[#1E3A8A]/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Feedback
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleArticleFeedback(article.id, 'up')}
                              className={cn(
                                "w-8 h-8 rounded-md flex items-center justify-center transition-all",
                                article.feedback === 'up'
                                  ? "bg-[#1E3A8A] text-white shadow-md"
                                  : "bg-accent/50 text-muted-foreground hover:bg-[#1E3A8A]/10 hover:text-[#1E3A8A]"
                              )}
                              title="Relevant precedent"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleArticleFeedback(article.id, 'down')}
                              className={cn(
                                "w-8 h-8 rounded-md flex items-center justify-center transition-all relative",
                                article.feedback === 'down'
                                  ? "bg-red-500 text-white shadow-md"
                                  : "bg-accent/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                              )}
                              title="Not relevant"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-[10px] text-muted-foreground/70 italic">
                          Research only • Cannot integrate into Case Workflow
                        </div>
                      </div>

                      {/* Refinement Prompt Overlay */}
                      {article.feedback === 'down' && (
                        <div className="absolute inset-0 bg-[#1E3A8A]/95 backdrop-blur-xl rounded-lg flex items-center justify-center z-10 animate-in fade-in duration-200">
                          <div className="text-center px-6 py-5">
                            <p className="text-sm font-bold text-white mb-1">
                              Is this article irrelevant?
                            </p>
                            <p className="text-xs text-white/80 mb-4">
                              Help Jubee recalibrate your radar.
                            </p>
                            <div className="flex flex-col gap-2">
                              <Button
                                onClick={onRefineRadar}
                                size="sm"
                                className="bg-white text-[#1E3A8A] hover:bg-white/90 font-semibold shadow-lg h-9"
                              >
                                Refine Radar Content
                              </Button>
                              {onRefineJurisdictions && (
                                <Button
                                  onClick={onRefineJurisdictions}
                                  size="sm"
                                  variant="outline"
                                  className="border-white/30 text-white hover:bg-white/10 font-semibold h-9"
                                >
                                  Re-evaluate Jurisdictions
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                </div>
              ))}
            </>
          )}

          {sortedCases.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-primary/50" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No Cases Intercepted Yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Your radar is active and monitoring. New cases will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Judgment Workspace */}
      {selectedCaseId && (() => {
        const selectedCase = cases.find(c => c.id === selectedCaseId);
        if (!selectedCase) return null;
        
        return (
          <div className="fixed inset-0 z-50 bg-background">
            <JudgmentWorkspace
              caseId={selectedCase.id}
              caseTitle={selectedCase.title}
              citation={selectedCase.citation}
              onBack={() => setSelectedCaseId(null)}
            />
          </div>
        );
      })()}

      {/* My Space Save Dialog */}
      <MySpaceSaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveToMySpace}
        defaultFileName={`Radar Case Feed - ${proposition.slice(0, 30)}`}
        format={saveFormat}
      />

      {/* Floating Chat Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group ${
          showChat ? 'scale-0' : 'scale-100'
        }`}
      >
        <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      </button>

      {/* AI Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-background border-l-[0.5px] border-border shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        showChat ? 'translate-x-0' : 'translate-x-full'
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
            Ask me about case relevance, legal principles, or research strategies
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
                Ask me about case analysis, relevance scoring, or how to use intercepted cases
              </p>
              <div className="mt-6 space-y-2 w-full max-w-[280px]">
                <button
                  onClick={() => setChatInput("Explain the relevance scores")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  Explain the relevance scores
                </button>
                <button
                  onClick={() => setChatInput("Analyze case patterns")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  Analyze case patterns
                </button>
                <button
                  onClick={() => setChatInput("Suggest arguments from these cases")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  Suggest arguments from these cases
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
                    className={`max-w-[280px] rounded-2xl px-4 py-3 ${
                      message.isAI
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
              placeholder="Ask about intercepted cases..."
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