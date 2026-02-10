import { useState, useRef } from 'react';
import { CheckCircle2, CheckCircle, XCircle, AlertTriangle, FileText, Upload, Eye, X, Loader2, Sparkles, Edit2, Trash2, AlertCircle, FileCheck, Download, ChevronRight, Link as LinkIcon, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';
import { MSWordWindow } from '@/app/components/MSWordWindow';
import { PreCheckDefectReport } from '@/app/components/PreCheckDefectReport';

// Types
interface DefectItem {
  id: number;
  code?: string;
  type: string;
  severity: 'must-fix' | 'review' | 'advisory';
  courtLanguage: string;
  explanation: string;
  whatJubeeChecked: string;
  page?: number;
  status: 'pending' | 'fixed';
}

interface AnnexureItem {
  id: string;
  annexureNo: string;
  fileAttached: File | null;
  source: 'auto' | 'manual' | 'missing';
  mentioned: boolean;
  uploaded: boolean;
  ocr: boolean;
  dim: boolean;
}

type FlowStage = 'create' | 'mapping' | 'scanning' | 'report' | 'completion';

export function RegistryPortalView() {
  // Flow state
  const [stage, setStage] = useState<FlowStage>('create');
  const [scanProgress, setScanProgress] = useState(0);
  
  // Form state
  const [caseName, setCaseName] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [filingType, setFilingType] = useState<'petition' | 'application' | 'misc' | 'orders-judgements'>('petition');
  const [prepareIndex, setPrepareIndex] = useState(true);
  
  // Files state
  const [petitionFile, setPetitionFile] = useState<File | null>(null);
  const [annexureFiles, setAnnexureFiles] = useState<File[]>([]);
  const [annexures, setAnnexures] = useState<AnnexureItem[]>([]);
  
  // Defects state
  const [defects, setDefects] = useState<DefectItem[]>([]);
  const [fixingDefect, setFixingDefect] = useState<DefectItem | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [highlightedPage, setHighlightedPage] = useState<number | null>(null);
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const [isWordEditorOpen, setIsWordEditorOpen] = useState(false);
  const [wordEditorContent, setWordEditorContent] = useState('');
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [resolutionChoice, setResolutionChoice] = useState<'upload' | 'replace' | 'remove' | null>(null);
  const [currentDefectId, setCurrentDefectId] = useState<number | null>(null);
  
  const petitionInputRef = useRef<HTMLInputElement>(null);
  const annexureInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  const courts = [
    'Supreme Court of India',
    'Delhi High Court'
  ];

  const mockDefects: DefectItem[] = [
    {
      id: 1,
      code: '202',
      type: 'Vakalatnama Verification',
      severity: 'must-fix',
      courtLanguage: 'Vakalatnama not signed by advocate on all pages',
      explanation: 'The Vakalatnama must be signed by the advocate on each page to establish authorization',
      whatJubeeChecked: 'Last page signature present: No | All pages signed: No',
      page: 3,
      status: 'pending'
    },
    {
      id: 2,
      code: '305',
      type: 'Court Fee / Stamp Duty',
      severity: 'must-fix',
      courtLanguage: 'Insufficient court fee stamps affixed',
      explanation: 'The total court fee required has not been paid in full',
      whatJubeeChecked: 'Required: ₹500 | Detected: ₹250 | Short: ₹250',
      status: 'pending'
    },
    {
      id: 3,
      type: 'Annexure Missing',
      severity: 'must-fix',
      courtLanguage: 'Annexure A-2 mentioned in prayer but not attached',
      explanation: 'The petition references this annexure but it was not found in uploaded files',
      whatJubeeChecked: 'Mentioned in petition: Yes | File attached: No',
      status: 'pending'
    },
    {
      id: 4,
      type: 'Index Mismatch',
      severity: 'review',
      courtLanguage: 'Index does not match actual annexures',
      explanation: 'The index page lists different annexures than what is actually attached',
      whatJubeeChecked: 'Index entries: 5 | Actual annexures: 4 | Mismatch: A-3',
      page: 2,
      status: 'pending'
    },
    {
      id: 5,
      type: 'Page Numbering',
      severity: 'review',
      courtLanguage: 'Page numbers are not continuous',
      explanation: 'There is a gap in page numbering sequence',
      whatJubeeChecked: 'Discontinuity found: Page 44 → Page 46',
      page: 45,
      status: 'pending'
    },
    {
      id: 6,
      type: 'Font Size Non-Compliance',
      severity: 'advisory',
      courtLanguage: 'Font size below 12pt detected',
      explanation: 'Some portions use font smaller than the required 12pt minimum',
      whatJubeeChecked: 'Pages with small font: 8, 9, 10 | Detected size: 10pt',
      page: 8,
      status: 'pending'
    }
  ];

  const mockAnnexures: AnnexureItem[] = [
    { id: '1', annexureNo: 'A-1', fileAttached: null, source: 'auto', mentioned: true, uploaded: true, ocr: true, dim: false },
    { id: '2', annexureNo: 'A-2', fileAttached: null, source: 'missing', mentioned: true, uploaded: false, ocr: false, dim: false },
    { id: '3', annexureNo: 'A-3', fileAttached: null, source: 'auto', mentioned: true, uploaded: true, ocr: false, dim: true },
  ];

  // Handlers
  const handlePetitionSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setPetitionFile(file);
      toast.success(`Petition uploaded: ${file.name}`);
    }
  };

  const handleAnnexureSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter(f => f.type === 'application/pdf');
      setAnnexureFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} annexure(s) uploaded`);
    }
  };

  const handleCreatePreCheck = () => {
    if (!caseName.trim()) {
      toast.error('Please enter case name');
      return;
    }
    if (!selectedCourt) {
      toast.error('Please select a court');
      return;
    }
    if (!petitionFile) {
      toast.error('Please upload petition document');
      return;
    }
    
    // Move to mapping stage
    setAnnexures(mockAnnexures);
    setStage('mapping');
  };

  const handleProceedToScan = () => {
    setStage('scanning');
    setScanProgress(0);
    
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setTimeout(() => {
            setDefects(mockDefects);
            setLastChecked(new Date());
            setStage('report');
            toast.success('Scrutiny complete', {
              description: `${mockDefects.filter(d => d.severity === 'must-fix').length} critical defects found`
            });
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleFixDefect = (defect: DefectItem) => {
    setFixingDefect(defect);
    setResolutionChoice(null);
  };

  const handleResolutionChoice = (choice: 'upload' | 'replace' | 'remove') => {
    setResolutionChoice(choice);
    
    if (choice === 'remove' && fixingDefect?.type === 'Annexure Missing') {
      // Store the defect ID before clearing fixingDefect
      setCurrentDefectId(fixingDefect.id);
      
      // Load mock petition content with the annexure reference highlighted
      const mockPetitionContent = `IN THE SUPREME COURT OF INDIA

ORIGINAL CIVIL JURISDICTION

WRIT PETITION (CIVIL) NO. ______ OF 2026

IN THE MATTER OF:

Ramesh Kumar                                                  ...Petitioner

                                    VERSUS

State of Delhi & Ors.                                        ...Respondents

PETITION UNDER ARTICLE 32 OF THE CONSTITUTION OF INDIA

TO,
THE HON'BLE CHIEF JUSTICE OF INDIA AND
HIS COMPANION JUSTICES OF THE
SUPREME COURT OF INDIA

THE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED

MOST RESPECTFULLY SHOWETH:

1. That the petitioner is a resident of Delhi and is filing this petition under Article 32 of the Constitution of India for the protection of his fundamental rights.

2. That the petitioner was served with an arbitrary order dated 15th January 2026 by the respondent authorities without following due process of law.

3. That the said order is challenged on the grounds that it violates the petitioner's fundamental rights under Article 14 and Article 21 of the Constitution. A copy of the said order is annexed herewith and marked as Annexure A-2.

4. That the petitioner has no other efficacious remedy except to approach this Hon'ble Court under Article 32 of the Constitution of India.

PRAYER

In light of the facts stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:

(a) Issue a writ of certiorari or any other appropriate writ quashing the impugned order dated 15th January 2026;

(b) Pass any other order as this Hon'ble Court may deem fit in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL DUTY BOUND FOREVER PRAY.

ADVOCATE FOR THE PETITIONER
PLACE: NEW DELHI
DATE: 10TH FEBRUARY 2026`;

      setWordEditorContent(mockPetitionContent);
      setHighlightedText('Annexure A-2');
      setIsWordEditorOpen(true);
      setFixingDefect(null);
    }
  };

  const handleSaveWordEditorContent = (content: string) => {
    if (currentDefectId && resolutionChoice === 'remove') {
      // Mark the defect as fixed
      setDefects(prev => prev.map(d => 
        d.id === currentDefectId 
          ? { ...d, status: 'fixed' as const }
          : d
      ));
      
      // Close the Word editor
      setIsWordEditorOpen(false);
      setCurrentDefectId(null);
      setResolutionChoice(null);
      
      toast.success('Reference removed successfully', {
        description: 'The defect has been resolved. Petition updated.'
      });
    }
  };

  const handleMarkForLater = (defectId: number) => {
    toast.info('Marked for later resolution');
  };

  const handleProceedToCompletion = () => {
    setStage('completion');
    toast.success('Scrutiny completed', {
      description: 'Proceeding to final filing preparation'
    });
  };

  const handleProceedWithoutFixing = () => {
    setStage('completion');
    toast.warning('Proceeding without fixing defects', {
      description: 'Please note that court may raise objections'
    });
  };

  const getSeverityColor = (severity: DefectItem['severity']) => {
    switch (severity) {
      case 'must-fix': return 'bg-red-50 text-red-600 border-red-200';
      case 'review': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'advisory': return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: DefectItem['severity']) => {
    switch (severity) {
      case 'must-fix': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'review': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'advisory': return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const mustFixCount = defects.filter(d => d.severity === 'must-fix' && d.status === 'pending').length;
  const reviewCount = defects.filter(d => d.severity === 'review' && d.status === 'pending').length;
  const advisoryCount = defects.filter(d => d.severity === 'advisory' && d.status === 'pending').length;

  return (
    <div className="flex-1 h-screen overflow-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-foreground text-2xl font-bold">Scrutiny</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Document management and compliance verification</p>
              </div>
            </div>
            {stage === 'report' && (
              <Button 
                variant="outline" 
                className="border-primary/30 text-primary hover:bg-primary/10 font-semibold"
                onClick={() => setStage('create')}
              >
                <FileCheck className="w-4 h-4 mr-2" />
                New Scrutiny
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="px-8 py-8">
        {/* STAGE 1: CREATE PRE-CHECK */}
        {stage === 'create' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Create Scrutiny</h2>
                <p className="text-muted-foreground font-medium">Complete this form to start your scrutiny. Takes less than 2 minutes.</p>
              </div>

              <div className="space-y-6">
                {/* Case Name */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Case Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={caseName}
                    onChange={(e) => setCaseName(e.target.value)}
                    placeholder="e.g., Ramesh Kumar vs State of Delhi"
                    className="h-12 text-base bg-input-background border-border focus:border-primary focus:ring-primary text-foreground"
                  />
                </div>

                {/* Court Selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Court <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCourt}
                    onChange={(e) => setSelectedCourt(e.target.value)}
                    className="w-full h-12 px-4 text-base border border-border rounded-xl bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Court</option>
                    {courts.map((court) => (
                      <option key={court} value={court}>{court}</option>
                    ))}
                  </select>
                </div>

                {/* Filing Type */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Filing Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {(['petition', 'application', 'misc', 'orders-judgements'] as const).map((type) => (
                      <label
                        key={type}
                        className={`flex-1 flex items-center gap-2 px-3 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                          filingType === type
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : 'border-border hover:border-primary/50 bg-card'
                        }`}
                      >
                        <input
                          type="radio"
                          name="filingType"
                          value={type}
                          checked={filingType === type}
                          onChange={(e) => setFilingType(e.target.value as any)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-foreground capitalize">
                          {type === 'orders-judgements' ? 'Orders & Judgements' : type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Petition Upload */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Petition Document <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={petitionInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handlePetitionSelect}
                    className="hidden"
                  />
                  {!petitionFile ? (
                    <div
                      onClick={() => petitionInputRef.current?.click()}
                      className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground font-medium">Click to upload petition (PDF only)</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <FileText className="w-10 h-10 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{petitionFile.name}</p>
                        <p className="text-sm text-muted-foreground">{(petitionFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPetitionFile(null)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Annexures Upload */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Annexures (Optional)
                  </label>
                  <input
                    ref={annexureInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleAnnexureSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => annexureInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-muted-foreground font-medium">Click to upload annexures (Multiple PDFs)</p>
                  </div>
                  {annexureFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {annexureFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <span className="flex-1 text-sm text-foreground font-medium truncate">{file.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAnnexureFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:bg-red-50 p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Index Preparation Checkbox */}
                <div className="p-4 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-xl border border-[#FBBF24]/30">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prepareIndex}
                      onChange={(e) => setPrepareIndex(e.target.checked)}
                      className="mt-1 w-5 h-5 text-[#FBBF24] border-[#FBBF24] rounded focus:ring-[#FBBF24]"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-[#92400E] mb-1">Let Jubee prepare Index, OCR & Bookmarking after pre-check</p>
                      <p className="text-sm text-[#92400E]/80">Recommended: Saves time and ensures compliance</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-border">
                <Button
                  onClick={handleCreatePreCheck}
                  className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground text-base font-bold shadow-lg shadow-primary/30"
                >
                  Start Scrutiny
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: UPLOAD & MAPPING */}
        {stage === 'mapping' && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-primary/10 to-[#FEF3C7] dark:to-[#FBBF24]/20 border-b border-border">
                <h2 className="text-xl font-bold text-foreground mb-1">Upload & Mapping</h2>
                <p className="text-sm text-muted-foreground font-medium">Verify annexure mapping before proceeding to pre-check. This prevents 50% of court defects.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-border">
                {/* Left: Uploaded Files */}
                <div className="p-6">
                  <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Uploaded Files
                  </h3>
                  <div className="space-y-3">
                    {/* Petition */}
                    <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-6 h-6 text-primary" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{petitionFile?.name}</p>
                          <p className="text-xs text-muted-foreground font-medium">Main Petition</p>
                        </div>
                        <Badge className="bg-primary text-primary-foreground border-0 font-semibold">Primary</Badge>
                      </div>
                    </div>

                    {/* Annexures */}
                    {annexureFiles.map((file, idx) => (
                      <div key={idx} className="p-4 bg-muted rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">Annexure {idx + 1}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Annexure Mapping Table */}
                <div className="p-6">
                  <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-[#FBBF24]" />
                    Annexure Mapping
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="text-left py-3 px-2 font-bold text-foreground">Annexure No</th>
                          <th className="text-left py-3 px-2 font-bold text-foreground">File Attached</th>
                          <th className="text-left py-3 px-2 font-bold text-foreground">Source</th>
                          <th className="text-right py-3 px-2 font-bold text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {annexures.map((annexure) => (
                          <tr key={annexure.id} className="border-b border-border hover:bg-accent">
                            <td className="py-4 px-2">
                              <span className="font-semibold text-foreground">{annexure.annexureNo}</span>
                            </td>
                            <td className="py-4 px-2">
                              {annexure.uploaded ? (
                                <span className="text-primary font-medium">Annexure-{annexure.id}.pdf</span>
                              ) : (
                                <span className="text-red-500 font-semibold flex items-center gap-1">
                                  <XCircle className="w-4 h-4" />
                                  Missing
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-2">
                              <Badge
                                variant="outline"
                                className={
                                  annexure.source === 'auto'
                                    ? 'border-primary/20 text-primary bg-primary/10 font-semibold'
                                    : annexure.source === 'missing'
                                    ? 'border-red-200 text-red-600 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 font-semibold'
                                    : 'border-border text-muted-foreground font-semibold'
                                }
                              >
                                {annexure.source === 'auto' ? 'From Petition' : annexure.source === 'missing' ? 'Missing' : 'Manual'}
                              </Badge>
                            </td>
                            <td className="py-4 px-2 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!annexure.uploaded && (
                                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 font-semibold">
                                    <Upload className="w-3 h-3 mr-1" />
                                    Attach
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost" className="h-8 hover:bg-accent">
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-900 font-medium">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      1 annexure is missing. Please attach or confirm before proceeding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 bg-muted border-t border-border flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStage('create')}
                  className="border-border hover:bg-accent font-semibold"
                >
                  Back to Form
                </Button>
                <Button
                  onClick={handleProceedToScan}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/30"
                >
                  Proceed to Scrutiny
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: SCANNING */}
        {stage === 'scanning' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary via-[#FBBF24] to-primary animate-pulse"></div>
              <div className="p-12">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/10 via-[#FEF3C7] dark:via-[#FBBF24]/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-2xl">
                    <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">AI Scrutiny in Progress</h3>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Scanning petition structure', threshold: 20 },
                    { label: 'Verifying court fee stamps', threshold: 40 },
                    { label: 'Checking annexure compliance', threshold: 60 },
                    { label: 'Analyzing format standards', threshold: 80 }
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        scanProgress > step.threshold
                          ? 'bg-gradient-to-r from-primary/10 to-primary/5'
                          : 'bg-muted'
                      }`}
                    >
                      {scanProgress > step.threshold ? (
                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                      ) : scanProgress > (step.threshold - 20) ? (
                        <Loader2 className="w-6 h-6 text-primary animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-3 border-border flex-shrink-0"></div>
                      )}
                      <span className="text-sm font-semibold text-foreground">{step.label}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-semibold">Scan Progress</span>
                    <span className="font-bold text-primary text-lg">{scanProgress}%</span>
                  </div>
                  <Progress
                    value={scanProgress}
                    className="h-3 bg-primary/10"
                    indicatorClassName="bg-gradient-to-r from-primary to-[#FBBF24]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: PRE-CHECK REPORT */}
        {stage === 'report' && (
          <>
            {/* Report Header */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="bg-card rounded-2xl border border-border p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Pre-Check Report</h2>
                    <p className="text-base text-muted-foreground">{caseName}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCourt}</p>
                    {lastChecked && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Last Checked: {lastChecked.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-accent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>

                {/* Summary Cards - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Must Fix</p>
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{mustFixCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Critical defects</p>
                  </div>

                  <div className="p-6 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Needs Review</p>
                      <AlertTriangle className="w-5 h-5 text-[#FBBF24]" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{reviewCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Moderate issues</p>
                  </div>

                  <div className="p-6 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Advisory</p>
                      <AlertCircle className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{advisoryCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Minor suggestions</p>
                  </div>

                  <div className="p-6 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <CheckCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{defects.filter(d => d.status === 'pending').length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Pending items</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Defect Cards */}
            <div className="max-w-6xl mx-auto grid grid-cols-2 gap-4 auto-rows-fr items-start">
              {defects.filter(d => d.status === 'pending').map((defect, index) => (
                <div
                  key={defect.id}
                  className="bg-card rounded-xl border border-border hover:border-primary/50 transition-all flex flex-col h-full"
                  style={{ gridRow: Math.floor(index / 2) + 1 }}
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-border flex-shrink-0">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(defect.severity)}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground mb-2">{defect.type}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${getSeverityColor(defect.severity)} border text-xs`}>
                            {defect.severity === 'must-fix' ? 'MUST FIX' : defect.severity === 'review' ? 'REVIEW' : 'ADVISORY'}
                          </Badge>
                          {defect.code && (
                            <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
                              {defect.code}
                            </Badge>
                          )}
                          {defect.page && (
                            <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                              Page {defect.page}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-grow">
                    {/* Error */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">Error</p>
                      <p className="text-sm text-foreground leading-relaxed">{defect.courtLanguage}</p>
                    </div>

                    {/* Solution */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">Solution</p>
                      <p className="text-sm text-foreground leading-relaxed">{defect.explanation}</p>
                    </div>
                  </div>

                  {/* Action Section - Always at Bottom */}
                  <div className="p-4 border-t border-border flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleFixDefect(defect)}
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Fix Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkForLater(defect.id)}
                      className="flex-1 border-border hover:bg-accent"
                    >
                      Mark Later
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {defects.filter(d => d.status === 'pending').length === 0 && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-500/10 dark:to-emerald-500/20 rounded-2xl border-2 border-green-200 dark:border-green-500/30 p-12 text-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-3">No Defects Found</h2>
                  <p className="text-green-800 dark:text-green-200 text-lg leading-relaxed max-w-xl mx-auto">
                    No defects detected based on current court rules. You may proceed to filing preparation.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* STAGE 5: COMPLETION */}
        {stage === 'completion' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-8">
              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Pre-Check Completed</h2>
                <p className="text-muted-foreground text-lg">{caseName}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedCourt}</p>
              </div>

              {/* Summary Section */}
              <div className="bg-muted rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Pre-Check Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                    <span className="text-sm text-muted-foreground">Filing Type</span>
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {filingType === 'orders-judgements' ? 'Orders & Judgements' : filingType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                    <span className="text-sm text-muted-foreground">Documents Scanned</span>
                    <span className="text-sm font-semibold text-foreground">{1 + annexureFiles.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                    <span className="text-sm text-muted-foreground">Total Defects</span>
                    <span className="text-sm font-semibold text-foreground">{defects.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                    <span className="text-sm text-muted-foreground">Critical Issues</span>
                    <span className="text-sm font-semibold text-red-600">{mustFixCount}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              {prepareIndex && (
                <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-xl p-6 mb-6 border border-[#FBBF24]/30">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#92400E] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#92400E] mb-2">Jubee is Preparing Your Documents</h3>
                      <p className="text-sm text-[#92400E]/80 mb-3">
                        Based on your pre-check selection, Jubee is now preparing:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm text-[#92400E]">
                          <CheckCircle2 className="w-4 h-4" />
                          Index preparation with proper formatting
                        </li>
                        <li className="flex items-center gap-2 text-sm text-[#92400E]">
                          <CheckCircle2 className="w-4 h-4" />
                          OCR processing for searchable documents
                        </li>
                        <li className="flex items-center gap-2 text-sm text-[#92400E]">
                          <CheckCircle2 className="w-4 h-4" />
                          PDF bookmarking for easy navigation
                        </li>
                      </ul>
                      <p className="text-xs text-[#92400E]/70 mt-3">
                        This process typically takes 2-3 minutes. You'll be notified once ready.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning if defects remain */}
              {defects.filter(d => d.status === 'pending').length > 0 && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">Pending Defects</h3>
                      <p className="text-sm text-red-800 dark:text-red-400">
                        You have {defects.filter(d => d.status === 'pending').length} defect(s) remaining. 
                        The court registry may raise objections during scrutiny. It's recommended to address these before filing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Available Actions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground mb-4">What's Next?</h3>
                
                <Button
                  className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-bold justify-between"
                >
                  <span>Download Pre-Check Package</span>
                  <Download className="w-5 h-5" />
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 border-border hover:bg-accent font-semibold"
                    onClick={() => {
                      setStage('report');
                    }}
                  >
                    View Defect Report
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-border hover:bg-accent font-semibold"
                  >
                    Send to Workflow
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 border-primary/30 text-primary hover:bg-primary/10 font-semibold"
                  onClick={() => {
                    setStage('create');
                    setCaseName('');
                    setSelectedCourt('');
                    setPetitionFile(null);
                    setAnnexureFiles([]);
                    setDefects([]);
                    setLastChecked(null);
                  }}
                >
                  Start New Pre-Check
                </Button>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  This pre-check is based on publicly available court rules. Jubee cannot guarantee acceptance by court registry. 
                  Always verify with your court's latest guidelines before filing.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Action Bar (Report Stage Only) */}
      {stage === 'report' && defects.filter(d => d.status === 'pending').length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-card border-t border-border shadow-2xl z-20">
          <div className="max-w-7xl mx-auto px-8 py-5">
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1 font-medium">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Court may still raise objections. Jubee only assists in pre-check.
                </p>
                <p className="text-lg font-bold text-foreground">
                  {defects.filter(d => d.status === 'pending').length} defects pending
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-border hover:bg-accent font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Defect Report
                </Button>
                <Button
                  variant="outline"
                  className="border-border hover:bg-accent font-semibold"
                >
                  Re-Run Pre-Check
                </Button>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 font-semibold"
                  onClick={handleProceedWithoutFixing}
                >
                  Proceed Without Fixing
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-bold px-8 shadow-lg shadow-primary/30"
                  onClick={handleProceedToCompletion}
                >
                  Proceed to Final Filing Prep
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fix Defect Modal */}
      {fixingDefect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-card border-b border-border p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-foreground">Resolve: {fixingDefect.type}</h3>
                <p className="text-sm text-muted-foreground mt-1">Choose how to fix this defect</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  setFixingDefect(null);
                  setResolutionChoice(null);
                }}
                className="hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {fixingDefect.type === 'Annexure Missing' ? (
              <div className="p-8">
                <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <p className="text-sm text-foreground">
                    <strong className="text-primary">Issue:</strong> {fixingDefect.courtLanguage}
                  </p>
                </div>

                {/* Resolution Options */}
                <div className="space-y-4">
                  {/* Option 1: Upload Document */}
                  <button
                    onClick={() => handleResolutionChoice('upload')}
                    className="w-full p-6 border-2 border-border hover:border-primary rounded-xl transition-all group text-left hover:bg-primary/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-foreground mb-1">Upload Document</h4>
                        <p className="text-sm text-muted-foreground">Upload the missing annexure document to complete the filing package</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </button>

                  {/* Option 2: Replace Reference */}
                  <button
                    onClick={() => handleResolutionChoice('replace')}
                    className="w-full p-6 border-2 border-border hover:border-primary rounded-xl transition-all group text-left hover:bg-primary/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <Edit className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-foreground mb-1">Replace Reference</h4>
                        <p className="text-sm text-muted-foreground">Update the annexure reference to match an existing document</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </button>

                  {/* Option 3: Remove Reference */}
                  <button
                    onClick={() => handleResolutionChoice('remove')}
                    className="w-full p-6 border-2 border-border hover:border-primary rounded-xl transition-all group text-left hover:bg-primary/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <Trash2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-foreground mb-1">Remove Reference</h4>
                        <p className="text-sm text-muted-foreground">Edit the petition text to remove the annexure reference entirely</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6">
                  <p className="text-muted-foreground mb-6">Upload replacement document or provide additional information to resolve this defect.</p>
                  {/* Fix interface would go here */}
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Upload corrected document</p>
                  </div>
                </div>
                <div className="bg-muted border-t border-border p-6 flex justify-end gap-3 rounded-b-2xl">
                  <Button variant="outline" onClick={() => setFixingDefect(null)} className="font-semibold">Cancel</Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30">
                    Submit & Re-check
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MS Word Editor */}
      {isWordEditorOpen && (
        <MSWordWindow
          isOpen={isWordEditorOpen}
          onClose={() => {
            setIsWordEditorOpen(false);
            setResolutionChoice(null);
          }}
          content={wordEditorContent}
          onContentChange={setWordEditorContent}
          fileName={`${caseName || 'Petition'} - Remove Annexure Reference.docx`}
          onSave={() => handleSaveWordEditorContent(wordEditorContent)}
          courtFormat={{
            font: 'Source Serif Pro',
            fontSize: 12,
            lineSpacing: 1.5
          }}
          isFullWindow={true}
          highlightedText={highlightedText}
          saveButtonText="Save & Finalize"
        />
      )}
    </div>
  );
}