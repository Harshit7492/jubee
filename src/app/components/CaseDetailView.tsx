import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MessageSquare, FileText, Bell, Plus, Search, Clock, Sparkles, FolderOpen, Gavel, LayoutDashboard, User, LogOut, Eye, Trash2, Upload, FolderPlus, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Switch } from '@/app/components/ui/switch';
import { CaseResearchBoard } from '@/app/components/CaseResearchBoard';
import { DocumentChatView } from '@/app/components/DocumentChatView';
import { CaseFolderView } from '@/app/components/CaseFolderView';
import { AutoCaveatSetupDialog } from '@/app/components/AutoCaveatSetupDialog';
import { AutoCaveatView } from '@/app/components/AutoCaveatView';
import { CaseFilesView } from '@/app/components/CaseFilesView';
import { RecentCourtOrdersView } from '@/app/components/RecentCourtOrdersView';
import { JubeeFooter } from '@/app/components/JubeeFooter';
import { PastChatView } from '@/app/components/PastChatView';
import jubeeLogo from '@/assets/jubee-logo.png';

interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  client: string;
  court: string;
  status: string;
  nextHearing: string;
  type: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  toolName: string;
  lastMessage: string;
  timestamp: string;
  folder?: string;
  documentName?: string;
  messages?: ChatMessage[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  size: string;
  folder: string;
}

const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Legal research on Section 9 Arbitration Act',
    toolName: 'Legal Research',
    lastMessage: 'Show me precedents on interim measures under Section 9',
    timestamp: '2 hours ago',
    messages: [
      {
        id: '1-1',
        role: 'user',
        content: 'I need to research Section 9 of the Arbitration and Conciliation Act. Can you help?',
        timestamp: '2 hours ago'
      },
      {
        id: '1-2',
        role: 'assistant',
        content: 'Certainly! Section 9 of the Arbitration and Conciliation Act, 1996 deals with interim measures by the Court. A party may, before or during arbitral proceedings or at any time after the making of the arbitral award but before it is enforced, apply to a court for interim measures of protection.',
        timestamp: '2 hours ago'
      },
      {
        id: '1-3',
        role: 'user',
        content: 'Show me precedents on interim measures under Section 9',
        timestamp: '2 hours ago'
      },
      {
        id: '1-4',
        role: 'assistant',
        content: 'Here are some key precedents:\n\n1. **Adhunik Steels Ltd. v. Orissa Manganese and Minerals (P) Ltd. (2007)**: The Supreme Court held that Section 9 applications are maintainable even after the arbitral award is made but before enforcement.\n\n2. **Sundaram Finance Ltd. v. Abdul Samad (2018)**: The Supreme Court clarified that interim relief under Section 9 can be sought at any stage.\n\n3. **Firm Ashok Traders v. Gurumukh Das Saluja (2004)**: Held that the power under Section 9 is wide and includes granting injunctions and appointing receivers.',
        timestamp: '2 hours ago'
      }
    ]
  },
  {
    id: '2',
    title: 'Draft reply to respondent\'s objections',
    toolName: 'AI Drafting',
    lastMessage: 'Draft a reply to the objections raised by the respondent',
    timestamp: '5 hours ago',
    messages: [
      {
        id: '2-1',
        role: 'user',
        content: 'I need to draft a reply to the respondent\'s objections in an arbitration matter.',
        timestamp: '5 hours ago'
      },
      {
        id: '2-2',
        role: 'assistant',
        content: 'I\'d be happy to help you draft a reply. Could you provide me with:\n1. The key objections raised by the respondent\n2. Your counter-arguments\n3. Any relevant facts or documents you want to reference',
        timestamp: '5 hours ago'
      },
      {
        id: '2-3',
        role: 'user',
        content: 'Draft a reply to the objections raised by the respondent',
        timestamp: '5 hours ago'
      }
    ]
  },
  {
    id: '3',
    title: 'Main Petition - Section 9 Arbitration Act',
    toolName: 'Document Chat',
    lastMessage: 'What relief is sought in this petition?',
    timestamp: 'Yesterday',
    folder: 'petitions',
    documentName: 'Main Petition - Section 9 Arbitration Act',
    messages: [
      {
        id: '3-1',
        role: 'user',
        content: 'Please analyze this petition document.',
        timestamp: 'Yesterday'
      },
      {
        id: '3-2',
        role: 'assistant',
        content: 'I\'ve analyzed the Main Petition under Section 9 of the Arbitration Act. The petition is well-structured and contains the following key sections:\n\n1. Jurisdiction and prayers\n2. Facts of the case\n3. Grounds for interim relief\n4. Legal submissions',
        timestamp: 'Yesterday'
      },
      {
        id: '3-3',
        role: 'user',
        content: 'What relief is sought in this petition?',
        timestamp: 'Yesterday'
      },
      {
        id: '3-4',
        role: 'assistant',
        content: 'The petition seeks the following interim reliefs:\n\n1. Restraining the respondent from alienating, disposing, or creating third-party rights over the disputed property\n2. Directing the respondent to maintain status quo with respect to the arbitration agreement\n3. Appointing a Court Receiver to take custody of relevant documents\n4. Any other relief deemed fit by the Hon\'ble Court',
        timestamp: 'Yesterday'
      }
    ]
  },
  {
    id: '4',
    title: 'Cross-examination questions for respondent witness',
    toolName: 'Cross-Examiner',
    lastMessage: 'Prepare questions to challenge witness credibility',
    timestamp: '2 days ago',
    messages: [
      {
        id: '4-1',
        role: 'user',
        content: 'I need to cross-examine the respondent\'s witness. Can you help me prepare?',
        timestamp: '2 days ago'
      },
      {
        id: '4-2',
        role: 'assistant',
        content: 'Absolutely! To prepare effective cross-examination questions, I\'ll need:\n1. The witness statement or deposition\n2. Key inconsistencies or weak points\n3. What you aim to establish through cross-examination',
        timestamp: '2 days ago'
      },
      {
        id: '4-3',
        role: 'user',
        content: 'Prepare questions to challenge witness credibility',
        timestamp: '2 days ago'
      },
      {
        id: '4-4',
        role: 'assistant',
        content: 'Here are strategic questions to challenge credibility:\n\n**Inconsistency Questions:**\n1. In your statement dated [date], you mentioned X. Today you\'re saying Y. Which is correct?\n2. You claim to remember specific details from [date], yet you cannot recall [other detail]. How do you explain this?\n\n**Bias Questions:**\n3. You have a business relationship with the respondent, correct?\n4. You stand to benefit if the respondent wins this case, don\'t you?\n\n**Memory & Perception:**\n5. How far were you from the incident?\n6. What was the lighting condition at that time?',
        timestamp: '2 days ago'
      }
    ]
  },
  {
    id: '5',
    title: 'Application for Interim Relief',
    toolName: 'Document Chat',
    lastMessage: 'Summarize the grounds for interim relief',
    timestamp: '3 days ago',
    folder: 'applications',
    documentName: 'Application for Interim Relief',
    messages: [
      {
        id: '5-1',
        role: 'user',
        content: 'Summarize the grounds for interim relief',
        timestamp: '3 days ago'
      },
      {
        id: '5-2',
        role: 'assistant',
        content: 'Based on the Application for Interim Relief, the grounds are:\n\n1. **Prima Facie Case**: The applicant has established a strong prima facie case with documentary evidence of the arbitration agreement and breach of contract.\n\n2. **Irreparable Loss**: Without interim measures, the applicant will suffer irreparable financial harm as the respondent is dissipating assets.\n\n3. **Balance of Convenience**: The balance of convenience favors the applicant as the respondent can be compensated in damages if the final award is in their favor.\n\n4. **Urgency**: Immediate relief is necessary as the respondent is attempting to sell the mortgaged property.',
        timestamp: '3 days ago'
      }
    ]
  }
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Main Petition - Section 9 Arbitration Act',
    type: 'pdf',
    uploadedDate: '15/12/2025',
    size: '2.4 MB',
    folder: 'petitions'
  },
  {
    id: '2',
    name: 'Written Statement by Respondent',
    type: 'pdf',
    uploadedDate: '18/12/2025',
    size: '1.8 MB',
    folder: 'petitions'
  },
  {
    id: '3',
    name: 'Rejoinder to Written Statement',
    type: 'pdf',
    uploadedDate: '05/01/2026',
    size: '1.5 MB',
    folder: 'petitions'
  },
  {
    id: '4',
    name: 'Application for Interim Relief',
    type: 'pdf',
    uploadedDate: '20/12/2025',
    size: '1.2 MB',
    folder: 'applications'
  },
  {
    id: '5',
    name: 'Application for Stay of Execution',
    type: 'pdf',
    uploadedDate: '22/12/2025',
    size: '980 KB',
    folder: 'applications'
  },
  {
    id: '6',
    name: 'Application for Modification of Order',
    type: 'pdf',
    uploadedDate: '08/01/2026',
    size: '756 KB',
    folder: 'applications'
  },
  {
    id: '7',
    name: 'Application for Additional Documents',
    type: 'pdf',
    uploadedDate: '12/01/2026',
    size: '645 KB',
    folder: 'applications'
  },
  {
    id: '8',
    name: 'Application for Exemption from Filing Court Fees',
    type: 'pdf',
    uploadedDate: '14/01/2026',
    size: '512 KB',
    folder: 'applications'
  },
  {
    id: '9',
    name: 'Order dated 10/01/2026 - Interim Relief Granted',
    type: 'pdf',
    uploadedDate: '10/01/2026',
    size: '856 KB',
    folder: 'orders'
  },
  {
    id: '10',
    name: 'Order dated 15/01/2026 - Notice issued to Respondent',
    type: 'pdf',
    uploadedDate: '15/01/2026',
    size: '654 KB',
    folder: 'orders'
  },
  {
    id: '11',
    name: 'Judgment dated 20/01/2026 - Matter Partly Allowed',
    type: 'pdf',
    uploadedDate: '20/01/2026',
    size: '3.2 MB',
    folder: 'orders'
  },
  {
    id: '12',
    name: 'Order dated 22/01/2026 - Next Hearing Scheduled',
    type: 'pdf',
    uploadedDate: '22/01/2026',
    size: '421 KB',
    folder: 'orders'
  },
  {
    id: '13',
    name: 'Arbitration Award Copy',
    type: 'pdf',
    uploadedDate: '01/12/2025',
    size: '2.8 MB',
    folder: 'misc'
  },
  {
    id: '14',
    name: 'Affidavit of Petitioner',
    type: 'pdf',
    uploadedDate: '10/12/2025',
    size: '892 KB',
    folder: 'misc'
  },
  {
    id: '15',
    name: 'List of Documents (Index)',
    type: 'pdf',
    uploadedDate: '15/12/2025',
    size: '234 KB',
    folder: 'misc'
  },
  {
    id: '16',
    name: 'Vakalatnama - Advocate on Record',
    type: 'pdf',
    uploadedDate: '28/11/2025',
    size: '156 KB',
    folder: 'misc'
  },
  {
    id: '17',
    name: 'Court Fee Stamps Receipt',
    type: 'pdf',
    uploadedDate: '30/11/2025',
    size: '89 KB',
    folder: 'misc'
  },
  {
    id: '18',
    name: 'Process Service Acknowledgment',
    type: 'pdf',
    uploadedDate: '18/01/2026',
    size: '312 KB',
    folder: 'misc'
  }
];

const folders = [
  { id: 'recent-chats', name: 'Recent Activity', icon: MessageSquare, color: 'text-primary' },
  { id: 'petitions', name: 'Petitions', icon: FileText, color: 'text-blue-500' },
  { id: 'applications', name: 'Applications', icon: FileText, color: 'text-purple-500' },
  { id: 'orders', name: 'Orders/Judgments', icon: Gavel, color: 'text-amber-500' },
  { id: 'misc', name: 'Misc', icon: FolderOpen, color: 'text-emerald-500' }
];

interface CaseDetailViewProps {
  caseData: CaseData;
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export function CaseDetailView({ caseData, onBack, onNavigate }: CaseDetailViewProps) {
  const [selectedView, setSelectedView] = useState<'recent-chats' | 'case-files' | 'new-chat' | 'document-chat' | 'auto-caveat' | 'recent-court-orders' | 'past-chat'>('new-chat');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isAutoCaveatDialogOpen, setIsAutoCaveatDialogOpen] = useState(false);
  const [autoCaveatConfig, setAutoCaveatConfig] = useState<{ court: string; clientName: string } | null>(null);
  const [isAutoCaveatEnabled, setIsAutoCaveatEnabled] = useState(false);
  const [isCourtOrdersEnabled, setIsCourtOrdersEnabled] = useState(false);
  const [chatSessions, setChatSessions] = useState(mockChatSessions);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [chatToView, setChatToView] = useState<ChatSession | null>(null);
  const [selectedPastChat, setSelectedPastChat] = useState<ChatSession | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Listen for navigate-recent-chats event
  useEffect(() => {
    const handleNavigateRecentChats = () => {
      setSelectedView('recent-chats');
    };

    const handleNavigateCaseFiles = () => {
      setSelectedView('case-files');
      setSelectedFolder('');
    };

    const handleNavigateCaseFolder = (event: any) => {
      const folderId = event.detail?.folderId;
      if (folderId) {
        setSelectedView('case-files');
        setSelectedFolder(folderId);
      }
    };

    window.addEventListener('navigate-recent-chats' as any, handleNavigateRecentChats);
    window.addEventListener('navigate-case-files' as any, handleNavigateCaseFiles);
    window.addEventListener('navigate-case-folder' as any, handleNavigateCaseFolder);

    return () => {
      window.removeEventListener('navigate-recent-chats' as any, handleNavigateRecentChats);
      window.removeEventListener('navigate-case-files' as any, handleNavigateCaseFiles);
      window.removeEventListener('navigate-case-folder' as any, handleNavigateCaseFolder);
    };
  }, []);

  const handleFolderClick = (folderId: string) => {
    if (folderId === 'recent-chats') {
      setSelectedView('recent-chats');
      setSelectedFolder('');
    } else {
      setSelectedView('folder');
      setSelectedFolder(folderId);
    }
  };

  const handleNewChat = () => {
    setSelectedView('new-chat');
  };

  const handleBackFromNewChat = () => {
    setSelectedView('new-chat');
  };

  const handleSelectDocument = (doc: any) => {
    setSelectedDocument(doc);
    setSelectedView('document-chat');
  };

  const handleBackFromDocument = () => {
    if (selectedFolder) {
      setSelectedView('folder');
    } else {
      setSelectedView('recent-chats');
    }
    setSelectedDocument(null);
  };

  const handleOpenChat = (chat: ChatSession) => {
    setSelectedPastChat(chat);
    setSelectedView('past-chat');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('Uploading files:', Array.from(files).map(f => f.name));
      // Add file upload logic here
    }
  };

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('Uploading folder:', Array.from(files).map(f => f.name));
      // Add folder upload logic here
    }
  };

  const getToolIcon = (toolName: string) => {
    if (toolName === 'Document Chat') return FileText;
    return Sparkles;
  };

  const getToolColor = (toolName: string) => {
    const colors: Record<string, string> = {
      'Legal Research': 'text-blue-500',
      'AI Drafting': 'text-amber-500',
      'Document Chat': 'text-red-500',
      'Cross-Examiner': 'text-cyan-500',
      'Translation': 'text-purple-500'
    };
    return colors[toolName] || 'text-primary';
  };

  // Filter documents and chats
  const filteredDocuments = selectedFolder
    ? mockDocuments.filter(doc => doc.folder === selectedFolder)
    : [];

  const filteredChats = chatSessions.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show past chat view
  if (selectedView === 'past-chat' && selectedPastChat) {
    return (
      <PastChatView
        chat={selectedPastChat}
        onBack={() => {
          setSelectedPastChat(null);
          setSelectedView('recent-chats');
        }}
        getToolIcon={getToolIcon}
        getToolColor={getToolColor}
      />
    );
  }

  // Show document chat
  if (selectedView === 'document-chat' && selectedDocument) {
    return (
      <DocumentChatView
        document={selectedDocument}
        caseData={caseData}
        onBack={handleBackFromDocument}
      />
    );
  }

  // Show Case Files view
  if (selectedView === 'case-files') {
    return (
      <div className="flex-1 flex h-screen bg-background overflow-hidden">
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} border-r border-sidebar-border bg-card flex flex-col transition-all duration-300`}>
          {/* Jubee Header */}
          <div className="border-b border-sidebar-border pt-[20px] pr-[12px] pb-[20px] pl-[20px]">
            {!isCollapsed ? (
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => onNavigate?.('research-board')}
                  className="flex items-center gap-3 px-[-2px] py-[0px] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center">
                    <img src={jubeeLogo} alt="Jubee" className="w-11 h-11 object-contain" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-foreground font-bold text-lg">JUBEE</h1>
                  </div>
                </button>
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer" onClick={() => onNavigate?.('research-board')}>
                  <img src={jubeeLogo} alt="Jubee.ai Logo" className="w-11 h-11 object-contain" />
                </div>
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>

          {/* Case Info */}
          {!isCollapsed && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-accent rounded-xl transition-all duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* Folders */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {/* Dashboard */}
              {!isCollapsed ? (
                <button
                  onClick={handleNewChat}
                  className={`w-full p-3 rounded-xl transition-all text-left group ${
                    selectedView === 'new-chat'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className={`w-5 h-5 ${selectedView === 'new-chat' ? 'text-primary-foreground' : 'text-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">Dashboard</p>
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleNewChat}
                  className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                    selectedView === 'new-chat'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <LayoutDashboard className={`w-5 h-5 ${selectedView === 'new-chat' ? 'text-primary-foreground' : 'text-blue-500'}`} />
                </button>
              )}

              {/* Recent Activity */}
              {!isCollapsed ? (
                <button
                  onClick={() => setSelectedView('recent-chats')}
                  className={`w-full p-3 rounded-xl transition-all text-left group ${
                    selectedView === 'recent-chats'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className={`w-5 h-5 ${selectedView === 'recent-chats' ? 'text-primary-foreground' : 'text-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">Recent Activity</p>
                      <p className={`text-xs ${selectedView === 'recent-chats' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {mockChatSessions.length} chat{mockChatSessions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setSelectedView('recent-chats')}
                  className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                    selectedView === 'recent-chats'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <MessageSquare className={`w-5 h-5 ${selectedView === 'recent-chats' ? 'text-primary-foreground' : 'text-primary'}`} />
                </button>
              )}

              {/* Case Files */}
              {!isCollapsed ? (
                <button
                  onClick={() => setSelectedView('case-files')}
                  className={`w-full p-3 rounded-xl transition-all text-left group ${
                    selectedView === 'case-files'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className={`w-5 h-5 ${selectedView === 'case-files' ? 'text-primary-foreground' : 'text-amber-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">Case Files</p>
                      <p className={`text-xs ${selectedView === 'case-files' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {mockDocuments.length} document{mockDocuments.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setSelectedView('case-files')}
                  className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                    selectedView === 'case-files'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <FolderOpen className={`w-5 h-5 ${selectedView === 'case-files' ? 'text-primary-foreground' : 'text-amber-500'}`} />
                </button>
              )}

              {/* Recent Court Orders */}
              {!isCollapsed ? (
                <div
                  onClick={() => setSelectedView('recent-court-orders')}
                  className={`w-full p-3 rounded-xl transition-all text-left group cursor-pointer ${
                    selectedView === 'recent-court-orders'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Gavel className={`w-5 h-5 ${selectedView === 'recent-court-orders' ? 'text-primary-foreground' : 'text-purple-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">Recent Court Orders</p>
                      <p className={`text-xs ${selectedView === 'recent-court-orders' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        6 orders
                      </p>
                    </div>
                    <Switch
                      checked={isCourtOrdersEnabled}
                      onCheckedChange={(checked) => {
                        setIsCourtOrdersEnabled(checked);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedView('recent-court-orders')}
                  className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                    selectedView === 'recent-court-orders'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <Gavel className={`w-5 h-5 ${selectedView === 'recent-court-orders' ? 'text-primary-foreground' : 'text-purple-500'}`} />
                </button>
              )}

              {/* Divider */}
              {!isCollapsed && <div className="my-3 h-px bg-border" />}

              {/* Auto Caveat Button */}
              {!isCollapsed ? (
                <div
                  onClick={() => {
                    if (autoCaveatConfig) {
                      setSelectedView('auto-caveat');
                    } else {
                      setIsAutoCaveatDialogOpen(true);
                    }
                  }}
                  className={`w-full p-3 rounded-xl transition-all text-left group cursor-pointer ${
                    selectedView === 'auto-caveat'
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg'
                      : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-foreground border border-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className={`w-5 h-5 ${selectedView === 'auto-caveat' ? 'text-primary-foreground animate-pulse' : 'text-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">Auto Caveat</p>
                      <p className={`text-xs ${selectedView === 'auto-caveat' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {autoCaveatConfig ? 'Monitoring active' : 'Setup monitoring'}
                      </p>
                    </div>
                    <Switch
                      checked={isAutoCaveatEnabled}
                      onCheckedChange={(checked) => {
                        setIsAutoCaveatEnabled(checked);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (autoCaveatConfig) {
                      setSelectedView('auto-caveat');
                    } else {
                      setIsAutoCaveatDialogOpen(true);
                    }
                  }}
                  className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                    selectedView === 'auto-caveat'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <Bell className={`w-5 h-5 ${selectedView === 'auto-caveat' ? 'text-primary-foreground animate-pulse' : 'text-primary'}`} />
                </button>
              )}
            </div>
          </div>

          {/* User Profile with Dropdown */}
          <div className="p-4 border-t border-border relative">
            {!isCollapsed ? (
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">VK</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-foreground text-sm font-semibold truncate text-left">Vipul Wadhwa</p>
                  <p className="text-muted-foreground text-xs truncate text-left">vipul@lawfirm.com</p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-accent cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">VK</span>
                </div>
              </button>
            )}

            {/* Profile Menu Popup */}
            {showProfileMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />

                {/* Popup Menu */}
                <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate && onNavigate('profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-all text-left"
                  >
                    <Settings className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Profile Settings</span>
                  </button>
                  <div className="border-t border-border" />
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onBack();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-[1024px]">
            {/* Header - Case Details with Buttons */}
            {selectedView === 'new-chat' && (
              <div className="border-b border-border bg-card backdrop-blur-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-foreground">{caseData.caseNumber}</h2>
                      <span className="px-2.5 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-lg uppercase">
                        {caseData.court}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Header - For other views */}
            {selectedView !== 'folder' && selectedView !== 'new-chat' && selectedView !== 'auto-caveat' && selectedView !== 'recent-court-orders' && (
              <div className="border-b border-border bg-card/50 backdrop-blur-sm px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      {selectedView === 'recent-chats' ? (
                        <MessageSquare className="w-5 h-5 text-primary" />
                      ) : selectedView === 'case-files' ? (
                        <FileText className="w-5 h-5 text-primary" />
                      ) : (
                        <FolderOpen className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-foreground">
                        {selectedView === 'recent-chats' ? 'Recent Chats' : selectedView === 'case-files' ? 'Case Files' : 'Files'}
                      </h1>
                      <p className="text-xs text-muted-foreground">
                        {selectedView === 'recent-chats' ? 'View all your previous conversations' : selectedView === 'case-files' ? 'Manage case documents and files' : 'Browse files'}
                      </p>
                    </div>
                  </div>
                  {selectedView === 'case-files' && (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="border-border hover:bg-accent font-semibold h-11 px-5"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files
                      </Button>
                      <Button
                        onClick={() => folderInputRef.current?.click()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-5 gap-2 font-semibold"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Folder
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Area */}
            {selectedView === 'auto-caveat' && autoCaveatConfig ? (
              // Auto Caveat View - No padding
              <AutoCaveatView
                court={autoCaveatConfig.court}
                clientName={autoCaveatConfig.clientName}
                onBack={() => setSelectedView('new-chat')}
                onNewCaveat={() => setIsAutoCaveatDialogOpen(true)}
              />
            ) : selectedView === 'recent-court-orders' ? (
              // Recent Court Orders View - No padding
              <RecentCourtOrdersView
                caseNumber={caseData.caseNumber}
                clientName={caseData.client}
                onBack={() => setSelectedView('new-chat')}
              />
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {selectedView === 'new-chat' ? (
                  // AI Tools View (inline)
                  <div className="px-8 py-8">
                    <CaseResearchBoard caseData={caseData} onBack={() => {}} onNavigate={onNavigate} />
                  </div>
                ) : selectedView === 'case-files' && !selectedFolder ? (
                  // Case Files Grid - Show folders
                  <CaseFilesView
                    onBack={() => setSelectedView('new-chat')}
                    onDocumentClick={handleSelectDocument}
                    documents={mockDocuments}
                  />
                ) : selectedView === 'case-files' && selectedFolder ? (
                  // Folder View - My Spaces Style
                  <>
                    {/* Header */}
                    <div className="bg-card border-b border-border px-8 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            {(() => {
                              if (selectedFolder === 'petitions') return <FileText className="w-5 h-5 text-primary" />;
                              if (selectedFolder === 'applications') return <FileText className="w-5 h-5 text-primary" />;
                              if (selectedFolder === 'orders') return <Gavel className="w-5 h-5 text-primary" />;
                              return <FolderOpen className="w-5 h-5 text-primary" />;
                            })()}
                          </div>
                          <div>
                            <h3 className="text-[22px] font-bold text-foreground">
                              {selectedFolder === 'petitions' && 'Petitions'}
                              {selectedFolder === 'applications' && 'Applications'}
                              {selectedFolder === 'orders' && 'Orders/Judgments'}
                              {selectedFolder === 'misc' && 'Misc'}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="border-border hover:bg-accent font-semibold"
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            Upload Files
                          </Button>
                          <Button
                            onClick={() => setSelectedFolder(null)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                          >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-background px-6 py-4">
                      <div className="flex items-center justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for files"
                            className="w-full h-12 pl-9 pr-4 text-sm bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-8">
                      {filteredDocuments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                            <FolderOpen className="w-10 h-10 text-muted-foreground" />
                          </div>
                          <h4 className="text-lg font-bold text-foreground mb-2">
                            This folder is empty
                          </h4>
                          <p className="text-muted-foreground text-center max-w-md">
                            Upload files to get started with your document organization
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {filteredDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              onClick={() => handleSelectDocument(doc)}
                              className="group relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:border-primary/40 hover:bg-card hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                              <div className="flex flex-col items-center text-center">
                                {/* Icon */}
                                <div className="flex items-center justify-center mb-3.5 transition-transform group-hover:scale-105">
                                  <div className="scale-[2]">
                                    <FileText className="w-5 h-5 text-foreground" />
                                  </div>
                                </div>

                                {/* Name */}
                                <h5 className="text-[13px] font-semibold text-foreground mb-2 line-clamp-2 w-full leading-snug">
                                  {doc.name}
                                </h5>

                                {/* Info */}
                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                                  <Clock className="w-3 h-3" />
                                  {doc.uploadedDate}
                                </div>
                                <div className="mt-2 px-2 py-0.5 rounded-md bg-muted/40 text-[10px] font-medium text-muted-foreground">
                                  {doc.size}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : selectedView === 'recent-chats' ? (
                  // Recent Chats List
                  <div className="px-8 py-8">
                    {filteredChats.length > 0 ? (
                      <div className="space-y-3">
                        {filteredChats.map((chat) => {
                          const ToolIcon = getToolIcon(chat.toolName);
                          const toolColor = getToolColor(chat.toolName);

                          return (
                            <div
                              key={chat.id}
                              className="w-full p-5 bg-card border border-border hover:border-primary hover:bg-card/80 rounded-xl transition-all group"
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0`}>
                                  <ToolIcon className={`w-6 h-6 ${toolColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                      {chat.title}
                                    </h3>
                                    <span className={`px-2 py-0.5 bg-accent rounded-full text-xs font-medium ${toolColor}`}>
                                      {chat.toolName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <MessageSquare className="w-4 h-4" />
                                    <p className="truncate">{chat.lastMessage}</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{chat.timestamp}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (chat.documentName) {
                                        const doc = mockDocuments.find(d => d.name === chat.documentName);
                                        if (doc) handleSelectDocument(doc);
                                      }
                                    }}
                                    className="p-2 hover:bg-accent rounded-lg transition-all"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4 text-primary" />
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setChatSessions(chatSessions.filter(c => c.id !== chat.id));
                                    }}
                                    className="p-2 hover:bg-accent rounded-lg transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                          <MessageSquare className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-2">No chats yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start a new conversation for this case
                        </p>
                        <Button
                          onClick={handleNewChat}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          New Chat
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          {onNavigate && <JubeeFooter onNavigate={onNavigate} />}
        </div>

        {/* Auto Caveat Setup Dialog */}
        <AutoCaveatSetupDialog
          isOpen={isAutoCaveatDialogOpen}
          onClose={() => setIsAutoCaveatDialogOpen(false)}
          onSubmit={(court, clientName) => {
            setAutoCaveatConfig({ court, clientName });
            setIsAutoCaveatDialogOpen(false);
            setSelectedView('auto-caveat');
          }}
        />

        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          style={{ display: 'none' }}
        />
        <input
          type="file"
          ref={folderInputRef}
          onChange={handleFolderUpload}
          // @ts-ignore
          webkitdirectory=""
          directory=""
          multiple
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-background">
      {/* Case Sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-64'} border-r border-sidebar-border bg-card h-screen flex flex-col transition-all duration-300`}>
        {/* Jubee Header */}
        <div className="border-b border-sidebar-border pt-[20px] pr-[12px] pb-[20px] pl-[20px]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => onNavigate?.('research-board')}
                className="flex items-center gap-3 px-[-2px] py-[0px] hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center">
                  <img src={jubeeLogo} alt="Jubee" className="w-11 h-11 object-contain" />
                </div>
                <div className="text-left">
                  <h1 className="text-foreground font-bold text-lg">JUBEE</h1>
                </div>
              </button>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer" onClick={() => onNavigate?.('research-board')}>
                <img src={jubeeLogo} alt="Jubee.ai Logo" className="w-11 h-11 object-contain" />
              </div>
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>

        {/* Case Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-accent rounded-xl transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Folders */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {/* Dashboard */}
            {!isCollapsed ? (
              <button
                onClick={handleNewChat}
                className={`w-full p-3 rounded-xl transition-all text-left group ${
                  selectedView === 'new-chat'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-5 h-5 ${selectedView === 'new-chat' ? 'text-primary-foreground' : 'text-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Dashboard</p>
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={handleNewChat}
                className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                  selectedView === 'new-chat'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <LayoutDashboard className={`w-5 h-5 ${selectedView === 'new-chat' ? 'text-primary-foreground' : 'text-blue-500'}`} />
              </button>
            )}

            {/* Recent Activity */}
            {!isCollapsed ? (
              <button
                onClick={() => setSelectedView('recent-chats')}
                className={`w-full p-3 rounded-xl transition-all text-left group ${
                  selectedView === 'recent-chats'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={`w-5 h-5 ${selectedView === 'recent-chats' ? 'text-primary-foreground' : 'text-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Recent Activity</p>
                    <p className={`text-xs ${selectedView === 'recent-chats' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {mockChatSessions.length} chat{mockChatSessions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setSelectedView('recent-chats')}
                className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                  selectedView === 'recent-chats'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <MessageSquare className={`w-5 h-5 ${selectedView === 'recent-chats' ? 'text-primary-foreground' : 'text-primary'}`} />
              </button>
            )}

            {/* Case Files */}
            {!isCollapsed ? (
              <button
                onClick={() => setSelectedView('case-files')}
                className={`w-full p-3 rounded-xl transition-all text-left group ${
                  selectedView === 'case-files'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className={`w-5 h-5 ${selectedView === 'case-files' ? 'text-primary-foreground' : 'text-amber-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Case Files</p>
                    <p className={`text-xs ${selectedView === 'case-files' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {mockDocuments.length} document{mockDocuments.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setSelectedView('case-files')}
                className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                  selectedView === 'case-files'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <FolderOpen className={`w-5 h-5 ${selectedView === 'case-files' ? 'text-primary-foreground' : 'text-amber-500'}`} />
              </button>
            )}

            {/* Recent Court Orders */}
            {!isCollapsed ? (
              <div
                onClick={() => setSelectedView('recent-court-orders')}
                className={`w-full p-3 rounded-xl transition-all text-left group cursor-pointer ${
                  selectedView === 'recent-court-orders'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Gavel className={`w-5 h-5 ${selectedView === 'recent-court-orders' ? 'text-primary-foreground' : 'text-purple-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Recent Court Orders</p>
                    <p className={`text-xs ${selectedView === 'recent-court-orders' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      6 orders
                    </p>
                  </div>
                  <Switch
                    checked={isCourtOrdersEnabled}
                    onCheckedChange={(checked) => {
                      setIsCourtOrdersEnabled(checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setSelectedView('recent-court-orders')}
                className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                  selectedView === 'recent-court-orders'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <Gavel className={`w-5 h-5 ${selectedView === 'recent-court-orders' ? 'text-primary-foreground' : 'text-purple-500'}`} />
              </button>
            )}

            {/* Divider */}
            {!isCollapsed && <div className="my-3 h-px bg-border" />}

            {/* Auto Caveat Button */}
            {!isCollapsed ? (
              <div
                onClick={() => {
                  if (autoCaveatConfig) {
                    setSelectedView('auto-caveat');
                  } else {
                    setIsAutoCaveatDialogOpen(true);
                  }
                }}
                className={`w-full p-3 rounded-xl transition-all text-left group cursor-pointer ${
                  selectedView === 'auto-caveat'
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg'
                    : 'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-foreground border border-primary/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className={`w-5 h-5 ${selectedView === 'auto-caveat' ? 'text-primary-foreground animate-pulse' : 'text-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Auto Caveat</p>
                    <p className={`text-xs ${selectedView === 'auto-caveat' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {autoCaveatConfig ? 'Monitoring active' : 'Setup monitoring'}
                    </p>
                  </div>
                  <Switch
                    checked={isAutoCaveatEnabled}
                    onCheckedChange={(checked) => {
                      setIsAutoCaveatEnabled(checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (autoCaveatConfig) {
                    setSelectedView('auto-caveat');
                  } else {
                    setIsAutoCaveatDialogOpen(true);
                  }
                }}
                className={`w-full p-3 rounded-xl transition-all flex items-center justify-center ${
                  selectedView === 'auto-caveat'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <Bell className={`w-5 h-5 ${selectedView === 'auto-caveat' ? 'text-primary-foreground animate-pulse' : 'text-primary'}`} />
              </button>
            )}
          </div>
        </div>

        {/* User Profile with Dropdown */}
        <div className="p-4 border-t border-border relative">
          {!isCollapsed ? (
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">VK</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-foreground text-sm font-semibold truncate text-left">Vipul Wadhwa</p>
                <p className="text-muted-foreground text-xs truncate text-left">vipul@lawfirm.com</p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-accent cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">VK</span>
              </div>
            </button>
          )}

          {/* Profile Menu Popup */}
          {showProfileMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />

              {/* Popup Menu */}
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate && onNavigate('profile');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-all text-left"
                >
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Profile Settings</span>
                </button>
                <div className="border-t border-border" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onBack();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 transition-all text-left"
                >
                  <LogOut className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-[1024px]">
          {/* Header - Case Details with Buttons */}
          {selectedView === 'new-chat' && (
            <div className="border-b border-border bg-card backdrop-blur-sm px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">{caseData.caseNumber}</h2>
                    <span className="px-3 py-1.5 bg-primary/20 text-primary text-sm font-semibold rounded-lg uppercase">
                      {caseData.court}
                    </span>
                  </div>
                  <p className="text-base font-medium text-muted-foreground">Case Number</p>
                </div>
              </div>
            </div>
          )}

          {/* Header - For other views */}
          {selectedView !== 'folder' && selectedView !== 'new-chat' && selectedView !== 'auto-caveat' && selectedView !== 'recent-court-orders' && (
            <div className="border-b border-border bg-card/50 backdrop-blur-sm px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedView('new-chat')}
                    className="p-2 hover:bg-accent rounded-xl transition-all duration-200 group"
                  >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                  </button>
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    {selectedView === 'recent-chats' ? (
                      <MessageSquare className="w-5 h-5 text-primary" />
                    ) : selectedView === 'case-files' ? (
                      <FileText className="w-5 h-5 text-primary" />
                    ) : (
                      <FolderOpen className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">
                      {selectedView === 'recent-chats' ? 'Recent Chats' : selectedView === 'case-files' ? 'Case Files' : 'Files'}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {selectedView === 'recent-chats' ? 'View all your previous conversations' : selectedView === 'case-files' ? 'Manage case documents and files' : 'Browse files'}
                    </p>
                  </div>
                </div>
                {selectedView === 'case-files' && (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-border hover:bg-accent font-semibold h-11 px-5"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                    <Button
                      onClick={() => folderInputRef.current?.click()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-5 gap-2 font-semibold"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Folder
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Area */}
          {selectedView === 'auto-caveat' && autoCaveatConfig ? (
            // Auto Caveat View - No padding
            <AutoCaveatView
              court={autoCaveatConfig.court}
              clientName={autoCaveatConfig.clientName}
              onBack={() => setSelectedView('new-chat')}
              onNewCaveat={() => setIsAutoCaveatDialogOpen(true)}
            />
          ) : selectedView === 'recent-court-orders' ? (
            // Recent Court Orders View - No padding
            <RecentCourtOrdersView
              caseNumber={caseData.caseNumber}
              clientName={caseData.client}
              onBack={() => setSelectedView('new-chat')}
            />
          ) : (
            <div className="">
              <div className="w-full">
                {selectedView === 'new-chat' ? (
                  // AI Tools View (inline)
                  <CaseResearchBoard caseData={caseData} onBack={() => {}} onNavigate={onNavigate} />
                ) : selectedView === 'case-files' && !selectedFolder ? (
                  // Case Files Grid - Show folders
                  <CaseFilesView
                    onBack={() => setSelectedView('new-chat')}
                    onDocumentClick={handleSelectDocument}
                    documents={mockDocuments}
                  />
                ) : selectedView === 'recent-chats' ? (
                  // Recent Chats List
                  filteredChats.length > 0 ? (
                    <div className="space-y-3">
                      {filteredChats.map((chat) => {
                        const ToolIcon = getToolIcon(chat.toolName);
                        const toolColor = getToolColor(chat.toolName);

                        return (
                          <div
                            key={chat.id}
                            className="w-full p-5 bg-card border border-border hover:border-primary hover:bg-card/80 rounded-xl transition-all group cursor-pointer"
                            onClick={() => handleOpenChat(chat)}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0`}>
                                <ToolIcon className={`w-6 h-6 ${toolColor}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                    {chat.title}
                                  </h3>
                                  <span className={`px-2 py-0.5 bg-accent rounded-full text-xs font-medium ${toolColor}`}>
                                    {chat.toolName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                  <MessageSquare className="w-4 h-4" />
                                  <p className="truncate">{chat.lastMessage}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{chat.timestamp}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenChat(chat);
                                  }}
                                  className="p-2 hover:bg-accent rounded-lg transition-all"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4 text-primary" />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setChatToDelete(chat.id);
                                  }}
                                  className="p-2 hover:bg-accent rounded-lg transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-2">No chats yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start a new conversation for this case
                      </p>
                      <Button
                        onClick={handleNewChat}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        New Chat
                      </Button>
                    </div>
                  )
                ) : (
                  // Documents List (when folder is selected) - Google Drive Style
                  <CaseFolderView
                    folder={selectedFolder}
                    documents={filteredDocuments}
                    onDocumentClick={handleSelectDocument}
                    onUploadClick={() => {}}
                    onBackToFiles={() => setSelectedFolder('')}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        {onNavigate && <JubeeFooter onNavigate={onNavigate} />}
      </div>

      {/* Auto Caveat Setup Dialog */}
      <AutoCaveatSetupDialog
        isOpen={isAutoCaveatDialogOpen}
        onClose={() => setIsAutoCaveatDialogOpen(false)}
        onSubmit={(court, clientName) => {
          setAutoCaveatConfig({ court, clientName });
          setIsAutoCaveatDialogOpen(false);
          setSelectedView('auto-caveat');
        }}
      />

      {/* Chat View Modal */}
      {chatToView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center`}>
                  {(() => {
                    const ToolIcon = getToolIcon(chatToView.toolName);
                    const toolColor = getToolColor(chatToView.toolName);
                    return <ToolIcon className={`w-5 h-5 ${toolColor}`} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{chatToView.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {chatToView.toolName} • {chatToView.timestamp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatToView(null)}
                className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Last Message */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Last Message</h3>
                  <div className="p-4 bg-secondary rounded-xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-foreground flex-1">{chatToView.lastMessage}</p>
                    </div>
                  </div>
                </div>

                {/* Document Info (if applicable) */}
                {chatToView.documentName && (
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Associated Document</h3>
                    <div className="p-4 bg-secondary rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{chatToView.documentName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {chatToView.folder ? folders.find(f => f.id === chatToView.folder)?.name : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Details */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-xl border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Tool Used</p>
                      <p className="text-sm font-semibold text-foreground">{chatToView.toolName}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-xl border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                      <p className="text-sm font-semibold text-foreground">{chatToView.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setChatToView(null)}
              >
                Close
              </Button>
              {chatToView.documentName && (
                <Button
                  onClick={() => {
                    const doc = mockDocuments.find(d => d.name === chatToView.documentName);
                    if (doc) {
                      handleSelectDocument(doc);
                      setChatToView(null);
                    }
                  }}
                >
                  <Eye className="w-4 h-4" />
                  Open Document
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-card relative rounded-[20px] w-full max-w-md pointer-events-auto">
            <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_32px_-4px_rgba(239,68,68,0.12),0px_3px_12px_-2px_rgba(239,68,68,0.06)]" />

            <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
              {/* Top Content */}
              <div className="relative shrink-0 w-full">
                <div className="content-stretch flex flex-col items-start pt-[32px] px-[24px] relative w-full">
                  {/* Header with icon and text */}
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                    <div className="bg-red-500/10 content-stretch flex items-center justify-center p-[11.667px] relative rounded-[8px] shrink-0 size-[40px]">
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.429px_1.429px_0px_rgba(255,255,255,0.35)]" />
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px not-italic relative">
                      <p className="font-semibold leading-[1.15] relative shrink-0 text-foreground text-[20px] w-full">Delete Chat Session</p>
                      <p className="font-normal leading-[1.5] relative shrink-0 text-muted-foreground text-[14px] w-full">This action cannot be undone</p>
                    </div>
                  </div>
                  <div className="h-[20px] shrink-0 w-full" />
                  <div className="h-px relative shrink-0 w-full bg-border" />

                  {/* Close Button */}
                  <div className="absolute content-stretch flex items-center p-[12px] right-0 top-[-0.5px]">
                    <button
                      onClick={() => setChatToDelete(null)}
                      className="content-stretch flex items-center justify-center overflow-clip p-[6.588px] relative rounded-[7.529px] shrink-0 size-[32px] hover:bg-accent transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative shrink-0 w-full">
                <div className="content-stretch flex flex-col items-start pt-[24px] px-[24px] relative w-full">
                  {/* Chat Info */}
                  <div className="mb-4 p-4 bg-muted/50 border border-border rounded-xl w-full">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const chat = chatSessions.find(c => c.id === chatToDelete);
                        if (!chat) return null;
                        const ToolIcon = getToolIcon(chat.toolName);
                        const toolColor = getToolColor(chat.toolName);
                        return (
                          <>
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0`}>
                              <ToolIcon className={`w-5 h-5 ${toolColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground truncate">{chat.title}</p>
                              <p className="text-xs text-muted-foreground">{chat.toolName}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Warning Message */}
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg w-full">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Once deleted, this chat session and all its history cannot be recovered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full">
                <div className="relative shrink-0 w-full">
                  <div className="flex flex-row justify-center size-full">
                    <div className="content-stretch flex items-center justify-center pb-[24px] px-[24px] relative w-full">
                      <button
                        onClick={() => {
                          setChatSessions(chatSessions.filter(c => c.id !== chatToDelete));
                          setChatToDelete(null);
                        }}
                        className="bg-gradient-to-b from-red-500 to-red-600 content-stretch flex gap-[6px] h-[40px] items-center justify-center min-h-[32px] px-[14px] py-[12px] relative rounded-[12px] w-full"
                      >
                        <div aria-hidden="true" className="absolute border-red-600/20 border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px] shadow-[0px_2px_3px_0px_rgba(239,68,68,0.21)]" />
                        <Trash2 className="w-4 h-4 text-white" />
                        <div className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white">
                          <p className="leading-[1.15]">Delete</p>
                        </div>
                        <div className="absolute inset-[-0.5px] pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_2px_0px_rgba(0,0,0,0.1),inset_0px_1px_1px_0px_rgba(255,255,255,0.25)]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderUpload}
        // @ts-ignore
        webkitdirectory=""
        directory=""
        multiple
        style={{ display: 'none' }}
      />
    </div>
  );
}