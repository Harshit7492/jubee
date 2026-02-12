import { useState, useRef, useEffect } from 'react';
import { Send, Upload, Languages, ArrowLeft, User, FileText, FolderOpen, Check, Download, Save, Edit3, Sparkles, X, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  attachment?: { name: string; type: string; size: string };
  languageSelector?: boolean;
  translationResult?: {
    originalDoc: string;
    translatedDoc: string;
    sourceLang: string;
    targetLang: string;
    fileName: string;
  };
}

interface TranslationToolChatProps {
  onBack: () => void;
  sessionId?: string;
  initialMessages?: Message[];
  sessionTitle?: string;
}

const INDIAN_LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
];

const COURT_FORMATS = [
  'Supreme Court of India',
  'Delhi High Court',
  'Standard Subordinate Court',
  'Tribunal Format',
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

export function TranslationToolChat({ onBack, sessionId, initialMessages = [], sessionTitle }: TranslationToolChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Skip auto-scroll on initial mount with initialMessages
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToBottom();
  }, [messages]);

  // Don't add welcome message - let it show the welcome screen instead

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentFileName(file.name);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `I've uploaded: ${file.name}`,
        timestamp: new Date(),
        attachment: {
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
        }
      };
      setMessages(prev => [...prev, userMessage]);

      // Add AI response asking for language with language selector
      setIsTyping(true);
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'In which language would you like the translation? (Optimized for Indian Court standards)',
          timestamp: new Date(),
          languageSelector: true
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 800);
    }
  };

  const handleSelectFromMySpace = () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'I want to select a document from My Space',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Opening your case files from My Space... Please select a document.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleLanguageSelect = (language: { code: string; name: string; native: string }) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Translate to ${language.name} (${language.native})`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Show processing message
    setIsTyping(true);
    setTimeout(() => {
      const processingMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '⚡ Processing Translation\n\nJubee is generating a legal-grade draft translation...\n\n✓ Document analyzed\n⟳ Translating with legal context\n○ Formatting for court standards',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, processingMessage]);

      // After 2.5 seconds, show the translation result
      setTimeout(() => {
        const resultMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: `✅ **Translation Complete**\n\nI've translated your legal document while preserving all legal terminology, formatting, and context. You can now:\n\n• Review the comparative view below\n• Apply court-specific formatting\n• Edit the translation manually\n• Save to My Space or Export`,
          timestamp: new Date(),
          translationResult: {
            originalDoc: SAMPLE_ORIGINAL,
            translatedDoc: SAMPLE_TRANSLATED,
            sourceLang: 'English',
            targetLang: language.name,
            fileName: currentFileName || 'Legal Notice.pdf'
          }
        };
        setMessages(prev => [...prev, resultMessage]);
        setIsTyping(false);
      }, 2500);
    }, 800);
  };

  const handleSaveToMySpace = (fileName: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: `✅ Translation of "${fileName}" saved to My Space successfully!\n\n📁 Translation History & Approved Drafts saved for future reference.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleExport = (format: 'pdf' | 'docx', fileName: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: `📥 Exporting "${fileName}" as ${format.toUpperCase()}...`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-xl transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <Languages className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Translation Tool</h1>
                <p className="text-xs text-muted-foreground">Legal-context aware translations</p>
              </div>
            </div>
          </div>
          {sessionTitle && (
            <div className="text-sm text-muted-foreground">
              Session: <span className="font-medium text-foreground">{sessionTitle}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full px-6 py-8">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Languages className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Legal Document Translation
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Upload legal documents for AI-powered translation with context-aware accuracy
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-primary transition-all">
                  <FileText className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Legal Terminology</h3>
                  <p className="text-sm text-muted-foreground">Preserves legal context and terms</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-primary transition-all">
                  <CheckCircle className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Format Intact</h3>
                  <p className="text-sm text-muted-foreground">Maintains document structure</p>
                </div>
                <div className="p-5 bg-card border border-border rounded-xl text-left hover:border-primary transition-all">
                  <Sparkles className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Court Ready</h3>
                  <p className="text-sm text-muted-foreground">Formatted for Indian courts</p>
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.type === 'system'
                        ? 'bg-yellow-500/20'
                        : 'bg-gradient-to-br from-primary to-primary/80'
                    }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : message.type === 'system' ? (
                      <Check className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Languages className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-4 rounded-2xl max-w-full ${message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : message.type === 'system'
                          ? 'bg-yellow-500/10 text-foreground border border-yellow-500/30'
                          : 'bg-muted text-foreground'
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                      {/* File Attachment */}
                      {message.attachment && (
                        <div className="mt-3 p-3 bg-background/50 rounded-xl flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{message.attachment.name}</p>
                            <p className="text-xs text-muted-foreground">{message.attachment.size}</p>
                          </div>
                        </div>
                      )}

                      {/* Language Selector */}
                      {message.languageSelector && (
                        <div className="mt-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <h4 className="text-xs font-semibold text-foreground">Select Target Language</h4>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                            {INDIAN_LANGUAGES.map((lang) => (
                              <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang)}
                                className="flex-shrink-0 px-4 py-3 bg-background border border-border hover:border-primary hover:bg-primary/5 rounded-lg transition-all duration-200 group"
                              >
                                <div className="text-center">
                                  <p className="text-base font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                                    {lang.native}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{lang.name}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Translation Result */}
                      {message.translationResult && (
                        <div className="mt-4 space-y-3">
                          {/* Comparative View */}
                          <div className="grid grid-cols-2 gap-3">
                            {/* Original */}
                            <div className="p-3 bg-background border border-border rounded-xl">
                              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-xs">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                Original ({message.translationResult.sourceLang})
                              </h4>
                              <div className="bg-muted/50 p-3 rounded-lg max-h-64 overflow-y-auto">
                                <pre className="text-xs whitespace-pre-wrap text-foreground font-sans leading-relaxed">
                                  {message.translationResult.originalDoc}
                                </pre>
                              </div>
                            </div>

                            {/* Translated */}
                            <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl">
                              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2 text-xs">
                                <Check className="w-4 h-4" />
                                Translation ({message.translationResult.targetLang})
                              </h4>
                              <div className="bg-background/50 p-3 rounded-lg max-h-64 overflow-y-auto">
                                <pre className="text-xs whitespace-pre-wrap text-foreground font-sans leading-relaxed">
                                  {message.translationResult.translatedDoc}
                                </pre>
                              </div>
                            </div>
                          </div>

                          {/* Court Format Selection */}
                          <div className="p-3 bg-background border border-border rounded-xl">
                            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-primary" />
                              Apply Court Format (Optional)
                            </label>
                            <select className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-foreground">
                              <option value="">Choose format...</option>
                              {COURT_FORMATS.map((format) => (
                                <option key={format} value={format}>
                                  {format}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleSaveToMySpace(message.translationResult!.fileName)}
                              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                              size="sm"
                            >
                              <Save className="w-4 h-4" />
                              Save to My Space
                            </Button>
                            <div className="relative group">
                              <Button variant="ghost" size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                                Export
                                <ChevronRight className="w-3 h-3" />
                              </Button>
                              <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <button
                                  onClick={() => handleExport('pdf', message.translationResult!.fileName)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent rounded-t-xl transition-colors"
                                >
                                  Export as PDF
                                </button>
                                <button
                                  onClick={() => handleExport('docx', message.translationResult!.fileName)}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent rounded-b-xl transition-colors"
                                >
                                  Export as DOCX
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Upload Options - Show after welcome message */}
              {messages.length === 1 && messages[0].type === 'ai' && (
                <div className="flex flex-col gap-4 items-center py-8">
                  {/* Upload New Document */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-2xl p-8 border-2 border-dashed border-border hover:border-primary rounded-2xl cursor-pointer transition-all duration-200 bg-card/50 backdrop-blur-sm hover:bg-primary/5 group"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-foreground mb-1">Upload New Document</h3>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop or click to browse (PDF, DOC, DOCX)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add from My Space */}
                  <div
                    onClick={handleSelectFromMySpace}
                    className="w-full max-w-2xl p-8 border-2 border-border hover:border-primary rounded-2xl cursor-pointer transition-all duration-200 bg-card/50 backdrop-blur-sm hover:bg-primary/5 group"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                        <FolderOpen className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-foreground mb-1">Add from My Space</h3>
                        <p className="text-sm text-muted-foreground">
                          Select an existing document from your case files
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <Languages className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-4 rounded-2xl bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-5xl mx-auto">
          {uploadedFile && (
            <div className="mb-3 p-3 bg-card border border-border rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="p-1 hover:bg-accent rounded-lg transition-all"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}

          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              placeholder="Upload a legal document for translation..."
              className="w-full h-14 pl-6 pr-28 text-base bg-card border-2 border-border rounded-2xl focus:border-primary text-foreground"
            />
            <div className="absolute right-2 top-2 flex items-center gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="icon"
                variant="ghost"
                title="Upload Document"
                className="h-10 w-10 rounded-xl hover:bg-primary/10 text-primary"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
    </div>
  );
}