import { useState, useRef, useEffect } from 'react';
import { Send, Upload, Languages, ArrowLeft, User, FileText, X, Download, Save, Sparkles, Bot, Paperclip, FolderOpen, File, ChevronLeft, ChevronRight, CheckCircle, RotateCcw, Edit3, Type, AlignLeft, Scale, ChevronDown, MessageSquare, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ToolNavigation } from '@/app/components/research-tools/ToolNavigation';
import { MySpacePickerDialog } from '@/app/components/MySpacePickerDialog';
import { MySpaceSaveDialog } from '@/app/components/MySpaceSaveDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { toast } from 'sonner';
import jubeeLogo from '@/assets/jubee-logo.png';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  options?: Array<{ id: string; label: string; icon?: any; native?: string }>;
  uploadedFiles?: Array<{ id: string; name: string }>;
}

interface TranslationToolProps {
  onBack: () => void;
  activeTool?: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'psi' | 'cross-examiner';
  onToolChange?: (tool: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'psi' | 'cross-examiner', initialContent?: string) => void;
}

const INDIAN_LANGUAGES = [
  { id: 'hi', label: 'Hindi', native: 'हिंदी' },
  { id: 'mr', label: 'Marathi', native: 'मराठी' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { id: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { id: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { id: 'ur', label: 'Urdu', native: 'اردو' },
];

const SAMPLE_ORIGINAL = `LEGAL NOTICE

To,
Mr. Rajesh Kumar
123, MG Road, New Delhi - 110001

Under instructions from and on behalf of my client, Mr. Amit Sharma, I hereby serve you with the following legal notice:

1. That you have illegally occupied the property situated at Plot No. 456, Sector 15, Noida, which rightfully belongs to my client as per the registered sale deed dated 15th January 2020.

2. That despite repeated requests, you have failed to vacate the said premises and hand over peaceful possession to my client.

3. That your continued occupation is causing severe financial and mental distress to my client.

Therefore, you are hereby called upon to vacate the premises within 15 days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, at your cost and consequences.

Dated: 30th January 2026
Place: New Delhi

Yours faithfully,
Advocate Priya Mehta
Bar Council No. 12345`;

const SAMPLE_TRANSLATED = `कानूनी नोटिस

प्रति,
श्री राजेश कुमार
123, एमजी रोड, नई दिल्ली - 110001

मेरे मुवक्किल श्री अमित शर्मा की ओर से और उनके निर्देशानुसार, मैं आपको निम्नलिखित कानूनी नोटिस भेज रहा हूं:

1. कि आपने प्लॉट नंबर 456, सेक्टर 15, नोएडा में स्थित संपत्ति पर अवैध रूप से कब्जा कर लिया है, जो 15 जनवरी 2020 को पंजीकृत बिक्री विलेख के अनुसार मेरे मुवक्किल की है।

2. कि बार-बार अनुरोध के बावजूद, आप उक्त परिसर खाली करने और मेरे मुवक्किल को शांतिपूर्ण कब्जा देने में विफल रहे हैं।

3. कि आपका निरंतर कब्जा मेरे मुवक्किल को गंभीर वित्तीय और मानसिक परेशानी का कारण बन रहा है।

इसलिए, आपसे अनुरोध है कि इस नोटिस की प्राप्ति से 15 दिनों के भीतर परिसर खाली कर दें, ऐसा न करने पर मेरा मुवक्किल आपके खिलाफ उचित कानूनी कार्यवाही शुरू करने के लिए मजबूर होगा, जिसकी लागत और परिणाम आप पर होंगे।

दिनांक: 30 जनवरी 2026
स्थान: नई दिल्ली

भवदीय,
अधिवक्ता प्रिया मेहता
बार काउंसिल नं. 12345`;

export function TranslationTool({ onBack, activeTool, onToolChange }: TranslationToolProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [visibleChars, setVisibleChars] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMySpacePickerOpen, setIsMySpacePickerOpen] = useState(false);
  const [isMySpaceSaveDialogOpen, setIsMySpaceSaveDialogOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<'chat' | 'viewing'>('chat');
  const [isRightPaneCollapsed, setIsRightPaneCollapsed] = useState(false);
  const [isLeftPaneCollapsed, setIsLeftPaneCollapsed] = useState(false);
  const [isChatPaneCollapsed, setIsChatPaneCollapsed] = useState(true); // Start collapsed, show button to open
  const [translationData, setTranslationData] = useState<{
    originalDoc: string;
    translatedDoc: string;
    sourceLang: string;
    targetLang: string;
    fileName: string;
  } | null>(null);
  
  // Approval and editing states
  const [isApproved, setIsApproved] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false);
  const [editedTranslation, setEditedTranslation] = useState('');
  const [fontSize, setFontSize] = useState('12');
  const [lineHeight, setLineHeight] = useState('1.5');
  const [courtFormat, setCourtFormat] = useState('delhi-hc');
  const translatedDocRef = useRef<HTMLTextAreaElement>(null);

  const courtFormats = [
    { id: 'delhi-hc', name: 'Delhi High Court' },
    { id: 'supreme', name: 'Supreme Court of India' }
  ];

  // Initial greeting
  useEffect(() => {
    addAIMessage(
      "Hello! I'm your AI Translation Assistant. I'll help you translate legal documents with context-aware accuracy. Upload a document to get started.",
      [
        { id: 'upload', label: 'Upload Document', icon: Upload },
        { id: 'myspace', label: 'Upload from My Space', icon: FolderOpen }
      ]
    );
  }, []);

  // Typewriter effect for AI messages
  useEffect(() => {
    if (typingMessageId) {
      const message = messages.find((m) => m.id === typingMessageId);
      if (!message || message.type !== 'ai') {
        setTypingMessageId(null);
        return;
      }

      const fullText = message.content;
      const currentLength = visibleChars[typingMessageId] || 0;

      if (currentLength < fullText.length) {
        const timer = setTimeout(() => {
          setVisibleChars((prev) => ({
            ...prev,
            [typingMessageId]: currentLength + 1,
          }));
        }, 20);

        return () => clearTimeout(timer);
      } else {
        setTypingMessageId(null);
      }
    }
  }, [typingMessageId, visibleChars, messages]);

  const addAIMessage = (
    content: string,
    options?: Array<{ id: string; label: string; icon?: any; native?: string }>
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date(),
      options,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Start typewriter effect for this message
    setTypingMessageId(newMessage.id);
    setVisibleChars((prev) => ({
      ...prev,
      [newMessage.id]: 0,
    }));
  };

  const addUserMessage = (content: string, files?: Array<{ id: string; name: string }>) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      uploadedFiles: files,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const handleUploadChoice = (choice: string) => {
    if (choice === 'upload') {
      fileInputRef.current?.click();
    } else if (choice === 'myspace') {
      setIsMySpacePickerOpen(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentFileName(file.name);
      
      addUserMessage(`Uploaded document`, [{ id: Date.now().toString(), name: file.name }]);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          'Perfect! In which language would you like the translation? (Optimized for Indian Court standards)',
          INDIAN_LANGUAGES.map((lang) => ({ ...lang, icon: Languages }))
        );
      }, 800);
    }
  };

  const handleLanguageSelect = (languageId: string) => {
    const language = INDIAN_LANGUAGES.find((l) => l.id === languageId);
    if (!language) return;

    addUserMessage(`Translate to ${language.label} (${language.native})`);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addAIMessage('⚡ Processing Translation\n\nJubee is generating a legal-grade draft translation...\n\n✓ Document analyzed\n⟳ Translating with legal context\n○ Formatting for court standards');
      
      setTimeout(() => {
        addAIMessage('✅ Translation Complete\n\nYour document has been translated while preserving legal terminology and formatting. Opening translation view...');
        
        // Set translation data and switch to viewing stage
        setTimeout(() => {
          setTranslationData({
            originalDoc: SAMPLE_ORIGINAL,
            translatedDoc: SAMPLE_TRANSLATED,
            sourceLang: 'English',
            targetLang: language.label,
            fileName: currentFileName || 'Legal_Notice.pdf'
          });
          setCurrentStage('viewing');
          
          // Add contextual message for the viewing stage
          setTimeout(() => {
            addAIMessage(
              '🎯 Translation workspace is now active!\n\nYou can:\n• Review both documents side-by-side\n• Ask me questions about specific translations\n• Request terminology clarifications\n• Get suggestions for legal accuracy\n\nWhat would you like to know about this translation?'
            );
          }, 500);
        }, 1000);
      }, 2500);
    }, 800);
  };

  const handleSaveToMySpace = () => {
    setIsMySpaceSaveDialogOpen(true);
  };

  const handleSaveDocument = (folderPath: string, fileName: string) => {
    toast.success(`Translation saved to "${folderPath}" as "${fileName}"`);
    setIsMySpaceSaveDialogOpen(false);
  };

  const handleExport = (format: 'pdf' | 'docx') => {
    if (!translationData) return;
    toast.success(`Exporting as ${format.toUpperCase()}...`, {
      description: `File: ${translationData.fileName.replace(/\.[^/.]+$/, '')}.${format}`
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (currentStage === 'viewing') {
        addAIMessage('I can assist you with the translation. Would you like me to refine any specific section or adjust the terminology?');
      } else {
        addAIMessage('I can help you with that. Please upload your document using the attachment button, and I\'ll translate it for you.');
      }
    }, 800);
  };

  // Render Viewing Stage (Split View)
  if (currentStage === 'viewing' && translationData) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ToolNavigation
          currentTool="translation"
          onToolChange={onToolChange}
          onBack={onBack}
          activeTool={activeTool}
        />

        {/* Header with Actions */}
        <div className="bg-secondary/50 border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <Languages className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Translation Workspace</h3>
                <p className="text-sm text-muted-foreground">{translationData.sourceLang} → {translationData.targetLang} • {translationData.fileName}</p>
              </div>
              
              {/* Pane Toggle Controls */}
              <div className="flex items-center gap-1 ml-4 pl-4 border-l border-border">
                <Button
                  onClick={() => setIsLeftPaneCollapsed(!isLeftPaneCollapsed)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-accent"
                  title={isLeftPaneCollapsed ? "Show Translated Document" : "Hide Translated Document"}
                >
                  <PanelLeftClose className={`w-4 h-4 transition-all ${isLeftPaneCollapsed ? 'text-muted-foreground' : 'text-primary'}`} />
                </Button>
                <Button
                  onClick={() => setIsRightPaneCollapsed(!isRightPaneCollapsed)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-accent"
                  title={isRightPaneCollapsed ? "Show Original Document" : "Hide Original Document"}
                >
                  <FileText className={`w-4 h-4 transition-all ${isRightPaneCollapsed ? 'text-muted-foreground' : 'text-primary'}`} />
                </Button>
                <Button
                  onClick={() => setIsChatPaneCollapsed(!isChatPaneCollapsed)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-accent"
                  title={isChatPaneCollapsed ? "Show AI Chat" : "Hide AI Chat"}
                >
                  <MessageSquare className={`w-4 h-4 transition-all ${isChatPaneCollapsed ? 'text-muted-foreground' : 'text-primary'}`} />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">{!isApproved ? (
                // Before Approval: Show Approve and Start Again buttons
                <>
                  <Button
                    onClick={() => setIsApproved(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStage('chat');
                      setIsApproved(false);
                      setIsEdited(false);
                      toast.info('Starting new translation...');
                    }}
                    variant="outline"
                    size="sm"
                    className="font-semibold border-border hover:bg-accent gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Start Again
                  </Button>
                </>
              ) : (
                // After Approval: Show Format & Edit, Save, and Export buttons
                <>
                  <Button
                    onClick={() => setIsFormatDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="font-semibold border-border hover:bg-accent gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Format & Edit
                  </Button>
                  <Button
                    onClick={handleSaveToMySpace}
                    variant="outline"
                    size="sm"
                    className="font-semibold border-border hover:bg-accent gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save to My Space
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-semibold border-border hover:bg-accent gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Export
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleExport('pdf')}
                        className="cursor-pointer font-semibold"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Save as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport('docx')}
                        className="cursor-pointer font-semibold"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Save as DOC
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Format & Edit Dialog */}
        {isFormatDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-border">
              {/* Dialog Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Format & Edit Translation</h3>
                  <p className="text-sm text-muted-foreground">Customize court format and text styling</p>
                </div>
                <Button
                  onClick={() => setIsFormatDialogOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Dialog Content */}
              <div className="p-6 space-y-6">
                {/* Court Format Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Scale className="w-4 h-4 text-primary" />
                    Court Format
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {courtFormats.map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setCourtFormat(format.id)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${ 
                          courtFormat === format.id
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border bg-card text-foreground hover:border-primary/50'
                        }`}
                      >
                        {format.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" />
                    Font Size
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span>{fontSize}pt</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full" align="start">
                      {['10', '11', '12', '13', '14', '16', '18'].map((size) => (
                        <DropdownMenuItem key={size} onClick={() => setFontSize(size)}>
                          {size}pt
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Line Height */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-primary" />
                    Line Height
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span>{lineHeight}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full" align="start">
                      {['1.0', '1.15', '1.5', '1.75', '2.0'].map((height) => (
                        <DropdownMenuItem key={height} onClick={() => setLineHeight(height)}>
                          {height}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="px-6 py-4 border-t border-border flex gap-2">
                <Button
                  onClick={() => setIsFormatDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsFormatDialogOpen(false);
                    setEditedTranslation(translationData.translatedDoc);
                    setIsEdited(true);
                    toast.success('Format applied! You can now edit the document.');
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Apply & Edit
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Pane: Translated Document */}
          {!isLeftPaneCollapsed && (
            <div className={`${!isRightPaneCollapsed ? 'w-1/2' : 'flex-1'} flex flex-col overflow-hidden bg-muted/30 border-r border-border/50`}>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-primary/5 dark:bg-primary/10 shadow-lg rounded-xl p-8 border border-primary/20 backdrop-blur-sm">
                    <div className="mb-4 pb-3 border-b border-primary/30">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Translated Document ({translationData.targetLang})
                      </h4>
                    </div>
                    {isEdited ? (
                      <textarea
                        ref={translatedDocRef}
                        value={editedTranslation}
                        onChange={(e) => setEditedTranslation(e.target.value)}
                        className="w-full min-h-[600px] text-black dark:text-foreground whitespace-pre-wrap font-serif leading-relaxed text-sm bg-transparent border-none focus:outline-none resize-none"
                        style={{
                          fontSize: `${fontSize}pt`,
                          lineHeight: lineHeight
                        }}
                      />
                    ) : (
                      <div 
                        className="text-black dark:text-foreground whitespace-pre-wrap font-serif leading-relaxed text-sm"
                        style={{
                          fontSize: `${fontSize}pt`,
                          lineHeight: lineHeight
                        }}
                      >
                        {translationData.translatedDoc}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Center Pane: Original Document */}
          {!isRightPaneCollapsed && (
            <div className={`${!isLeftPaneCollapsed ? 'w-1/2' : 'flex-1'} flex flex-col overflow-hidden bg-muted/30`}>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-card shadow-lg rounded-xl p-8 border border-border/50 backdrop-blur-sm">
                    <div className="mb-4 pb-3 border-b border-border">
                      <h4 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Original Document ({translationData.sourceLang})
                      </h4>
                    </div>
                    <div className="text-black dark:text-foreground whitespace-pre-wrap font-serif leading-relaxed text-sm">
                      {translationData.originalDoc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floating AI Chat Panel - Slides from Right */}
          <div
            className={`absolute top-0 right-0 h-full w-[400px] bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
              isChatPaneCollapsed ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            {/* Chat Header */}
            <div className="border-b border-border/50 p-4 bg-primary/5 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center overflow-hidden">
                  <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Jubee</h4>
                  <p className="text-xs text-muted-foreground">Ask about translation</p>
                </div>
              </div>
              <Button
                onClick={() => setIsChatPaneCollapsed(true)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-accent"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'ai' && (
                      <div className="w-7 h-7 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-xl px-3 py-2 ${ 
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-card/50 border border-border/50 text-foreground backdrop-blur-sm'
                      }`}
                    >
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">
                        {message.type === 'ai'
                          ? message.content.slice(0, visibleChars[message.id] || message.content.length)
                          : message.content}
                      </p>

                      {/* Show uploaded files */}
                      {message.uploadedFiles && message.uploadedFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.uploadedFiles.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center gap-1.5 text-xs bg-primary-foreground/10 rounded px-2 py-1"
                            >
                              <File className="w-3 h-3" />
                              <span className="truncate">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.type === 'user' && (
                      <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-xl px-3 py-2 backdrop-blur-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 p-3 bg-secondary/10 backdrop-blur-sm">
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask about the translation..."
                  className="w-full h-10 pl-3 pr-11 text-sm bg-card/50 border border-border/50 focus:border-primary rounded-xl text-foreground backdrop-blur-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Floating Chat Bubble Button - Always visible when chat is closed */}
          {isChatPaneCollapsed && (
            <button
              onClick={() => setIsChatPaneCollapsed(false)}
              className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-50 group"
              title="Open AI Chat"
            >
              <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render Chat Stage
  return (
    <div className="flex flex-col h-screen bg-background">
      <ToolNavigation
        currentTool="translation"
        onToolChange={onToolChange}
        onBack={onBack}
        activeTool={activeTool}
      />

      {/* Conversation Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-secondary/50 border-b border-border px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Languages className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Translation Tool
              </h2>
              <p className="text-sm text-muted-foreground">
                AI-powered legal document translation
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-8 pb-6 flex flex-col-reverse">
          <div className="space-y-6 flex flex-col">
            {messages.map((message, index) => (
              <div key={message.id}>
                {/* Message Bubble */}
                <div
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border text-foreground shadow-sm'
                    }`}
                  >
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {message.type === 'ai'
                        ? message.content.slice(
                            0,
                            visibleChars[message.id] || message.content.length
                          )
                        : message.content}
                    </p>

                    {/* Show uploaded files */}
                    {message.uploadedFiles && message.uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 text-sm bg-primary-foreground/10 rounded-lg px-3 py-2"
                          >
                            <File className="w-4 h-4" />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Options (Chips) */}
                {message.type === 'ai' &&
                  message.options &&
                  index === messages.length - 1 &&
                  !isTyping &&
                  typingMessageId !== message.id && (
                    <div className="ml-16 mt-4 flex flex-wrap gap-2">
                      {message.options.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              if (option.id === 'upload' || option.id === 'myspace') {
                                handleUploadChoice(option.id);
                              } else {
                                handleLanguageSelect(option.id);
                              }
                            }}
                            className="px-4 py-2.5 bg-card hover:bg-primary/10 border-2 border-border hover:border-primary rounded-xl transition-all hover:shadow-md flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
                          >
                            {Icon && <Icon className="w-4 h-4" />}
                            <div className="flex flex-col items-start">
                              <span>{option.label}</span>
                              {option.native && (
                                <span className="text-xs opacity-70">{option.native}</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-border bg-background/95 backdrop-blur-sm px-6 py-6 flex-shrink-0 sticky bottom-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  handleSendMessage()
                }
                placeholder="Type your message here..."
                className="w-full h-16 pl-6 pr-28 text-base bg-card border-2 border-border focus:border-primary rounded-2xl text-foreground"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <div className="absolute right-2 top-3 flex items-center gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-accent"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && !isTyping}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Space Picker Dialog */}
      <MySpacePickerDialog
        isOpen={isMySpacePickerOpen}
        onClose={() => setIsMySpacePickerOpen(false)}
        onSelect={(documents) => {
          if (documents.length > 0) {
            const file = documents[0];
            setCurrentFileName(file.name);
            addUserMessage(`Uploaded document from My Space`, [{ id: file.id, name: file.name }]);
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addAIMessage(
                'Perfect! In which language would you like the translation? (Optimized for Indian Court standards)',
                INDIAN_LANGUAGES.map((lang) => ({ ...lang, icon: Languages }))
              );
            }, 800);
          }
        }}
      />

      {/* My Space Save Dialog */}
      <MySpaceSaveDialog
        isOpen={isMySpaceSaveDialogOpen}
        onClose={() => setIsMySpaceSaveDialogOpen(false)}
        onSave={handleSaveDocument}
      />
    </div>
  );
}