import { useState, useRef, useEffect } from 'react';
import { 
  FileSearch, ArrowLeft, Upload, File, X, Send, Bot, User, CheckCircle, 
  XCircle, AlertTriangle, Download, Save, Eye, Lightbulb, AlertCircle,
  Paperclip, ChevronRight, Languages, Edit3, RotateCcw, FileText, Scale,
  BookOpen, Link as LinkIcon, Sparkles, ChevronDown, RefreshCw, FolderOpen,
  FilePlus, FileUp, Type, Circle, Check, Maximize2, Minimize2
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
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

interface PreCheckToolProps {
  onBack: () => void;
  onToolChange?: (tool: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner' | 'precheck') => void;
  activeTool?: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner' | 'precheck';
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  category: 'petition' | 'annexure';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  options?: Array<{ id: string; label: string; icon?: any }>;
  uploadedFiles?: UploadedDocument[];
}

type DefectCategory = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';
type DefectSeverity = 'critical' | 'warning' | 'suggestion';
type ResolutionType = 'auto' | 'translation' | 'upload' | 'rename' | 'edit';

interface DefectItem {
  id: string;
  registryCategory: DefectCategory;
  categoryName: string;
  type: string;
  severity: DefectSeverity;
  title: string;
  description: string;
  aiRecommendation: string;
  page?: number;
  status: 'pending' | 'resolved' | 'ignored';
  resolutionType: ResolutionType;
  affectedFile?: string;
  similarCount?: number;
}

type ConversationStage = 'initial' | 'jurisdiction' | 'case-type' | 'main-file' | 'annexures' | 'processing' | 'workspace';
type ResolutionModalType = 'translation' | 'upload' | 'rename' | 'edit' | null;

const COURTS = [
  { id: 'supreme', name: 'Supreme Court of India' },
  { id: 'delhi-hc', name: 'Delhi High Court' }
];

const CASE_TYPES: Record<string, string[]> = {
  'supreme': ['SLP (Civil)', 'SLP (Criminal)', 'Writ Petition', 'Civil Appeal', 'Criminal Appeal', 'Transfer Petition', 'Contempt Petition'],
  'delhi-hc': ['WP (Civil)', 'WP (Criminal)', 'Civil Suit', 'Criminal Appeal', 'FAO', 'Company Petition', 'Arbitration Petition']
};

const CATEGORY_DETAILS: Record<DefectCategory, { name: string; description: string }> = {
  'A': { name: 'Annexure Completeness', description: 'Missing, dim, or incomplete annexures' },
  'B': { name: 'Service & Affidavit', description: 'Service proof and affidavit defects' },
  'C': { name: 'Caveat Issues', description: 'Caveat search and compliance' },
  'D': { name: 'Signature & Authority', description: 'Missing signatures, Vakalatnama issues' },
  'E': { name: 'Index & Pagination', description: 'Index mismatches, page numbering' },
  'F': { name: 'OCR & Technical', description: 'OCR, bookmarks, hyperlinks' },
  'G': { name: 'Court Fee', description: 'Court fee and stamp duty' },
  'H': { name: 'Format Compliance', description: 'Font, margins, line spacing' },
  'I': { name: 'Prayer & Relief', description: 'Prayer clause issues' },
  'J': { name: 'Party Details', description: 'Party names and addresses' },
  'K': { name: 'Formatting', description: 'Non-compliant margins, spacing, font' },
  'L': { name: 'Language', description: 'Vernacular documents without translation' }
};

export function PreCheckTool({ onBack, onToolChange, activeTool }: PreCheckToolProps) {
  // Conversation phase states
  const [currentStage, setCurrentStage] = useState<ConversationStage>('initial');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMySpaceDialogOpen, setIsMySpaceDialogOpen] = useState(false);
  const [isMySpaceSaveDialogOpen, setIsMySpaceSaveDialogOpen] = useState(false);

  // Typewriter effect state
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [visibleChars, setVisibleChars] = useState<Record<string, number>>({});

  // Case details states
  const [petitionerName, setPetitionerName] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [selectedCaseType, setSelectedCaseType] = useState('');
  
  // Document states
  const [mainFile, setMainFile] = useState<UploadedDocument | null>(null);
  const [annexures, setAnnexures] = useState<UploadedDocument[]>([]);
  
  // Workspace states
  const [defects, setDefects] = useState<DefectItem[]>([]);
  const [selectedDefect, setSelectedDefect] = useState<DefectItem | null>(null);
  const [documentContent, setDocumentContent] = useState('');
  const [expandedDefect, setExpandedDefect] = useState<string | null>(null);
  
  // Resolution modal states
  const [resolutionModal, setResolutionModal] = useState<ResolutionModalType>(null);
  const [activeDefectForResolution, setActiveDefectForResolution] = useState<DefectItem | null>(null);
  const [uploadOption, setUploadOption] = useState<'append' | 'replace' | null>(null);
  const [isReProcessing, setIsReProcessing] = useState(false);
  const [fullScreenPanel, setFullScreenPanel] = useState<'document' | 'defects' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resolutionFileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadCategory = useRef<'petition' | 'annexure'>('petition');

  // Initialize conversation
  useEffect(() => {
    addAIMessage(
      "Hello! I'm your Pre-Check Assistant. I'll help you prepare your filing by checking it against court registry standards. Let's start by getting the party details.\n\nPlease provide the Petitioner name (you can add 'and anr' or 'and ors' if multiple):",
      []
    );
  }, []);

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
        }, 20);

        return () => clearTimeout(timer);
      } else {
        setTypingMessageId(null);
      }
    }
  }, [typingMessageId, visibleChars, messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
    }
  }, [messages.length, isTyping, isProcessing]);

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const trimmedInput = inputValue.trim();
    
    if (currentStage === 'initial') {
      // Petitioner name
      setPetitionerName(trimmedInput);
      addUserMessage(trimmedInput);
      setInputValue('');
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage('Great! Now please provide the Respondent name (you can add \'and anr\' or \'and ors\' if multiple):');
        setCurrentStage('jurisdiction');
      }, 800);
    } else if (currentStage === 'jurisdiction') {
      // Respondent name
      setRespondentName(trimmedInput);
      addUserMessage(trimmedInput);
      setInputValue('');
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          'Perfect! Now please select the Court:',
          COURTS.map(court => ({ id: court.id, label: court.name, icon: Scale }))
        );
      }, 800);
    } else if (currentStage === 'case-type') {
      // Case type typed by user
      setSelectedCaseType(trimmedInput);
      addUserMessage(trimmedInput);
      setInputValue('');
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          'Perfect! Now let\'s upload your main file (Petition/Application). Would you like to upload from your device or choose from My Space?',
          [
            { id: 'upload-from-myspace-main', label: 'Upload from My Space', icon: File },
            { id: 'upload-new-main', label: 'Upload New File', icon: Upload }
          ]
        );
        setCurrentStage('main-file');
      }, 800);
    }
  };

  const handleOptionSelect = (optionId: string, optionLabel: string) => {
    setIsTyping(true);
    
    if (COURTS.find(c => c.id === optionId)) {
      // Court selection
      setSelectedCourt(optionLabel);
      setSelectedCourtId(optionId);
      addUserMessage(optionLabel);
      
      setTimeout(() => {
        setIsTyping(false);
        const caseTypes = CASE_TYPES[optionId] || [];
        addAIMessage(
          'Excellent! Please write your case type or select from suggestions below:',
          caseTypes.map((type, index) => ({ id: `case-type-${index}`, label: type, icon: FileText }))
        );
        setCurrentStage('case-type');
      }, 800);
    } else if (optionId.startsWith('case-type-')) {
      // Case type selection
      setSelectedCaseType(optionLabel);
      addUserMessage(optionLabel);
      
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          'Perfect! Now let\'s upload your main file (Petition/Application). Would you like to upload from your device or choose from My Space?',
          [
            { id: 'upload-from-myspace-main', label: 'Upload from My Space', icon: File },
            { id: 'upload-new-main', label: 'Upload New File', icon: Upload }
          ]
        );
        setCurrentStage('main-file');
      }, 800);
    } else if (optionId === 'upload-from-myspace-main') {
      addUserMessage('I\'ll upload from My Space');
      setIsTyping(false);
      currentUploadCategory.current = 'petition';
      setIsMySpaceDialogOpen(true);
    } else if (optionId === 'upload-new-main') {
      addUserMessage('I\'ll upload a new file');
      setIsTyping(false);
      currentUploadCategory.current = 'petition';
      fileInputRef.current?.click();
    } else if (optionId === 'upload-annexures') {
      addUserMessage('I\'ll upload annexures');
      setIsTyping(false);
      currentUploadCategory.current = 'annexure';
      fileInputRef.current?.click();
    } else if (optionId === 'upload-from-myspace-annexures') {
      addUserMessage('I\'ll upload annexures from My Space');
      setIsTyping(false);
      currentUploadCategory.current = 'annexure';
      setIsMySpaceDialogOpen(true);
    } else if (optionId === 'skip-annexures') {
      addUserMessage('Skip annexures');
      setTimeout(() => {
        proceedToProcessing();
      }, 500);
    } else if (optionId === 'continue-annexures') {
      proceedToProcessing();
    }
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

    if (category === 'petition') {
      setMainFile(newDocs[0]);
      addUserMessage(`Uploaded: ${newDocs[0].name}`, [newDocs[0]]);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          'Excellent! Main file received. Would you like to upload Annexures (supporting documents)?',
          [
            { id: 'upload-annexures', label: 'Upload Annexures', icon: Upload },
            { id: 'upload-from-myspace-annexures', label: 'Upload from My Space', icon: File },
            { id: 'skip-annexures', label: 'Skip This Step', icon: ChevronRight }
          ]
        );
        setCurrentStage('annexures');
      }, 800);
    } else if (category === 'annexure') {
      setAnnexures(prev => [...prev, ...newDocs]);
      addUserMessage(`Uploaded ${newDocs.length} annexure(s)`, newDocs);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          `Perfect! I've received ${newDocs.length} annexure(s). Would you like to add more or continue to scrutiny?`,
          [
            { id: 'upload-annexures', label: 'Upload More', icon: Upload },
            { id: 'upload-from-myspace-annexures', label: 'Upload from My Space', icon: File },
            { id: 'continue-annexures', label: 'Continue to Scrutiny', icon: ChevronRight }
          ]
        );
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

    if (category === 'petition') {
      setMainFile(newDocs[0]);
      addUserMessage(`Uploaded from My Space: ${newDocs[0].name}`, [newDocs[0]]);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          'Excellent! Main file received. Would you like to upload Annexures (supporting documents)?',
          [
            { id: 'upload-annexures', label: 'Upload Annexures', icon: Upload },
            { id: 'upload-from-myspace-annexures', label: 'Upload from My Space', icon: File },
            { id: 'skip-annexures', label: 'Skip This Step', icon: ChevronRight }
          ]
        );
        setCurrentStage('annexures');
      }, 800);
    } else if (category === 'annexure') {
      setAnnexures(prev => [...prev, ...newDocs]);
      addUserMessage(`Uploaded ${newDocs.length} annexure(s) from My Space`, newDocs);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          `Perfect! I've received ${newDocs.length} annexure(s). Would you like to add more or continue to scrutiny?`,
          [
            { id: 'upload-annexures', label: 'Upload More', icon: Upload },
            { id: 'upload-from-myspace-annexures', label: 'Upload from My Space', icon: File },
            { id: 'continue-annexures', label: 'Continue to Scrutiny', icon: ChevronRight }
          ]
        );
      }, 800);
    }
  };

  const proceedToProcessing = () => {
    setIsTyping(false);
    setIsProcessing(true);
    addAIMessage('Perfect! I have all the documents. Starting Pre-Check now...');
    
    setCurrentStage('processing');
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate comprehensive mock defects across all categories
      const mockDefects: DefectItem[] = [
        // Category A: Annexure Completeness
        {
          id: '1',
          registryCategory: 'A',
          categoryName: 'Annexure Completeness',
          type: 'Missing Annexure',
          severity: 'critical',
          title: 'Annexure A-2 mentioned but not attached',
          description: 'The petition references Annexure A-2 in Para 4 but it was not found in uploaded files.',
          aiRecommendation: 'Upload the missing Annexure A-2 or remove the reference from the petition.',
          status: 'pending',
          resolutionType: 'upload',
          affectedFile: 'Main Petition',
          similarCount: 0
        },
        {
          id: '2',
          registryCategory: 'A',
          categoryName: 'Annexure Completeness',
          type: 'Dim/Illegible Document',
          severity: 'critical',
          title: 'Annexure A-5 is dim and illegible',
          description: 'The scanned copy of Annexure A-5 has poor contrast and text is not clearly readable.',
          aiRecommendation: 'Replace with a high-quality scan or certified copy of the document.',
          status: 'pending',
          resolutionType: 'upload',
          affectedFile: 'Annexure A-5',
          page: 28
        },
        // Category D: Signature & Authority
        {
          id: '3',
          registryCategory: 'D',
          categoryName: 'Signature & Authority',
          type: 'Vakalatnama Verification',
          severity: 'critical',
          title: 'Vakalatnama not signed on all pages',
          description: 'The Vakalatnama must be signed by the advocate on each page to establish authorization.',
          aiRecommendation: 'Ensure all pages of the Vakalatnama are signed. Replace with corrected version.',
          page: 3,
          status: 'pending',
          resolutionType: 'upload',
          affectedFile: 'Vakalatnama'
        },
        // Category E: Index & Pagination
        {
          id: '4',
          registryCategory: 'E',
          categoryName: 'Index & Pagination',
          type: 'Index Mismatch',
          severity: 'warning',
          title: 'Index does not match actual annexures',
          description: 'The index lists Annexures A-1 to A-6, but only A-1, A-3, A-4, A-5 are attached.',
          aiRecommendation: 'Update the index to reflect the actual annexures. Jubee can regenerate automatically.',
          status: 'pending',
          resolutionType: 'auto',
          affectedFile: 'Index Page'
        },
        {
          id: '5',
          registryCategory: 'E',
          categoryName: 'Index & Pagination',
          type: 'Continuous Pagination',
          severity: 'warning',
          title: 'Page numbering breaks at Annexure A-3',
          description: 'Page numbers jump from 24 to 30, missing pages 25-29 in the sequence.',
          aiRecommendation: 'Renumber pages continuously. Jubee can fix this automatically.',
          status: 'pending',
          resolutionType: 'auto',
          affectedFile: 'Annexure A-3',
          page: 24,
          similarCount: 0
        },
        // Category F: OCR & Technical
        {
          id: '6',
          registryCategory: 'F',
          categoryName: 'OCR & Technical',
          type: 'OCR Status',
          severity: 'warning',
          title: 'Annexures A-3 and A-5 are not OCR-enabled',
          description: 'These annexures are scanned images without OCR, making them non-searchable.',
          aiRecommendation: 'Enable OCR on these files for registry compliance. Jubee can process automatically.',
          status: 'pending',
          resolutionType: 'auto',
          affectedFile: 'Annexure A-3, A-5',
          similarCount: 2
        },
        // Category K: Formatting
        {
          id: '7',
          registryCategory: 'K',
          categoryName: 'Formatting',
          type: 'Margin Requirements',
          severity: 'warning',
          title: 'Left margin non-compliant on pages 5-12',
          description: 'The left margin is 1 inch instead of the required 1.25 inches per registry rules.',
          aiRecommendation: 'Reformat with correct margins. Jubee can auto-fix this globally across all pages.',
          page: 5,
          status: 'pending',
          resolutionType: 'auto',
          affectedFile: 'Main Petition',
          similarCount: 8
        },
        {
          id: '8',
          registryCategory: 'K',
          categoryName: 'Formatting',
          type: 'Line Spacing',
          severity: 'suggestion',
          title: 'Line spacing is 1.0 instead of 1.5',
          description: 'Registry standards require 1.5 line spacing throughout the petition.',
          aiRecommendation: 'Adjust line spacing globally. Auto-fix available.',
          status: 'pending',
          resolutionType: 'auto',
          affectedFile: 'Main Petition',
          similarCount: 15
        },
        // Category L: Language/Translation
        {
          id: '9',
          registryCategory: 'L',
          categoryName: 'Language',
          type: 'Vernacular Document',
          severity: 'critical',
          title: 'Annexure A-8 is in Hindi without translation',
          description: 'Registry rules require vernacular documents to have certified English translations attached.',
          aiRecommendation: 'Translate Annexure A-8 to English using Jubee Translation Tool or upload pre-translated copy.',
          status: 'pending',
          resolutionType: 'translation',
          affectedFile: 'Annexure A-8',
          page: 42
        },
        // Category J: Party Details
        {
          id: '10',
          registryCategory: 'J',
          categoryName: 'Party Details',
          type: 'Party Name Typo',
          severity: 'warning',
          title: 'Petitioner name spelling inconsistency',
          description: 'Petitioner is spelled as "Ramesh Kumar" on page 1 but "Ramesh Kuamr" on page 8.',
          aiRecommendation: 'Correct the typo to maintain consistency. Use inline edit.',
          status: 'pending',
          resolutionType: 'edit',
          affectedFile: 'Main Petition',
          page: 8
        },
        // Category B: Service & Affidavit
        {
          id: '11',
          registryCategory: 'B',
          categoryName: 'Service & Affidavit',
          type: 'Service Proof',
          severity: 'critical',
          title: 'Missing proof of service on respondents',
          description: 'No affidavit of service or postal receipts attached for service on Respondent No. 2.',
          aiRecommendation: 'Upload proof of service (registered post receipt or affidavit of service).',
          status: 'pending',
          resolutionType: 'upload',
          affectedFile: 'Service Documents'
        },
        // Category E: Structural - Rename
        {
          id: '12',
          registryCategory: 'E',
          categoryName: 'Index & Pagination',
          type: 'Annexure Title Mismatch',
          severity: 'warning',
          title: 'Annexure labeled as A-1 should be A-1A',
          description: 'Based on the content, this annexure should be numbered A-1A as it\'s a supplementary document.',
          aiRecommendation: 'Rename the annexure from A-1 to A-1A for accurate indexing.',
          status: 'pending',
          resolutionType: 'rename',
          affectedFile: 'Annexure A-1'
        }
      ];
      
      setDefects(mockDefects);
      
      // Initialize document content with mock petition
      setDocumentContent(generateMockPetition());
      
      setCurrentStage('workspace');
    }, 3000);
  };

  const generateMockPetition = () => {
    return `IN THE ${selectedCourt.toUpperCase()}

ORIGINAL CIVIL JURISDICTION

${selectedCaseType.toUpperCase()} NO. _____ OF 2026

IN THE MATTER OF:

${petitionerName.toUpperCase()}
...Petitioner

VERSUS

${respondentName.toUpperCase()}
...Respondent

PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA

TO,
THE HON'BLE CHIEF JUSTICE AND HIS COMPANION JUSTICES OF THE ${selectedCourt.toUpperCase()}

THE HUMBLE PETITION OF THE PETITIONER ABOVE-NAMED

MOST RESPECTFULLY SHOWETH:

1. That the petitioner is a law-abiding citizen and has no criminal record.

2. That the impugned order dated [DATE] is wholly arbitrary, illegal, and violative of Articles 14, 19, and 21 of the Constitution of India.

3. That the petitioner has no alternative efficacious remedy except to approach this Hon'ble Court under Article 226 of the Constitution of India.

4. That the petitioner relies on Annexure A-1 (copy of impugned order) and Annexure A-2 (supporting documents).

PRAYER

In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:

(a) Issue appropriate writs, orders or directions quashing the impugned order;

(b) Pass such other orders as this Hon'ble Court may deem fit in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL DUTY BOUND FOREVER PRAY.

Place: New Delhi
Date: ${new Date().toLocaleDateString('en-IN')}`;
  };

  // Advanced Resolution Handlers
  const handleResolveDefect = (defect: DefectItem) => {
    setActiveDefectForResolution(defect);
    
    if (defect.resolutionType === 'auto') {
      // Auto-fix
      handleAutoFix(defect);
    } else if (defect.resolutionType === 'translation') {
      // Open translation modal
      setResolutionModal('translation');
    } else if (defect.resolutionType === 'upload') {
      // Open upload modal
      setResolutionModal('upload');
    } else if (defect.resolutionType === 'rename') {
      // Open rename modal
      setResolutionModal('rename');
    } else if (defect.resolutionType === 'edit') {
      // Open edit modal
      setResolutionModal('edit');
    }
  };

  const handleAutoFix = (defect: DefectItem) => {
    setIsReProcessing(true);
    setCurrentStage('processing');
    toast.success('Re-running Pre-Check...', {
      description: defect.title
    });
    
    setTimeout(() => {
      setDefects(prev => prev.map(d => 
        d.id === defect.id ? { ...d, status: 'resolved' } : d
      ));
      setIsReProcessing(false);
      setCurrentStage('workspace');
      toast.success('Pre-Check complete - Defect resolved');
    }, 2500);
  };

  const handleApplyToSimilar = (defect: DefectItem) => {
    if (!defect.similarCount || defect.similarCount === 0) return;
    
    toast.success(`Applying fix to ${defect.similarCount} similar defects...`);
    
    setTimeout(() => {
      setDefects(prev => prev.map(d => 
        d.type === defect.type && d.status === 'pending'
          ? { ...d, status: 'resolved' }
          : d
      ));
      toast.success(`Resolved ${defect.similarCount + 1} defects`);
    }, 2000);
  };

  const handleIgnoreDefect = (defectId: string) => {
    setDefects(prev => prev.map(d => 
      d.id === defectId ? { ...d, status: 'ignored' } : d
    ));
    toast.info('Defect marked as ignored');
  };

  const handleRectifyAll = () => {
    const autoFixableDefects = defects.filter(d => 
      d.resolutionType === 'auto' && d.status === 'pending'
    );
    
    toast.success(`Rectifying ${autoFixableDefects.length} global defects...`, {
      description: 'Fixing margins, formatting, OCR, and pagination'
    });
    
    setTimeout(() => {
      setDefects(prev => prev.map(d => 
        d.resolutionType === 'auto' && d.status === 'pending'
          ? { ...d, status: 'resolved' }
          : d
      ));
      toast.success('All global defects rectified');
    }, 3000);
  };

  // Translation Resolution Handlers
  const handleOpenTranslationTool = () => {
    toast.info('Opening Jubee Translation Tool', {
      description: 'You can translate documents with certified translations'
    });
    setResolutionModal(null);
    // In real implementation, navigate to translation tool
  };

  const handleTranslationUpload = (option: 'append' | 'replace') => {
    setUploadOption(option);
    resolutionFileInputRef.current?.click();
  };

  const handleTranslationFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (activeDefectForResolution) {
      setIsReProcessing(true);
      setCurrentStage('processing');
      
      if (uploadOption === 'append') {
        toast.success('Re-running Pre-Check...', {
          description: `Adding translation: ${file.name}`
        });
      } else if (uploadOption === 'replace') {
        toast.success('Re-running Pre-Check...', {
          description: `Replacing with: ${file.name}`
        });
      }
      
      setTimeout(() => {
        setDefects(prev => prev.map(d => 
          d.id === activeDefectForResolution.id ? { ...d, status: 'resolved' } : d
        ));
        setIsReProcessing(false);
        setCurrentStage('workspace');
        toast.success('Pre-Check complete - Translation processed and defect resolved');
      }, 2500);
    }
    
    setResolutionModal(null);
    setActiveDefectForResolution(null);
    setUploadOption(null);
    
    if (resolutionFileInputRef.current) {
      resolutionFileInputRef.current.value = '';
    }
  };

  // Upload Resolution Handlers
  const handleUploadReplace = () => {
    resolutionFileInputRef.current?.click();
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (activeDefectForResolution) {
      setIsReProcessing(true);
      setCurrentStage('processing');
      toast.success('Re-running Pre-Check...', {
        description: `Uploaded: ${file.name}`
      });
      
      setTimeout(() => {
        setDefects(prev => prev.map(d => 
          d.id === activeDefectForResolution.id ? { ...d, status: 'resolved' } : d
        ));
        setIsReProcessing(false);
        setCurrentStage('workspace');
        toast.success('Pre-Check complete - Document uploaded and defect resolved');
      }, 2500);
    }
    
    setResolutionModal(null);
    setActiveDefectForResolution(null);
    
    if (resolutionFileInputRef.current) {
      resolutionFileInputRef.current.value = '';
    }
  };

  // Rename Resolution Handler
  const [renameValue, setRenameValue] = useState('');
  
  const handleRenameSubmit = () => {
    if (!renameValue.trim()) {
      toast.error('Please enter a new name');
      return;
    }
    
    if (activeDefectForResolution) {
      setIsReProcessing(true);
      setCurrentStage('processing');
      toast.success('Re-running Pre-Check...', {
        description: `Renaming to ${renameValue}`
      });
      
      setTimeout(() => {
        setDefects(prev => prev.map(d => 
          d.id === activeDefectForResolution.id ? { ...d, status: 'resolved' } : d
        ));
        setIsReProcessing(false);
        setCurrentStage('workspace');
        toast.success('Pre-Check complete - Annexure renamed successfully');
      }, 2500);
    }
    
    setResolutionModal(null);
    setActiveDefectForResolution(null);
    setRenameValue('');
  };

  // Edit Resolution Handler
  const [editValue, setEditValue] = useState('');
  
  const handleEditSubmit = () => {
    if (!editValue.trim()) {
      toast.error('Please enter the corrected text');
      return;
    }
    
    if (activeDefectForResolution) {
      setIsReProcessing(true);
      setCurrentStage('processing');
      toast.success('Re-running Pre-Check...', {
        description: 'Updating document text'
      });
      
      setTimeout(() => {
        setDefects(prev => prev.map(d => 
          d.id === activeDefectForResolution.id ? { ...d, status: 'resolved' } : d
        ));
        setIsReProcessing(false);
        setCurrentStage('workspace');
        toast.success('Pre-Check complete - Text corrected successfully');
      }, 2500);
    }
    
    setResolutionModal(null);
    setActiveDefectForResolution(null);
    setEditValue('');
  };

  const handleSaveToMySpace = () => {
    setIsMySpaceSaveDialogOpen(true);
  };

  const handleSaveDocument = (folderPath: string, fileName: string, format: 'pdf' | 'doc') => {
    toast.success(`Document saved to "${folderPath}" as "${fileName}" (${format.toUpperCase()})`);
    setIsMySpaceSaveDialogOpen(false);
  };

  const handleDownload = () => {
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pre_check_report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Document downloaded successfully');
  };

  // Render Workspace View
  if (currentStage === 'workspace') {
    // Group defects by category
    const groupedDefects: Record<DefectCategory, DefectItem[]> = {} as Record<DefectCategory, DefectItem[]>;
    defects.forEach(defect => {
      if (!groupedDefects[defect.registryCategory]) {
        groupedDefects[defect.registryCategory] = [];
      }
      groupedDefects[defect.registryCategory].push(defect);
    });

    const criticalCount = defects.filter(d => d.severity === 'critical' && d.status === 'pending').length;
    const warningCount = defects.filter(d => d.severity === 'warning' && d.status === 'pending').length;
    const suggestionCount = defects.filter(d => d.severity === 'suggestion' && d.status === 'pending').length;
    const resolvedCount = defects.filter(d => d.status === 'resolved').length;

    return (
      <div className="flex flex-col h-screen bg-background">
        <ToolNavigation
          currentTool="registry"
          onToolChange={onToolChange}
          onBack={onBack}
          activeTool={activeTool}
        />

        {/* Header with Actions */}
        <div className="bg-secondary/50 border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
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
                <FileSearch className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Pre-Check Workspace</h3>
                <p className="text-sm text-muted-foreground">
                  {petitionerName} vs {respondentName} • {selectedCourt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleRectifyAll}
                variant="outline"
                size="sm"
                className="font-semibold border-primary/30 hover:bg-primary/10 hover:border-primary text-primary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Rectify All Global
              </Button>
              <Button
                onClick={handleSaveToMySpace}
                variant="outline"
                size="sm"
                className="font-semibold border-border hover:bg-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="font-semibold border-border hover:bg-accent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Defect Summary Bar */}
        <div className="bg-card border-b border-border px-6 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-red-500 text-red-500" />
              <span className="text-sm font-semibold text-foreground">{criticalCount} Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-semibold text-foreground">{warningCount} Warnings</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
              <span className="text-sm font-semibold text-foreground">{suggestionCount} Suggestions</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
              <span className="text-sm font-semibold text-foreground">{resolvedCount} Resolved</span>
            </div>
            <div className="flex-1" />
            <Badge variant="secondary" className="font-semibold">
              Last checked: Just now
            </Badge>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Document Viewer */}
          {fullScreenPanel !== 'defects' && (
            <div className={`flex flex-col overflow-hidden bg-muted/20 transition-all ${
              fullScreenPanel === 'document' ? 'flex-1' : 'flex-1'
            }`}>
              {/* Document Header with Full-Screen Toggle */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-50/20 dark:from-blue-950/30 dark:to-blue-950/10 border-b border-border px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">Document Preview</h4>
                  </div>
                  <Button
                    onClick={() => setFullScreenPanel(fullScreenPanel === 'document' ? null : 'document')}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                    title={fullScreenPanel === 'document' ? 'Exit full-screen' : 'Enter full-screen'}
                  >
                    {fullScreenPanel === 'document' ? (
                      <Minimize2 className="w-4 h-4 text-primary" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                  <div className="bg-white dark:bg-card shadow-sm border border-border rounded-lg p-6">
                    <textarea
                      value={documentContent}
                      onChange={(e) => setDocumentContent(e.target.value)}
                      placeholder="Document content will appear here..."
                      className="w-full min-h-[1000px] text-black dark:text-foreground focus:outline-none resize-none font-serif leading-relaxed bg-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      style={{
                        fontSize: '12pt',
                        lineHeight: '1.5'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Pane: Defect & Resolution Center */}
          {fullScreenPanel !== 'document' && (
            <div className={`border-l border-border bg-muted/10 flex flex-col transition-all ${
              fullScreenPanel === 'defects' ? 'flex-1' : 'w-[460px]'
            }`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b-2 border-primary/20 px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                      <AlertCircle className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <h4 className="text-base font-bold text-foreground">Pre-Check Defects & Curing</h4>
                  </div>
                  <Button
                    onClick={() => setFullScreenPanel(fullScreenPanel === 'defects' ? null : 'defects')}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                    title={fullScreenPanel === 'defects' ? 'Exit full-screen' : 'Enter full-screen'}
                  >
                    {fullScreenPanel === 'defects' ? (
                      <Minimize2 className="w-4 h-4 text-primary" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground ml-10.5">
                  AI-identified issues categorized by registry standards
                </p>
              </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {Object.entries(groupedDefects)
                .sort(([, defectsA], [, defectsB]) => {
                  // Sort: categories with pending defects first, then completed categories
                  const hasPendingA = defectsA.some(d => d.status === 'pending');
                  const hasPendingB = defectsB.some(d => d.status === 'pending');
                  
                  if (hasPendingA && !hasPendingB) return -1;
                  if (!hasPendingA && hasPendingB) return 1;
                  return 0;
                })
                .map(([category, categoryDefects]) => {
                const categoryInfo = CATEGORY_DETAILS[category as DefectCategory];
                const categoryPendingCount = categoryDefects.filter(d => d.status === 'pending').length;
                const categoryResolvedCount = categoryDefects.filter(d => d.status === 'resolved').length;
                const allResolved = categoryPendingCount === 0 && categoryDefects.length > 0;

                return (
                  <div key={category} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    {/* Category Header */}
                    <div className={`px-5 py-4 border-b-2 ${
                      allResolved 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50' 
                        : 'bg-muted/30 border-border'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shadow-sm ${
                            allResolved 
                              ? 'bg-green-500 text-white' 
                              : 'bg-primary text-primary-foreground'
                          }`}>
                            {category}
                          </div>
                          <div>
                            <p className="text-base font-bold text-foreground">{categoryInfo.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{categoryInfo.description}</p>
                          </div>
                        </div>
                        {allResolved ? (
                          <div className="flex items-center gap-2 bg-green-500/15 px-3 py-1.5 rounded-full border border-green-500/30">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-bold text-green-700 dark:text-green-400">Complete</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                            <Circle className="w-3 h-3 text-primary fill-primary" />
                            <span className="text-sm font-bold text-primary">{categoryPendingCount} pending</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Defects in this category */}
                    <div className="divide-y divide-border/40">
                      {categoryDefects
                        .sort((a, b) => {
                          // Sort: pending first, then resolved, then ignored
                          const statusOrder = { pending: 0, resolved: 1, ignored: 2 };
                          return statusOrder[a.status] - statusOrder[b.status];
                        })
                        .map((defect, index, array) => {
                          // Check if we need a separator (transition from pending to resolved/ignored)
                          const prevDefect = index > 0 ? array[index - 1] : null;
                          const needsSeparator = prevDefect && prevDefect.status === 'pending' && defect.status !== 'pending';
                          
                          return (
                            <div key={defect.id}>
                              {needsSeparator && (
                                <div className="px-6 py-4 bg-gradient-to-r from-muted/50 to-muted/20">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 h-px bg-border"></div>
                                    <div className="flex items-center gap-2 bg-card px-3 py-1 rounded-full border border-border">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Completed Items
                                      </span>
                                    </div>
                                    <div className="flex-1 h-px bg-border"></div>
                                  </div>
                                </div>
                              )}
                              <div
                                className={`px-6 py-5 transition-all ${
                                  defect.status === 'resolved'
                                    ? 'bg-green-50/50 dark:bg-green-950/10'
                                    : defect.status === 'ignored'
                                    ? 'bg-muted/20'
                                    : 'bg-background hover:bg-muted/20'
                                }`}
                              >
                          {/* Defect Header */}
                          <div className="flex items-start gap-4">
                            {/* Status Icon */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
                              defect.status === 'resolved'
                                ? 'bg-green-500'
                                : defect.status === 'ignored'
                                ? 'bg-gray-400'
                                : defect.severity === 'critical'
                                ? 'bg-red-500'
                                : defect.severity === 'warning'
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}>
                              {defect.status === 'resolved' ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : defect.status === 'ignored' ? (
                                <X className="w-4 h-4 text-white" />
                              ) : defect.severity === 'critical' ? (
                                <XCircle className="w-4 h-4 text-white" />
                              ) : defect.severity === 'warning' ? (
                                <AlertTriangle className="w-4 h-4 text-white" />
                              ) : (
                                <Lightbulb className="w-4 h-4 text-white" />
                              )}
                            </div>

                            {/* Defect Content */}
                            <div className="flex-1 min-w-0 space-y-3">
                              {/* Title & Meta */}
                              <div>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <h5 className="text-base font-bold text-foreground leading-tight">
                                    {defect.title}
                                  </h5>
                                  {defect.status !== 'pending' && (
                                    <Badge 
                                      className={`flex-shrink-0 text-[11px] h-6 px-2.5 font-bold ${
                                        defect.status === 'resolved' 
                                          ? 'bg-green-500 hover:bg-green-500 text-white border-0' 
                                          : 'bg-gray-400 hover:bg-gray-400 text-white border-0'
                                      }`}
                                    >
                                      {defect.status === 'resolved' ? '✓ Resolved' : 'Ignored'}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {defect.page && (
                                    <Badge variant="outline" className="text-[11px] h-5 px-2 font-medium border-muted-foreground/30">
                                      Page {defect.page}
                                    </Badge>
                                  )}
                                  {defect.similarCount && defect.similarCount > 0 && defect.status === 'pending' && (
                                    <Badge className="text-[11px] h-5 px-2 bg-primary/10 text-primary border-primary/20 font-semibold">
                                      +{defect.similarCount} similar issues
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {defect.description}
                              </p>

                              {/* AI Recommendation - Only for pending */}
                              {defect.status === 'pending' && (
                                <div className="bg-gradient-to-r from-blue-50 to-blue-50/20 dark:from-blue-950/30 dark:to-blue-950/10 border-l-4 border-primary rounded-r-lg pl-4 pr-4 py-3">
                                  <div className="flex items-start gap-2.5">
                                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-[11px] font-bold text-primary uppercase tracking-wide mb-1">AI Suggestion</p>
                                      <p className="text-sm text-foreground/90 leading-relaxed">{defect.aiRecommendation}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons - Only for pending */}
                              {defect.status === 'pending' && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  <Button
                                    onClick={() => handleResolveDefect(defect)}
                                    size="sm"
                                    className="h-9 text-sm px-4 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                                  >
                                    {defect.resolutionType === 'auto' && (
                                      <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Auto-Fix
                                      </>
                                    )}
                                    {defect.resolutionType === 'translation' && (
                                      <>
                                        <Languages className="w-4 h-4 mr-2" />
                                        Translate
                                      </>
                                    )}
                                    {defect.resolutionType === 'upload' && (
                                      <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Re-upload
                                      </>
                                    )}
                                    {defect.resolutionType === 'rename' && (
                                      <>
                                        <Type className="w-4 h-4 mr-2" />
                                        Rename
                                      </>
                                    )}
                                    {defect.resolutionType === 'edit' && (
                                      <>
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Edit Text
                                      </>
                                    )}
                                  </Button>
                                  
                                  {defect.similarCount && defect.similarCount > 0 && (
                                    <Button
                                      onClick={() => handleApplyToSimilar(defect)}
                                      size="sm"
                                      variant="outline"
                                      className="h-9 text-sm px-4 font-semibold border-primary/40 hover:bg-primary/10 hover:border-primary text-primary"
                                    >
                                      Apply to {defect.similarCount} similar
                                    </Button>
                                  )}
                                  
                                  <Button
                                    onClick={() => handleIgnoreDefect(defect.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-9 text-sm px-4 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                  >
                                    Ignore
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>

        {/* Resolution Modals */}
        
        {/* Translation Modal */}
        {resolutionModal === 'translation' && activeDefectForResolution && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Languages className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Translation Resolution</h3>
                    <p className="text-sm text-muted-foreground">{activeDefectForResolution.affectedFile}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Choose how you'd like to resolve the vernacular document issue:
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleOpenTranslationTool}
                    className="w-full p-4 bg-primary/5 hover:bg-primary/10 border-2 border-primary/20 hover:border-primary rounded-xl transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Languages className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-bold text-foreground">Open Jubee Translation Tool</p>
                        <p className="text-xs text-muted-foreground">Get AI-powered certified translation</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTranslationUpload('append')}
                    className="w-full p-4 bg-card hover:bg-muted/20 border-2 border-border hover:border-primary/40 rounded-xl transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FilePlus className="w-5 h-5 text-foreground" />
                      <div>
                        <p className="text-sm font-bold text-foreground">Upload Translation + Append</p>
                        <p className="text-xs text-muted-foreground">Add translated copy after original</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTranslationUpload('replace')}
                    className="w-full p-4 bg-card hover:bg-muted/20 border-2 border-border hover:border-primary/40 rounded-xl transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 text-foreground" />
                      <div>
                        <p className="text-sm font-bold text-foreground">Upload Translation + Replace</p>
                        <p className="text-xs text-muted-foreground">Replace original with translated version</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-end">
                  <Button
                    onClick={() => {
                      setResolutionModal(null);
                      setActiveDefectForResolution(null);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload/Replace Modal */}
        {resolutionModal === 'upload' && activeDefectForResolution && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FileUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Upload Document</h3>
                    <p className="text-sm text-muted-foreground">{activeDefectForResolution.title}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Upload the {activeDefectForResolution.resolutionType === 'upload' ? 'missing or corrected' : ''} document to resolve this defect:
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleUploadReplace}
                    className="w-full p-4 bg-primary/5 hover:bg-primary/10 border-2 border-primary/20 hover:border-primary rounded-xl transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-bold text-foreground">Upload from Device</p>
                        <p className="text-xs text-muted-foreground">Browse and select file</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setIsMySpaceDialogOpen(true)}
                    className="w-full p-4 bg-card hover:bg-muted/20 border-2 border-border hover:border-primary/40 rounded-xl transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-foreground" />
                      <div>
                        <p className="text-sm font-bold text-foreground">Choose from My Space</p>
                        <p className="text-xs text-muted-foreground">Select from saved documents</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-end">
                  <Button
                    onClick={() => {
                      setResolutionModal(null);
                      setActiveDefectForResolution(null);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {resolutionModal === 'rename' && activeDefectForResolution && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Type className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Rename Annexure</h3>
                    <p className="text-sm text-muted-foreground">{activeDefectForResolution.affectedFile}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Enter the correct annexure name or number:
                </p>

                <Input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="e.g., A-1A or Annexure B-3"
                  className="mb-6"
                  autoFocus
                />

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setResolutionModal(null);
                      setActiveDefectForResolution(null);
                      setRenameValue('');
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRenameSubmit}
                    size="sm"
                    className="bg-[#008080] hover:bg-[#006666]"
                  >
                    Rename
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {resolutionModal === 'edit' && activeDefectForResolution && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Edit Text</h3>
                    <p className="text-sm text-muted-foreground">{activeDefectForResolution.title}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Enter the corrected text:
                </p>

                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Enter corrected text..."
                  className="mb-6"
                  autoFocus
                />

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setResolutionModal(null);
                      setActiveDefectForResolution(null);
                      setEditValue('');
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditSubmit}
                    size="sm"
                    className="bg-[#008080] hover:bg-[#006666]"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={resolutionFileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={resolutionModal === 'translation' ? handleTranslationFileUpload : handleUploadFile}
          className="hidden"
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

        {/* My Space Picker for Upload Resolution */}
        {isMySpaceDialogOpen && resolutionModal === 'upload' && (
          <MySpacePickerDialog
            isOpen={isMySpaceDialogOpen}
            onClose={() => setIsMySpaceDialogOpen(false)}
            onSelect={(docs) => {
              if (docs.length > 0) {
                if (activeDefectForResolution) {
                  setIsReProcessing(true);
                  setCurrentStage('processing');
                  toast.success('Re-running Pre-Check...', {
                    description: activeDefectForResolution.title
                  });
                  
                  setTimeout(() => {
                    setDefects(prev => prev.map(d => 
                      d.id === activeDefectForResolution.id ? { ...d, status: 'resolved' } : d
                    ));
                    setIsReProcessing(false);
                    setCurrentStage('workspace');
                    toast.success('Pre-Check complete - Document uploaded and defect resolved');
                  }, 2500);
                }
                setResolutionModal(null);
                setActiveDefectForResolution(null);
              }
              setIsMySpaceDialogOpen(false);
            }}
          />
        )}
      </div>
    );
  }

  // Render Processing View
  if (currentStage === 'processing') {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ToolNavigation
          currentTool="registry"
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
            <h3 className="text-2xl font-bold text-foreground mb-2">Pre-Check in Progress</h3>
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

  // Render Conversational Intake View
  return (
    <div className="flex flex-col h-screen bg-background">
      <ToolNavigation
        currentTool="registry"
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
              <FileSearch className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Pre-Check</h2>
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
                  </div>
                  {message.type === 'user' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Options (Chips) */}
                {message.type === 'ai' && message.options && index === messages.length - 1 && !isTyping && !isProcessing && typingMessageId !== message.id && (
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

            {isProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-foreground">
                      Performing pre-check...
                    </p>
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
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder={
                  (currentStage === 'initial' || currentStage === 'jurisdiction' || currentStage === 'case-type') && !([...messages].reverse().find(m => m.type === 'ai')?.options?.length)
                    ? currentStage === 'initial' 
                      ? 'Type petitioner name here... ✍️'
                      : currentStage === 'jurisdiction'
                      ? 'Type respondent name here... ✍️'
                      : 'Type your case type here... ✍️'
                    : 'Type your message here...'
                }
                disabled={currentStage !== 'initial' && currentStage !== 'jurisdiction' && currentStage !== 'case-type'}
                className={`w-full h-16 pl-6 pr-28 text-base rounded-2xl transition-all duration-300 ${
                  (currentStage === 'initial' || currentStage === 'jurisdiction' || currentStage === 'case-type') && !([...messages].reverse().find(m => m.type === 'ai')?.options?.length)
                    ? 'bg-primary/5 border-2 border-primary shadow-lg shadow-primary/20 animate-pulse'
                    : 'bg-card border-2 border-border focus:border-primary'
                } text-foreground`}
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
                  disabled={!inputValue.trim() || (currentStage !== 'initial' && currentStage !== 'jurisdiction' && currentStage !== 'case-type')}
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
      {isMySpaceDialogOpen && !resolutionModal && (
        <MySpacePickerDialog
          isOpen={isMySpaceDialogOpen}
          onClose={() => setIsMySpaceDialogOpen(false)}
          onSelect={handleMySpaceSelect}
        />
      )}
    </div>
  );
}
