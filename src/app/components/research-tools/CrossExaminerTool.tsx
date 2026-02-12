import { useState, useRef } from 'react';
import { Upload, FileText, ChevronRight, Check, Download, Save, FolderOpen, X, ChevronLeft, Search, ThumbsUp, ThumbsDown, Trash2, FileDown, Eye, ChevronDown, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { MySpaceSaveDialog } from '@/app/components/MySpaceSaveDialog';
import { MSWordWindow } from '@/app/components/MSWordWindow';
import { MySpaceBrowserDialog } from '@/app/components/MySpaceBrowserDialog';
import jubeeLogo from '@/assets/jubee-logo.png';

type Step = 'upload' | 'process' | 'results';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'docx' | 'doc';
  category: 'evidence' | 'pleading' | 'supporting';
}

interface CrossQuestion {
  id: string;
  question: string;
  category: string;
  sourceDoc: string;
  sourcePage: number;
  sourceParagraph: number; // Add paragraph number for highlighting
  priority: 'high' | 'medium' | 'low';
  feedback?: 'positive' | 'negative';
}

const proceedingTypes = [
  { id: 'arbitration', name: 'Arbitration' },
  { id: 'commercial-suits', name: 'Commercial Suits' },
  { id: 'ordinary-suits', name: 'Ordinary Suits' },
  { id: 'criminal', name: 'Criminal Proceedings' },
  { id: 'section-138', name: 'Section 138 N.I. Act' },
  { id: 'other', name: 'Other (Specify)' }
];

interface CrossExaminerToolProps {
  onBack: () => void;
  onToolChange?: (tool: string, initialContent?: string) => void;
  activeTool?: string;
}

export function CrossExaminerTool({ onBack, onToolChange, activeTool }: CrossExaminerToolProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedProceeding, setSelectedProceeding] = useState('');
  const [proceedingSearchQuery, setProceedingSearchQuery] = useState('');
  const [customProceeding, setCustomProceeding] = useState('');
  const [witnessName, setWitnessName] = useState('');
  const [partyName, setPartyName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showMSWord, setShowMSWord] = useState(false);
  const [showMySpaceBrowser, setShowMySpaceBrowser] = useState(false);
  const [questions, setQuestions] = useState<CrossQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<CrossQuestion | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Chat states
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; text: string; isAI: boolean; timestamp: Date }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  // Mock document content for the viewer
  const mockDocumentContent = `IN THE HON'BLE SUPREME COURT OF INDIA

CIVIL APPEAL NO. 12345 OF 2024

BETWEEN:

RAJ KUMAR
SON OF SHRI RAM KUMAR
RESIDENT OF NEW DELHI
...APPELLANT

VERSUS

SUNIL SHARMA
SON OF SHRI MOHAN SHARMA
RESIDENT OF MUMBAI
...RESPONDENT

EVIDENCE AFFIDAVIT

I, RAJ KUMAR, son of SHRI RAM KUMAR, aged 45 years, residing at 123, Green Park, New Delhi, do hereby solemnly affirm and state as follows:

1. That I am the Appellant in the above-captioned matter and am competent to swear this affidavit.

2. That on 15th January, 2024, at approximately 3:00 PM, I was present at the location mentioned in the complaint, namely, the coffee shop at Connaught Place, New Delhi.

3. That I had gone to the said location to meet with the Respondent regarding a business transaction that we had discussed earlier over telephone.

4. That when I reached the coffee shop, the Respondent was already present there. I noticed that he was wearing a blue shirt and black trousers.

5. That our conversation lasted approximately 10 minutes, during which we discussed the terms of the proposed business deal.

6. That during our conversation, no threats were made by either party, and the discussion was conducted in a cordial manner.

7. That there was another person, Mr. Sharma, who was sitting at a nearby table and could have witnessed our interaction.

8. That prior to this incident, I had met the Respondent on two previous occasions to discuss business matters.

9. That I was not under any medication or influence that could have affected my perception of the events.

10. That I made detailed notes of our conversation immediately after leaving the coffee shop, which I still possess.

11. That I have not discussed my testimony with any other witnesses involved in this case.

12. That I have no financial interest in the outcome of this case beyond recovering the amount owed to me.

13. That the statements made in this affidavit are true to the best of my knowledge and belief.

DEPONENT

Verification:
I, the deponent above-named, do hereby verify that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.

Verified at New Delhi on this 20th day of January, 2024.

DEPONENT`;

  // Filter proceeding types based on search
  const filteredProceedingTypes = proceedingTypes.filter(type =>
    type.name.toLowerCase().includes(proceedingSearchQuery.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(files).map(file => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        return {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: ['pdf', 'docx', 'doc'].includes(extension) ? extension as 'pdf' | 'docx' | 'doc' : 'pdf',
          category: 'evidence' // Default category
        };
      });
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const handleCategoryChange = (fileId: string, category: 'evidence' | 'pleading' | 'supporting') => {
    setUploadedFiles(uploadedFiles.map(f =>
      f.id === fileId ? { ...f, category } : f
    ));
  };

  const handleStartAnalysis = () => {
    if (uploadedFiles.length > 0 && (selectedProceeding || customProceeding)) {
      setCurrentStep('process');
      setIsProcessing(true);
      setProcessingProgress(0);

      // Simulate processing
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            // Generate mock questions
            const mockQuestions: CrossQuestion[] = [
              {
                id: '1',
                question: 'Can you confirm that you were present at the location on January 15, 2024, at approximately 3:00 PM?',
                category: 'Fact Verification',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 1,
                sourceParagraph: 2,
                priority: 'high'
              },
              {
                id: '2',
                question: 'In your affidavit dated January 20, 2024, you mentioned seeing the defendant wearing a blue shirt. Can you describe what else the defendant was wearing?',
                category: 'Credibility',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 1,
                sourceParagraph: 4,
                priority: 'high'
              },
              {
                id: '3',
                question: 'You stated in paragraph 5 that the conversation lasted "approximately 10 minutes." Are you certain of this timeframe, or is it an approximation?',
                category: 'Precision',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 1,
                sourceParagraph: 5,
                priority: 'medium'
              },
              {
                id: '4',
                question: 'According to paragraph 7 of your affidavit, Mr. Sharma was present and could have witnessed the interaction. Did Mr. Sharma actually witness the conversation?',
                category: 'Corroboration',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 1,
                sourceParagraph: 7,
                priority: 'high'
              },
              {
                id: '5',
                question: 'In paragraph 8, you mention meeting the defendant on two previous occasions. Can you provide the dates and locations of these meetings?',
                category: 'Background',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 1,
                sourceParagraph: 8,
                priority: 'medium'
              },
              {
                id: '6',
                question: 'In paragraph 6 of your affidavit, you state that "no threats were made." However, the complaint alleges threats. How do you explain this contradiction?',
                category: 'Contradiction',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 1,
                sourceParagraph: 6,
                priority: 'high'
              },
              {
                id: '7',
                question: 'Can you explain why your testimony regarding the duration of the meeting differs from the account provided by witness Mr. Sharma?',
                category: 'Inconsistency',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 2,
                sourceParagraph: 7,
                priority: 'high'
              },
              {
                id: '8',
                question: 'According to paragraph 9, you were not under any medication. However, medical records show you were prescribed medication. Can you clarify?',
                category: 'Mental State',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 2,
                sourceParagraph: 8,
                priority: 'medium'
              },
              {
                id: '9',
                question: 'You mentioned in paragraph 10 making notes immediately after the incident. Can you produce those notes as evidence?',
                category: 'Evidence Chain',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 2,
                sourceParagraph: 9,
                priority: 'low'
              },
              {
                id: '10',
                question: 'Despite your claim in paragraph 11, have you discussed your testimony with your legal counsel before providing this affidavit?',
                category: 'Contamination',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 2,
                sourceParagraph: 10,
                priority: 'medium'
              },
              {
                id: '11',
                question: 'In paragraph 12, you state you have "no financial interest" except recovering the amount owed. Is this the only financial motivation?',
                category: 'Bias',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 2,
                sourceParagraph: 11,
                priority: 'high'
              },
              {
                id: '12',
                question: 'Based on your observation in paragraph 4, what do you believe motivated the defendant to agree to this meeting?',
                category: 'Speculation',
                sourceDoc: 'Evidence Affidavit',
                sourcePage: 1,
                sourceParagraph: 4,
                priority: 'low'
              }
            ];
            setQuestions(mockQuestions);
            setTimeout(() => {
              setCurrentStep('results');
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleQuestionClick = (question: CrossQuestion) => {
    setSelectedQuestion(question);
    setShowDocumentViewer(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(null);
      setShowDocumentViewer(false);
    }
  };

  const handleFeedback = (questionId: string, feedback: 'positive' | 'negative') => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, feedback } : q
    ));
  };

  const handleOpenMSWord = () => {
    setShowMSWord(true);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-500/10 text-red-500';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'border-blue-500 bg-blue-500/10 text-blue-500';
      default:
        return 'border-border bg-muted text-muted-foreground';
    }
  };

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
        "This question targets credibility issues in the witness statement. Would you like me to suggest follow-up questions based on the same paragraph?",
        "I've analyzed the evidence affidavit. This line of questioning could help establish inconsistencies. Should I generate more questions on this topic?",
        "The witness statement in paragraph 4 provides good material for cross-examination. I can help you develop a questioning strategy.",
        "Based on the evidence pattern, you might want to explore the timeline contradictions further. Would you like me to generate questions about that?"
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

  const renderHeader = () => {
    return (
      <div className="border-b border-border bg-card px-6 py-4">
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
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Jubee Probe</h1>
          </div>
        </div>
      </div>
    );
  };

  const renderUploadStep = () => {
    return (
      <div className="flex-1 bg-[#F9F9F9] dark:bg-background p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Multi-File Upload Section */}
          <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Upload Case Files</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload multiple documents including Evidence Affidavits, Pleadings, and Supporting Documents
              </p>
            </div>

            {/* Upload Options - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Minimal Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-2 rounded-xl p-3 transition-all duration-300 cursor-pointer bg-card border-border hover:border-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Upload Documents</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, or DOC files</p>
                  </div>
                </div>
              </div>

              {/* Add from My Space */}
              <Button
                variant="ghost"
                onClick={() => setShowMySpaceBrowser(true)}
                className="group relative border-2 !border-border rounded-xl p-3 transition-all duration-300 cursor-pointer hover:!border-primary hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5 h-auto bg-transparent justify-start"
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

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="text-sm font-bold text-foreground">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 bg-black dark:bg-black rounded-xl border-2 border-primary/40 shadow-[0_0_30px_rgba(30,58,138,0.5)] transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white truncate">{file.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400 font-medium">{file.size}</span>
                              <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-md font-bold shadow-sm uppercase">
                                {file.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-all duration-200 group flex-shrink-0 hover:shadow-md"
                          >
                            <X className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Proceeding Type Selection */}
          <div className={`bg-card border border-border/50 rounded-2xl p-8 space-y-6 transition-opacity ${uploadedFiles.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploadedFiles.length === 0 && (
              <div className="pb-4 border-b border-border/50">
                <p className="text-sm text-muted-foreground">
                  Upload documents before selecting proceeding type
                </p>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">
                Select Proceeding Type <span className="text-xs font-normal text-muted-foreground">(Optional but Recommended)</span>
              </label>

              {/* Dropdown Selector */}
              <div className="relative">
                <select
                  value={selectedProceeding}
                  onChange={(e) => {
                    setSelectedProceeding(e.target.value);
                    if (e.target.value !== 'other') {
                      setCustomProceeding('');
                    }
                  }}
                  disabled={uploadedFiles.length === 0}
                  className="w-full h-12 px-4 pr-10 bg-background border border-border rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed"
                >
                  <option value="">Select a proceeding type...</option>
                  <option value="arbitration">Arbitration</option>
                  <option value="commercial-suits">Commercial Suits</option>
                  <option value="ordinary-suits">Ordinary Suits</option>
                  <option value="criminal">Criminal Proceedings</option>
                  <option value="section-138">Section 138 N.I. Act</option>
                  <option value="other">Other (Write Manually)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Custom Proceeding Input - Shows when "Other" is selected */}
              {selectedProceeding === 'other' && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Specify Proceeding Type
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Matrimonial Dispute, Property Dispute, etc."
                    value={customProceeding}
                    onChange={(e) => setCustomProceeding(e.target.value)}
                    className="border-2 border-border focus:border-primary h-12"
                  />
                </div>
              )}

              {/* Instructional Note */}
              {!selectedProceeding && uploadedFiles.length > 0 && (
                <div className="p-3 bg-accent/50 border border-border/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    💡 <span className="font-medium">Tip:</span> Selecting a proceeding type helps the AI generate more contextually relevant cross-examination questions.
                  </p>
                </div>
              )}
            </div>

            {/* Witness and Party Identification Fields */}
            <div className="space-y-4 pt-2">
              <label className="block text-sm font-bold text-foreground">
                Identification Details <span className="text-xs font-normal text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Witness Name Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Name of the witness
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter witness name"
                    value={witnessName}
                    onChange={(e) => setWitnessName(e.target.value)}
                    disabled={uploadedFiles.length === 0}
                    className="border-[0.5px] border-border focus:border-primary h-12"
                  />
                </div>

                {/* Party Name Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    Name of the Party cross-examining
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter party name"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    disabled={uploadedFiles.length === 0}
                    className="border-[0.5px] border-border focus:border-primary h-12"
                  />
                </div>
              </div>
            </div>

            {/* Proceed to Analysis Button */}
            <Button
              onClick={handleStartAnalysis}
              disabled={uploadedFiles.length === 0}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
            >
              Proceed to Analysis
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
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing Case Files</h2>
            </div>

            {/* Progress Bar */}
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
                  {processingProgress < 30 && 'Reading documents...'}
                  {processingProgress >= 30 && processingProgress < 60 && 'Identifying key statements...'}
                  {processingProgress >= 60 && processingProgress < 90 && 'Generating questions...'}
                  {processingProgress >= 90 && 'Linking to sources...'}
                </span>
                <span className="text-xs font-bold text-primary">{processingProgress}%</span>
              </div>
            </div>

            {/* Processing Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[#F9F9F9] dark:bg-card/50 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Files</p>
                <p className="text-lg font-bold text-foreground">{uploadedFiles.length}</p>
              </div>
              <div className="text-center p-3 bg-[#F9F9F9] dark:bg-card/50 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <p className="text-lg font-bold text-foreground">
                  {selectedProceeding ? 'Selected' : 'General'}
                </p>
              </div>
              <div className="text-center p-3 bg-[#F9F9F9] dark:bg-card/50 rounded-xl border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Stage</p>
                <p className="text-lg font-bold text-foreground">Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResultsStep = () => {
    return (
      <div className="flex-1 flex flex-col bg-[#F9F9F9] dark:bg-background">
        {/* Top Utility Toolbar */}
        <div className="border-b border-border bg-card px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">
                {questions.length} Questions Generated
              </h2>
            </div>
            <div className="flex items-center gap-2">
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

        {/* Main Content Area - Split Screen */}
        <div className="flex-1 flex relative overflow-hidden h-full">
          {/* Left Side: Questions List (2/3 width when viewer open, full width when closed) */}
          <div className={`${showDocumentViewer ? 'w-2/3' : 'w-full'} flex flex-col border-r border-border transition-all duration-300 overflow-hidden`}>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`bg-card border-[0.5px] rounded-xl p-5 transition-all cursor-pointer ${selectedQuestion?.id === question.id
                        ? 'border-primary shadow-lg shadow-primary/10'
                        : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                      }`}
                    onClick={() => handleQuestionClick(question)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2 py-1 bg-accent border border-border rounded-md font-medium text-foreground">
                              {question.category}
                            </span>
                          </div>
                        </div>

                        {/* Question Text */}
                        <p className="text-base text-foreground leading-relaxed mb-3">
                          {question.question}
                        </p>

                        {/* Source Reference */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuestionClick(question);
                            }}
                            className="flex items-center gap-2 text-xs text-primary hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-medium">
                              Ref: {question.sourceDoc} • Page {question.sourcePage}
                            </span>
                          </button>

                          {/* Action Icons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeedback(question.id, 'positive');
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${question.feedback === 'positive'
                                  ? 'bg-green-500/10 text-green-500'
                                  : 'hover:bg-accent text-muted-foreground'
                                }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeedback(question.id, 'negative');
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${question.feedback === 'negative'
                                  ? 'bg-red-500/10 text-red-500'
                                  : 'hover:bg-accent text-muted-foreground'
                                }`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteQuestion(question.id);
                              }}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Document Viewer (1/3 width) */}
          {showDocumentViewer && selectedQuestion && (
            <div className="w-1/3 flex flex-col bg-card/50 backdrop-blur-sm">
              <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{selectedQuestion.sourceDoc}</h3>
                    <p className="text-xs text-muted-foreground">Page {selectedQuestion.sourcePage}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDocumentViewer(false)}
                  className="p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white dark:bg-card p-6 rounded-lg border-[0.5px] border-border/50 shadow-sm font-serif text-sm leading-relaxed">
                  {mockDocumentContent.split('\n\n').map((paragraph, index) => {
                    // Extract paragraph number from the text (e.g., "2. That on..." -> 2)
                    const paragraphMatch = paragraph.trim().match(/^(\d+)\.\s/);
                    const paragraphNumber = paragraphMatch ? parseInt(paragraphMatch[1]) : null;

                    // Check if this paragraph number matches the selected question's source paragraph
                    const isHighlighted = selectedQuestion && paragraphNumber !== null && paragraphNumber === selectedQuestion.sourceParagraph;

                    return (
                      <p
                        key={index}
                        id={paragraphNumber ? `paragraph-${paragraphNumber}` : undefined}
                        ref={(el) => {
                          // Auto-scroll to highlighted paragraph
                          if (isHighlighted && el) {
                            setTimeout(() => {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                          }
                        }}
                        className={`mb-4 transition-all duration-300 ${isHighlighted
                            ? 'bg-yellow-100 dark:bg-yellow-500/20 border-l-4 border-yellow-500 pl-4 py-2 rounded-r-lg shadow-sm'
                            : ''
                          }`}
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Persistence Notification */}
        <div className="border-t border-border bg-card px-6 py-3">
          <div className="flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
              <Check className="w-3 h-3 inline mr-1 text-primary" />
              This Cross-Examination session and all edited questions are saved to your History
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
      {currentStep === 'upload' && renderUploadStep()}
      {currentStep === 'process' && renderProcessStep()}
      {currentStep === 'results' && renderResultsStep()}

      {/* MS Word Window */}
      <MSWordWindow
        isOpen={showMSWord}
        onClose={() => setShowMSWord(false)}
        content={questions.map((q, i) => `${i + 1}. ${q.question}\n   [Ref: ${q.sourceDoc}, Page ${q.sourcePage}]`).join('\n\n')}
        onContentChange={(newContent) => {
          console.log('Content changed:', newContent);
        }}
        fileName="Cross_Examination_Questions.docx"
        courtFormat={{
          font: 'Times New Roman',
          fontSize: 12,
          lineSpacing: 1.5
        }}
      />

      {/* My Space Browser */}
      <MySpaceBrowserDialog
        isOpen={showMySpaceBrowser}
        onClose={() => setShowMySpaceBrowser(false)}
        onSelect={(files) => {
          if (files.length > 0) {
            const newFiles: UploadedFile[] = files.map(file => ({
              id: `myspace-${Date.now()}-${Math.random()}`,
              name: file.name,
              size: file.size,
              type: file.type as 'pdf' | 'docx' | 'doc',
              category: 'evidence'
            }));
            setUploadedFiles([...uploadedFiles, ...newFiles]);
            setShowMySpaceBrowser(false);
          }
        }}
      />

      {/* Save Dialog */}
      {showSaveDialog && (
        <MySpaceSaveDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          defaultFileName={`Cross_Examination_${uploadedFiles[0]?.name.replace(/\\.(pdf|docx|doc)$/, '') || 'Questions'}`}
          fileType="Cross-Examination"
          onSave={(folder, filename, format) => {
            console.log('Saving to:', folder, filename, 'as', format);
            setShowSaveDialog(false);
          }}
        />
      )}

      {/* Floating Chat Toggle Button - Only show in results step */}
      {currentStep === 'results' && (
        <button
          onClick={() => setShowChat(!showChat)}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group ${showChat ? 'scale-0' : 'scale-100'
            }`}
        >
          <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        </button>
      )}

      {/* AI Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-background border-l-[0.5px] border-border shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${showChat ? 'translate-x-0' : 'translate-x-full'
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
            Ask me about questions, evidence analysis, or cross-examination strategy
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
                Ask me about specific questions, request follow-ups, or get advice on cross-examination strategy
              </p>
              <div className="mt-6 space-y-2 w-full max-w-[280px]">
                <button
                  onClick={() => setChatInput("Explain question #4 strategy")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  Explain question #4 strategy
                </button>
                <button
                  onClick={() => setChatInput("Generate follow-up questions")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  Generate follow-up questions
                </button>
                <button
                  onClick={() => setChatInput("What weaknesses can I exploit?")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  What weaknesses can I exploit?
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
              placeholder="Ask about questions..."
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