import { useState, useRef, useEffect } from 'react';
import {
  PenTool, ArrowLeft, Sparkles, Save, Download, Upload, File, X, Send, Bot,
  User, AlertCircle, CheckCircle, Lightbulb, BookOpen, Type, AlignLeft,
  FileText, Scale, ChevronDown, Paperclip, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { ToolNavigation } from '@/app/components/research-tools/ToolNavigation';
import { MySpacePickerDialog } from '@/app/components/MySpacePickerDialog';
import { MySpaceSaveDialog } from '@/app/components/MySpaceSaveDialog';
import { MSWordWindow } from '@/app/components/MSWordWindow';
import { JudgeSelectionModal } from '@/app/components/research-tools/JudgeSelectionModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { toast } from 'sonner';
import jubeeLogo from '@/assets/jubee-logo.png';

interface DraftsmanToolProps {
  onBack: () => void;
  onToolChange?: (tool: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'psi' | 'cross-examiner') => void;
  activeTool?: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'psi' | 'cross-examiner';
  initialContent?: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  category: 'draft' | 'supporting' | 'caselaw';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  options?: Array<{ id: string; label: string; icon?: any }>;
  uploadedFiles?: UploadedDocument[];
  judgeChips?: string[];
}

interface AutoCheckIssue {
  id: string;
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  line?: number;
}

type ConversationStage = 'initial' | 'draft-choice' | 'supporting-docs' | 'caselaw-docs' | 'court-selection' | 'bench-selection' | 'judge-selection' | 'processing' | 'editor' | 'word-editor';

const COURTS = [
  { id: 'supreme', name: 'Supreme Court of India' },
  { id: 'delhi-hc', name: 'Delhi High Court' },
  // { id: 'delhi-district', name: 'District Court - Delhi' },
  // { id: 'other', name: 'Other Court' }
];

const JUDGES = [
  'Justice Sanjiv Khanna',
  'Justice B.R. Gavai',
  'Justice Surya Kant',
  'Justice Hrishikesh Roy',
  'Justice Abhay S. Oka',
  'Justice Prashant Kumar Mishra',
  'Other Judge'
];

export function DraftsmanTool({ onBack, onToolChange, activeTool, initialContent }: DraftsmanToolProps) {
  // Conversation phase states
  const [currentStage, setCurrentStage] = useState<ConversationStage>(initialContent ? 'editor' : 'initial');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMySpaceDialogOpen, setIsMySpaceDialogOpen] = useState(false);
  const [isMySpaceSaveDialogOpen, setIsMySpaceSaveDialogOpen] = useState(false);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [selectedJudges, setSelectedJudges] = useState<string[]>([]);

  // Typewriter effect state
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [visibleChars, setVisibleChars] = useState<Record<string, number>>({});

  // Document states
  const [draftDoc, setDraftDoc] = useState<UploadedDocument | null>(null);
  const [supportingDocs, setSupportingDocs] = useState<UploadedDocument[]>([]);
  const [caselawDocs, setCaselawDocs] = useState<UploadedDocument[]>([]);
  const [selectedCourt, setSelectedCourt] = useState(initialContent ? 'Delhi High Court' : '');
  const [selectedBench, setSelectedBench] = useState('');
  const [selectedJudge, setSelectedJudge] = useState(initialContent ? 'Justice Sanjiv Khanna' : '');
  const [jurisdiction, setJurisdiction] = useState(initialContent ? 'Delhi High Court - Justice Sanjiv Khanna' : '');

  // Editor phase states
  const [documentContent, setDocumentContent] = useState(initialContent || '');
  const [isRightPaneCollapsed, setIsRightPaneCollapsed] = useState(false);
  const [autoCheckIssues, setAutoCheckIssues] = useState<AutoCheckIssue[]>([]);
  const [isAnalyzingDocument, setIsAnalyzingDocument] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState<'documents' | 'suggestions' | 'chatbot' | null>('suggestions');

  // Chatbot states
  const [chatbotMessages, setChatbotMessages] = useState<Array<{
    id: string;
    text: string;
    isAI: boolean;
    timestamp: Date;
  }>>([]);
  const [chatbotInput, setChatbotInput] = useState('');
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);

  // Formatting states
  const [fontSize, setFontSize] = useState('12');
  const [lineSpacing, setLineSpacing] = useState('1.5');
  const [courtFormat, setCourtFormat] = useState('delhi-hc');
  const [wordCount, setWordCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadCategory = useRef<'draft' | 'supporting' | 'caselaw'>('draft');

  const courtFormats = [
    { id: 'delhi-hc', name: 'Delhi High Court' },
    { id: 'supreme', name: 'Supreme Court of India' }
  ];

  // Initialize conversation
  useEffect(() => {
    if (!initialContent) {
      // Only show initial message if no content was provided
      addAIMessage(
        "Reviews your draft in realtime to ensure quality and control.",
        [
          { id: 'upload-from-space', label: 'Upload from My Space', icon: BookOpen },
          { id: 'upload-new-document', label: 'Upload New Document', icon: Upload },
          { id: 'start-fresh', label: 'Start Fresh', icon: FileText }
        ]
      );
    }
  }, []);

  // Auto-check document content
  useEffect(() => {
    if (documentContent && currentStage === 'editor') {
      analyzeDocument(documentContent);
    }
  }, [documentContent]);

  // Update word count
  useEffect(() => {
    if (documentContent) {
      const words = documentContent.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  }, [documentContent]);

  // Typewriter effect for AI messages
  useEffect(() => {
    if (typingMessageId) {
      const message = messages.find(m => m.id === typingMessageId);
      if (!message || message.type !== 'ai') {
        setTypingMessageId(null);
        return;
      }

      const fullText = message.content;
      const currentLength = visibleChars[typingMessageId] || 0;

      if (currentLength < fullText.length) {
        const timer = setTimeout(() => {
          setVisibleChars(prev => ({
            ...prev,
            [typingMessageId]: currentLength + 1
          }));
        }, 20); // Adjust speed here (lower = faster)

        return () => clearTimeout(timer);
      } else {
        // Typing complete for this message
        setTypingMessageId(null);
      }
    }
  }, [typingMessageId, visibleChars, messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current && currentStage !== 'editor' && currentStage !== 'processing') {
      // Scroll the chat container to bottom
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
    }
  }, [messages.length, isTyping, currentStage]);

  const addAIMessage = (
    content: string,
    options?: Array<{ id: string; label: string; icon?: any }>
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date(),
      options
    };

    setMessages(prev => [...prev, newMessage]);

    // Start typewriter effect for this message
    setTypingMessageId(newMessage.id);
    setVisibleChars(prev => ({ ...prev, [newMessage.id]: 0 }));
  };

  const addUserMessage = (content: string, files?: UploadedDocument[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      uploadedFiles: files
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionSelect = (optionId: string, optionLabel: string) => {
    setIsTyping(true);

    if (currentStage === 'initial') {
      if (optionId === 'upload-from-space') {
        addUserMessage('I want to upload from My Space');
        setIsTyping(false);
        setIsMySpaceDialogOpen(true);
        currentUploadCategory.current = 'draft';
      } else if (optionId === 'upload-new-document') {
        addUserMessage('I want to upload a new document');
        setIsTyping(false);
        currentUploadCategory.current = 'draft';
        fileInputRef.current?.click();
      } else if (optionId === 'start-fresh') {
        addUserMessage('I want to start fresh');
        setTimeout(() => {
          setIsTyping(false);
          proceedToSupportingDocs();
        }, 800);
      }
    } else if (currentStage === 'draft-choice') {
      if (optionId === 'upload-from-myspace') {
        addUserMessage('I\'ll upload from My Space');
        setIsTyping(false);
        setIsMySpaceDialogOpen(true);
        currentUploadCategory.current = 'draft';
      } else if (optionId === 'upload-new') {
        addUserMessage('I\'ll upload a new document');
        setIsTyping(false);
        currentUploadCategory.current = 'draft';
        fileInputRef.current?.click();
      }
    } else if (currentStage === 'supporting-docs') {
      if (optionId === 'upload-supporting-space') {
        addUserMessage('I\'ll upload supporting documents from My Space');
        setIsTyping(false);
        setIsMySpaceDialogOpen(true);
        currentUploadCategory.current = 'supporting';
      } else if (optionId === 'upload-supporting') {
        addUserMessage('I\'ll upload supporting documents');
        setIsTyping(false);
        currentUploadCategory.current = 'supporting';
        fileInputRef.current?.click();
      } else if (optionId === 'skip-supporting') {
        addUserMessage('Skip supporting documents');
        setTimeout(() => {
          setIsTyping(false);
          proceedToCaseLaws();
        }, 800);
      } else if (optionId === 'continue-supporting') {
        setTimeout(() => {
          setIsTyping(false);
          proceedToCaseLaws();
        }, 500);
      }
    } else if (currentStage === 'caselaw-docs') {
      if (optionId === 'upload-caselaw-space') {
        addUserMessage('I\'ll upload case laws from My Space');
        setIsTyping(false);
        setIsMySpaceDialogOpen(true);
        currentUploadCategory.current = 'caselaw';
      } else if (optionId === 'upload-caselaw') {
        addUserMessage('I\'ll upload case laws');
        setIsTyping(false);
        currentUploadCategory.current = 'caselaw';
        fileInputRef.current?.click();
      } else if (optionId === 'skip-caselaw') {
        addUserMessage('Skip case laws');
        setTimeout(() => {
          setIsTyping(false);
          proceedToCourtSelection();
        }, 800);
      } else if (optionId === 'continue-caselaw') {
        setTimeout(() => {
          setIsTyping(false);
          proceedToCourtSelection();
        }, 500);
      }
    } else if (currentStage === 'court-selection') {
      handleCourtSelect(optionId, optionLabel);
    } else if (currentStage === 'bench-selection') {
      handleBenchSelect(optionId, optionLabel);
    }
  };

  const proceedToSupportingDocs = () => {
    addAIMessage(
      'Please add relevant/supporting documents (Multiple files) to give Jubee a context of the case. This is optional.',
      [
        { id: 'upload-supporting-space', label: 'Upload from My Space', icon: BookOpen },
        { id: 'upload-supporting', label: 'Upload New Document', icon: Upload },
        { id: 'skip-supporting', label: 'Skip This Step', icon: ChevronRight }
      ]
    );
    setCurrentStage('supporting-docs');
  };

  const proceedToCaseLaws = () => {
    addAIMessage(
      'Would you like to upload any specific Case Laws to strengthen your document?',
      [
        { id: 'upload-caselaw-space', label: 'Upload from My Space', icon: BookOpen },
        { id: 'upload-caselaw', label: 'Upload Case Laws', icon: Upload },
        { id: 'skip-caselaw', label: 'Skip This Step', icon: ChevronRight }
      ]
    );
    setCurrentStage('caselaw-docs');
  };

  const proceedToCourtSelection = () => {
    addAIMessage(
      'Please select the Court for this matter.',
      COURTS.map(court => ({ id: court.id, label: court.name, icon: Scale }))
    );
    setCurrentStage('court-selection');
  };

  const handleCourtSelect = (courtId: string, courtName: string) => {
    setIsTyping(true);
    setSelectedCourt(courtName);
    addUserMessage(courtName);

    setTimeout(() => {
      setIsTyping(false);
      proceedToBenchSelection();
    }, 800);
  };

  const proceedToBenchSelection = () => {
    addAIMessage(
      'Select the Bench (Optional)',
      [
        { id: 'single-judge', label: 'Single Judge', icon: Scale },
        { id: 'division-bench', label: 'Division Bench', icon: Scale },
        { id: 'full-bench', label: 'Full Bench', icon: Scale },
        { id: 'constitution-bench', label: 'Constitution Bench', icon: Scale },
        { id: 'skip-bench', label: 'Skip This Step', icon: ChevronRight }
      ]
    );
    setCurrentStage('bench-selection');
  };

  const handleBenchSelect = (benchId: string, benchLabel: string) => {
    setIsTyping(true);

    if (benchId === 'skip-bench') {
      addUserMessage('Skip bench selection');
      setSelectedBench('');
    } else {
      addUserMessage(benchLabel);
      setSelectedBench(benchLabel);
    }

    setTimeout(() => {
      setIsTyping(false);
      setIsJudgeModalOpen(true);
      setCurrentStage('judge-selection');
    }, 800);
  };

  const handleJudgeModalConfirm = (selectedJudgesList: Array<{ id: string; name: string; gender: 'Mr.' | 'Ms.' }>) => {
    setIsJudgeModalOpen(false);

    if (selectedJudgesList.length === 0) {
      // Skip judge selection
      setIsTyping(true);
      setSelectedJudge('');
      setJurisdiction(selectedCourt);

      setTimeout(() => {
        setIsTyping(false);
        addAIMessage('Perfect! I have all the information I need. Preparing your drafting workspace now...');

        setTimeout(() => {
          // Initialize document content without judge
          if (draftDoc) {
            const mockDraftContent = `IN THE ${selectedCourt.toUpperCase()}\n\nORIGINAL CIVIL JURISDICTION\n\nCIVIL WRIT PETITION NO. _____ OF 2026\n\nIN THE MATTER OF:\n\n[PETITIONER NAME]\n...Petitioner\n\nVERSUS\n\n[RESPONDENT NAME]\n...Respondent\n\nPETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA\n\nTO,\nTHE HON'BLE CHIEF JUSTICE OF THE ${selectedCourt.toUpperCase()}\n\nTHE HUMBLE PETITION OF THE PETITIONER ABOVE-NAMED\n\nMOST RESPECTFULLY SHOWETH:\n\n1. That the petitioner is a law-abiding citizen.\n\n2. That the impugned order dated [DATE] is wholly arbitrary and illegal.\n\n3. That the petitioner has no alternative efficacious remedy except to approach this Hon'ble Court.\n\nPRAYER\n\nIn view of the facts stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:\n\n(a) Issue appropriate writs, orders or directions;\n\n(b) Pass such other orders as this Hon'ble Court may deem fit in the interest of justice.\n\nAND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL DUTY BOUND FOREVER PRAY.\n\nPlace: New Delhi\nDate: ${new Date().toLocaleDateString('en-IN')}`;
            setDocumentContent(mockDraftContent);
          } else {
            setDocumentContent(`IN THE ${selectedCourt.toUpperCase()}\n\n\n\n`);
          }

          setCurrentStage('processing');

          setTimeout(() => {
            // Always use editor to show right panel with suggestions and chatbot
            setCurrentStage('editor');
          }, 3000);
        }, 1500);
      }, 800);
      return;
    }

    // If judges provided
    const judgeNames = selectedJudgesList.map(j => j.name);
    setSelectedJudges(judgeNames);
    setIsTyping(true);
    setSelectedJudge(judgeNames.join(', '));
    setJurisdiction(`${selectedCourt} - ${judgeNames.join(', ')}`);

    // Add user message with judge chips
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: `Selected ${judgeNames.length} judge${judgeNames.length > 1 ? 's' : ''}`,
      timestamp: new Date(),
      judgeChips: judgeNames
    };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      setIsTyping(false);
      addAIMessage('Perfect! I have all the information I need. Preparing your drafting workspace now...');

      setTimeout(() => {
        // Initialize document content
        if (draftDoc) {
          // Simulate loading draft content
          const mockDraftContent = `IN THE ${selectedCourt.toUpperCase()}

ORIGINAL CIVIL JURISDICTION

CIVIL WRIT PETITION NO. _____ OF 2026

IN THE MATTER OF:

[PETITIONER NAME]
...Petitioner

VERSUS

[RESPONDENT NAME]
...Respondent

PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA

TO,
THE HON'BLE ${selectedJudge.toUpperCase()} OF THE ${selectedCourt.toUpperCase()}

THE HUMBLE PETITION OF THE PETITIONER ABOVE-NAMED

MOST RESPECTFULLY SHOWETH:

1. That the petitioner is a law-abiding citizen.

2. That the impugned order dated [DATE] is wholly arbitrary and illegal.

3. That the petitioner has no alternative efficacious remedy except to approach this Hon'ble Court.

PRAYER

In view of the facts stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:

(a) Issue appropriate writs, orders or directions;

(b) Pass such other orders as this Hon'ble Court may deem fit in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL DUTY BOUND FOREVER PRAY.

Place: New Delhi
Date: ${new Date().toLocaleDateString('en-IN')}`;
          setDocumentContent(mockDraftContent);
        } else {
          // Start with blank template
          setDocumentContent(`IN THE ${selectedCourt.toUpperCase()}



`);
        }

        // Show processing screen
        setCurrentStage('processing');

        // After processing, move to editor
        setTimeout(() => {
          // Always use editor to show right panel with suggestions and chatbot
          setCurrentStage('editor');
        }, 3000);
      }, 1500);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const category = currentUploadCategory.current;
    const newDocs: UploadedDocument[] = Array.from(files).map((file, index) => ({
      id: `${category}-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      category
    }));

    setIsTyping(true);

    if (category === 'draft') {
      setDraftDoc(newDocs[0]);
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          proceedToSupportingDocs();
        }, 600);
      }, 800);
    } else if (category === 'supporting') {
      setSupportingDocs(prev => [...prev, ...newDocs]);
      setTimeout(() => {
        setIsTyping(false);
        proceedToCaseLaws();
      }, 800);
    } else if (category === 'caselaw') {
      setCaselawDocs(prev => [...prev, ...newDocs]);
      setTimeout(() => {
        setIsTyping(false);
        proceedToCourtSelection();
      }, 800);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMySpaceSelect = (documents: any[]) => {
    if (documents.length === 0) return;

    const category = currentUploadCategory.current;
    const newDocs: UploadedDocument[] = documents.map((doc, index) => ({
      id: `${category}-${Date.now()}-${index}`,
      name: doc.name,
      type: doc.type.toLowerCase(),
      category
    }));

    setIsTyping(true);
    setIsMySpaceDialogOpen(false);

    if (category === 'draft') {
      setDraftDoc(newDocs[0]);
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          proceedToSupportingDocs();
        }, 600);
      }, 800);
    } else if (category === 'supporting') {
      setSupportingDocs(prev => [...prev, ...newDocs]);
      setTimeout(() => {
        setIsTyping(false);
        proceedToCaseLaws();
      }, 800);
    } else if (category === 'caselaw') {
      setCaselawDocs(prev => [...prev, ...newDocs]);
      setTimeout(() => {
        setIsTyping(false);
        proceedToCourtSelection();
      }, 800);
    }
  };

  const analyzeDocument = (content: string) => {
    // Start analyzing animation
    setIsAnalyzingDocument(true);
    setAutoCheckIssues([]);

    // Simulate AI analysis delay
    setTimeout(() => {
      const issues: AutoCheckIssue[] = [];

      // Simple analysis rules (can be enhanced)
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Check for incomplete sections
        if (line.includes('[') && line.includes(']')) {
          issues.push({
            id: `incomplete-${index}`,
            type: 'warning',
            message: `Line ${index + 1}: Incomplete section detected - "${line.trim()}"`,
            line: index + 1
          });
        }

        // Check for formatting issues
        if (line.trim().length > 0 && !line.match(/^[A-Z0-9\s\(\)\[\]]/)) {
          issues.push({
            id: `format-${index}`,
            type: 'suggestion',
            message: `Line ${index + 1}: Consider using proper capitalization`,
            line: index + 1
          });
        }
      });

      // Check for missing elements
      if (!content.includes('PRAYER')) {
        issues.push({
          id: 'missing-prayer',
          type: 'error',
          message: 'Missing "PRAYER" section - Every petition should include a prayer',
        });
      }

      if (!content.includes('Date:')) {
        issues.push({
          id: 'missing-date',
          type: 'warning',
          message: 'Missing date field - Add the date at the end of document',
        });
      }

      setAutoCheckIssues(issues);
      setIsAnalyzingDocument(false);
    }, 2000); // 2 second delay for AI analysis animation
  };

  const handleSaveToMySpace = () => {
    setIsMySpaceSaveDialogOpen(true);
  };

  const handleSaveDocument = (folderPath: string, fileName: string, format: 'pdf' | 'doc') => {
    // Here you would normally save to backend/database
    // For now, we'll just show a success message
    toast.success(`Document saved to "${folderPath}" as "${fileName}" (${format.toUpperCase()})`);
    setIsMySpaceSaveDialogOpen(false);
  };

  const handleDownload = (format: 'pdf' | 'doc') => {
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `draftsman_document_${Date.now()}.${format === 'pdf' ? 'pdf' : 'docx'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Document downloaded as ${format.toUpperCase()}`);
  };

  const handleSendChatbotMessage = () => {
    if (!chatbotInput.trim()) return;

    // Add user message
    setChatbotMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: chatbotInput,
      isAI: false,
      timestamp: new Date()
    }]);

    setChatbotInput('');
    setIsChatbotTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsChatbotTyping(false);
      setChatbotMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I can help you with drafting questions, legal terminology, document structure, or suggest improvements based on your uploaded documents and case laws. What would you like to know?",
        isAI: true,
        timestamp: new Date()
      }]);
    }, 1500);
  };

  const handleIssueClick = (issue: AutoCheckIssue) => {
    if (!editorRef.current) return;

    if (issue.line) {
      // Scroll to the specific line
      const lines = documentContent.split('\n');
      const linesBefore = lines.slice(0, issue.line - 1);
      const charPosition = linesBefore.join('\n').length + (linesBefore.length > 0 ? 1 : 0);

      // Focus the editor
      editorRef.current.focus();

      // Set cursor position to the start of the line
      editorRef.current.setSelectionRange(charPosition, charPosition + lines[issue.line - 1].length);

      // Scroll into view
      editorRef.current.scrollTop = (issue.line - 1) * 20; // Approximate line height
    } else {
      // For issues without line numbers, just focus the editor
      editorRef.current.focus();
      editorRef.current.scrollTop = 0;
    }
  };

  // Render Processing View
  if (currentStage === 'processing') {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ToolNavigation
          currentTool="draftsman"
          onToolChange={onToolChange}
          onBack={onBack}
          activeTool={activeTool}
        />

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Preparing Your Workspace</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Word Editor View (Full Window)
  if (currentStage === 'word-editor') {
    return (
      <MSWordWindow
        isOpen={true}
        onClose={() => {
          setCurrentStage('initial');
          setMessages([]);
        }}
        content={documentContent}
        onContentChange={(newContent) => {
          setDocumentContent(newContent);
        }}
        fileName="Untitled Document.docx"
        onSave={() => {
          toast.success('Document saved successfully!');
        }}
        courtFormat={{
          font: 'Times New Roman',
          fontSize: 14,
          lineSpacing: 2.0
        }}
        isFullWindow={true}
      />
    );
  }

  // Render Editor View
  if (currentStage === 'editor') {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ToolNavigation
          currentTool="draftsman"
          onToolChange={onToolChange}
          onBack={onBack}
          activeTool={activeTool}
        />

        {/* Header with Actions */}
        <div className="bg-secondary/50 border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setCurrentStage('initial');
                  setMessages([]);
                }}
                variant="outline"
                size="sm"
                className="h-12 px-4 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <PenTool className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Jubee Counsel Workspace</h3>
                <p className="text-sm text-muted-foreground">{wordCount} words • {selectedCourt}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveToMySpace}
                variant="outline"
                size="sm"
                className="font-semibold border-border hover:bg-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                Save to My Space
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-semibold border-border hover:bg-accent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleDownload('pdf')}
                    className="cursor-pointer font-semibold"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDownload('doc')}
                    className="cursor-pointer font-semibold"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as DOC
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="bg-card border-b border-border px-6 py-3">
          <div className="flex items-center gap-6">
            {/* Font Size */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Type className="w-4 h-4" />
                  <span className="text-xs">{fontSize}pt</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {['10', '11', '12', '13', '14', '16'].map((size) => (
                  <DropdownMenuItem key={size} onClick={() => setFontSize(size)}>
                    {size}pt
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Line Spacing */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <AlignLeft className="w-4 h-4" />
                  <span className="text-xs">{lineSpacing}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {['1.0', '1.5', '2.0'].map((spacing) => (
                  <DropdownMenuItem key={spacing} onClick={() => setLineSpacing(spacing)}>
                    {spacing}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Court Format */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Scale className="w-4 h-4" />
                  <span className="text-xs hidden lg:inline">
                    {courtFormats.find(f => f.id === courtFormat)?.name}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {courtFormats.map((format) => (
                  <DropdownMenuItem key={format.id} onClick={() => setCourtFormat(format.id)}>
                    {format.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1" />

            <Badge variant="secondary" className="font-semibold">
              Session auto-saved
            </Badge>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Document Editor */}
          <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
            <div className="flex-1 overflow-y-auto ">
              <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-card shadow-lg rounded-lg p-12">
                  <textarea
                    ref={editorRef}
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    placeholder="Start typing your legal document here..."
                    className="w-full min-h-[1000px] text-black dark:text-foreground focus:outline-none resize-none font-serif leading-relaxed"
                    style={{
                      fontSize: `${fontSize}pt`,
                      lineHeight: lineSpacing
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsRightPaneCollapsed(!isRightPaneCollapsed)}
            className="w-8 bg-card border-x border-border hover:bg-accent transition-colors flex items-center justify-center"
          >
            {isRightPaneCollapsed ? (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* Right Pane: Three-Section Accordion */}
          {!isRightPaneCollapsed && (
            <div className="w-96 border-l border-border bg-background flex flex-col">
              {/* Section 1: Documents Referenced */}
              <div className={`border-b-2 flex flex-col transition-all duration-300 ${
                expandedPanel === 'documents'
                  ? 'flex-1 border-primary/30'
                  : 'flex-shrink-0 border-border'
              }`}>
                <button
                  onClick={() => setExpandedPanel(expandedPanel === 'documents' ? null : 'documents')}
                  className={`group backdrop-blur-sm border-b px-4 py-3.5 transition-all w-full text-left relative overflow-hidden ${
                    expandedPanel === 'documents'
                      ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-sm'
                      : 'bg-card/50 hover:bg-primary/5 border-border/50 hover:border-primary/20'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="flex items-center gap-2.5 relative z-10">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      expandedPanel === 'documents'
                        ? 'bg-primary/15 ring-2 ring-primary/30'
                        : 'bg-primary/10 group-hover:bg-primary/15'
                    }`}>
                      <FileText className={`w-4 h-4 transition-colors ${
                        expandedPanel === 'documents' ? 'text-primary' : 'text-primary/70 group-hover:text-primary'
                      }`} />
                    </div>
                    <h4 className={`text-sm font-bold transition-colors ${
                      expandedPanel === 'documents' ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    }`}>Documents Referenced</h4>
                    <Badge variant="secondary" className="text-xs ml-auto mr-2">
                      {draftDoc || supportingDocs.length > 0 || caselawDocs.length > 0
                        ? (draftDoc ? 1 : 0) + supportingDocs.length + caselawDocs.length
                        : 2}
                    </Badge>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      expandedPanel === 'documents'
                        ? 'bg-primary/20'
                        : 'bg-muted group-hover:bg-primary/10'
                    }`}>
                      <ChevronDown className={`w-4 h-4 transition-all duration-300 ${
                        expandedPanel === 'documents'
                          ? 'rotate-180 text-primary'
                          : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                    </div>
                  </div>
                  <p className={`text-xs mt-1.5 transition-colors relative z-10 ${
                    expandedPanel === 'documents' ? 'text-primary/70' : 'text-muted-foreground'
                  }`}>
                    All uploaded documents • {expandedPanel === 'documents' ? 'Expanded' : 'Click to expand'}
                  </p>
                </button>

                {expandedPanel === 'documents' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {draftDoc && (
                      <div>
                        <h5 className="text-xs font-bold text-muted-foreground mb-2">DRAFT DOCUMENT</h5>
                        <div className="p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">{draftDoc.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{draftDoc.type.toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {supportingDocs.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold text-muted-foreground mb-2">SUPPORTING DOCUMENTS</h5>
                        <div className="space-y-2">
                          {supportingDocs.map((doc) => (
                            <div key={doc.id} className="p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
                              <div className="flex items-start gap-2">
                                <File className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-foreground truncate">{doc.name}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">{doc.type.toUpperCase()}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {caselawDocs.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold text-muted-foreground mb-2">CASE LAWS</h5>
                        <div className="space-y-2">
                          {caselawDocs.map((doc) => (
                            <div key={doc.id} className="p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors">
                              <div className="flex items-start gap-2">
                                <Scale className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-foreground truncate">{doc.name}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">{doc.type.toUpperCase()}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {!draftDoc && supportingDocs.length === 0 && caselawDocs.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-foreground">No documents yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Upload documents during intake</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section 2: Suggestions */}
              <div className={`border-b-2 flex flex-col transition-all duration-300 ${
                expandedPanel === 'suggestions'
                  ? 'flex-1 border-primary/30'
                  : 'flex-shrink-0 border-border'
              }`}>
                <button
                  onClick={() => setExpandedPanel(expandedPanel === 'suggestions' ? null : 'suggestions')}
                  className={`group backdrop-blur-sm border-b px-4 py-3.5 transition-all w-full text-left relative overflow-hidden ${
                    expandedPanel === 'suggestions'
                      ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-sm'
                      : 'bg-card/50 hover:bg-primary/5 border-border/50 hover:border-primary/20'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="flex items-center gap-2.5 relative z-10">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      expandedPanel === 'suggestions'
                        ? 'bg-primary/15 ring-2 ring-primary/30'
                        : 'bg-primary/10 group-hover:bg-primary/15'
                    }`}>
                      <AlertCircle className={`w-4 h-4 transition-colors ${
                        expandedPanel === 'suggestions' ? 'text-primary' : 'text-primary/70 group-hover:text-primary'
                      }`} />
                    </div>
                    <h4 className={`text-sm font-bold transition-colors ${
                      expandedPanel === 'suggestions' ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    }`}>Suggestions</h4>
                    <Badge variant="secondary" className="text-xs ml-auto mr-2">
                      {autoCheckIssues.length}
                    </Badge>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      expandedPanel === 'suggestions'
                        ? 'bg-primary/20'
                        : 'bg-muted group-hover:bg-primary/10'
                    }`}>
                      <ChevronDown className={`w-4 h-4 transition-all duration-300 ${
                        expandedPanel === 'suggestions'
                          ? 'rotate-180 text-primary'
                          : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                    </div>
                  </div>
                  <p className={`text-xs mt-1.5 transition-colors relative z-10 ${
                    expandedPanel === 'suggestions' ? 'text-primary/70' : 'text-muted-foreground'
                  }`}>
                    Real-time document analysis • {expandedPanel === 'suggestions' ? 'Expanded' : 'Click to expand'}
                  </p>
                </button>

                {expandedPanel === 'suggestions' && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isAnalyzingDocument ? (
                      <div className="text-center py-8">
                        <div className="relative inline-block mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-foreground">Analyzing Document...</p>
                        <div className="flex items-center justify-center gap-1 mt-3">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    ) : autoCheckIssues.length === 0 ? (
                      <>
                        <div
                          className="p-3 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md bg-red-500/5 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 bg-red-500">
                              <X className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-foreground">Error</p>
                              <p className="text-xs text-muted-foreground mt-1">Paragraph 8 wrongly states that Arbitration was invoked vide letter dated 21.06.2025. Arbitration was invoked by letter dated 07.07.2025;</p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="p-3 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/10"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 bg-yellow-500">
                              <AlertCircle className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-foreground">Warning</p>
                              <p className="text-xs text-muted-foreground mt-1">In Prayer clause, relief of Specific Performance is sought, however, the Plaintiff has not undertaken anywhere that it is ready and willing to perform its part of the obligations.</p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="p-3 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 bg-blue-500">
                              <Lightbulb className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-foreground">Suggestion</p>
                              <p className="text-xs text-muted-foreground mt-1">The Petition does not explain territorial jurisdiction of the Hon'ble Court. Please add a paragraph to specify the same. Reliance maybe placed on the purchase order dated 01.02.2025 to establish that part cause of action has arisen within the jurisdiction of this Hon'ble Court.</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      autoCheckIssues.map((issue) => (
                        <div
                          key={issue.id}
                          onClick={() => handleIssueClick(issue)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                            issue.type === 'error'
                              ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10'
                              : issue.type === 'warning'
                              ? 'bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/10'
                              : 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              issue.type === 'error' ? 'bg-red-500' : issue.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}>
                              {issue.type === 'error' ? (
                                <X className="w-3 h-3 text-white" />
                              ) : issue.type === 'warning' ? (
                                <AlertCircle className="w-3 h-3 text-white" />
                              ) : (
                                <Lightbulb className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-foreground capitalize">{issue.type}</p>
                              <p className="text-xs text-muted-foreground mt-1">{issue.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Section 3: AI Assistant Chatbot */}
              <div className={`border-b-2 flex flex-col transition-all duration-300 ${
                expandedPanel === 'chatbot'
                  ? 'flex-1 border-primary/30'
                  : 'flex-shrink-0 border-border'
              }`}>
                <button
                  onClick={() => setExpandedPanel(expandedPanel === 'chatbot' ? null : 'chatbot')}
                  className={`group backdrop-blur-sm border-b px-4 py-3.5 transition-all w-full text-left relative overflow-hidden ${
                    expandedPanel === 'chatbot'
                      ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-sm'
                      : 'bg-card/50 hover:bg-primary/5 border-border/50 hover:border-primary/20'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="flex items-center gap-2.5 relative z-10">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      expandedPanel === 'chatbot'
                        ? 'bg-primary/15 ring-2 ring-primary/30'
                        : 'bg-primary/10 group-hover:bg-primary/15'
                    }`}>
                      <img
                        src={jubeeLogo}
                        alt="Jubee"
                        className={`w-4 h-4 transition-opacity ${
                          expandedPanel === 'chatbot' ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <h4 className={`text-sm font-bold transition-colors ${
                      expandedPanel === 'chatbot' ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    }`}>Jubee</h4>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ml-auto ${
                      expandedPanel === 'chatbot'
                        ? 'bg-primary/20'
                        : 'bg-muted group-hover:bg-primary/10'
                    }`}>
                      <ChevronDown className={`w-4 h-4 transition-all duration-300 ${
                        expandedPanel === 'chatbot'
                          ? 'rotate-180 text-primary'
                          : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                    </div>
                  </div>
                  <p className={`text-xs mt-1.5 transition-colors relative z-10 ${
                    expandedPanel === 'chatbot' ? 'text-primary/70' : 'text-muted-foreground'
                  }`}>
                    Ask questions about drafting • {expandedPanel === 'chatbot' ? 'Expanded' : 'Click to expand'}
                  </p>
                </button>

                {expandedPanel === 'chatbot' && (
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-4">
                      {chatbotMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
                            <img src={jubeeLogo} alt="Jubee" className="w-10 h-10 object-contain" />
                          </div>
                          <h5 className="text-sm font-semibold text-foreground mb-2">Start a conversation</h5>
                          <p className="text-xs text-muted-foreground max-w-[250px] mb-4">
                            {!draftDoc && supportingDocs.length === 0 && caselawDocs.length === 0
                              ? 'Get help with drafting from scratch'
                              : 'Ask me about drafting, legal terms, or document structure'}
                          </p>
                          <div className="space-y-2 w-full max-w-[250px]">
                            {!draftDoc && supportingDocs.length === 0 && caselawDocs.length === 0 ? (
                              <>
                                <button
                                  onClick={() => setChatbotInput("Help me structure a petition")}
                                  className="w-full text-left px-3 py-2 bg-muted hover:bg-primary/10 rounded-lg text-xs text-foreground transition-colors border border-border"
                                >
                                  Help me structure a petition
                                </button>
                                <button
                                  onClick={() => setChatbotInput("What should I include in prayers?")}
                                  className="w-full text-left px-3 py-2 bg-muted hover:bg-primary/10 rounded-lg text-xs text-foreground transition-colors border border-border"
                                >
                                  What should I include in prayers?
                                </button>
                                <button
                                  onClick={() => setChatbotInput("Draft an opening statement")}
                                  className="w-full text-left px-3 py-2 bg-muted hover:bg-primary/10 rounded-lg text-xs text-foreground transition-colors border border-border"
                                >
                                  Draft an opening statement
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setChatbotInput("Help me improve this section")}
                                  className="w-full text-left px-3 py-2 bg-muted hover:bg-primary/10 rounded-lg text-xs text-foreground transition-colors border border-border"
                                >
                                  Help me improve this section
                                </button>
                                <button
                                  onClick={() => setChatbotInput("Explain legal terminology")}
                                  className="w-full text-left px-3 py-2 bg-muted hover:bg-primary/10 rounded-lg text-xs text-foreground transition-colors border border-border"
                                >
                                  Explain legal terminology
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {chatbotMessages.map((message) => (
                            <div key={message.id} className={`flex gap-2 ${message.isAI ? 'items-start' : 'items-end flex-row-reverse'}`}>
                              {message.isAI && (
                                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  <img src={jubeeLogo} alt="Jubee" className="w-4 h-4 object-contain" />
                                </div>
                              )}
                              <div className={`max-w-[220px] rounded-xl px-3 py-2 ${message.isAI ? 'bg-muted border border-border' : 'bg-primary text-primary-foreground'}`}>
                                <p className="text-xs leading-relaxed">{message.text}</p>
                                <p className={`text-[10px] mt-1 ${message.isAI ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                                  {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                          {isChatbotTyping && (
                            <div className="flex gap-2 items-start">
                              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <img src={jubeeLogo} alt="Jubee" className="w-4 h-4 object-contain" />
                              </div>
                              <div className="bg-muted border border-border rounded-xl px-3 py-2">
                                <div className="flex gap-1">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-3 border-t border-border bg-background flex-shrink-0">
                      <div className="relative">
                        <Input
                          value={chatbotInput}
                          onChange={(e) => setChatbotInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChatbotMessage()}
                          placeholder="Ask about drafting..."
                          className="w-full h-9 pl-3 pr-10 text-xs bg-muted/50 border border-border focus:border-primary rounded-lg text-foreground"
                        />
                        <Button
                          onClick={handleSendChatbotMessage}
                          disabled={!chatbotInput.trim()}
                          size="icon"
                          className="absolute right-1 top-1 h-7 w-7 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                        >
                          <Send className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* My Space Dialog */}
        {isMySpaceDialogOpen && (
          <MySpacePickerDialog
            isOpen={isMySpaceDialogOpen}
            onClose={() => setIsMySpaceDialogOpen(false)}
            onSelect={handleMySpaceSelect}
          />
        )}

        {/* Judge Selection Modal */}
        <JudgeSelectionModal
          isOpen={isJudgeModalOpen}
          onClose={() => setIsJudgeModalOpen(false)}
          onConfirm={handleJudgeModalConfirm}
        />

        {/* My Space Save Dialog */}
        {isMySpaceSaveDialogOpen && (
          <MySpaceSaveDialog
            isOpen={isMySpaceSaveDialogOpen}
            onClose={() => setIsMySpaceSaveDialogOpen(false)}
            documentContent={documentContent}
            onSave={handleSaveDocument}
          />
        )}
      </div>
    );
  }

  // Render Conversational Intake View
  return (
    <div className="flex flex-col h-screen bg-background">
      <ToolNavigation
        currentTool="draftsman"
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
              <PenTool className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Jubee Counsel</h2>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6" ref={chatContainerRef}>
          <div className="min-h-full flex flex-col justify-end">
            <div className="space-y-6 pb-2">
            {messages.map((message, index) => (
              <div key={message.id}>
                {/* Message Bubble */}
                <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                        ? message.content.slice(0, visibleChars[message.id] || message.content.length)
                        : message.content
                      }
                    </p>

                    {/* Show uploaded files */}
                    {message.uploadedFiles && message.uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center gap-2 text-sm bg-primary-foreground/10 rounded-lg px-3 py-2">
                            <File className="w-4 h-4" />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Show selected judges as chips */}
                    {message.judgeChips && message.judgeChips.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.judgeChips.map((judge, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 rounded-lg text-sm text-white"
                          >
                            <Scale className="w-3.5 h-3.5 text-[#1E3A8A]" />
                            <span>Hon'ble Mr./Ms. Justice {judge}</span>
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
                {message.type === 'ai' && message.options && index === messages.length - 1 && !isTyping && typingMessageId !== message.id && (
                  <div className="ml-16 mt-4 flex flex-wrap gap-2">
                    {message.options.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option.id, option.label)}
                          className="px-4 py-2.5 bg-card hover:bg-primary/10 border-2 border-border hover:border-primary rounded-xl transition-all hover:shadow-md flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          {option.label}
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
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-border bg-background/95 backdrop-blur-sm px-6 py-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    // No special handling needed for judge selection anymore
                  }
                }}
                placeholder="Type your message here..."
                className="w-full h-16 pl-6 pr-28 text-base bg-card border-2 border-border rounded-2xl focus:border-primary text-foreground"
                disabled={currentStage === 'judge-selection'}
              />
              <div className="absolute right-2 top-3 flex items-center gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-accent"
                  disabled={currentStage === 'judge-selection'}
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button
                  onClick={() => {
                    // Regular message send
                  }}
                  disabled={true}
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* My Space Dialog */}
      {isMySpaceDialogOpen && (
        <MySpacePickerDialog
          isOpen={isMySpaceDialogOpen}
          onClose={() => setIsMySpaceDialogOpen(false)}
          onSelect={handleMySpaceSelect}
        />
      )}

      {/* Judge Selection Modal */}
      <JudgeSelectionModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        onConfirm={handleJudgeModalConfirm}
      />
    </div>
  );
}