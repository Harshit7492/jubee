import { useState } from 'react';
import { FileSearch, ChevronRight, Sparkles, ChevronLeft, ChevronDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/app/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { cn } from '@/app/components/ui/utils';

interface RadarSetupWizardProps {
  onComplete: (data: { proposition: string; jurisdictions: string[] }) => void;
  onBack?: () => void;
}

// All Indian Courts and Tribunals
const jurisdictions = [
  // Supreme Court
  { value: 'supreme-court', label: 'Supreme Court of India', category: 'Supreme Court' },

  // High Courts (26)
  { value: 'allahabad-hc', label: 'Allahabad High Court', category: 'High Courts' },
  { value: 'andhra-pradesh-hc', label: 'Andhra Pradesh High Court', category: 'High Courts' },
  { value: 'bombay-hc', label: 'Bombay High Court', category: 'High Courts' },
  { value: 'calcutta-hc', label: 'Calcutta High Court', category: 'High Courts' },
  { value: 'chhattisgarh-hc', label: 'Chhattisgarh High Court', category: 'High Courts' },
  { value: 'delhi-hc', label: 'Delhi High Court', category: 'High Courts' },
  { value: 'gauhati-hc', label: 'Gauhati High Court', category: 'High Courts' },
  { value: 'gujarat-hc', label: 'Gujarat High Court', category: 'High Courts' },
  { value: 'himachal-pradesh-hc', label: 'Himachal Pradesh High Court', category: 'High Courts' },
  { value: 'jammu-kashmir-hc', label: 'Jammu & Kashmir High Court', category: 'High Courts' },
  { value: 'jharkhand-hc', label: 'Jharkhand High Court', category: 'High Courts' },
  { value: 'karnataka-hc', label: 'Karnataka High Court', category: 'High Courts' },
  { value: 'kerala-hc', label: 'Kerala High Court', category: 'High Courts' },
  { value: 'madhya-pradesh-hc', label: 'Madhya Pradesh High Court', category: 'High Courts' },
  { value: 'madras-hc', label: 'Madras High Court', category: 'High Courts' },
  { value: 'manipur-hc', label: 'Manipur High Court', category: 'High Courts' },
  { value: 'meghalaya-hc', label: 'Meghalaya High Court', category: 'High Courts' },
  { value: 'orissa-hc', label: 'Orissa High Court', category: 'High Courts' },
  { value: 'patna-hc', label: 'Patna High Court', category: 'High Courts' },
  { value: 'punjab-haryana-hc', label: 'Punjab & Haryana High Court', category: 'High Courts' },
  { value: 'rajasthan-hc', label: 'Rajasthan High Court', category: 'High Courts' },
  { value: 'sikkim-hc', label: 'Sikkim High Court', category: 'High Courts' },
  { value: 'telangana-hc', label: 'Telangana High Court', category: 'High Courts' },
  { value: 'tripura-hc', label: 'Tripura High Court', category: 'High Courts' },
  { value: 'uttarakhand-hc', label: 'Uttarakhand High Court', category: 'High Courts' },
  { value: 'uttar-pradesh-hc', label: 'Uttar Pradesh High Court', category: 'High Courts' },

  // Tribunals
  { value: 'ncdrc', label: 'NCDRC - National Consumer Disputes Redressal Commission', category: 'Tribunals' },
  { value: 'nclt', label: 'NCLT - National Company Law Tribunal', category: 'Tribunals' },
  { value: 'nclat', label: 'NCLAT - National Company Law Appellate Tribunal', category: 'Tribunals' },
  { value: 'cci', label: 'CCI - Competition Commission of India', category: 'Tribunals' },
  { value: 'cat', label: 'CAT - Central Administrative Tribunal', category: 'Tribunals' },
  { value: 'cestat', label: 'CESTAT - Customs, Excise & Service Tax Appellate Tribunal', category: 'Tribunals' },
  { value: 'itat', label: 'ITAT - Income Tax Appellate Tribunal', category: 'Tribunals' },
  { value: 'ngt', label: 'NGT - National Green Tribunal', category: 'Tribunals' },
  { value: 'drt', label: 'DRT - Debt Recovery Tribunal', category: 'Tribunals' },
  { value: 'rera', label: 'RERA - Real Estate Regulatory Authority', category: 'Tribunals' },
];

export function RadarSetupWizard({ onComplete, onBack }: RadarSetupWizardProps) {
  const [proposition, setProposition] = useState('');
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([]);
  const [jurisdictionOpen, setJurisdictionOpen] = useState(false);
  const [otherJurisdiction, setOtherJurisdiction] = useState('');

  const examplePropositions = [
    "Case laws on stay of invocation of bank guarantee under Section 9 of Arbitration Act 1996",
    "Liability of non-executive directors in Section 138 NI Act proceedings",
    "Principles governing grant of anticipatory bail in economic offences",
    "Judicial interpretation of force majeure clauses post-COVID-19",
    "Scope of Section 34 Arbitration Act - grounds for setting aside arbitral awards"
  ];

  const handleAddJurisdiction = (value: string) => {
    if (!selectedJurisdictions.includes(value)) {
      setSelectedJurisdictions([...selectedJurisdictions, value]);
    }
    setJurisdictionOpen(false);
  };

  const handleRemoveJurisdiction = (value: string) => {
    setSelectedJurisdictions(selectedJurisdictions.filter(j => j !== value));
  };

  const handleAddOther = () => {
    if (otherJurisdiction.trim() && !selectedJurisdictions.includes(otherJurisdiction)) {
      setSelectedJurisdictions([...selectedJurisdictions, otherJurisdiction]);
      setOtherJurisdiction('');
    }
  };

  const handleSubmit = () => {
    if (proposition.trim() && selectedJurisdictions.length > 0) {
      onComplete({ proposition, jurisdictions: selectedJurisdictions });
    }
  };

  const getJurisdictionLabel = (value: string) => {
    const found = jurisdictions.find(j => j.value === value);
    return found ? found.label : value;
  };

  const isFormValid = proposition.trim().length > 20 && selectedJurisdictions.length > 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-card border-b border-border px-[24px] py-[20px] h-[90px] flex items-center">
        <div className="flex items-center gap-4">
          {onBack && (
            <>
              <Button
                onClick={onBack}
                variant="ghost"
                className="hover:bg-accent"
                size="sm"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <div className="h-6 w-px bg-border" />
            </>
          )}
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-[22px] font-bold text-foreground">Create New Radar</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-20 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* Setup Form */}
          <div className="bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="p-6 space-y-6">
              {/* Step 1: Proposition */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <Label className="text-lg font-bold text-foreground">Legal Proposition</Label>
                </div>

                <textarea
                  value={proposition}
                  onChange={(e) => setProposition(e.target.value)}
                  placeholder="Enter your legal proposition here..."
                  className="w-full min-h-[140px] px-4 py-3 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all"
                />

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <p>Be specific and elaborate to ensure radar precision. Include relevant sections, acts, or legal principles.</p>
                </div>

                {/* Example Chips */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Example Propositions:</p>
                  <div className="flex flex-wrap gap-2">
                    {examplePropositions.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setProposition(example)}
                        className="px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-[#F7F7F7] text-sm rounded-full border border-primary/20 hover:border-primary/40 transition-all font-medium"
                      >
                        {example.length > 60 ? example.substring(0, 60) + '...' : example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Step 2: Jurisdiction */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <Label className="text-lg font-bold text-foreground">Target Jurisdictions</Label>
                </div>

                {/* Jurisdiction Selector */}
                <div className="space-y-3">
                  <Popover open={jurisdictionOpen} onOpenChange={setJurisdictionOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-12 border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        <span className="text-muted-foreground">Select courts and tribunals...</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px] p-0 border-2 border-primary shadow-xl" align="start">
                      <Command>
                        <CommandInput placeholder="Search jurisdiction..." />
                        <CommandList className="max-h-[400px]">
                          <CommandEmpty>No jurisdiction found.</CommandEmpty>

                          {['Supreme Court', 'High Courts', 'Tribunals'].map(category => {
                            const categoryItems = jurisdictions.filter(j => j.category === category);
                            return (
                              <CommandGroup key={category} heading={category}>
                                {categoryItems.map((jurisdiction) => (
                                  <CommandItem
                                    key={jurisdiction.value}
                                    value={jurisdiction.value}
                                    onSelect={() => handleAddJurisdiction(jurisdiction.value)}
                                    className="cursor-pointer"
                                  >
                                    <div className={cn(
                                      "mr-2 h-4 w-4 rounded border-2 flex items-center justify-center",
                                      selectedJurisdictions.includes(jurisdiction.value)
                                        ? "bg-primary border-primary"
                                        : "border-muted-foreground"
                                    )}>
                                      {selectedJurisdictions.includes(jurisdiction.value) && (
                                        <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                                      )}
                                    </div>
                                    {jurisdiction.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            );
                          })}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* "Others" Manual Entry */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otherJurisdiction}
                      onChange={(e) => setOtherJurisdiction(e.target.value)}
                      placeholder="Or enter another jurisdiction manually..."
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOther()}
                    />
                    <Button
                      onClick={handleAddOther}
                      disabled={!otherJurisdiction.trim()}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Add
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Select multiple courts/tribunals to monitor. You can also add custom jurisdictions.
                  </p>
                </div>

                {/* Selected Jurisdictions */}
                {selectedJurisdictions.length > 0 && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl max-h-[200px] overflow-y-auto">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Selected Jurisdictions ({selectedJurisdictions.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedJurisdictions.map((jurisdiction) => (
                        <Badge
                          key={jurisdiction}
                          variant="secondary"
                          className="bg-black text-white hover:bg-black/90 pr-1 pl-3 py-1.5 text-xs"
                        >
                          {getJurisdictionLabel(jurisdiction)}
                          <button
                            onClick={() => handleRemoveJurisdiction(jurisdiction)}
                            className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <span className="sr-only">Remove</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-accent/30 border-t border-border px-8 py-5 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {!isFormValid && (
                  <span className="text-yellow-600 dark:text-yellow-500">
                    ⚠️ Please provide a detailed proposition (min 20 chars) and select at least one jurisdiction
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onBack && (
                  <Button
                    onClick={onBack}
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/30"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />

                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Preview
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}