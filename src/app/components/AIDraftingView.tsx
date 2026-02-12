import { useState } from 'react';
import { Save, Sparkles, FileText, BookOpen, Scale, ChevronRight, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';

interface PrayerSuggestion {
  id: number;
  title: string;
  content: string;
  context: string;
}

export function AIDraftingView() {
  const [content, setContent] = useState(`IN THE HIGH COURT OF DELHI AT NEW DELHI

Subject: Application under Section 9 of the Arbitration and Conciliation Act, 1996

In the matter of:

ABC Private Limited
...Petitioner

Versus

XYZ Enterprises
...Respondent

PETITION UNDER SECTION 9 OF THE ARBITRATION AND CONCILIATION ACT, 1996

TO,
THE HON'BLE CHIEF JUSTICE AND HIS COMPANION JUSTICES OF THE HIGH COURT OF DELHI

THE HUMBLE PETITION OF THE PETITIONER ABOVE-NAMED

MOST RESPECTFULLY SHOWETH:

1. That the Petitioner is a company duly incorporated under the Companies Act, 2013 and is engaged in the business of...`);

  const prayerSuggestions: PrayerSuggestion[] = [
    {
      id: 1,
      title: 'Interim Relief - Stay Order',
      content: 'Pass an interim order of stay restraining the Respondent from proceeding with the impugned action during the pendency of the present petition',
      context: 'Common in Arbitration matters'
    },
    {
      id: 2,
      title: 'Appointment of Arbitrator',
      content: 'Appoint a sole arbitrator to adjudicate the disputes between the parties in accordance with the Arbitration and Conciliation Act, 1996',
      context: 'Section 11, Arbitration Act'
    },
    {
      id: 3,
      title: 'Interim Measures - Section 9',
      content: 'Direct the Respondent to maintain status quo with respect to the subject matter of the arbitration agreement during the pendency of arbitral proceedings',
      context: 'Pre-arbitral remedy under CPC'
    },
    {
      id: 4,
      title: 'Costs and Interest',
      content: 'Award costs of the present petition along with interest @ 9% per annum from the date of filing till realization',
      context: 'Standard prayer in Civil matters'
    }
  ];

  const templates = [
    { id: 1, title: 'Writ Petition (Article 226)', category: 'Constitutional', icon: Scale },
    { id: 2, title: 'Civil Suit', category: 'Civil Matters', icon: FileText },
    { id: 3, title: 'Arbitration Application', category: 'Arbitration', icon: Scale },
    { id: 4, title: 'Criminal Complaint', category: 'Criminal', icon: BookOpen },
  ];

  return (
    <div className="flex-1 h-screen overflow-hidden bg-background">
      <div className="h-full flex">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="border-b border-border bg-card/90 backdrop-blur-xl px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-foreground font-bold text-base">AI Drafting Hub</h1>
                <p className="text-muted-foreground text-sm font-medium">Section 9 Application - ABC Pvt. Ltd. v. XYZ Enterprises</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="border-border hover:bg-accent font-semibold">
                  <FileText className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 font-semibold">
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </div>
          </header>

          {/* Editor Content */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-5xl mx-auto">
              {/* AI Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                    Arbitration Act
                  </Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground font-semibold">
                    High Court
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent hover:text-primary text-primary font-semibold"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Enhance
                </Button>
              </div>

              {/* Document Editor */}
              <div className="bg-card rounded-xl border border-border shadow-lg p-8">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[600px] font-mono text-sm resize-none border-0 focus-visible:ring-0 bg-transparent text-foreground"
                  placeholder="Start drafting your legal document..."
                />
              </div>

              {/* Quick Stats */}
              <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground font-medium">
                <span>Words: 87</span>
                <span>Characters: 612</span>
                <span>Last saved: 2 minutes ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Suggestions */}
        <aside className="w-96 border-l border-border bg-card overflow-auto">
          <div className="p-6 space-y-6">
            {/* Templates Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-foreground">Quick Templates</h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-primary">
                  View All
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <div className="space-y-2">
                {templates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-accent hover:border-primary/20 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold text-foreground">{template.title}</div>
                        <div className="text-xs text-muted-foreground font-medium">{template.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-foreground">Standard Prayers</h3>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-xs font-semibold">
                  AI Suggested
                </Badge>
              </div>

              <div className="space-y-3">
                {prayerSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors group bg-card"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground pr-2">{suggestion.title}</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-primary"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 font-medium">
                      {suggestion.content}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground font-semibold">
                        {suggestion.context}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground h-8 text-xs font-semibold shadow-lg shadow-primary/30"
                      >
                        Insert Prayer
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-accent"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-accent"
                      >
                        <ThumbsDown className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight Card */}
            <div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/30 p-4 shadow-lg">
                <div className="flex items-start gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-1">AI Insight</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      Consider citing <span className="font-bold text-primary">Bharat Aluminum Co. v. Kaiser Aluminum (2012) 9 SCC 552</span> for Section 9 jurisdiction arguments.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10 text-xs font-semibold"
                >
                  View Citation
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}