import { useState, useRef } from 'react';
import { Check, ChevronsUpDown, Upload, X, FileText, FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/app/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { cn } from '@/app/components/ui/utils';
import { toast } from 'sonner';
import { MySpacePickerDialog } from '@/app/components/MySpacePickerDialog';
import type { IntakeData } from '@/app/components/research-tools/PreCheckWorkflow';

interface IntakeModalProps {
  onComplete: (data: IntakeData) => void;
}

// Mock data for dropdowns
const courts = [
  { value: 'supreme-court', label: 'Supreme Court of India' },
  { value: 'delhi-high-court', label: 'Delhi High Court' },
];

const caseTypesByCourtMap: Record<string, { value: string; label: string }[]> = {
  'supreme-court': [
    { value: 'slp-civil', label: 'SLP (Civil)' },
    { value: 'slp-criminal', label: 'SLP (Criminal)' },
    { value: 'civil-appeal', label: 'Civil Appeal' },
    { value: 'criminal-appeal', label: 'Criminal Appeal' },
    { value: 'writ-petition', label: 'Writ Petition' },
    { value: 'transfer-petition', label: 'Transfer Petition' },
  ],
  'delhi-high-court': [
    { value: 'wp-civil', label: 'WP (Civil)' },
    { value: 'wp-criminal', label: 'WP (Criminal)' },
    { value: 'crm', label: 'CRM (Criminal Misc.)' },
    { value: 'cs', label: 'CS (Civil Suit)' },
    { value: 'rfa', label: 'RFA (Regular First Appeal)' },
    { value: 'execution', label: 'Execution Petition' },
    { value: 'arb-petition', label: 'Arbitration Petition' },
  ],
};

const petitionerSuggestions = [
  'Ram Kumar and Ors.',
  'Sita Devi',
  'ABC Private Limited and Anr.',
  'State of Delhi',
  'Union of India',
];

const respondentSuggestions = [
  'State of Delhi and Ors.',
  'Union of India and Anr.',
  'XYZ Corporation Limited',
  'Municipal Corporation of Delhi',
  'Delhi Development Authority',
];

export function IntakeModal({ onComplete }: IntakeModalProps) {
  // Form state
  const [petitioners, setPetitioners] = useState<string[]>([]);
  const [respondents, setRespondents] = useState<string[]>([]);
  const [court, setCourt] = useState('');
  const [caseType, setCaseType] = useState('');
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [annexures, setAnnexures] = useState<File[]>([]);
  
  // Temporary input state for adding new entries
  const [petitionerInput, setPetitionerInput] = useState('');
  const [respondentInput, setRespondentInput] = useState('');

  // UI state
  const [courtOpen, setCourtOpen] = useState(false);
  const [caseTypeOpen, setCaseTypeOpen] = useState(false);
  const [petitionerOpen, setPetitionerOpen] = useState(false);
  const [respondentOpen, setRespondentOpen] = useState(false);
  const [showMainMySpace, setShowMainMySpace] = useState(false);
  const [showAnnexureMySpace, setShowAnnexureMySpace] = useState(false);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const annexuresInputRef = useRef<HTMLInputElement>(null);

  const caseTypes = court ? caseTypesByCourtMap[court] || [] : [];

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setMainFile(file);
        toast.success(`Main petition uploaded: ${file.name}`);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const handleAnnexuresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    
    if (pdfFiles.length !== files.length) {
      toast.error('Only PDF files are allowed');
    }
    
    if (pdfFiles.length > 0) {
      setAnnexures(prev => [...prev, ...pdfFiles]);
      toast.success(`${pdfFiles.length} annexure(s) uploaded`);
    }
  };

  const removeAnnexure = (index: number) => {
    setAnnexures(prev => prev.filter((_, i) => i !== index));
  };

  const handleMainMySpaceSelect = (documents: any[]) => {
    if (documents.length > 0) {
      // For main petition, we only take the first document
      const doc = documents[0];
      // Convert the MySpace document to a File object
      const file = new File([], doc.name, { 
        type: doc.type || 'application/pdf',
        lastModified: doc.lastModified || Date.now()
      });
      // Set file size if available
      Object.defineProperty(file, 'size', { value: doc.size || 0 });
      
      setMainFile(file);
      toast.success(`Selected: ${doc.name}`);
      setShowMainMySpace(false);
    }
  };

  const handleAnnexureMySpaceSelect = (documents: any[]) => {
    if (documents.length > 0) {
      // Convert MySpace documents to File objects
      const files = documents.map(doc => {
        const file = new File([], doc.name, { 
          type: doc.type || 'application/pdf',
          lastModified: doc.lastModified || Date.now()
        });
        // Set file size if available
        Object.defineProperty(file, 'size', { value: doc.size || 0 });
        return file;
      });
      
      setAnnexures(prev => [...prev, ...files]);
      toast.success(`${files.length} annexure(s) added from My Space`);
      setShowAnnexureMySpace(false);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (petitioners.length === 0) {
      toast.error('Please enter at least one petitioner name');
      return;
    }
    if (respondents.length === 0) {
      toast.error('Please enter at least one respondent name');
      return;
    }
    if (!court) {
      toast.error('Please select a court');
      return;
    }
    if (!caseType) {
      toast.error('Please select a case type');
      return;
    }
    if (!mainFile) {
      toast.error('Please upload the main petition/application');
      return;
    }

    onComplete({
      petitioner: petitioners.join(', '),
      respondent: respondents.join(', '),
      court,
      caseType,
      mainFile,
      annexures,
    });
  };

  return (
    <div className="h-full flex items-center justify-center p-6 bg-[#F9F9F9] dark:bg-background">
      <div className="w-full max-w-[95%] bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-8 py-6 border-b border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-2">Scrutiny</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Provide case details and upload documents for Scrutiny
          </p>
        </div>

        {/* Modal Content */}
        <div className="px-8 py-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Party Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-border" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Party Details</h3>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Petitioner */}
                <div className="space-y-2">
                  <Label htmlFor="petitioner" className="text-sm font-semibold">
                    Petitioner / Appellant
                  </Label>
                  
                  <Popover open={petitionerOpen} onOpenChange={setPetitionerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={petitionerOpen}
                        className="w-full justify-between h-11 border-2 border-border hover:border-primary/50 hover:bg-accent font-medium transition-colors"
                      >
                        {petitioners.length === 0 ? "Enter or select..." : "Add another..."}
                        <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0 border-2 border-primary shadow-xl bg-card" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Type petitioner name..."
                          value={petitionerInput}
                          onValueChange={setPetitionerInput}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && petitionerInput.trim()) {
                              e.preventDefault();
                              if (!petitioners.includes(petitionerInput.trim())) {
                                setPetitioners([...petitioners, petitionerInput.trim()]);
                                setPetitionerInput('');
                              }
                            }
                          }}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {petitionerInput.trim() && (
                              <div className="p-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    if (!petitioners.includes(petitionerInput.trim())) {
                                      setPetitioners([...petitioners, petitionerInput.trim()]);
                                      setPetitionerInput('');
                                      setPetitionerOpen(false);
                                    }
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add "{petitionerInput}"
                                </Button>
                              </div>
                            )}
                          </CommandEmpty>
                          <CommandGroup heading="Suggestions">
                            {petitionerSuggestions
                              .filter(s => !petitioners.includes(s))
                              .map((suggestion) => (
                              <CommandItem
                                key={suggestion}
                                value={suggestion}
                                onSelect={(value) => {
                                  if (!petitioners.includes(value)) {
                                    setPetitioners([...petitioners, value]);
                                    setPetitionerInput('');
                                  }
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4 text-primary" />
                                {suggestion}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">Format: Name and Ors./Anr.</p>
                  
                  {/* Selected Petitioners Badges */}
                  {petitioners.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-accent/30 rounded-lg border border-border/50 min-h-[2.5rem]">
                      {petitioners.map((pet, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium border border-primary/20"
                        >
                          {pet}
                          <button
                            onClick={() => setPetitioners(petitioners.filter((_, i) => i !== index))}
                            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Respondent */}
                <div className="space-y-2">
                  <Label htmlFor="respondent" className="text-sm font-semibold">
                    Respondent
                  </Label>
                  
                  <Popover open={respondentOpen} onOpenChange={setRespondentOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={respondentOpen}
                        className="w-full justify-between h-11 border-2 border-border hover:border-primary/50 hover:bg-accent font-medium transition-colors"
                      >
                        {respondents.length === 0 ? "Enter or select..." : "Add another..."}
                        <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0 border-2 border-primary shadow-xl bg-card" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Type respondent name..."
                          value={respondentInput}
                          onValueChange={setRespondentInput}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && respondentInput.trim()) {
                              e.preventDefault();
                              if (!respondents.includes(respondentInput.trim())) {
                                setRespondents([...respondents, respondentInput.trim()]);
                                setRespondentInput('');
                              }
                            }
                          }}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {respondentInput.trim() && (
                              <div className="p-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    if (!respondents.includes(respondentInput.trim())) {
                                      setRespondents([...respondents, respondentInput.trim()]);
                                      setRespondentInput('');
                                      setRespondentOpen(false);
                                    }
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add "{respondentInput}"
                                </Button>
                              </div>
                            )}
                          </CommandEmpty>
                          <CommandGroup heading="Suggestions">
                            {respondentSuggestions
                              .filter(s => !respondents.includes(s))
                              .map((suggestion) => (
                              <CommandItem
                                key={suggestion}
                                value={suggestion}
                                onSelect={(value) => {
                                  if (!respondents.includes(value)) {
                                    setRespondents([...respondents, value]);
                                    setRespondentInput('');
                                  }
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4 text-primary" />
                                {suggestion}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">Format: Name and Ors./Anr.</p>
                  
                  {/* Selected Respondents Badges */}
                  {respondents.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-accent/30 rounded-lg border border-border/50 min-h-[2.5rem]">
                      {respondents.map((resp, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium border border-primary/20"
                        >
                          {resp}
                          <button
                            onClick={() => setRespondents(respondents.filter((_, i) => i !== index))}
                            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Jurisdiction Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-border" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Jurisdiction</h3>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Court Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Court Name</Label>
                  <Popover open={courtOpen} onOpenChange={setCourtOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={courtOpen}
                        className="w-full justify-between h-11 border-2 border-border hover:border-primary/50 hover:bg-accent font-medium transition-colors"
                      >
                        {court ? courts.find((c) => c.value === court)?.label : "Select court..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search court..." />
                        <CommandList>
                          <CommandEmpty>No court found.</CommandEmpty>
                          <CommandGroup>
                            {courts.map((c) => (
                              <CommandItem
                                key={c.value}
                                value={c.value}
                                onSelect={(value) => {
                                  setCourt(value);
                                  setCaseType(''); // Reset case type when court changes
                                  setCourtOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    court === c.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {c.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Case Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Case Type</Label>
                  <Popover open={caseTypeOpen} onOpenChange={setCaseTypeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={caseTypeOpen}
                        disabled={!court}
                        className="w-full justify-between h-11 border-2 border-border hover:border-primary/50 hover:bg-accent font-medium disabled:opacity-50 transition-colors"
                      >
                        {caseType ? caseTypes.find((ct) => ct.value === caseType)?.label : "Select case type..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0 border-2 border-primary shadow-xl bg-card" align="start" style={{ maxHeight: '400px', overflow: 'hidden' }}>
                      <Command className="h-full">
                        <CommandInput placeholder="Search case type..." />
                        <CommandList style={{ maxHeight: '340px', overflowY: 'auto' }}>
                          <CommandEmpty>No case type found.</CommandEmpty>
                          <CommandGroup>
                            {caseTypes.map((ct) => (
                              <CommandItem
                                key={ct.value}
                                value={ct.value}
                                onSelect={(value) => {
                                  setCaseType(value);
                                  setCaseTypeOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    caseType === ct.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {ct.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {!court && (
                    <p className="text-xs text-muted-foreground">Select a court first</p>
                  )}
                </div>
              </div>
            </div>

            {/* Asset Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-border" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Document Upload</h3>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Main File Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Main Petition / Application *</Label>
                
                {/* Upload Options */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => mainFileInputRef.current?.click()}
                    className="border-2 border-primary/30 hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-all bg-primary/5 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/25 transition-colors">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">Upload Documents</p>
                    <p className="text-xs text-muted-foreground">From your device</p>
                  </div>
                  
                  <div
                    onClick={() => setShowMainMySpace(true)}
                    className="border-2 border-border hover:border-primary/50 rounded-xl p-4 text-center cursor-pointer transition-all bg-accent/20 hover:bg-accent/40 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent/40 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/60 transition-colors">
                      <FolderOpen className="w-6 h-6 text-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">My Space</p>
                    <p className="text-xs text-muted-foreground">Browse saved files</p>
                  </div>
                </div>

                <input
                  ref={mainFileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleMainFileChange}
                  className="hidden"
                />

                {/* Show selected file */}
                {mainFile && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/40 border border-border mt-2">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{mainFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(mainFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setMainFile(null)}
                      className="hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Annexures Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Annexures / Exhibits</Label>
                
                {/* Upload Options */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => annexuresInputRef.current?.click()}
                    className="border-2 border-primary/30 hover:border-primary rounded-xl p-4 text-center cursor-pointer transition-all bg-primary/5 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/25 transition-colors">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">Upload Documents</p>
                    <p className="text-xs text-muted-foreground">From your device</p>
                  </div>
                  
                  <div
                    onClick={() => setShowAnnexureMySpace(true)}
                    className="border-2 border-border hover:border-primary/50 rounded-xl p-4 text-center cursor-pointer transition-all bg-accent/20 hover:bg-accent/40 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-accent/40 flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/60 transition-colors">
                      <FolderOpen className="w-6 h-6 text-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-1">My Space</p>
                    <p className="text-xs text-muted-foreground">Browse saved files</p>
                  </div>
                </div>

                <input
                  ref={annexuresInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleAnnexuresChange}
                  className="hidden"
                />

                {/* Annexure List */}
                {annexures.length > 0 && (
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {annexures.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/40 border border-border"
                      >
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAnnexure(index)}
                          className="hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 border-t border-border bg-accent/20 flex justify-end gap-3">
          <Button
            variant="outline"
            className="px-6 font-semibold"
            onClick={() => {
              setPetitioners([]);
              setRespondents([]);
              setCourt('');
              setCaseType('');
              setMainFile(null);
              setAnnexures([]);
            }}
          >
            Clear All
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-semibold shadow-lg shadow-primary/30"
          >
            Proceed to Scrutiny
          </Button>
        </div>
      </div>

      {/* My Space Dialogs */}
      <MySpacePickerDialog
        isOpen={showMainMySpace}
        onClose={() => setShowMainMySpace(false)}
        onSelect={handleMainMySpaceSelect}
      />
      
      <MySpacePickerDialog
        isOpen={showAnnexureMySpace}
        onClose={() => setShowAnnexureMySpace(false)}
        onSelect={handleAnnexureMySpaceSelect}
      />
    </div>
  );
}