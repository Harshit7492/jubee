import { useState, useRef } from 'react';
import { Upload, FileText, ChevronRight, Check, Settings, Download, Save, FolderOpen, FileDown, Type, Clock, ChevronLeft, ChevronDown, X, History, Search, Send, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { MySpaceSaveDialog } from '@/app/components/MySpaceSaveDialog';
import { MSWordWindow } from '@/app/components/MSWordWindow';
import { MySpaceBrowserDialog } from '@/app/components/MySpaceBrowserDialog';
import jubeeLogo from '@/assets/jubee-logo.png';

type Step = 'upload' | 'process' | 'review';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf';
}

interface CourtFormat {
  id: string;
  name: string;
  font: string;
  fontSize: number;
  lineSpacing: number;
  margins: string;
}

interface FormattingHistory {
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

const paperSizes = [
  { id: 'a4', name: 'A4 (210 x 297mm)', value: 'A4' },
  { id: 'legal', name: 'Legal/Green Paper (8.5 x 14in)', value: 'Legal' },
  { id: 'letter', name: 'Letter (8.5 x 11in)', value: 'Letter' }
];

const pageNumberPositions = [
  { id: 'top-center', name: 'Top Center' },
  { id: 'top-right', name: 'Top Right' },
  { id: 'bottom-center', name: 'Bottom Center' },
  { id: 'bottom-right', name: 'Bottom Right' },
  { id: 'none', name: 'No Numbering' }
];

const indentationTypes = [
  { id: 'none', name: 'None' },
  { id: 'first-line', name: 'First Line' },
  { id: 'hanging', name: 'Hanging' }
];

interface TypingToolProps {
  onBack: () => void;
}

export function TypingTool({ onBack }: TypingToolProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<CourtFormat | null>(null);
  const [customizeFormat, setCustomizeFormat] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [showMSWord, setShowMSWord] = useState(false);
  const [showMySpaceBrowser, setShowMySpaceBrowser] = useState(false);
  const [formattedContent, setFormattedContent] = useState('');
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

  // Custom formatting options
  const [customFont, setCustomFont] = useState('Times New Roman');
  const [customFontSize, setCustomFontSize] = useState(14);
  const [customLineSpacing, setCustomLineSpacing] = useState(1.5);
  const [customMarginTop, setCustomMarginTop] = useState(1);
  const [customMarginBottom, setCustomMarginBottom] = useState(1);
  const [customMarginLeft, setCustomMarginLeft] = useState(1);
  const [customMarginRight, setCustomMarginRight] = useState(1);
  const [customPaperSize, setCustomPaperSize] = useState('A4');
  const [customPageNumbering, setCustomPageNumbering] = useState('bottom-center');
  const [customIndentation, setCustomIndentation] = useState('none');
  const [customIndentValue, setCustomIndentValue] = useState(0.5);
  const [enableHeader, setEnableHeader] = useState(false);
  const [enableFooter, setEnableFooter] = useState(false);

  const formattingHistory: FormattingHistory[] = [
    { id: '1', timestamp: new Date(Date.now() - 3600000), action: 'Initial Formatting', version: 'v1.0' },
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
      const file = files[0];
      // Only allow PDF files
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please upload a PDF file only');
        return;
      }
      const newFile: UploadedFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: 'pdf'
      };
      setUploadedFile(newFile);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setSelectedCourt(null);
  };

  const handleStartFormatting = () => {
    if (uploadedFile) {
      setCurrentStep('process');
      setIsProcessing(true);
      setProcessingProgress(0);

      // Simulate processing
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            // Mock original and formatted content
            setOriginalContent(`IN THE SUPREME COURT OF INDIA\n\nCIVIL APPEAL NO. 12345 OF 2024\n\nBETWEEN:\n\nRAJ KUMAR\nSON OF SHRI RAM KUMAR\nRESIDENT OF NEW DELHI\n...APPELLANT\n\nVERSUS\n\nSUNIL SHARMA\nSON OF SHRI MOHAN SHARMA\nRESIDENT OF MUMBAI\n...RESPONDENT\n\nJUDGMENT\n\nThis appeal has been filed under Section 100 of the Code of Civil Procedure, 1908, challenging the judgment and decree dated 15th January, 2024 passed by the High Court of Delhi.\n\nThe brief facts of the case are as follows: The appellant filed a suit for recovery of Rs. 50,00,000/- against the respondent on account of breach of contract. The Trial Court dismissed the suit holding that there was no valid contract between the parties. The appellant filed an appeal before the High Court which was also dismissed.\n\nThe learned counsel for the appellant has submitted that both the courts below have erred in not appreciating the documentary evidence on record which clearly establishes the existence of a valid contract between the parties.`);
            setFormattedContent(`IN THE SUPREME COURT OF INDIA\n\nCIVIL APPEAL NO. 12345 OF 2024\n\nBETWEEN:\n\nRAJ KUMAR\nSON OF SHRI RAM KUMAR\nRESIDENT OF NEW DELHI\n...APPELLANT\n\nVERSUS\n\nSUNIL SHARMA\nSON OF SHRI MOHAN SHARMA\nRESIDENT OF MUMBAI\n...RESPONDENT\n\nJUDGMENT\n\nThis appeal has been filed under Section 100 of the Code of Civil Procedure, 1908, challenging the judgment and decree dated 15th January, 2024 passed by the High Court of Delhi.\n\nThe brief facts of the case are as follows: The appellant filed a suit for recovery of Rs. 50,00,000/- against the respondent on account of breach of contract. The Trial Court dismissed the suit holding that there was no valid contract between the parties. The appellant filed an appeal before the High Court which was also dismissed.\n\nThe learned counsel for the appellant has submitted that both the courts below have erred in not appreciating the documentary evidence on record which clearly establishes the existence of a valid contract between the parties.`);
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
    setFormattedContent(newContent);
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

  const handleSendChatMessage = () => {
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

    // Simulate AI response
    setTimeout(() => {
      setIsAITyping(false);
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I can help you with formatting questions. Would you like me to suggest improvements to the document structure or explain the court-specific formatting rules applied?",
        isAI: true,
        timestamp: new Date()
      }]);
    }, 1500);
  };

  const renderHeader = () => {
    return (
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
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
                <Type className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Steno</h1>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUploadAndConfigStep = () => {
    return (
      <div className="flex-1 bg-[#F9F9F9] dark:bg-background p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Options - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Upload PDF Document */}
            <div
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
              className={`group relative border-2 rounded-xl p-6 transition-all duration-300 ${uploadedFile
                  ? 'cursor-not-allowed bg-muted/30 border-border/40'
                  : 'cursor-pointer bg-card border-border hover:border-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={!!uploadedFile}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground text-sm mb-1">Upload PDF Document</p>
                  <p className="text-xs text-muted-foreground">Strictly PDF format only</p>
                </div>
              </div>
            </div>

            {/* Add from My Space */}
            <Button
              variant="ghost"
              onClick={() => !uploadedFile && setShowMySpaceBrowser(true)}
              disabled={!!uploadedFile}
              className="group relative border-2 !border-border rounded-xl p-6 transition-all duration-300 cursor-pointer hover:!border-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 h-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:!border-border disabled:hover:shadow-none bg-transparent"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground text-sm mb-1">My Space</p>
                  <p className="text-xs text-muted-foreground">Browse saved files</p>
                </div>
              </div>
            </Button>
          </div>

          {/* Uploaded File Display */}
          {uploadedFile && (
            <div className="p-4 bg-card border border-border/50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{uploadedFile.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{uploadedFile.size}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">
                        PDF
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors group flex-shrink-0"
                >
                  <X className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
                </button>
              </div>
            </div>
          )}

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

            {/* Court Selection - Always visible, two courts side by side */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">
                Select Court <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
              </label>

              {/* Court Selection Cards - Always Displayed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courtFormats.map((court) => (
                  <button
                    key={court.id}
                    onClick={() => uploadedFile && setSelectedCourt(selectedCourt?.id === court.id ? null : court)}
                    disabled={!uploadedFile}
                    className={`p-4 border-2 rounded-xl text-left transition-all duration-300 disabled:cursor-not-allowed ${selectedCourt?.id === court.id
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                        : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
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

              {/* Instructional Note */}
              <div className="p-3 bg-accent/50 border border-border/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 <span className="font-medium">Tip:</span> Selecting the court will allow us to change the document into the desired court-prescribed format.
                </p>
              </div>
            </div>

            {/* Customization Panel */}
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
                <div className="mt-4 space-y-6">
                  {/* Typography Section */}
                  <div className="p-4 bg-[#F9F9F9] dark:bg-card/50 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Typography</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Font Type
                        </label>
                        <select
                          value={customFont}
                          onChange={(e) => setCustomFont(e.target.value)}
                          className="w-full h-10 px-3 bg-background border-2 border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Arial">Arial</option>
                          <option value="Calibri">Calibri</option>
                          <option value="Garamond">Garamond</option>
                          <option value="Georgia">Georgia</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Font Size (pt)
                        </label>
                        <Input
                          type="number"
                          value={customFontSize}
                          onChange={(e) => setCustomFontSize(Number(e.target.value))}
                          min="8"
                          max="24"
                          className="border-2 border-border focus:border-primary h-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Spacing & Indent Section */}
                  <div className="p-4 bg-[#F9F9F9] dark:bg-card/50 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Spacing & Indentation</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Line Spacing
                        </label>
                        <select
                          value={customLineSpacing}
                          onChange={(e) => setCustomLineSpacing(Number(e.target.value))}
                          className="w-full h-10 px-3 bg-background border-2 border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="1">1.0</option>
                          <option value="1.15">1.15</option>
                          <option value="1.5">1.5</option>
                          <option value="2">2.0</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Paragraph Indentation
                        </label>
                        <select
                          value={customIndentation}
                          onChange={(e) => setCustomIndentation(e.target.value)}
                          className="w-full h-10 px-3 bg-background border-2 border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                        >
                          {indentationTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {customIndentation !== 'none' && (
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Indentation Value (inches)
                        </label>
                        <Input
                          type="number"
                          value={customIndentValue}
                          onChange={(e) => setCustomIndentValue(Number(e.target.value))}
                          min="0"
                          max="2"
                          step="0.1"
                          className="border-2 border-border focus:border-primary h-10"
                        />
                      </div>
                    )}
                  </div>

                  {/* Page Setup Section - REMOVED */}

                  {/* Structural Section - REMOVED */}
                </div>
              )}
            </div>

            {/* Start Formatting Button */}
            <Button
              onClick={handleStartFormatting}
              disabled={!uploadedFile}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
            >
              Apply Formatting
              <ChevronRight className="w-4 h-4 ml-2" />
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
                <Type className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Processing Document</h2>
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
                  {processingProgress >= 30 && processingProgress < 60 && 'Applying formatting rules...'}
                  {processingProgress >= 60 && processingProgress < 90 && 'Optimizing layout...'}
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
                <p className="text-xs text-muted-foreground mb-1">Format</p>
                <p className="text-lg font-bold text-foreground">
                  {selectedCourt ? 'Court' : 'Custom'}
                </p>
              </div>
              <div className="text-center p-3 bg-[#F9F9F9] dark:bg-card/50 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <p className="text-lg font-bold text-foreground">PDF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewStep = () => {
    const activeFont = selectedCourt?.font || customFont;
    const activeFontSize = selectedCourt?.fontSize || customFontSize;
    const activeLineSpacing = selectedCourt?.lineSpacing || customLineSpacing;

    return (
      <div className="flex-1 flex flex-col bg-[#F9F9F9] dark:bg-background">
        {/* Top Action Bar */}
        <div className="border-b border-border bg-card px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Formatting Complete</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className="h-9"
              >
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button
                onClick={handleOpenMSWord}
                size="sm"
                className="h-9 bg-primary hover:bg-primary/90"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Open in MS Word
              </Button>
              <div className="relative group">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="h-9 bg-primary hover:bg-primary/90 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                  <ChevronDown className="w-4 h-4 ml-2" />
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
          </div>
        </div>

        {/* Split-Screen Workspace */}
        <div className="flex-1 flex relative">
          {/* Left Pane - Formatted Document (Editable in MS Word) */}
          <div className="flex-1 flex flex-col border-r border-border">
            <div className="bg-card border-b border-border px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <h3 className="text-sm font-bold text-foreground">New Document</h3>
                  <span className="text-xs text-muted-foreground">(Formatted)</span>
                </div>
                <span className="text-xs text-muted-foreground">Edit in MS Word</span>
              </div>
            </div>
            <div
              ref={leftPaneRef}
              onScroll={() => handleScroll('left')}
              className="flex-1 overflow-y-auto p-8 bg-[#F9F9F9] dark:bg-background"
            >
              <div
                className="max-w-3xl mx-auto min-h-full p-12 bg-white dark:bg-card shadow-lg border-[0.5px] border-border/50"
                style={{
                  fontFamily: activeFont,
                  fontSize: `${activeFontSize}pt`,
                  lineHeight: activeLineSpacing
                }}
              >
                {formattedContent.split('\n').map((line, index) => (
                  <p key={index} className="mb-4">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pane - Original PDF (Read-only) */}
          <div className="flex-1 flex flex-col">
            <div className="bg-card border-b border-border px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <h3 className="text-sm font-bold text-foreground">Old Document</h3>
                  <span className="text-xs text-muted-foreground">(Original PDF)</span>
                </div>
                <span className="text-xs text-muted-foreground">Read-only</span>
              </div>
            </div>
            <div
              ref={rightPaneRef}
              onScroll={() => handleScroll('right')}
              className="flex-1 overflow-y-auto p-8 bg-[#F9F9F9] dark:bg-background/50"
            >
              <div
                className="max-w-3xl mx-auto min-h-full p-12 bg-white dark:bg-card shadow-lg border-[0.5px] border-border/50 opacity-90"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '12pt',
                  lineHeight: 1.3
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
                  <h3 className="font-bold text-foreground">Formatting History</h3>
                </div>
                <button
                  onClick={() => setShowHistorySidebar(false)}
                  className="p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {formattingHistory.map((item) => (
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

          {/* AI Chat Panel - Slides from bottom right */}
          {showAIChat && (
            <div className="fixed top-0 right-0 h-full w-[400px] bg-background border-l-[0.5px] border-border shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col">
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
                  Ask me about formatting, court rules, or document structure
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
                      Ask me about formatting rules, court standards, or document improvements
                    </p>
                    <div className="mt-6 space-y-2 w-full max-w-[280px]">
                      <button
                        onClick={() => setChatInput("Explain the formatting applied")}
                        className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                      >
                        Explain the formatting applied
                      </button>
                      <button
                        onClick={() => setChatInput("What are the court requirements?")}
                        className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                      >
                        What are the court requirements?
                      </button>
                      <button
                        onClick={() => setChatInput("Suggest document improvements")}
                        className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                      >
                        Suggest document improvements
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
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChatMessage()}
                    placeholder="Ask about formatting..."
                    className="w-full h-11 pl-4 pr-12 text-sm bg-muted/50 border-[0.5px] border-border focus:border-primary rounded-xl text-foreground"
                  />
                  <Button
                    onClick={handleSendChatMessage}
                    disabled={!chatInput.trim()}
                    size="icon"
                    className="absolute right-1.5 top-1.5 h-8 w-8 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Chat Toggle Button - Only show in review step */}
          {currentStep === 'review' && (
            <button
              onClick={() => setShowAIChat(!showAIChat)}
              className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group ${showAIChat ? 'scale-0' : 'scale-100'
                }`}
            >
              <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            </button>
          )}
        </div>

        {/* Bottom Info Bar */}
        <div className="border-t border-border bg-card px-6 py-4">
          <div className="flex items-center justify-center max-w-7xl mx-auto">
            <p className="text-xs text-muted-foreground">
              Formatting completed • All versions saved for future reference
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
        content={formattedContent}
        onContentChange={handleMSWordContentChange}
        fileName={`${uploadedFile?.name.replace(/\.pdf$/, '') || 'Formatted'}.docx`}
        courtFormat={selectedCourt ? {
          font: selectedCourt.font,
          fontSize: selectedCourt.fontSize,
          lineSpacing: selectedCourt.lineSpacing
        } : {
          font: customFont,
          fontSize: customFontSize,
          lineSpacing: customLineSpacing
        }}
      />

      {/* My Space Browser */}
      <MySpaceBrowserDialog
        isOpen={showMySpaceBrowser}
        onClose={() => setShowMySpaceBrowser(false)}
        onSelect={(files) => {
          if (files.length > 0) {
            const file = files[0];
            // Only allow PDF files
            if (file.type !== 'pdf') {
              alert('Please select a PDF file only');
              return;
            }
            const newFile: UploadedFile = {
              id: `myspace-${Date.now()}`,
              name: file.name,
              size: file.size,
              type: 'pdf'
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
          defaultFileName={`Formatted_${uploadedFile?.name.replace(/\.pdf$/, '') || 'Document'}`}
          fileType="Court Typing"
          onSave={(folder, filename) => {
            console.log('Saving to:', folder, filename);
            setShowSaveDialog(false);
          }}
        />
      )}
    </div>
  );
}