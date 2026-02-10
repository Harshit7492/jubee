import { useState } from 'react';
import { Search, Upload, FileText, Download, Loader2, CheckCircle2, ArrowLeft, Filter, ExternalLink } from 'lucide-react';
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
          <Button variant="outline" size="sm">
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
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedCourts.includes('all')
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
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCourts.includes(court) && !selectedCourts.includes('all')
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
                      variant="outline"
                      className="border-border hover:bg-accent font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Judgment
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
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
    </div>
  );
}