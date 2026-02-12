import { useState, useRef, useEffect } from 'react';
import {
  Scale, ArrowLeft, Upload, FileText, Download, Save, Bot, User, Send,
  Paperclip, TrendingUp, AlertCircle, CheckCircle, XCircle, ChevronRight,
  ChevronDown, Globe, Target, Shield, Lightbulb, BookOpen, AlertTriangle, X, ExternalLink
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { ToolNavigation } from '@/app/components/research-tools/ToolNavigation';
import { MySpacePickerDialog } from '@/app/components/MySpacePickerDialog';
import { MySpaceSaveDialog } from '@/app/components/MySpaceSaveDialog';
import { JudgeSelectionModal } from '@/app/components/JudgeSelectionModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import { toast } from 'sonner';
import jubeeLogo from '@/assets/jubee-logo.png';

interface SIToolProps {
  onBack: () => void;
  onToolChange?: (tool: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner') => void;
  activeTool?: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner';
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  category: 'judgment' | 'context' | 'argument';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  options?: Array<{ id: string; label: string; icon?: any }>;
  uploadedFiles?: UploadedDocument[];
}

interface PSIMetrics {
  indexScore: number;
  stageProceedingMismatch: number;
  contextProximity: number;
  courtMismatch: number;
  benchStrength: number;
  citationFrequency: number;
  overrulingStatus: 'Active' | 'Partially Overruled' | 'Overruled';
  courtMismatchDetails?: string;
}

interface PSIResult {
  caseName: string;
  citation: string;
  metrics: PSIMetrics;
  badLaws: Array<{
    id: string;
    issue: string;
    severity: 'high' | 'medium' | 'low';
    explanation: string;
    referencedCase?: string;
    referencedCitation?: string;
  }>;
}

interface ASIArgument {
  id: string;
  reliefSought: string;
  factsReliedUpon: string[];
  casesReliedUpon: Array<{
    name: string;
    citation: string;
    relevance: number;
  }>;
  vulnerabilities: Array<{
    id: string;
    type: 'weak-fact' | 'contradictory-precedent' | 'procedural-issue';
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  strengthScore: number;
}

type ConversationStage =
  | 'mode-selection'
  | 'psi-judgments'
  | 'psi-context'
  | 'psi-court-selection'
  | 'psi-bench-selection'
  | 'psi-judge-selection'
  | 'psi-badlaws'
  | 'asi-arguments'
  | 'asi-context'
  | 'asi-court-selection'
  | 'asi-bench-selection'
  | 'asi-judge-selection'
  | 'psi-results'
  | 'asi-results';

type SIMode = 'psi' | 'asi' | null;

const COURTS = [
  { id: 'supreme', name: 'Supreme Court of India' },
  { id: 'delhi-hc', name: 'High Court of Delhi' }
];

export function SITool({ onBack, onToolChange, activeTool }: SIToolProps) {
  // Conversation phase states
  const [currentStage, setCurrentStage] = useState<ConversationStage>('mode-selection');
  const [selectedMode, setSelectedMode] = useState<SIMode>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMySpaceDialogOpen, setIsMySpaceDialogOpen] = useState(false);
  const [isMySpaceSaveDialogOpen, setIsMySpaceSaveDialogOpen] = useState(false);

  // Typewriter effect state
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [visibleChars, setVisibleChars] = useState<Record<string, number>>({});

  // Document states
  const [judgmentDocs, setJudgmentDocs] = useState<UploadedDocument[]>([]);
  const [contextDocs, setContextDocs] = useState<UploadedDocument[]>([]);
  const [argumentDocs, setArgumentDocs] = useState<UploadedDocument[]>([]);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [selectedBench, setSelectedBench] = useState('');
  const [selectedJudge, setSelectedJudge] = useState('');
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [enableBadLawsCheck, setEnableBadLawsCheck] = useState(true);

  // Results states
  const [isProcessing, setIsProcessing] = useState(false);
  const [psiResults, setPsiResults] = useState<PSIResult[]>([]);
  const [asiResults, setAsiResults] = useState<ASIArgument[]>([]);
  const [expandedArguments, setExpandedArguments] = useState<Set<string>>(new Set());
  const [savingBadLaws, setSavingBadLaws] = useState(false);
  const [selectedBadLaw, setSelectedBadLaw] = useState<{
    caseName: string;
    citation: string;
    badLaw: { id: string; issue: string; severity: 'high' | 'medium' | 'low'; explanation: string; referencedCase?: string; referencedCitation?: string; };
  } | null>(null);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<PSIResult | null>(null);

  // Floating AI Chat states for Results screens
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAIChatTyping, setIsAIChatTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    text: string;
    isAI: boolean;
    timestamp: Date;
  }>>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadCategory = useRef<'judgment' | 'context' | 'argument'>('judgment');

  // Initialize conversation
  useEffect(() => {
    addAIMessage(
      "Choose PSI (Precedent Strength Index) or ASI (Argument Strength Index).",
      [
        { id: 'psi', label: 'PSI (Precedent Strength Index)', icon: Scale },
        { id: 'asi', label: 'ASI (Argument Strength Index)', icon: Target }
      ]
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

    if (currentStage === 'mode-selection') {
      if (optionId === 'psi') {
        setSelectedMode('psi');
        addUserMessage('PSI (Precedent Strength Index)');
        setTimeout(() => {
          setIsTyping(false);
          addAIMessage(
            'Evaluate how strongly a precedent supports your position.',
            [
              { id: 'upload-judgments', label: 'Upload Judgments', icon: Upload },
              { id: 'myspace-judgments', label: 'Choose from My Space', icon: FileText }
            ]
          );
          setCurrentStage('psi-judgments');
        }, 800);
      } else if (optionId === 'asi') {
        setSelectedMode('asi');
        addUserMessage('ASI (Argument Strength Index)');
        setTimeout(() => {
          setIsTyping(false);
          addAIMessage(
            'Examine arguments for consistency, authority and risk. Please upload draft arguments (multiple files allowed).',
            [
              { id: 'upload-arguments', label: 'Upload Arguments', icon: Upload },
              { id: 'myspace-arguments', label: 'Choose from My Space', icon: FileText }
            ]
          );
          setCurrentStage('asi-arguments');
        }, 800);
      }
    } else if (currentStage === 'psi-judgments') {
      if (optionId === 'upload-judgments') {
        addUserMessage('I\'ll upload judgment files');
        setIsTyping(false);
        currentUploadCategory.current = 'judgment';
        fileInputRef.current?.click();
      } else if (optionId === 'myspace-judgments') {
        addUserMessage('I\'ll choose from My Space');
        setIsTyping(false);
        currentUploadCategory.current = 'judgment';
        setIsMySpaceDialogOpen(true);
      } else if (optionId === 'continue-psi-context') {
        setTimeout(() => {
          setIsTyping(false);
          proceedToPSIContext();
        }, 500);
      }
    } else if (currentStage === 'psi-context') {
      if (optionId === 'upload-context') {
        addUserMessage('I\'ll upload context documents');
        setIsTyping(false);
        currentUploadCategory.current = 'context';
        fileInputRef.current?.click();
      } else if (optionId === 'skip-context') {
        addUserMessage('Skip context documents');
        setTimeout(() => {
          setIsTyping(false);
          proceedToPSIJurisdiction();
        }, 800);
      } else if (optionId === 'continue-psi-jurisdiction') {
        setTimeout(() => {
          setIsTyping(false);
          proceedToPSIJurisdiction();
        }, 500);
      }
    } else if (currentStage === 'psi-court-selection') {
      handleCourtSelect(optionId, optionLabel);
    } else if (currentStage === 'psi-bench-selection') {
      handleBenchSelect(optionId, optionLabel);
    } else if (currentStage === 'psi-judge-selection') {
      handlePSIJudgeSelection(optionId);
    } else if (currentStage === 'psi-badlaws') {
      if (optionId === 'enable-badlaws') {
        addUserMessage('Yes, identify Jubee Contra');
        setEnableBadLawsCheck(true);
        setTimeout(() => {
          setIsTyping(false);
          processPSIAnalysis();
        }, 800);
      } else if (optionId === 'skip-badlaws') {
        addUserMessage('Skip Jubee Contra check');
        setEnableBadLawsCheck(false);
        setTimeout(() => {
          setIsTyping(false);
          processPSIAnalysis();
        }, 800);
      }
    } else if (currentStage === 'asi-arguments') {
      if (optionId === 'upload-arguments') {
        addUserMessage('I\'ll upload argument files');
        setIsTyping(false);
        currentUploadCategory.current = 'argument';
        fileInputRef.current?.click();
      } else if (optionId === 'myspace-arguments') {
        addUserMessage('I\'ll choose from My Space');
        setIsTyping(false);
        currentUploadCategory.current = 'argument';
        setIsMySpaceDialogOpen(true);
      } else if (optionId === 'continue-asi-context') {
        setTimeout(() => {
          setIsTyping(false);
          proceedToASIContext();
        }, 500);
      }
    } else if (currentStage === 'asi-context') {
      if (optionId === 'upload-asi-context') {
        addUserMessage('I\'ll upload context documents');
        setIsTyping(false);
        currentUploadCategory.current = 'context';
        fileInputRef.current?.click();
      } else if (optionId === 'skip-asi-context') {
        addUserMessage('Skip context documents');
        setTimeout(() => {
          setIsTyping(false);
          proceedToASIJurisdiction();
        }, 800);
      } else if (optionId === 'continue-asi-jurisdiction') {
        setTimeout(() => {
          setIsTyping(false);
          proceedToASIJurisdiction();
        }, 500);
      }
    } else if (currentStage === 'asi-court-selection') {
      handleASICourtSelect(optionId, optionLabel);
    } else if (currentStage === 'asi-bench-selection') {
      handleASIBenchSelect(optionId, optionLabel);
    } else if (currentStage === 'asi-judge-selection') {
      handleASIJudgeSelection(optionId);
    }
  };

  const proceedToPSIContext = () => {
    addAIMessage(
      'Upload relevant documents (e.g., Petition/Reply)',
      [
        { id: 'upload-context', label: 'Upload Context Documents', icon: Upload },
        { id: 'skip-context', label: 'Skip This Step', icon: ChevronRight }
      ]
    );
    setCurrentStage('psi-context');
  };

  const proceedToPSIJurisdiction = () => {
    addAIMessage(
      'Please select the Court.',
      COURTS.map(court => ({ id: court.id, label: court.name, icon: Scale }))
    );
    setCurrentStage('psi-court-selection');
  };

  const handleCourtSelect = (courtId: string, courtName: string) => {
    setIsTyping(true);
    setSelectedCourt(courtName);
    setJurisdiction(courtName);
    addUserMessage(courtName);

    setTimeout(() => {
      setIsTyping(false);
      proceedToPSIBenchSelection();
    }, 800);
  };

  const proceedToPSIBenchSelection = () => {
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
    setCurrentStage('psi-bench-selection');
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
      proceedToPSIJudgeSelection();
    }, 800);
  };

  const proceedToPSIJudgeSelection = () => {
    addAIMessage(
      'Please specify the judge for this matter (Optional).',
      [
        { id: 'select-judges', label: 'Select Judge(s)' },
        { id: 'skip-judge', label: 'Skip This Step' }
      ]
    );
    setCurrentStage('psi-judge-selection');
  };

  const handlePSIJudgeSelection = (choiceId: string) => {
    if (choiceId === 'select-judges') {
      setIsJudgeModalOpen(true);
    } else if (choiceId === 'skip-judge') {
      addUserMessage('Skip judge selection');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        proceedToPSIBadLaws();
      }, 800);
    }
  };

  const handlePSIJudgeModalConfirm = (selectedJudgesList: Array<{ id: string; name: string; gender: 'Mr.' | 'Ms.' }>) => {
    setIsJudgeModalOpen(false);

    if (selectedJudgesList.length === 0) {
      // Skip judge selection
      setIsTyping(true);
      setSelectedJudge('');

      setTimeout(() => {
        setIsTyping(false);
        proceedToPSIBadLaws();
      }, 800);
    } else {
      const judgeNames = selectedJudgesList.map(j => `${j.gender} ${j.name}`).join(', ');
      setSelectedJudge(judgeNames);
      addUserMessage(judgeNames);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        proceedToPSIBadLaws();
      }, 800);
    }
  };

  const proceedToPSIBadLaws = () => {
    addAIMessage(
      'Would you like me to identify Jubee Contra (precedents that might backfire based on your context) using a web search?',
      [
        { id: 'enable-badlaws', label: 'Yes, Identify Jubee Contra', icon: Globe },
        { id: 'skip-badlaws', label: 'Skip This Step', icon: ChevronRight }
      ]
    );
    setCurrentStage('psi-badlaws');
  };

  const processPSIAnalysis = () => {
    setIsProcessing(true);
    addAIMessage('Perfect! Jubee is evaluating Strength Index...');

    setTimeout(() => {
      // Mock PSI results - Generate multiple cases
      const mockResults: PSIResult[] = [
        {
          caseName: 'Kesavananda Bharati v. State of Kerala',
          citation: '(1973) 4 SCC 225',
          metrics: {
            indexScore: 92,
            stageProceedingMismatch: 5,
            contextProximity: 95,
            courtMismatch: 0,
            benchStrength: 98,
            citationFrequency: 96,
            overrulingStatus: 'Active'
          },
          badLaws: enableBadLawsCheck ? [
            {
              id: '1',
              issue: 'Contextual Deviation Detected',
              severity: 'medium',
              explanation: 'This precedent was cited in a different procedural context in 3 recent cases.',
              referencedCase: 'Suresh Kumar Koushal v. Naz Foundation',
              referencedCitation: '(2014) 1 SCC 1'
            }
          ] : []
        },
        {
          caseName: 'State of Maharashtra v. Indian Hotel & Restaurants Association',
          citation: '(2013) 8 SCC 519',
          metrics: {
            indexScore: 78,
            stageProceedingMismatch: 15,
            contextProximity: 82,
            courtMismatch: 20,
            courtMismatchDetails: 'Supreme Court precedent applied in High Court of Delhi matter',
            benchStrength: 75,
            citationFrequency: 68,
            overrulingStatus: 'Active'
          },
          badLaws: enableBadLawsCheck ? [
            {
              id: '2',
              issue: 'Court Jurisdiction Mismatch',
              severity: 'high',
              explanation: 'Supreme Court judgment being cited for matter before High Court of Delhi may require additional consideration.',
              referencedCase: 'K.S. Puttaswamy v. Union of India',
              referencedCitation: '(2017) 10 SCC 1'
            },
            {
              id: '3',
              issue: 'Rarely Cited',
              severity: 'low',
              explanation: 'This judgment has been cited only 12 times in the last 5 years.',
              referencedCase: 'Shayara Bano v. Union of India',
              referencedCitation: '(2017) 9 SCC 1'
            }
          ] : []
        },
        {
          caseName: 'Union of India v. Raghubir Singh',
          citation: '(1989) 2 SCC 754',
          metrics: {
            indexScore: 65,
            stageProceedingMismatch: 25,
            contextProximity: 70,
            courtMismatch: 0,
            benchStrength: 80,
            citationFrequency: 45,
            overrulingStatus: 'Partially Overruled'
          },
          badLaws: enableBadLawsCheck ? [
            {
              id: '4',
              issue: 'Partially Overruled',
              severity: 'high',
              explanation: 'Key principles from this judgment were modified by subsequent Supreme Court decision in 2015.',
              referencedCase: 'Navtej Singh Johar v. Union of India',
              referencedCitation: '(2018) 10 SCC 1'
            },
            {
              id: '5',
              issue: 'Stage Proceeding Mismatch',
              severity: 'medium',
              explanation: 'Original case was at appeal stage while current matter is at preliminary hearing stage.',
              referencedCase: 'Common Cause v. Union of India',
              referencedCitation: '(2018) 5 SCC 1'
            }
          ] : []
        },
        {
          caseName: 'Ashok Kumar Gupta v. State of Uttar Pradesh',
          citation: '(1997) 5 SCC 201',
          metrics: {
            indexScore: 88,
            stageProceedingMismatch: 8,
            contextProximity: 90,
            courtMismatch: 0,
            benchStrength: 85,
            citationFrequency: 92,
            overrulingStatus: 'Active'
          },
          badLaws: enableBadLawsCheck ? [] : []
        }
      ];

      setPsiResults(mockResults);
      setIsProcessing(false);
      setCurrentStage('psi-results');
      toast.success('PSI analysis complete! This session has been saved to your History.');
    }, 3000);
  };

  const proceedToASIContext = () => {
    addAIMessage(
      'Now, upload relevant documents (e.g., Petition/Reply)',
      [
        { id: 'upload-asi-context', label: 'Upload Context Documents', icon: Upload },
        { id: 'skip-asi-context', label: 'Skip This Step', icon: ChevronRight }
      ]
    );
    setCurrentStage('asi-context');
  };

  const proceedToASIJurisdiction = () => {
    addAIMessage(
      'Please select the Court.',
      COURTS.map(court => ({ id: court.id, label: court.name, icon: Scale }))
    );
    setCurrentStage('asi-court-selection');
  };

  const handleASICourtSelect = (courtId: string, courtName: string) => {
    setIsTyping(true);
    setSelectedCourt(courtName);
    setJurisdiction(courtName);
    addUserMessage(courtName);

    setTimeout(() => {
      setIsTyping(false);
      proceedToASIBenchSelection();
    }, 800);
  };

  const proceedToASIBenchSelection = () => {
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
    setCurrentStage('asi-bench-selection');
  };

  const handleASIBenchSelect = (benchId: string, benchLabel: string) => {
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
      proceedToASIJudgeSelection();
    }, 800);
  };

  const proceedToASIJudgeSelection = () => {
    addAIMessage(
      'Please specify the judge for this matter (Optional).',
      [
        { id: 'select-judges', label: 'Select Judge(s)' },
        { id: 'skip-judge', label: 'Skip This Step' }
      ]
    );
    setCurrentStage('asi-judge-selection');
  };

  const handleASIJudgeSelection = (choiceId: string) => {
    if (choiceId === 'select-judges') {
      setIsJudgeModalOpen(true);
    } else if (choiceId === 'skip-judge') {
      addUserMessage('Skip judge selection');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        processASIAnalysis();
      }, 800);
    }
  };

  const handleASIJudgeModalConfirm = (selectedJudgesList: Array<{ id: string; name: string; gender: 'Mr.' | 'Ms.' }>) => {
    setIsJudgeModalOpen(false);

    if (selectedJudgesList.length === 0) {
      // Skip judge selection
      setIsTyping(true);
      setSelectedJudge('');

      setTimeout(() => {
        setIsTyping(false);
        processASIAnalysis();
      }, 800);
    } else {
      const judgeNames = selectedJudgesList.map(j => `${j.gender} ${j.name}`).join(', ');
      setSelectedJudge(judgeNames);
      addUserMessage(judgeNames);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        processASIAnalysis();
      }, 800);
    }
  };

  const processASIAnalysis = () => {
    setIsProcessing(true);
    addAIMessage('Perfect! Jubee is evaluating Argument Strength Index...');

    setTimeout(() => {
      // Mock ASI results
      const mockResults: ASIArgument[] = [
        {
          id: '1',
          reliefSought: 'Quashing of Arbitrary Order dated 15th January 2026',
          factsReliedUpon: [
            'Petitioner was not given proper notice before passing the impugned order',
            'Order violates principles of natural justice as per Article 14',
            'No opportunity of hearing was provided to the petitioner'
          ],
          casesReliedUpon: [
            { name: 'Maneka Gandhi v. Union of India', citation: '(1978) 1 SCC 248', relevance: 95 },
            { name: 'A.K. Kraipak v. Union of India', citation: '(1970) 1 SCC 457', relevance: 88 }
          ],
          vulnerabilities: [
            {
              id: 'v1',
              type: 'procedural-issue',
              description: 'Lack of specific statutory provision reference weakens the argument',
              severity: 'medium'
            },
            {
              id: 'v2',
              type: 'weak-fact',
              description: 'Timeline of events needs stronger documentary evidence',
              severity: 'low'
            }
          ],
          strengthScore: 78
        },
        {
          id: '2',
          reliefSought: 'Direction to Respondent to Issue Fresh Order with Proper Hearing',
          factsReliedUpon: [
            'Respondent has statutory duty to provide hearing as per Section 23 of the Act',
            'Similar relief granted in comparable cases'
          ],
          casesReliedUpon: [
            { name: 'Union of India v. Tulsiram Patel', citation: '(1985) 3 SCC 398', relevance: 82 }
          ],
          vulnerabilities: [
            {
              id: 'v3',
              type: 'contradictory-precedent',
              description: 'Recent judgment in State v. Kumar (2024) distinguished similar facts',
              severity: 'high'
            }
          ],
          strengthScore: 65
        }
      ];

      setAsiResults(mockResults);
      setIsProcessing(false);
      setCurrentStage('asi-results');
      toast.success('ASI analysis complete! This session has been saved to your History.');
    }, 3000);
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

    if (category === 'judgment') {
      setJudgmentDocs(prev => [...prev, ...newDocs]);
      addUserMessage(`Uploaded ${newDocs.length} judgment(s)`, newDocs);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          'Judgment received. Would you like to add more judgments or continue to analysis?',
          [
            { id: 'upload-judgments', label: 'Upload More', icon: Upload },
            { id: 'continue-psi-context', label: 'Continue', icon: ChevronRight }
          ]
        );
      }, 800);
    } else if (category === 'argument') {
      setArgumentDocs(prev => [...prev, ...newDocs]);
      addUserMessage(`Uploaded ${newDocs.length} argument document(s)`, newDocs);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          newDocs.length === 1
            ? 'One file received. Would you like to add more or continue?'
            : `Perfect! I've received ${newDocs.length} argument document(s). Would you like to add more or continue?`,
          [
            { id: 'upload-arguments', label: 'Upload More', icon: Upload },
            { id: 'continue-asi-context', label: 'Continue', icon: ChevronRight }
          ]
        );
      }, 800);
    } else if (category === 'context') {
      setContextDocs(prev => [...prev, ...newDocs]);
      addUserMessage(`Uploaded ${newDocs.length} context document(s)`, newDocs);
      setTimeout(() => {
        setIsTyping(false);
        if (selectedMode === 'psi') {
          addAIMessage(
            `Great! I've received ${newDocs.length} context document(s). Would you like to add more or continue?`,
            [
              { id: 'upload-context', label: 'Upload More', icon: Upload },
              { id: 'continue-psi-jurisdiction', label: 'Continue', icon: ChevronRight }
            ]
          );
        } else {
          addAIMessage(
            `Great! I've received ${newDocs.length} context document(s). Would you like to add more or continue?`,
            [
              { id: 'upload-asi-context', label: 'Upload More', icon: Upload },
              { id: 'continue-asi-jurisdiction', label: 'Continue', icon: ChevronRight }
            ]
          );
        }
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

    if (category === 'judgment') {
      setJudgmentDocs(prev => [...prev, ...newDocs]);
      addUserMessage(`Selected ${newDocs.length} judgment(s) from My Space`, newDocs);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          'Judgment received. Would you like to add more judgments or continue to analysis?',
          [
            { id: 'upload-judgments', label: 'Upload More', icon: Upload },
            { id: 'continue-psi-context', label: 'Continue', icon: ChevronRight }
          ]
        );
      }, 800);
    } else if (category === 'argument') {
      setArgumentDocs(prev => [...prev, ...newDocs]);
      addUserMessage(`Selected ${newDocs.length} argument document(s) from My Space`, newDocs);
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          newDocs.length === 1
            ? 'One file received. Would you like to add more or continue?'
            : `Perfect! I've received ${newDocs.length} argument document(s). Would you like to add more or continue?`,
          [
            { id: 'upload-arguments', label: 'Upload More', icon: Upload },
            { id: 'continue-asi-context', label: 'Continue', icon: ChevronRight }
          ]
        );
      }, 800);
    } else if (category === 'context') {
      setContextDocs(prev => [...prev, ...newDocs]);
      addUserMessage(`Selected ${newDocs.length} context document(s) from My Space`, newDocs);
      setTimeout(() => {
        setIsTyping(false);
        if (selectedMode === 'psi') {
          addAIMessage(
            `Great! I've received ${newDocs.length} context document(s). Would you like to add more or continue?`,
            [
              { id: 'upload-context', label: 'Upload More', icon: Upload },
              { id: 'continue-psi-jurisdiction', label: 'Continue', icon: ChevronRight }
            ]
          );
        } else {
          addAIMessage(
            `Great! I've received ${newDocs.length} context document(s). Would you like to add more or continue?`,
            [
              { id: 'upload-asi-context', label: 'Upload More', icon: Upload },
              { id: 'continue-asi-jurisdiction', label: 'Continue', icon: ChevronRight }
            ]
          );
        }
      }, 800);
    }
  };

  const toggleArgumentExpansion = (argumentId: string) => {
    const newExpanded = new Set(expandedArguments);
    if (newExpanded.has(argumentId)) {
      newExpanded.delete(argumentId);
    } else {
      newExpanded.add(argumentId);
    }
    setExpandedArguments(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    if (severity === 'high') return 'text-red-600 dark:text-red-400';
    if (severity === 'medium') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getSeverityBg = (severity: 'high' | 'medium' | 'low') => {
    if (severity === 'high') return 'bg-red-500/10 border-red-500/30';
    if (severity === 'medium') return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-blue-500/10 border-blue-500/30';
  };

  const handleDownloadReport = () => {
    toast.success('Report downloaded successfully');
  };

  const handleSaveToMySpace = () => {
    setSavingBadLaws(false);
    setIsMySpaceSaveDialogOpen(true);
  };

  const handleSaveBadLaws = () => {
    setSavingBadLaws(true);
    setIsMySpaceSaveDialogOpen(true);
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
    setIsAIChatTyping(true);

    // Simulate AI response with PSI/ASI specific context
    setTimeout(() => {
      setIsAIChatTyping(false);

      const responseText = currentStage === 'psi-results'
        ? "I can help you understand the PSI scores, explain Jubee Contra findings, suggest how to strengthen your precedent selection, or provide guidance on citation strategies. What would you like to know?"
        : "I can help you analyze the ASI scores, explain strength ratings, suggest improvements to your arguments, or provide guidance on supporting evidence. What would you like to discuss?";

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isAI: true,
        timestamp: new Date()
      }]);
    }, 1500);
  };

  const handleSaveDocument = (folderPath: string, fileName: string) => {
    if (savingBadLaws) {
      toast.success(`Jubee Contra report saved to "${folderPath}" as "${fileName}"`);
    } else {
      toast.success(`Report saved to "${folderPath}" as "${fileName}"`);
    }
    setIsMySpaceSaveDialogOpen(false);
    setSavingBadLaws(false);
  };

  // Render PSI Results View
  if (currentStage === 'psi-results') {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ToolNavigation
          currentTool="si"
          onToolChange={onToolChange}
          onBack={onBack}
          activeTool={activeTool}
        />

        {/* Header */}
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
                <Scale className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">PSI Results</h3>
                <p className="text-sm text-muted-foreground">{psiResults.length} {psiResults.length === 1 ? 'judgment' : 'judgments'} analyzed • {jurisdiction}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {enableBadLawsCheck && psiResults.some(r => r.badLaws.length > 0) && (
                <Button
                  onClick={handleSaveBadLaws}
                  variant="ghost"
                  size="sm"
                  className="font-semibold border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Save Jubee Contra
                </Button>
              )}
              <Button
                onClick={handleSaveToMySpace}
                variant="ghost"
                size="sm"
                className="font-semibold border-border hover:bg-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Report
              </Button>
              <Button
                onClick={handleDownloadReport}
                variant="ghost"
                size="sm"
                className="font-semibold border-border hover:bg-accent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Summary Card */}


            {/* Summary Card */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-1">
                    PSI Analysis Complete
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {psiResults.length} {psiResults.length === 1 ? 'judgment' : 'judgments'} evaluated • Average PSI Score: {Math.round(psiResults.reduce((sum, r) => sum + r.metrics.indexScore, 0) / psiResults.length)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{psiResults.filter(r => r.metrics.indexScore >= 80).length}</div>
                    <div className="text-xs text-muted-foreground">Strong</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{psiResults.filter(r => r.metrics.indexScore >= 60 && r.metrics.indexScore < 80).length}</div>
                    <div className="text-xs text-muted-foreground">Moderate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{psiResults.filter(r => r.metrics.indexScore < 60).length}</div>
                    <div className="text-xs text-muted-foreground">Weak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Case Results */}
            {psiResults.map((result, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Case Header */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs font-bold">
                          Case {index + 1}
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground group cursor-pointer hover:text-primary transition-colors flex items-center gap-2">
                          <span
                            className="underline cursor-pointer"
                            onClick={() => setSelectedCaseDetail(result)}
                          >
                            {result.caseName}
                          </span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">{result.citation}</p>
                    </div>
                    <div className={`px-6 py-3 rounded-xl border-2 ${getScoreBg(result.metrics.indexScore)}`}>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(result.metrics.indexScore)}`}>
                          {result.metrics.indexScore}
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground mt-1">
                          PSI SCORE
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="p-6 grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-muted-foreground">Context Proximity</p>
                      <span className={`text-lg font-bold ${getScoreColor(result.metrics.contextProximity)}`}>
                        {result.metrics.contextProximity}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${result.metrics.contextProximity}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-muted-foreground">Bench Strength</p>
                      <span className={`text-lg font-bold ${getScoreColor(result.metrics.benchStrength)}`}>
                        {result.metrics.benchStrength}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${result.metrics.benchStrength}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-muted-foreground">Citation Frequency</p>
                      <span className={`text-lg font-bold ${getScoreColor(result.metrics.citationFrequency)}`}>
                        {result.metrics.citationFrequency}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${result.metrics.citationFrequency}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.metrics.citationFrequency >= 80 ? 'Frequently cited' : result.metrics.citationFrequency >= 50 ? 'Moderately cited' : 'Rarely cited'}
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-muted-foreground">Stage/Proceeding Match</p>
                      <span className={`text-lg font-bold ${getScoreColor(100 - result.metrics.stageProceedingMismatch)}`}>
                        {100 - result.metrics.stageProceedingMismatch}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${100 - result.metrics.stageProceedingMismatch}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-muted-foreground">Court Match</p>
                      <span className={`text-lg font-bold ${getScoreColor(100 - result.metrics.courtMismatch)}`}>
                        {100 - result.metrics.courtMismatch}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${100 - result.metrics.courtMismatch}%` }}
                      />
                    </div>
                    {result.metrics.courtMismatchDetails && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        ⚠️ {result.metrics.courtMismatchDetails}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Overruling Status</p>
                    <Badge className={`${result.metrics.overrulingStatus === 'Active'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30'
                        : result.metrics.overrulingStatus === 'Partially Overruled'
                          ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                      } font-semibold`}>
                      {result.metrics.overrulingStatus}
                    </Badge>
                    {result.metrics.overrulingStatus === 'Active' && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Subsequent courts have not overruled
                      </p>
                    )}
                  </div>
                </div>

              </div>
            ))}

            {/* Jubee Contra Summary Section - Minimal Design */}
            {enableBadLawsCheck && psiResults.some(r => r.badLaws.length > 0) && (
              <div className="bg-background border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-base font-bold text-foreground mb-1">Jubee Contra Detected</h4>
                    <p className="text-sm text-muted-foreground">
                      {psiResults.reduce((sum, r) => sum + r.badLaws.length, 0)} issues found across {psiResults.filter(r => r.badLaws.length > 0).length} {psiResults.filter(r => r.badLaws.length > 0).length === 1 ? 'judgment' : 'judgments'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/10">
                      {psiResults.reduce((sum, r) => sum + r.badLaws.filter(b => b.severity === 'high').length, 0)} High
                    </Badge>
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/10">
                      {psiResults.reduce((sum, r) => sum + r.badLaws.filter(b => b.severity === 'medium').length, 0)} Medium
                    </Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                      {psiResults.reduce((sum, r) => sum + r.badLaws.filter(b => b.severity === 'low').length, 0)} Low
                    </Badge>
                  </div>
                </div>

                {/* All Jubee Contra List */}
                <div className="space-y-4">
                  {(() => {
                    let badLawCounter = 0;
                    return psiResults.map((result, resultIndex) =>
                      result.badLaws.length > 0 ? (
                        <div key={resultIndex}>
                          <div className="space-y-2">
                            {result.badLaws.map((badLaw) => {
                              badLawCounter++;
                              return (
                                <div
                                  key={badLaw.id}
                                  className="p-4 bg-muted/30 border border-border rounded-lg"
                                >
                                  <div className="flex items-start gap-3 mb-3">
                                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                                      Jubee Contra {badLawCounter}
                                    </Badge>
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-foreground mb-1">{badLaw.issue}</p>
                                      {badLaw.referencedCase && (
                                        <div className="flex items-center gap-2 mb-2 text-xs">
                                          <Scale className="w-3 h-3 text-primary flex-shrink-0" />
                                          <span className="font-medium text-primary">{badLaw.referencedCase}</span>
                                          {badLaw.referencedCitation && (
                                            <span className="text-muted-foreground font-mono">• {badLaw.referencedCitation}</span>
                                          )}
                                        </div>
                                      )}
                                      <p className="text-xs text-muted-foreground leading-relaxed">{badLaw.explanation}</p>
                                    </div>
                                    <Badge
                                      className={`text-xs capitalize flex-shrink-0 ${badLaw.severity === 'high'
                                          ? 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/10'
                                          : badLaw.severity === 'medium'
                                            ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/10'
                                            : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10'
                                        }`}
                                    >
                                      {badLaw.severity}
                                    </Badge>
                                  </div>

                                  {/* CTAs */}
                                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                    <Button
                                      onClick={() => toast.success('Opening case law in new tab...')}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 text-xs font-semibold border-border hover:bg-accent hover:border-primary/30"
                                    >
                                      <BookOpen className="w-3 h-3 mr-1.5" />
                                      Read Case Law
                                    </Button>
                                    <Button
                                      onClick={() => setSelectedBadLaw({ caseName: result.caseName, citation: result.citation, badLaw })}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 text-xs font-semibold border-border hover:bg-accent hover:border-primary/30"
                                    >
                                      <FileText className="w-3 h-3 mr-1.5" />
                                      Detailed Analysis
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        toast.success('Opening judgement in new tab...');
                                      }}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 text-xs font-semibold border-border hover:bg-accent hover:border-primary/30"
                                    >
                                      <Scale className="w-3 h-3 mr-1.5" />
                                      Read Judgement
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Session Saved Notice */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Session saved!</span> This PSI analysis, including identified Jubee Contra, has been saved to your History.
              </p>
            </div>
          </div>
        </div>

        {/* AI Chat Panel - Slides from right */}
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
                Ask me about PSI scores, Jubee Contra, precedent selection, or citation strategies
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
                    Ask me about PSI scores, Jubee Contra findings, or how to strengthen your precedent selection
                  </p>
                  <div className="mt-6 space-y-2 w-full max-w-[280px]">
                    <button
                      onClick={() => setChatInput("Explain the PSI scores in detail")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      Explain the PSI scores in detail
                    </button>
                    <button
                      onClick={() => setChatInput("What are the Jubee Contra findings?")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      What are the Jubee Contra findings?
                    </button>
                    <button
                      onClick={() => setChatInput("How can I strengthen my precedents?")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      How can I strengthen my precedents?
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

                  {isAIChatTyping && (
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
                  placeholder="Ask about PSI analysis..."
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

        {/* Floating Chat Toggle Button */}
        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group ${showAIChat ? 'scale-0' : 'scale-100'
            }`}
        >
          <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        </button>

        {/* Dialogs */}
        {isMySpaceSaveDialogOpen && (
          <MySpaceSaveDialog
            isOpen={isMySpaceSaveDialogOpen}
            onClose={() => {
              setIsMySpaceSaveDialogOpen(false);
              setSavingBadLaws(false);
            }}
            defaultFileName={savingBadLaws ? "Bad_Laws_Report.pdf" : "PSI_Report.pdf"}
            onSave={handleSaveDocument}
          />
        )}

        {/* Detailed Analysis Dialog */}
        {selectedBadLaw && (
          <Dialog open={!!selectedBadLaw} onOpenChange={() => setSelectedBadLaw(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${selectedBadLaw.badLaw.severity === 'high'
                      ? 'text-red-500'
                      : selectedBadLaw.badLaw.severity === 'medium'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                    }`} />
                  Detailed Jubee Contra Analysis
                </DialogTitle>
                <DialogDescription>
                  Comprehensive analysis of the detected Jubee Contra issue and its implications
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                {/* Case Information */}
                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Scale className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-2">Your Uploaded Judgment</p>
                      <p className="text-sm font-bold text-foreground mb-1">{selectedBadLaw.caseName}</p>
                      <p className="text-xs text-muted-foreground">{selectedBadLaw.citation}</p>
                    </div>
                    <Badge
                      className={`text-xs capitalize ${selectedBadLaw.badLaw.severity === 'high'
                          ? 'bg-red-500/10 text-red-600 border-red-500/20'
                          : selectedBadLaw.badLaw.severity === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}
                    >
                      {selectedBadLaw.badLaw.severity} severity
                    </Badge>
                  </div>
                </div>

                {/* Referenced Case - from Internet */}
                {selectedBadLaw.badLaw.referencedCase && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-primary font-semibold mb-2">Referenced Case (Internet Source)</p>
                        <p className="text-sm font-bold text-foreground mb-1">{selectedBadLaw.badLaw.referencedCase}</p>
                        {selectedBadLaw.badLaw.referencedCitation && (
                          <p className="text-xs text-muted-foreground font-mono">{selectedBadLaw.badLaw.referencedCitation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Issue */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    Issue Identified
                  </h4>
                  <p className="text-sm text-foreground bg-card border border-border rounded-lg p-3">
                    {selectedBadLaw.badLaw.issue}
                  </p>
                </div>

                {/* Explanation */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Detailed Explanation
                  </h4>
                  <p className="text-sm text-muted-foreground bg-card border border-border rounded-lg p-3 leading-relaxed">
                    {selectedBadLaw.badLaw.explanation}
                  </p>
                </div>

                {/* AI Recommendations */}
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    AI Recommendations
                  </h4>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground">Consider citing alternative precedents that better align with your jurisdiction and case facts.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground">Review the overruling status and citation frequency to assess current legal standing.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground">Verify bench strength compatibility with your target court to strengthen your argument.</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    onClick={() => {
                      toast.success('Opening full case law...');
                      setSelectedBadLaw(null);
                    }}
                    className="flex-1 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Full Case Law
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success('Jubee Contra analysis saved to My Space');
                      setSelectedBadLaw(null);
                    }}
                    variant="ghost"
                    className="flex-1 h-10 font-semibold border-border hover:bg-accent"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Analysis
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Detailed Case Analysis Dialog */}
        {selectedCaseDetail && (
          <Dialog open={!!selectedCaseDetail} onOpenChange={() => setSelectedCaseDetail(null)}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Scale className="w-6 h-6 text-primary" />
                  Detailed PSI Analysis
                </DialogTitle>
                <DialogDescription>
                  In-depth breakdown of the Precedent Strength Index score and metrics
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Case Header */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{selectedCaseDetail.caseName}</h3>
                      <p className="text-sm text-muted-foreground font-mono mb-3">{selectedCaseDetail.citation}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedCaseDetail.metrics.overrulingStatus}
                        </Badge>
                        <Badge
                          className={`text-xs ${selectedCaseDetail.metrics.indexScore >= 75
                              ? 'bg-green-500/10 text-green-600 border-green-500/20'
                              : selectedCaseDetail.metrics.indexScore >= 50
                                ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                                : 'bg-red-500/10 text-red-600 border-red-500/20'
                            }`}
                        >
                          {selectedCaseDetail.metrics.indexScore >= 75 ? 'Strong Precedent' : selectedCaseDetail.metrics.indexScore >= 50 ? 'Moderate Precedent' : 'Weak Precedent'}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-card border-2 border-primary rounded-xl p-6 text-center min-w-[120px]">
                      <div className={`text-4xl font-bold mb-1 ${selectedCaseDetail.metrics.indexScore >= 75
                          ? 'text-green-500'
                          : selectedCaseDetail.metrics.indexScore >= 50
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}>
                        {selectedCaseDetail.metrics.indexScore}
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground">PSI SCORE</div>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Explanation */}
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Why This Score?
                  </h4>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-sm text-foreground mb-4 leading-relaxed">
                      The PSI score of <strong className="text-primary">{selectedCaseDetail.metrics.indexScore}</strong> is calculated based on multiple factors that determine the strength and reliability of this precedent for your case. Here's the detailed breakdown:
                    </p>
                  </div>
                </div>

                {/* Detailed Metrics Analysis */}
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Metric-by-Metric Analysis
                  </h4>
                  <div className="space-y-4">
                    {/* Context Proximity */}
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-foreground mb-1">Context Proximity</h5>
                          <p className="text-xs text-muted-foreground">How closely the case facts align with your situation</p>
                        </div>
                        <span className={`text-2xl font-bold ${selectedCaseDetail.metrics.contextProximity >= 75 ? 'text-green-500' :
                            selectedCaseDetail.metrics.contextProximity >= 50 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                          {selectedCaseDetail.metrics.contextProximity}%
                        </span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all ${selectedCaseDetail.metrics.contextProximity >= 75 ? 'bg-green-500' :
                              selectedCaseDetail.metrics.contextProximity >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${selectedCaseDetail.metrics.contextProximity}%` }}
                        />
                      </div>
                      <p className="text-xs text-foreground bg-muted/30 rounded-lg p-3 leading-relaxed">
                        {selectedCaseDetail.metrics.contextProximity >= 75
                          ? 'Excellent alignment! The factual circumstances and legal issues in this case are very similar to yours, making it a highly relevant precedent.'
                          : selectedCaseDetail.metrics.contextProximity >= 50
                            ? 'Moderate alignment. While there are similarities, some factual differences exist that may require careful distinction in your arguments.'
                            : 'Limited alignment. The factual context differs significantly from your case, which may weaken its persuasive value.'
                        }
                      </p>
                    </div>

                    {/* Stage/Proceeding Mismatch */}
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-foreground mb-1">Stage/Proceeding Match</h5>
                          <p className="text-xs text-muted-foreground">Alignment with your case's procedural stage</p>
                        </div>
                        <span className={`text-2xl font-bold ${selectedCaseDetail.metrics.stageProceedingMismatch <= 25 ? 'text-green-500' :
                            selectedCaseDetail.metrics.stageProceedingMismatch <= 50 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                          {100 - selectedCaseDetail.metrics.stageProceedingMismatch}%
                        </span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all ${selectedCaseDetail.metrics.stageProceedingMismatch <= 25 ? 'bg-green-500' :
                              selectedCaseDetail.metrics.stageProceedingMismatch <= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${100 - selectedCaseDetail.metrics.stageProceedingMismatch}%` }}
                        />
                      </div>
                      <p className="text-xs text-foreground bg-muted/30 rounded-lg p-3 leading-relaxed">
                        {selectedCaseDetail.metrics.stageProceedingMismatch <= 25
                          ? 'Perfect match! This precedent was decided at a similar procedural stage, making it highly applicable to your current proceedings.'
                          : selectedCaseDetail.metrics.stageProceedingMismatch <= 50
                            ? 'Partial match. The procedural stage differs somewhat, so consider whether the legal principles still fully apply.'
                            : 'Significant mismatch. This case was decided at a different procedural stage, which may limit its direct applicability.'
                        }
                      </p>
                    </div>

                    {/* Court Hierarchy */}
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-foreground mb-1">Court Hierarchy Match</h5>
                          <p className="text-xs text-muted-foreground">Binding authority for your target court</p>
                        </div>
                        <span className={`text-2xl font-bold ${selectedCaseDetail.metrics.courtMismatch <= 25 ? 'text-green-500' :
                            selectedCaseDetail.metrics.courtMismatch <= 50 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                          {100 - selectedCaseDetail.metrics.courtMismatch}%
                        </span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all ${selectedCaseDetail.metrics.courtMismatch <= 25 ? 'bg-green-500' :
                              selectedCaseDetail.metrics.courtMismatch <= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${100 - selectedCaseDetail.metrics.courtMismatch}%` }}
                        />
                      </div>
                      <p className="text-xs text-foreground bg-muted/30 rounded-lg p-3 leading-relaxed">
                        {selectedCaseDetail.metrics.courtMismatch <= 25
                          ? 'Strong binding authority! This precedent from a higher or same court will carry significant weight in your proceedings.'
                          : selectedCaseDetail.metrics.courtMismatch <= 50
                            ? 'Moderate authority. While persuasive, this precedent may not be strictly binding on your target court.'
                            : 'Limited binding authority. This precedent comes from a different jurisdiction and may have persuasive value only.'
                        }
                        {selectedCaseDetail.metrics.courtMismatchDetails && (
                          <span className="block mt-2 font-semibold text-primary">
                            {selectedCaseDetail.metrics.courtMismatchDetails}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Bench Strength */}
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-foreground mb-1">Bench Strength</h5>
                          <p className="text-xs text-muted-foreground">Size and composition of the deciding bench</p>
                        </div>
                        <span className={`text-2xl font-bold ${selectedCaseDetail.metrics.benchStrength >= 75 ? 'text-green-500' :
                            selectedCaseDetail.metrics.benchStrength >= 50 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                          {selectedCaseDetail.metrics.benchStrength}%
                        </span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all ${selectedCaseDetail.metrics.benchStrength >= 75 ? 'bg-green-500' :
                              selectedCaseDetail.metrics.benchStrength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${selectedCaseDetail.metrics.benchStrength}%` }}
                        />
                      </div>
                      <p className="text-xs text-foreground bg-muted/30 rounded-lg p-3 leading-relaxed">
                        {selectedCaseDetail.metrics.benchStrength >= 75
                          ? 'Constitutional bench or larger bench! Decisions by larger benches carry more weight and are less likely to be overruled.'
                          : selectedCaseDetail.metrics.benchStrength >= 50
                            ? 'Regular bench. The decision has standard precedential value based on court hierarchy.'
                            : 'Single judge or smaller bench. May be overruled by larger benches in future.'
                        }
                      </p>
                    </div>

                    {/* Citation Frequency */}
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-foreground mb-1">Citation Frequency</h5>
                          <p className="text-xs text-muted-foreground">How often this case is cited in subsequent judgments</p>
                        </div>
                        <span className={`text-2xl font-bold ${selectedCaseDetail.metrics.citationFrequency >= 75 ? 'text-green-500' :
                            selectedCaseDetail.metrics.citationFrequency >= 50 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                          {selectedCaseDetail.metrics.citationFrequency}%
                        </span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full rounded-full transition-all ${selectedCaseDetail.metrics.citationFrequency >= 75 ? 'bg-green-500' :
                              selectedCaseDetail.metrics.citationFrequency >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${selectedCaseDetail.metrics.citationFrequency}%` }}
                        />
                      </div>
                      <p className="text-xs text-foreground bg-muted/30 rounded-lg p-3 leading-relaxed">
                        {selectedCaseDetail.metrics.citationFrequency >= 75
                          ? 'Landmark case! Frequently cited by courts, indicating its importance and acceptance as settled law.'
                          : selectedCaseDetail.metrics.citationFrequency >= 50
                            ? 'Moderately cited. The case has reasonable recognition but may not be a leading authority.'
                            : 'Rarely cited. This precedent may have limited acceptance or may address a narrow legal point.'
                        }
                      </p>
                    </div>

                    {/* Overruling Status */}
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-bold text-foreground mb-1">Overruling Status</h5>
                          <p className="text-xs text-muted-foreground">Current legal validity of this precedent</p>
                        </div>
                        <Badge className={`text-sm font-bold ${selectedCaseDetail.metrics.overrulingStatus === 'Active'
                            ? 'bg-green-500/10 text-green-600 border-green-500/20'
                            : selectedCaseDetail.metrics.overrulingStatus === 'Partially Overruled'
                              ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                              : 'bg-red-500/10 text-red-600 border-red-500/20'
                          }`}>
                          {selectedCaseDetail.metrics.overrulingStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground bg-muted/30 rounded-lg p-3 leading-relaxed">
                        {selectedCaseDetail.metrics.overrulingStatus === 'Active'
                          ? 'Good law! This precedent has not been overruled and remains fully applicable as binding authority.'
                          : selectedCaseDetail.metrics.overrulingStatus === 'Partially Overruled'
                            ? 'Caution required. Some aspects of this judgment have been overruled. Verify which specific holdings remain valid.'
                            : 'Overruled! This precedent is no longer good law. Do not rely on it as it has been explicitly overruled by a later judgment.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overall Recommendation */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
                  <h4 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                    <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                    Jubee's Conclusion
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedCaseDetail.metrics.indexScore >= 75
                      ? 'This is a strong precedent that you should definitely cite in your arguments. The high PSI score indicates excellent alignment with your case context, strong judicial authority, and reliable legal standing.'
                      : selectedCaseDetail.metrics.indexScore >= 50
                        ? 'This precedent has moderate strength and can be used to support your arguments, but consider supplementing it with stronger authorities. Pay attention to the metrics that scored lower and address potential counterarguments.'
                        : 'Exercise caution when relying on this precedent. The low PSI score indicates significant weaknesses in context alignment, judicial authority, or legal validity. Consider finding alternative precedents with higher scores.'
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={() => {
                      toast.success('Case analysis saved to My Space');
                      setSelectedCaseDetail(null);
                    }}
                    className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Analysis
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success('Opening full judgment...');
                    }}
                    variant="ghost"
                    className="flex-1 h-11 font-semibold border-border hover:bg-accent"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Full Judgment
                  </Button>
                  <Button
                    onClick={() => setSelectedCaseDetail(null)}
                    variant="ghost"
                    className="h-11 px-4 font-semibold border-border hover:bg-accent"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  // Render ASI Results View
  if (currentStage === 'asi-results') {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ToolNavigation
          currentTool="si"
          onToolChange={onToolChange}
          onBack={onBack}
          activeTool={activeTool}
        />

        {/* Header */}
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
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">ASI Results</h3>
                <p className="text-sm text-muted-foreground">{asiResults.length} {asiResults.length === 1 ? 'argument' : 'arguments'} analyzed • {jurisdiction}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveToMySpace}
                variant="ghost"
                size="sm"
                className="font-semibold border-border hover:bg-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                Save to My Space
              </Button>
              <Button
                onClick={handleDownloadReport}
                variant="ghost"
                size="sm"
                className="font-semibold border-border hover:bg-accent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>

        {/* Results Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {asiResults.map((argument) => (
              <div key={argument.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Argument Header */}
                <button
                  onClick={() => toggleArgumentExpansion(argument.id)}
                  className="w-full bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border hover:from-primary/15 hover:to-primary/10 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-bold text-foreground">{argument.reliefSought}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-xs">
                          {argument.factsReliedUpon.length} Facts
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {argument.casesReliedUpon.length} Cases
                        </Badge>
                        <Badge
                          className={`text-xs ${argument.vulnerabilities.length === 0
                              ? 'bg-green-500/10 text-green-600 border-green-500/30'
                              : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                            }`}
                        >
                          {argument.vulnerabilities.length} {argument.vulnerabilities.length === 1 ? 'Vulnerability' : 'Vulnerabilities'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-6 py-3 rounded-xl border-2 ${getScoreBg(argument.strengthScore)}`}>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(argument.strengthScore)}`}>
                            {argument.strengthScore}
                          </div>
                          <div className="text-xs font-semibold text-muted-foreground mt-1">
                            ASI SCORE
                          </div>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${expandedArguments.has(argument.id) ? 'rotate-180' : ''
                          }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedArguments.has(argument.id) && (
                  <div className="p-6 space-y-6">
                    {/* Facts Relied Upon */}
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-bold text-foreground">Facts Relied Upon</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">Key factual points supporting this argument</p>
                      </div>
                      <div className="space-y-2">
                        {argument.factsReliedUpon.map((fact, index) => (
                          <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary">{index + 1}</span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">{fact}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cases Relied Upon */}
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <h4 className="text-sm font-bold text-foreground">Cases Relied Upon</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">Legal precedents cited to support this argument</p>
                      </div>
                      <div className="space-y-3">
                        {argument.casesReliedUpon.map((caseRef, index) => (
                          <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground mb-1">{caseRef.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{caseRef.citation}</p>
                              </div>
                              <Badge className={`${getScoreBg(caseRef.relevance)} ${getScoreColor(caseRef.relevance)} text-xs flex-shrink-0`}>
                                {caseRef.relevance}%
                              </Badge>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Relevance Score</span>
                                <span className="text-xs font-semibold text-foreground">{caseRef.relevance}%</span>
                              </div>
                              <div className="h-2 bg-border rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${caseRef.relevance}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vulnerabilities */}
                    {argument.vulnerabilities.length > 0 && (
                      <div>
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <h4 className="text-sm font-bold text-foreground">Identified Vulnerabilities</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">Potential weaknesses or issues that may affect this argument</p>
                        </div>
                        <div className="space-y-3">
                          {argument.vulnerabilities.map((vuln) => (
                            <div
                              key={vuln.id}
                              className="p-4 rounded-lg border border-border bg-muted/20"
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  {vuln.type === 'weak-fact' && <Lightbulb className="w-4 h-4 text-muted-foreground" />}
                                  {vuln.type === 'contradictory-precedent' && <XCircle className="w-4 h-4 text-muted-foreground" />}
                                  {vuln.type === 'procedural-issue' && <AlertCircle className="w-4 h-4 text-muted-foreground" />}
                                  <p className="text-sm font-semibold text-foreground capitalize">
                                    {vuln.type.replace('-', ' ')}
                                  </p>
                                </div>
                                <Badge
                                  className={`text-xs capitalize flex-shrink-0 ${vuln.severity === 'high'
                                      ? 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/10'
                                      : vuln.severity === 'medium'
                                        ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/10'
                                        : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10'
                                    }`}
                                >
                                  {vuln.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{vuln.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Session Saved Notice */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Session saved!</span> This ASI analysis has been saved to your History.
              </p>
            </div>
          </div>
        </div>

        {/* AI Chat Panel - Slides from right */}
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
                Ask me about ASI scores, argument strengths, vulnerabilities, or evidence strategies
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
                    Ask me about ASI scores, argument strength analysis, or how to address vulnerabilities
                  </p>
                  <div className="mt-6 space-y-2 w-full max-w-[280px]">
                    <button
                      onClick={() => setChatInput("Explain the ASI scores in detail")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      Explain the ASI scores in detail
                    </button>
                    <button
                      onClick={() => setChatInput("What are the main vulnerabilities?")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      What are the main vulnerabilities?
                    </button>
                    <button
                      onClick={() => setChatInput("How can I strengthen my arguments?")}
                      className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                    >
                      How can I strengthen my arguments?
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

                  {isAIChatTyping && (
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
                  placeholder="Ask about ASI analysis..."
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

        {/* Floating Chat Toggle Button */}
        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group ${showAIChat ? 'scale-0' : 'scale-100'
            }`}
        >
          <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        </button>

        {/* Dialogs */}
        {isMySpaceSaveDialogOpen && (
          <MySpaceSaveDialog
            isOpen={isMySpaceSaveDialogOpen}
            onClose={() => setIsMySpaceSaveDialogOpen(false)}
            defaultFileName="ASI_Report.pdf"
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
        currentTool="si"
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
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">SI Analysis</h2>
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
                      className={`max-w-[85%] rounded-2xl px-5 py-4 ${message.type === 'user'
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
                              <FileText className="w-4 h-4" />
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
                        Jubee is evaluating Strength Index...
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
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && console.log('Send')}
                placeholder="Type your message here..."
                className="w-full h-16 pl-6 pr-28 text-base bg-card border-2 border-border rounded-2xl focus:border-primary text-foreground"
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
                  onClick={() => console.log('Send')}
                  disabled={!inputValue.trim()}
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
        onConfirm={(judges) => {
          if (currentStage === 'psi-judge-selection') {
            handlePSIJudgeModalConfirm(judges);
          } else if (currentStage === 'asi-judge-selection') {
            handleASIJudgeModalConfirm(judges);
          }
        }}
      />
    </div>
  );
}