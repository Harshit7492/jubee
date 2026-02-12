import { useState, useRef } from 'react';
import {
  NotebookPen,
  Mic,
  MicOff,
  Sparkles,
  Save,
  Share2,
  X,
  Check,
  CheckSquare,
  Square,
  Download,
  FolderOpen,
  Mail,
  Copy,
  ChevronDown,
  Filter,
  ArrowUpDown,
  User,
  FileText,
  Lightbulb,
  Target,
  Clock,
  Calendar,
  Folder,
  Search,
  ArrowLeft,
  MessageCircle,
  Send,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import jubeeLogo from '@/assets/jubee-logo.png';

interface Note {
  id: string;
  title: string;
  rawContent: string;
  polishedContent?: {
    summary: string;
    legalArguments: string[];
    actionItems: Array<{ id: string; text: string; completed: boolean; dueDate?: string }>;
    nextSteps: string[];
  };
  clientName?: string;
  caseId?: string;
  createdAt: Date;
  updatedAt: Date;
  isRecording?: boolean;
  duration?: number; // duration in seconds
}

export function NoteTakingView() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Client Meeting - Rajesh Kumar Case',
      rawContent: `Met with Rajesh Kumar today. Case is about property dispute with neighbor.

Key points discussed:
- Property was purchased in 2018
- Boundary wall dispute started in January 2024
- Neighbor constructed encroachment of approx 15 feet
- Have survey documents and sale deed
- Need to file civil suit for removal of encroachment

Client wants quick resolution. Mentioned previous attempt at mediation failed.`,
      clientName: 'Rajesh Kumar',
      caseId: 'CIV/2024/1245',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 315, // 5 minutes 15 seconds
    },
    {
      id: '2',
      title: 'Court Hearing - Priya Sharma',
      rawContent: `Supreme Court hearing today for Priya Sharma's appeal.

Arguments presented:
- Section 138 NI Act violation clear from evidence
- Cheque dishonor notice properly served
- No valid defense presented by accused
- Previous HC judgment needs reconsideration on limitation point

Judge asked about Rangappa v. Sri Mohan precedent application. Need to submit written note on this within 7 days.`,
      polishedContent: {
        summary: 'Supreme Court hearing for Section 138 NI Act appeal. Court receptive to arguments but seeks clarification on Rangappa precedent application within 7 days.',
        legalArguments: [
          'Section 138 NI Act violation established through proper notice and dishonored cheque evidence',
          'Accused failed to present valid defense under Section 139 presumption',
          'High Court incorrectly applied limitation period in original judgment',
          'Rangappa v. Sri Mohan (2010) 11 SCC 441 supports burden of proof argument'
        ],
        actionItems: [
          { id: 'a1', text: 'Draft written note on Rangappa precedent application', completed: false, dueDate: '2024-02-13' },
          { id: 'a2', text: 'Research additional Supreme Court cases on limitation period for NI Act', completed: false },
          { id: 'a3', text: 'Prepare compilation of evidence documents for next hearing', completed: false }
        ],
        nextSteps: [
          'Submit written note to Supreme Court within 7 days',
          'Brief client on court\'s receptive stance and next hearing date',
          'Coordinate with junior advocate for case law research support'
        ]
      },
      clientName: 'Priya Sharma',
      caseId: 'CRIM/2023/8845',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      duration: 1847, // 30 minutes 47 seconds
    },
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'note'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showPolished, setShowPolished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByClient, setFilterByClient] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date-desc' | 'title-asc' | 'client-asc'>('date-desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatInput, setAIChatInput] = useState('');
  const [aiChatMessages, setAIChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [listeningIntervalId, setListeningIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [transcriptIndex, setTranscriptIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [saveRecordingDialog, setSaveRecordingDialog] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const aiChatInputRef = useRef<HTMLInputElement>(null);

  const uniqueClients = Array.from(new Set(notes.map(n => n.clientName).filter(Boolean))) as string[];

  let filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.rawContent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = !filterByClient || note.clientName === filterByClient;
    return matchesSearch && matchesClient;
  });

  filteredNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'date-desc':
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      case 'client-asc':
        return (a.clientName || '').localeCompare(b.clientName || '');
      default:
        return 0;
    }
  });

  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      rawContent: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditContent('');
    setEditTitle('Untitled Note');
    setShowPolished(false);
    setViewMode('note');
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setEditContent(note.rawContent);
    setEditTitle(note.title);
    setShowPolished(!!note.polishedContent);
    setViewMode('note');
  };

  const handleBackToList = () => {
    setSelectedNote(null);
    setIsEditing(false);
    setShowPolished(false);
    setViewMode('list');
  };

  const handleToggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Started listening...');

      // Demo transcript phrases for realistic legal meeting simulation
      const demoTranscript = [
        'Client mentioned the incident occurred on',
        ' January 15th, 2024 around 3:30 PM.',
        ' The plaintiff was driving a Honda Civic',
        ' when the defendant ran a red light at the intersection.',
        ' There were two witnesses present',
        ' who can corroborate the client\'s version of events.',
        ' Client sustained minor injuries',
        ' including whiplash and bruising on left shoulder.',
        ' Medical records from Apollo Hospital',
        ' show treatment costs of approximately ₹45,000.',
        ' The defendant\'s insurance company',
        ' has offered ₹1,50,000 as settlement',
        ' but client believes this is inadequate.',
        ' We need to file a claim for ₹5,00,000',
        ' covering medical expenses, vehicle damage,',
        ' and compensation for pain and suffering.',
      ];

      const intervalId = setInterval(() => {
        setTranscriptIndex(currentIdx => {
          if (currentIdx < demoTranscript.length) {
            setEditContent(prev => prev + demoTranscript[currentIdx]);
            return currentIdx + 1;
          } else {
            if (listeningIntervalId) {
              clearInterval(listeningIntervalId);
              setListeningIntervalId(null);
            }
            return currentIdx;
          }
        });
        setRecordingDuration(prev => prev + 1);
      }, 800);

      setListeningIntervalId(intervalId);
    } else {
      toast.info('Paused listening');
      if (listeningIntervalId) {
        clearInterval(listeningIntervalId);
        setListeningIntervalId(null);
      }
    }
  };

  const handlePolishAndSummarize = () => {
    if (!selectedNote) return;

    toast.info('Processing with AI...');

    setTimeout(() => {
      const polishedContent = {
        summary: `Meeting summary for ${selectedNote.clientName || 'client'}. Key legal matter discussed with comprehensive strategy outlined.`,
        legalArguments: [
          'Primary legal argument based on applicable statute and precedent',
          'Secondary supporting argument from case law analysis',
          'Procedural compliance and jurisdictional considerations addressed',
        ],
        actionItems: [
          { id: `a${Date.now()}1`, text: 'Draft preliminary legal notice', completed: false, dueDate: '2024-02-10' },
          { id: `a${Date.now()}2`, text: 'Collect supporting documents from client', completed: false },
          { id: `a${Date.now()}3`, text: 'Research relevant Supreme Court judgments', completed: false },
        ],
        nextSteps: [
          'Schedule follow-up meeting with client next week',
          'Initiate case research and draft initial pleading',
          'Consult with senior counsel on strategy approach',
        ],
      };

      const updatedNote = {
        ...selectedNote,
        rawContent: editContent,
        title: editTitle,
        polishedContent,
        updatedAt: new Date(),
      };

      setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
      setSelectedNote(updatedNote);
      setShowPolished(true);
      setShowAIChat(true);
      toast.success('Notes polished successfully!');
    }, 1500);
  };

  const handleToggleActionItem = (itemId: string) => {
    if (!selectedNote?.polishedContent) return;

    const updatedActionItems = selectedNote.polishedContent.actionItems.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updatedNote = {
      ...selectedNote,
      polishedContent: {
        ...selectedNote.polishedContent,
        actionItems: updatedActionItems,
      },
    };

    setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
    setSelectedNote(updatedNote);
  };

  const handleSaveNote = () => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      rawContent: editContent,
      title: editTitle,
      updatedAt: new Date(),
    };

    setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
    setSelectedNote(updatedNote);
    setIsEditing(false);
    toast.success('Note saved successfully!');
  };

  const handleSaveToCase = () => {
    toast.success('Note linked to My Space successfully!');
    setSaveDialog(false);
  };

  const handleShareViaEmail = () => {
    if (shareEmail && shareEmail.includes('@')) {
      toast.success(`Note shared with ${shareEmail}!`);
      setShareDialog(false);
      setShareEmail('');
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  const handleSendAIMessage = () => {
    if (!aiChatInput.trim()) return;

    const userMessage = aiChatInput.trim();
    setAIChatMessages([...aiChatMessages, { role: 'user', content: userMessage }]);
    setAIChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `I can help you with note-taking tasks! For example:\n• Organize and structure your notes\n• Suggest legal precedents\n• Create action items\n• Summarize meeting minutes\n\nWhat would you like assistance with regarding "${userMessage}"?`;
      setAIChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    }, 1000);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      toast.success('Playing recording...');
    } else {
      toast.info('Paused playback');
    }
  };

  const handlePauseRecording = () => {
    setIsPaused(true);
    if (listeningIntervalId) {
      clearInterval(listeningIntervalId);
      setListeningIntervalId(null);
    }
    toast.info('Recording paused');
  };

  const handleResumeRecording = () => {
    setIsPaused(false);
    toast.success('Recording resumed');

    const demoTranscript = [
      ' Additional points discussed',
      ' regarding the settlement terms.',
      ' Client wants to proceed with litigation',
      ' if settlement negotiations fail.',
    ];

    const intervalId = setInterval(() => {
      setTranscriptIndex(currentIdx => {
        if (currentIdx < demoTranscript.length) {
          setEditContent(prev => prev + demoTranscript[currentIdx]);
          return currentIdx + 1;
        } else {
          if (listeningIntervalId) {
            clearInterval(listeningIntervalId);
            setListeningIntervalId(null);
          }
          return currentIdx;
        }
      });
      setRecordingDuration(prev => prev + 1);
    }, 800);

    setListeningIntervalId(intervalId);
  };

  const handleStopRecording = () => {
    if (listeningIntervalId) {
      clearInterval(listeningIntervalId);
      setListeningIntervalId(null);
    }
    setIsListening(false);
    setIsPaused(false);
    setRecordingTitle('Recording ' + new Date().toLocaleString());
    setSaveRecordingDialog(true);
  };

  const handleSaveRecording = () => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      rawContent: editContent,
      title: recordingTitle || editTitle,
      updatedAt: new Date(),
      duration: recordingDuration,
    };

    setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
    setSelectedNote(updatedNote);
    setIsEditing(false);
    setSaveRecordingDialog(false);
    setRecordingTitle('');
    toast.success('Recording saved successfully!');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {selectedNote && (
              <>
                <Button
                  onClick={handleBackToList}
                  variant="ghost"
                  className="hover:bg-accent"
                  size="sm"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
                <div className="h-6 w-px bg-border" />
              </>
            )}
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <NotebookPen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-foreground">Verbatim</h3>
            </div>
          </div>
          <Button
            onClick={handleCreateNewNote}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <NotebookPen className="w-4 h-4 mr-1" />
            New Note
          </Button>
        </div>
      </div>

      {/* Toolbar - Search, Sort, Filter - Only show on main list view */}
      {!selectedNote && (
        <div className="bg-background border-b-[0.5px] border-border px-8 py-3 backdrop-blur-md relative z-30">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full h-10 pl-9 pr-4 text-sm bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Notes List - Left Sidebar - Only show when no note is selected */}
        {!selectedNote && (
          <div className="flex-1 bg-card border-r border-border flex flex-col overflow-hidden transition-all">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-muted-foreground">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <NotebookPen className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || filterByClient ? 'No notes match your filters' : 'No notes yet. Create your first note to get started!'}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {filteredNotes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className="w-full text-left p-4 rounded-xl transition-all bg-card/50 border-2 border-border/50 hover:border-primary/30 hover:bg-accent"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground line-clamp-1">{note.title}</h4>
                        {note.polishedContent && (
                          <Sparkles className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 ml-2" />
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {note.rawContent}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {note.clientName && (
                            <Badge className="bg-primary/10 text-primary text-xs border-0">
                              {note.clientName}
                            </Badge>
                          )}
                          {note.caseId && (
                            <Badge className="bg-muted text-muted-foreground text-xs border-0">
                              {note.caseId}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Editor/Viewer Area */}
        {selectedNote && (
          <div className="flex-1 flex overflow-hidden">
            {/* Raw Notes / Editor */}
            <div className="w-full flex flex-col bg-background overflow-hidden transition-all">
              {/* Editor Header */}
              <div className="px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={isEditing ? editTitle : selectedNote.title}
                    onChange={(e) => setEditTitle(e.target.value)}
                    disabled={!isEditing}
                    className="text-xl font-bold text-foreground bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 -mx-2 w-full disabled:cursor-default"
                    placeholder="Note title..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedNote.clientName && (
                      <Badge className="bg-primary/10 text-primary border-0 whitespace-nowrap">
                        <User className="w-3 h-3 mr-1" />
                        {selectedNote.clientName}
                      </Badge>
                    )}
                    {selectedNote.caseId && (
                      <Badge className="bg-muted text-muted-foreground border-0 whitespace-nowrap">
                        <FileText className="w-3 h-3 mr-1" />
                        {selectedNote.caseId}
                      </Badge>
                    )}
                    <Badge className="bg-muted text-muted-foreground border-0 whitespace-nowrap">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(selectedNote.updatedAt)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!isEditing ? (
                      <>
                        <Button
                          onClick={() => {
                            setIsEditing(true);
                            setEditContent(selectedNote.rawContent);
                            setEditTitle(selectedNote.title);
                          }}
                          variant="ghost"
                          className="border-border hover:bg-accent font-semibold text-sm h-9 whitespace-nowrap"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => setSaveDialog(true)}
                          variant="ghost"
                          className="border-border hover:bg-accent font-semibold text-sm h-9 whitespace-nowrap"
                        >
                          <FolderOpen className="w-4 h-4 mr-1" />
                          Save to Case
                        </Button>
                        <Button
                          onClick={() => setShareDialog(true)}
                          variant="ghost"
                          className="border-border hover:bg-accent font-semibold text-sm h-9 whitespace-nowrap"
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setIsEditing(false);
                            setEditContent(selectedNote.rawContent);
                            setEditTitle(selectedNote.title);
                          }}
                          variant="ghost"
                          className="border-border hover:bg-accent font-semibold text-sm h-9 whitespace-nowrap"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveNote}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm h-9 whitespace-nowrap"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isEditing ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    {!isListening ? (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                          <Mic className="w-16 h-16 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Ready to Record</h3>
                        <p className="text-muted-foreground max-w-md mb-8">
                          Press the record button below to start recording your voice notes, hearing proceedings, or meeting discussions.
                        </p>
                        <button
                          onClick={handleToggleListen}
                          className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
                        >
                          <Mic className="w-5 h-5" />
                          Start Recording
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col">
                        <div className="flex items-center justify-center mb-6 gap-3">
                          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-primary">Recording...</span>
                          </div>
                        </div>
                        <div className="flex-1 p-4 bg-card border-[0.5px] border-border rounded-xl overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
                            {editContent || 'Listening...'}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Audio Player */}
                    {selectedNote.duration && (
                      <div className="bg-card border-[0.5px] border-border rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Volume2 className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground mb-1">Audio Recording</h4>
                            <p className="text-xs text-muted-foreground">
                              Duration: {formatDuration(selectedNote.duration)}
                            </p>
                          </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="space-y-4">
                          {/* Timeline Scrubber */}
                          <div className="space-y-2">
                            <div className="relative h-2 bg-muted rounded-full overflow-hidden cursor-pointer group">
                              <div
                                className="absolute inset-y-0 left-0 bg-primary transition-all"
                                style={{ width: `${selectedNote.duration ? (currentTime / selectedNote.duration) * 100 : 0}%` }}
                              />
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ left: `calc(${selectedNote.duration ? (currentTime / selectedNote.duration) * 100 : 0}% - 8px)` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{formatDuration(currentTime)}</span>
                              <span>{formatDuration(selectedNote.duration)}</span>
                            </div>
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => {
                                setCurrentTime(Math.max(0, currentTime - 10));
                                toast.info('Rewind 10 seconds');
                              }}
                              className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
                            >
                              <SkipBack className="w-5 h-5 text-foreground" />
                            </button>

                            <button
                              onClick={handleTogglePlayback}
                              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all shadow-lg shadow-primary/30"
                            >
                              {isPlaying ? (
                                <Pause className="w-6 h-6 text-primary-foreground" />
                              ) : (
                                <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                              )}
                            </button>

                            <button
                              onClick={() => {
                                if (selectedNote.duration) {
                                  setCurrentTime(Math.min(selectedNote.duration, currentTime + 10));
                                }
                                toast.info('Forward 10 seconds');
                              }}
                              className="w-10 h-10 rounded-full bg-muted hover:bg-accent flex items-center justify-center transition-colors"
                            >
                              <SkipForward className="w-5 h-5 text-foreground" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Transcript */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-semibold text-foreground">Transcript</h4>
                      </div>
                      <div className="p-4 bg-card border-[0.5px] border-border rounded-xl">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
                          {selectedNote.rawContent}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="px-6 py-4 border-t border-border bg-card/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  {isEditing && !isListening && (
                    <div className="flex-1" />
                  )}

                  {isEditing && isListening && (
                    <div className="flex items-center gap-3 flex-1">
                      {isPaused ? (
                        <button
                          onClick={handleResumeRecording}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
                        >
                          <Mic className="w-4 h-4" />
                          Resume
                        </button>
                      ) : (
                        <button
                          onClick={handlePauseRecording}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg shadow-yellow-500/30"
                        >
                          <Pause className="w-4 h-4" />
                          Pause
                        </button>
                      )}

                      <button
                        onClick={handleStopRecording}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
                      >
                        <MicOff className="w-4 h-4" />
                        Stop
                      </button>

                      <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl ml-auto">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-mono text-foreground">
                          {formatDuration(recordingDuration)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


          </div>
        )}
      </div>

      {/* Save to Case Dialog */}
      {saveDialog && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setSaveDialog(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-card relative rounded-2xl w-full max-w-md pointer-events-auto border-[0.5px] border-border shadow-2xl">
              <div className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground mb-1">Save to My Space</h3>
                    <p className="text-sm text-muted-foreground">Link this note to a case folder</p>
                  </div>
                  <button
                    onClick={() => setSaveDialog(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Select Folder</label>
                    <select className="w-full h-12 px-4 bg-input-background border-[0.5px] border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Legal Documents</option>
                      <option>Case Briefs</option>
                      <option>Evidence_Photos</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setSaveDialog(false)}
                    variant="ghost"
                    className="flex-1 border-border hover:bg-accent font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveToCase}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Share Dialog */}
      {shareDialog && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShareDialog(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-card relative rounded-2xl w-full max-w-md pointer-events-auto border-[0.5px] border-border shadow-2xl">
              <div className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground mb-1">Share Note</h3>
                    <p className="text-sm text-muted-foreground">Send this note via email</p>
                  </div>
                  <button
                    onClick={() => setShareDialog(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleShareViaEmail()}
                      placeholder="colleague@lawfirm.com"
                      className="w-full h-12 px-4 bg-input-background border-[0.5px] border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShareDialog(false)}
                    variant="ghost"
                    className="flex-1 border-border hover:bg-accent font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleShareViaEmail}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    disabled={!shareEmail}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Save Recording Dialog */}
      {saveRecordingDialog && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setSaveRecordingDialog(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-card relative rounded-2xl w-full max-w-md pointer-events-auto border-[0.5px] border-border shadow-2xl">
              <div className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Save className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground mb-1">Save Recording</h3>
                    <p className="text-sm text-muted-foreground">Give your recording a title</p>
                  </div>
                  <button
                    onClick={() => setSaveRecordingDialog(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Recording Title</label>
                    <input
                      type="text"
                      value={recordingTitle}
                      onChange={(e) => setRecordingTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveRecording()}
                      placeholder="e.g., Client Meeting - Case Discussion"
                      className="w-full h-12 px-4 bg-input-background border-[0.5px] border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-xl">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Duration: {formatDuration(recordingDuration)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setSaveRecordingDialog(false)}
                    variant="ghost"
                    className="flex-1 border-border hover:bg-accent font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveRecording}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Floating AI Chatbot */}
      {showAIChat ? (
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
              Your note-taking assistant for legal research and case management
            </p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 min-h-0 px-6 py-4 overflow-y-auto">
            {selectedNote?.polishedContent ? (
              <div className="space-y-4">
                {/* AI Structured Brief Header */}
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
                  <h3 className="text-base font-bold text-foreground">AI Structured Brief</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  Automatically generated from your raw notes
                </p>

                {/* Summary */}
                <div className="bg-card/60 backdrop-blur-sm border-[0.5px] border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#1E3A8A]" />
                    </div>
                    <h4 className="font-bold text-foreground">Summary</h4>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedNote.polishedContent.summary}
                  </p>
                </div>

                {/* Key Legal Arguments */}
                <div className="bg-card/60 backdrop-blur-sm border-[0.5px] border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-[#1E3A8A]" />
                    </div>
                    <h4 className="font-bold text-foreground">Key Legal Arguments</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedNote.polishedContent.legalArguments.map((arg, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                          {idx + 1}
                        </span>
                        <span className="text-foreground leading-relaxed">{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items */}
                <div className="bg-card/60 backdrop-blur-sm border-[0.5px] border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-[#1E3A8A]" />
                    </div>
                    <h4 className="font-bold text-foreground">Action Items</h4>
                  </div>
                  <div className="space-y-2">
                    {selectedNote.polishedContent.actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
                      >
                        <button
                          onClick={() => handleToggleActionItem(item.id)}
                          className="flex-shrink-0 mt-0.5"
                        >
                          {item.completed ? (
                            <CheckSquare className="w-5 h-5 text-primary" />
                          ) : (
                            <Square className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {item.text}
                          </p>
                          {item.dueDate && (
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Due: {new Date(item.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-card/60 backdrop-blur-sm border-[0.5px] border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#1E3A8A]/10 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-[#1E3A8A]" />
                    </div>
                    <h4 className="font-bold text-foreground">Next Steps</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedNote.polishedContent.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="text-primary font-bold flex-shrink-0">→</span>
                        <span className="text-foreground leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : selectedNote?.rawContent && !selectedNote?.polishedContent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6">
                <div className="w-20 h-20 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center mb-6 overflow-hidden">
                  <img src={jubeeLogo} alt="Jubee" className="w-12 h-12 object-contain" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-3">Ready to Polish Your Notes?</h4>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-[320px]">
                  Transform your raw transcript into a structured AI brief with summary, legal arguments, action items, and next steps.
                </p>
                <Button
                  onClick={handlePolishAndSummarize}
                  className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:from-[#1E40AF] hover:to-[#2563EB] text-white font-semibold shadow-lg shadow-primary/30 h-12 px-6"
                  disabled={!selectedNote.rawContent.trim()}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Polish & Summarize
                </Button>
              </div>
            ) : aiChatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center mb-4 overflow-hidden">
                  <img src={jubeeLogo} alt="Jubee" className="w-10 h-10 object-contain" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Start a conversation</h4>
                <p className="text-xs text-muted-foreground max-w-[280px]">
                  Ask me anything about note-taking, legal research, or case management
                </p>
                <div className="mt-6 space-y-2 w-full max-w-[280px]">
                  <button
                    onClick={() => setAIChatInput("Help me organize these notes better")}
                    className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                  >
                    Help organize my notes
                  </button>
                  <button
                    onClick={() => setAIChatInput("Suggest relevant legal precedents")}
                    className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                  >
                    Suggest legal precedents
                  </button>
                  <button
                    onClick={() => setAIChatInput("Create action items from these notes")}
                    className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                  >
                    Create action items
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {aiChatMessages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${message.role === 'assistant' ? 'items-start' : 'items-end flex-row-reverse'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img src={jubeeLogo} alt="Jubee" className="w-5 h-5 object-contain" />
                      </div>
                    )}
                    <div
                      className={`max-w-[280px] rounded-2xl px-4 py-3 ${message.role === 'assistant' ? 'bg-muted border-[0.5px] border-border' : 'bg-[#1E3A8A] text-white'}`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Input - Hide when showing polished content */}
          {!selectedNote?.polishedContent && (
            <div className="px-6 py-4 border-t-[0.5px] border-border bg-background flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={aiChatInputRef}
                  type="text"
                  value={aiChatInput}
                  onChange={(e) => setAIChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendAIMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 h-10 px-4 bg-muted border-[0.5px] border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                />
                <button
                  onClick={handleSendAIMessage}
                  disabled={!aiChatInput.trim()}
                  className="w-10 h-10 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Floating Chat Toggle Button - Only show when viewing a note */}
      {selectedNote && (
        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group ${showAIChat ? 'scale-0' : 'scale-100'}`}
        >
          <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
        </button>
      )}
    </div>
  );
}