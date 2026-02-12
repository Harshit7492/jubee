import { useState, useRef } from 'react';
import { Upload, FileText, ChevronRight, Check, Settings, Download, Save, FolderOpen, FileDown, Languages, Clock, ChevronLeft, ChevronDown, X, History, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { MySpaceSaveDialog } from '@/app/components/MySpaceSaveDialog';
import { MSWordWindow } from '@/app/components/MSWordWindow';
import { MySpaceBrowserDialog } from '@/app/components/MySpaceBrowserDialog';
import { WorkspaceQuote, WORKSPACE_QUOTES } from '@/app/components/WorkspaceQuote';
import { JubeeFooter } from '@/app/components/JubeeFooter';
import jubeeLogo from '@/assets/jubee-logo.png';

type Step = 'upload' | 'process' | 'review';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  detectedLanguage: string;
  type: 'pdf' | 'docx';
}

interface CourtFormat {
  id: string;
  name: string;
  font: string;
  fontSize: number;
  lineSpacing: number;
  margins: string;
}

interface TranslationHistory {
  id: string;
  timestamp: Date;
  action: string;
  version: string;
}

const courtFormats: CourtFormat[] = [
  {
    id: 'supreme-court',
    name: 'Supreme Court of India',
    font: 'Times New Roman',
    fontSize: 14,
    lineSpacing: 2.0,
    margins: '1.5in 1in 1in 1in'
  },
  {
    id: 'delhi-high-court',
    name: 'Delhi High Court',
    font: 'Times New Roman',
    fontSize: 14,
    lineSpacing: 1.5,
    margins: '1in 1in 1in 1in'
  }
];

interface TranslationViewProps {
  onBack: () => void;
}

export function TranslationView({ onBack }: TranslationViewProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [selectedCourt, setSelectedCourt] = useState<CourtFormat | null>(null);
  const [customizeFormat, setCustomizeFormat] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [showMSWord, setShowMSWord] = useState(false);
  const [showMySpaceBrowser, setShowMySpaceBrowser] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);

  // Jubee AI Chat states
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    text: string;
    isAI: boolean;
    timestamp: Date;
  }>>([]);

  const translationHistory: TranslationHistory[] = [
    { id: '1', timestamp: new Date(Date.now() - 3600000), action: 'Initial Jubee Bhasha', version: 'v1.0' },
    { id: '2', timestamp: new Date(Date.now() - 1800000), action: 'Manual Edit in MS Word', version: 'v1.1' },
    { id: '3', timestamp: new Date(Date.now() - 900000), action: 'Court Format Applied', version: 'v1.2' }
  ];

  // Synchronized scrolling
  const handleScroll = (source: 'left' | 'right') => {
    if (source === 'left' && leftPaneRef.current && rightPaneRef.current) {
      rightPaneRef.current.scrollTop = leftPaneRef.current.scrollTop;
    } else if (source === 'right' && leftPaneRef.current && rightPaneRef.current) {
      leftPaneRef.current.scrollTop = rightPaneRef.current.scrollTop;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0]; // Only take first file
      const newFile: UploadedFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        detectedLanguage: 'Hindi', // Mock detection
        type: file.name.endsWith('.pdf') ? 'pdf' : 'docx'
      };
      setUploadedFile(newFile);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setSelectedCourt(null);
    setTargetLanguage('English');
  };

  const handleStartTranslation = () => {
    if (selectedCourt && targetLanguage && uploadedFile) {
      setCurrentStep('process');
      setIsProcessing(true);
      setProcessingProgress(0);

      // Simulate processing
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            // Mock translated content
            setOriginalContent(`यह एक नमूना दस्तावेज़ है जिसमें कानूनी पाठ शामिल है।\n\nभारत के माननीय सर्वोच्च न्यायालय के समक्ष\n\nसिविल अपील संख्या 12345/2024\n\nअपीलकर्ता: राज कुमार बनाम\nप्रतिवादी: सुनील शर्मा\n\nमाननीय न्यायालय,\n\nयह अपील धारा 100 सीपीसी के तहत दायर की गई है। अपीलकर्ता ने निम्नलिखित आधारों पर अपील की है:\n\n1. विद्वान ट्रायल कोर्ट ने साक्ष्य की सराहना करने में त्रुटि की है।\n2. निर्णय कानून के विपरीत है और तथ्यों के विपरीत है।\n3. प्रतिवादी द्वारा प्रस्तुत दस्तावेज़ प्रामाणिक नहीं हैं।\n\nइसलिए, यह प्रार्थना की जाती है कि अपील स्वीकार की जाए।`);
            setTranslatedContent(`This is a sample document containing legal text.\n\nBEFORE THE HON'BLE SUPREME COURT OF INDIA\n\nCIVIL APPEAL NO. 12345 OF 2024\n\nAPPELLANT: Raj Kumar Versus\nRESPONDENT: Sunil Sharma\n\nHON'BLE COURT,\n\nThis appeal has been filed under Section 100 CPC. The appellant has preferred this appeal on the following grounds:\n\n1. The learned Trial Court has erred in appreciating the evidence on record.\n2. The judgment is contrary to law and against the facts of the case.\n3. The documents produced by the respondent are not authentic.\n\nIt is therefore prayed that the appeal may be allowed.`);
            setTimeout(() => {
              setCurrentStep('review');
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleOpenMSWord = () => {
    setShowMSWord(true);
  };

  const handleMSWordContentChange = (newContent: string) => {
    setTranslatedContent(newContent);
  };

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleDownloadWord = () => {
    console.log('Downloading as Word document...');
  };

  const handleExportPDF = () => {
    console.log('Exporting as PDF...');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: chatInput,
      isAI: false,
      timestamp: new Date()
    }]);

    setChatInput('');
    setIsAITyping(true);

    // Simulate AI response about translation
    setTimeout(() => {
      setIsAITyping(false);
      const aiResponse = "I can help you with translation-related questions, explain legal terms, or assist with document formatting. What would you like to know about your translated document?";

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isAI: true,
        timestamp: new Date()
      }]);
    }, 1500);
  };

  const renderHeader = () => {
    return (
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Languages className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Jubee Bhasha</h1>
        </div>

        {/* Action buttons - only show in review step */}
        {currentStep === 'review' && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistorySidebar(!showHistorySidebar)}
              className="h-9 w-9 p-0 bg-black dark:bg-black border-border/60 hover:border-primary/50 hover:bg-black"
            >
              <History className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleOpenMSWord}
              size="sm"
              className="h-9 bg-black dark:bg-black border-border/60 hover:border-primary/50 hover:bg-black"
            >
              <FileDown className="w-4 h-4 mr-1" />
              Open in MS Word
            </Button>
            <div className="relative group">
              <Button
                onClick={handleSave}
                size="sm"
                className="h-9 bg-primary hover:bg-primary/90 text-white"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>

              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 space-y-1">
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors text-left"
                  >
                    <Save className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Save to My Space</p>
                      <p className="text-xs text-muted-foreground">Organize in case folders</p>
                    </div>
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors text-left"
                  >
                    <FileDown className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Download as Word</p>
                      <p className="text-xs text-muted-foreground">Direct .docx download</p>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-lg transition-colors text-left"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Export as PDF</p>
                      <p className="text-xs text-muted-foreground">Court-ready format</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUploadAndConfigStep = () => {
    return (
      <div className="flex-1 bg-[#F9F9F9] dark:bg-background p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Workspace Quote */}
          <WorkspaceQuote quotes={WORKSPACE_QUOTES.translation} />

          {/* Upload Section */}
          <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Upload Document</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your document for AI-powered translation with court-compliant formatting
              </p>
            </div>

            {/* Upload Options - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Minimal Upload Area */}
              <div
                onClick={() => !uploadedFile && fileInputRef.current?.click()}
                className={`group relative border-2 rounded-xl p-3 transition-all duration-300 ${uploadedFile
                    ? 'cursor-not-allowed bg-muted/30 border-border/40'
                    : 'cursor-pointer bg-card border-border hover:border-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={!!uploadedFile}
                />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Upload Document</p>
                    <p className="text-xs text-muted-foreground">PDF or DOCX file</p>
                  </div>
                </div>
              </div>

              {/* Add from My Space */}
              <Button
                variant="ghost"
                onClick={() => !uploadedFile && setShowMySpaceBrowser(true)}
                disabled={!!uploadedFile}
                className="group relative border-2 !border-border rounded-xl p-3 transition-all duration-300 cursor-pointer hover:!border-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 h-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:!border-border disabled:hover:shadow-none bg-transparent justify-start"
              >
                <div className="flex items-center gap-3 justify-start w-full">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <FolderOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground text-sm">My Space</p>
                    <p className="text-xs text-muted-foreground">Browse saved files</p>
                  </div>
                </div>
              </Button>
            </div>

            {/* Uploaded File Display */}
            {uploadedFile && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="text-sm font-bold text-foreground">Uploaded File</h4>
                <div className="p-3 bg-black dark:bg-black rounded-xl border-2 border-primary/40 shadow-[0_0_30px_rgba(30,58,138,0.5)] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{uploadedFile.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400 font-medium">{uploadedFile.size}</span>
                          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-md font-bold shadow-sm">
                            {uploadedFile.detectedLanguage}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg transition-all duration-200 group flex-shrink-0 hover:shadow-md"
                    >
                      <X className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Configuration Options - Always visible, disabled when no file */}
          <div className={`bg-card border border-border/50 rounded-2xl p-8 shadow-sm space-y-6 transition-opacity ${!uploadedFile ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Helper Text - Only visible when no file uploaded */}
            {!uploadedFile && (
              <div className="pb-4 border-b border-border/50">
                <p className="text-sm text-muted-foreground">
                  Upload a document before customizing these options
                </p>
              </div>
            )}

            {/* Target Language */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">Target Language</label>
              <div className="relative">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  disabled={!uploadedFile}
                  className="w-full h-12 px-4 pr-10 bg-background border border-border rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Bengali">Bengali</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Court Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">Select Court</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courtFormats.map((court) => (
                  <button
                    key={court.id}
                    onClick={() => uploadedFile && setSelectedCourt(court)}
                    disabled={!uploadedFile}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-300 disabled:cursor-not-allowed ${selectedCourt?.id === court.id
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-bold text-sm text-foreground">{court.name}</p>
                      {selectedCourt?.id === court.id && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Font:</span> {court.font}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Size:</span> {court.fontSize}pt
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Spacing:</span> {court.lineSpacing}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Automatic Format Info */}
            {selectedCourt && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your document will be automatically formatted according to {selectedCourt.name} standards with {selectedCourt.font} font, {selectedCourt.fontSize}pt size, and {selectedCourt.lineSpacing} line spacing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Options Toggle */}
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => uploadedFile && setCustomizeFormat(!customizeFormat)}
                disabled={!uploadedFile}
                className="flex items-center justify-between w-full p-4 hover:bg-accent rounded-xl transition-colors disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-foreground">Customize Formatting</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${customizeFormat ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {customizeFormat && (
                <div className="mt-4 p-4 bg-[#F9F9F9] dark:bg-card/50 rounded-xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-muted-foreground">
                        Font Family
                      </label>
                      <Input
                        defaultValue={selectedCourt?.font || 'Times New Roman'}
                        className="border-2 border-border focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-muted-foreground">
                        Font Size (pt)
                      </label>
                      <Input
                        type="number"
                        defaultValue={selectedCourt?.fontSize || 14}
                        className="border-2 border-border focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-muted-foreground">
                        Line Spacing
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        defaultValue={selectedCourt?.lineSpacing || 2.0}
                        className="border-2 border-border focus:border-primary"
                      />\n                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-muted-foreground">
                        Margins
                      </label>
                      <Input
                        defaultValue={selectedCourt?.margins || '1in 1in 1in 1in'}
                        className="border-2 border-border focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Start Translation Button */}
            <Button
              onClick={handleStartTranslation}
              disabled={!selectedCourt || !targetLanguage || !uploadedFile}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
            >
              Start Translation
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderProcessStep = () => {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F9F9F9] dark:bg-background p-8">
        <div className="w-full max-w-xl">
          <div className="bg-card border border-border/50 rounded-2xl p-12 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Languages className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Processing Translation</h2>
            </div>

            {/* Weightless Progress Bar */}
            <div className="space-y-3">
              <div className="relative h-2 bg-border/30 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out shadow-lg shadow-primary/30"
                  style={{ width: `${processingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {processingProgress < 30 && 'Analyzing document structure...'}
                  {processingProgress >= 30 && processingProgress < 60 && 'Translating content...'}
                  {processingProgress >= 60 && processingProgress < 90 && 'Applying court formatting...'}
                  {processingProgress >= 90 && 'Finalizing document...'}
                </span>
                <span className="text-xs font-bold text-primary">{processingProgress}%</span>
              </div>
            </div>

            {/* Processing Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[#F9F9F9] dark:bg-card/50 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">File</p>
                <p className="text-lg font-bold text-foreground">1</p>
              </div>
              <div className="text-center p-3 bg-[#F9F9F9] dark:bg-card/50 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Target</p>
                <p className="text-lg font-bold text-foreground">{targetLanguage}</p>
              </div>
              <div className="text-center p-3 bg-[#F9F9F9] dark:bg-card/50 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Court</p>
                <p className="text-lg font-bold text-foreground text-xs">
                  {selectedCourt?.name.split(' ')[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewStep = () => {
    return (
      <div className="flex-1 flex flex-col bg-[#F9F9F9] dark:bg-background">
        {/* Split-Screen Workspace */}
        <div className="flex-1 flex relative">
          {/* Left Pane - Translated (Read-only Preview) */}
          <div className="flex-1 flex flex-col border-r border-border">
            <div className="bg-card border-b border-border px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">Translated Document</h3>
                  <span className="text-xs text-muted-foreground">({targetLanguage})</span>
                </div>
                <span className="text-xs text-muted-foreground">Read-only (edit in MS Word)</span>
              </div>
            </div>
            <div
              ref={leftPaneRef}
              onScroll={() => handleScroll('left')}
              className="flex-1 overflow-y-auto bg-white dark:bg-background"
            >
              <div
                className="max-w-3xl mx-auto min-h-full p-8 bg-black shadow-lg border border-border/50"
                style={{
                  fontFamily: selectedCourt?.font || 'Times New Roman',
                  fontSize: `${selectedCourt?.fontSize || 14}pt`,
                  lineHeight: selectedCourt?.lineSpacing || 2.0
                }}
              >
                {translatedContent.split('\n').map((line, index) => (
                  <p key={index} className="mb-4">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pane - Original (Read-only) */}
          <div className="flex-1 flex flex-col">
            <div className="bg-card border-b border-border px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">Original Document</h3>
                  <span className="text-xs text-muted-foreground">
                    ({uploadedFile?.detectedLanguage || 'Hindi'})
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Read-only</span>
              </div>
            </div>
            <div
              ref={rightPaneRef}
              onScroll={() => handleScroll('right')}
              className="flex-1 overflow-y-auto bg-[#F9F9F9] dark:bg-background/50"
            >
              <div
                className="max-w-3xl mx-auto min-h-full p-8 bg-white dark:bg-card shadow-lg border border-border/50 opacity-90"
                style={{
                  fontFamily: 'Noto Sans Devanagari, sans-serif',
                  fontSize: '14pt',
                  lineHeight: 2.0
                }}
              >
                {originalContent.split('\n').map((line, index) => (
                  <p key={index} className="mb-4">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* History Sidebar */}
          {showHistorySidebar && (
            <div className="w-80 border-l border-border bg-card flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Translation History</h3>
                </div>
                <button
                  onClick={() => setShowHistorySidebar(false)}
                  className="p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {translationHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#F9F9F9] dark:bg-card/50 border border-border/50 rounded-xl hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-bold text-foreground">{item.action}</p>
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-md font-medium">
                        {item.version}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {item.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Info Bar */}
        <div className="border-t border-border bg-card px-6 py-4">
          <div className="flex items-center justify-center max-w-7xl mx-auto">
            <p className="text-xs text-muted-foreground">
              Translation completed • 1 file processed
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      {renderHeader()}

      {/* Step Content */}
      {currentStep === 'upload' && renderUploadAndConfigStep()}
      {currentStep === 'process' && renderProcessStep()}
      {currentStep === 'review' && renderReviewStep()}

      {/* MS Word Window */}
      <MSWordWindow
        isOpen={showMSWord}
        onClose={() => setShowMSWord(false)}
        content={translatedContent}
        onContentChange={handleMSWordContentChange}
        fileName={`${uploadedFile?.name.replace(/\.[^/.]+$/, '') || 'Translation'}.docx`}
        courtFormat={selectedCourt ? {
          font: selectedCourt.font,
          fontSize: selectedCourt.fontSize,
          lineSpacing: selectedCourt.lineSpacing
        } : undefined}
      />

      {/* My Space Browser */}
      <MySpaceBrowserDialog
        isOpen={showMySpaceBrowser}
        onClose={() => setShowMySpaceBrowser(false)}
        onSelect={(files) => {
          if (files.length > 0) {
            const file = files[0]; // Only take first file
            const newFile: UploadedFile = {
              id: `myspace-${Date.now()}`,
              name: file.name,
              size: file.size,
              detectedLanguage: 'Hindi',
              type: file.type
            };
            setUploadedFile(newFile);
            setShowMySpaceBrowser(false);
          }
        }}
      />

      {/* Save Dialog */}
      {showSaveDialog && (
        <MySpaceSaveDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          defaultFileName={`JubeeBhasha_${uploadedFile?.name.replace(/\.[^/.]+$/, '') || 'Document'}`}
          fileType="Jubee Bhasha"
          onSave={(folder, filename, format) => {
            console.log('Saving to:', folder, filename, 'as', format);
            setShowSaveDialog(false);
          }}
        />
      )}

      {/* Jubee AI Chat - Only show on review step after translation */}
      {currentStep === 'review' && (
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
                Your translation assistant for document queries and formatting
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
                    Ask me about translation accuracy, legal terms, or document formatting
                  </p>
                  <div className="mt-6 space-y-2 w-full max-w-[280px]">
                    <button
                      onClick={() => setChatInput("Explain any legal terms in this document")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      Explain legal terms in the document
                    </button>
                    <button
                      onClick={() => setChatInput("Check if the formatting meets court standards")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      Verify court format compliance
                    </button>
                    <button
                      onClick={() => setChatInput("Suggest improvements to the translation")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      Suggest translation improvements
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
                  placeholder="Ask Jubee about translation..."
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

      {/* <JubeeFooter /> */}
    </div>
  );
}