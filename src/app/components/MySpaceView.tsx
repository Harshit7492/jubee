import { useState, useRef } from 'react';
import { 
  FolderPlus, 
  Upload, 
  File, 
  Folder, 
  MoreVertical, 
  Trash2, 
  Download, 
  Edit2, 
  Share2, 
  Clock, 
  Grid3x3, 
  List, 
  Search,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  FileArchive,
  Music,
  Video,
  X,
  Check,
  FolderOpen,
  Home,
  ChevronRight,
  Link as LinkIcon,
  Mail,
  Copy,
  Eye,
  ChevronDown,
  Filter,
  ArrowUpDown,
  User,
  FileType,
  CalendarClock
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import { WorkspaceQuote, WORKSPACE_QUOTES } from '@/app/components/WorkspaceQuote';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  sizeBytes?: number; // For sorting by size
  modified: string;
  modifiedDate?: Date; // For sorting by date
  starred?: boolean;
  parentId: string | null;
  fileType?: string; // pdf, doc, image, etc.
  clientName?: string; // For filtering by client
}

export function MySpaceView() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; itemId: string } | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: 'My Space' }
  ]);
  const [shareDialog, setShareDialog] = useState<{ isOpen: boolean; itemId: string | null }>({ isOpen: false, itemId: null });
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState<'view' | 'edit'>('view');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; itemId: string | null }>({ isOpen: false, itemId: null });
  const [renameDialog, setRenameDialog] = useState<{ isOpen: boolean; itemId: string | null }>({ isOpen: false, itemId: null });
  const [renameValue, setRenameValue] = useState('');

  // Sorting and Filtering State
  const [sortBy, setSortBy] = useState<'name-asc' | 'date-desc' | 'size-desc'>('date-desc');
  const [filterByClient, setFilterByClient] = useState<string | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Sample files and folders
  const [items, setItems] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Legal Documents',
      type: 'folder',
      modified: '2 hours ago',
      modifiedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      starred: true,
      parentId: null,
      clientName: 'Rajesh Kumar'
    },
    {
      id: '2',
      name: 'Case Briefs',
      type: 'folder',
      modified: '1 day ago',
      modifiedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      parentId: null,
      clientName: 'Priya Sharma'
    },
    {
      id: '3',
      name: 'Petition_Draft_Final.pdf',
      type: 'file',
      size: '2.4 MB',
      sizeBytes: 2400000,
      modified: '3 hours ago',
      modifiedDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
      starred: true,
      parentId: null,
      fileType: 'pdf',
      clientName: 'Anjali Mehta'
    },
    {
      id: '4',
      name: 'Client_Agreement.docx',
      type: 'file',
      size: '156 KB',
      sizeBytes: 156000,
      modified: '5 days ago',
      modifiedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      parentId: null,
      fileType: 'doc',
      clientName: 'Rajesh Kumar'
    },
    {
      id: '5',
      name: 'Evidence_Photos',
      type: 'folder',
      modified: '1 week ago',
      modifiedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      parentId: null,
      clientName: 'Priya Sharma'
    },
    {
      id: '6',
      name: 'Supreme_Court_Judgment.pdf',
      type: 'file',
      size: '1.8 MB',
      sizeBytes: 1800000,
      modified: '2 weeks ago',
      modifiedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      parentId: '1',
      fileType: 'pdf',
      clientName: 'Anjali Mehta'
    },
    {
      id: '7',
      name: 'Contract_Template.docx',
      type: 'file',
      size: '89 KB',
      sizeBytes: 89000,
      modified: '3 days ago',
      modifiedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      parentId: '1',
      fileType: 'doc',
      clientName: 'Rajesh Kumar'
    }
  ]);

  // Get unique client names for filter dropdown
  const uniqueClients = Array.from(new Set(items.map(item => item.clientName).filter(Boolean))) as string[];

  // Filter items based on current folder
  const currentItems = items.filter(item => item.parentId === currentFolderId);
  
  // Apply search and client filter
  let filteredAndSortedItems = currentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = !filterByClient || item.clientName === filterByClient;
    return matchesSearch && matchesClient;
  });

  // Apply sorting
  filteredAndSortedItems = [...filteredAndSortedItems].sort((a, b) => {
    // Folders always come first
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'date-desc':
        return (b.modifiedDate?.getTime() || 0) - (a.modifiedDate?.getTime() || 0);
      case 'size-desc':
        return (b.sizeBytes || 0) - (a.sizeBytes || 0);
      default:
        return 0;
    }
  });

  const filteredItems = filteredAndSortedItems;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newFile: FileItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: 'file',
          size: formatFileSize(file.size),
          sizeBytes: file.size,
          modified: 'Just now',
          modifiedDate: new Date(),
          parentId: currentFolderId,
          fileType: getFileType(file.name)
        };
        setItems(prev => [...prev, newFile]);
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Note: Folder upload would need proper handling based on file paths
    const files = e.target.files;
    if (files && files.length > 0) {
      // Create a folder first
      const folderName = files[0].webkitRelativePath.split('/')[0];
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: folderName,
        type: 'folder',
        modified: 'Just now',
        modifiedDate: new Date(),
        parentId: currentFolderId
      };
      setItems(prev => [...prev, newFolder]);
    }
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: newFolderName,
        type: 'folder',
        modified: 'Just now',
        modifiedDate: new Date(),
        parentId: currentFolderId
      };
      setItems(prev => [...prev, newFolder]);
      setNewFolderName('');
      setNewFolderDialog(false);
    }
  };

  const handleOpenFolder = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setBreadcrumbs(prev => [...prev, { id: folderId, name: folderName }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolderId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setContextMenu(null);
  };

  const handleStarItem = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, starred: !item.starred } : item
    ));
    setContextMenu(null);
  };

  const handleRenameItem = (itemId: string | null, newName: string) => {
    if (itemId && newName.trim()) {
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, name: newName.trim() } : item
      ));
      toast.success('Renamed successfully!');
      setRenameDialog({ isOpen: false, itemId: null });
      setRenameValue('');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image';
    if (['zip', 'rar', '7z'].includes(ext || '')) return 'archive';
    if (['mp3', 'wav', 'flac'].includes(ext || '')) return 'audio';
    if (['mp4', 'avi', 'mov'].includes(ext || '')) return 'video';
    return 'file';
  };

  const getFileIcon = (fileType: string = 'file') => {
    switch (fileType) {
      case 'pdf':
      case 'doc':
        return <FileText className="w-5 h-5 text-foreground" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-foreground" />;
      case 'archive':
        return <FileArchive className="w-5 h-5 text-foreground" />;
      case 'audio':
        return <Music className="w-5 h-5 text-foreground" />;
      case 'video':
        return <Video className="w-5 h-5 text-foreground" />;
      default:
        return <File className="w-5 h-5 text-foreground" />;
    }
  };

  const getFileColor = (fileType: string = 'file') => {
    switch (fileType) {
      case 'pdf':
        return 'text-red-500';
      case 'doc':
        return 'text-blue-500';
      case 'image':
        return 'text-purple-500';
      case 'archive':
        return 'text-yellow-500';
      case 'audio':
        return 'text-pink-500';
      case 'video':
        return 'text-orange-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-foreground">My Space</h3>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setNewFolderDialog(true)}
              variant="outline"
              className="border-border hover:bg-accent font-semibold"
            >
              <FolderPlus className="w-4 h-4 mr-1" />
              New Folder
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-border hover:bg-accent font-semibold"
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload Files
            </Button>
            <Button
              onClick={() => folderInputRef.current?.click()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload Folder
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFolderUpload}
        className="hidden"
      />

      {/* Workspace Quote */}
      <div className="bg-background px-8 pt-6">
        <WorkspaceQuote quotes={WORKSPACE_QUOTES['myspace']} />
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
              placeholder="Search for folders and files"
              className="w-full h-12 pl-9 pr-4 text-sm bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Toolbar - Sort and Filter */}
      <div className="bg-background border-b-[0.5px] border-border px-8 py-3 backdrop-blur-md relative z-30">
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative z-50">
            <button
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowFilterMenu(false);
              }}
              className="flex items-center gap-2 h-10 px-4 bg-background border-[0.5px] border-border rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 transition-all text-sm font-medium text-foreground"
            >
              <ArrowUpDown className="w-4 h-4 text-[#1E3A8A]" />
              <span>Sort By</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            
            {showSortMenu && (
              <>
                <div 
                  className="fixed inset-0 z-[60]" 
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-48 bg-background dark:bg-slate-900 border-[0.5px] border-border rounded-xl shadow-2xl overflow-hidden z-[70] backdrop-blur-[16px]">
                  <div className="py-1">
                    <button
                      onClick={() => { setSortBy('name-asc'); setShowSortMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        sortBy === 'name-asc' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold' : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      {sortBy === 'name-asc' && <Check className="w-4 h-4" />}
                      {sortBy !== 'name-asc' && <div className="w-4" />}
                      Name (A-Z)
                    </button>
                    <button
                      onClick={() => { setSortBy('date-desc'); setShowSortMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        sortBy === 'date-desc' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold' : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      {sortBy === 'date-desc' && <Check className="w-4 h-4" />}
                      {sortBy !== 'date-desc' && <div className="w-4" />}
                      Date Modified
                    </button>
                    <button
                      onClick={() => { setSortBy('size-desc'); setShowSortMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        sortBy === 'size-desc' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold' : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      {sortBy === 'size-desc' && <Check className="w-4 h-4" />}
                      {sortBy !== 'size-desc' && <div className="w-4" />}
                      File Size
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative z-50">
            <button
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
                setShowSortMenu(false);
              }}
              className="flex items-center gap-2 h-10 px-4 bg-background border-[0.5px] border-border rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 transition-all text-sm font-medium text-foreground"
            >
              <Filter className="w-4 h-4 text-[#1E3A8A]" />
              <span>Filter By</span>
              {filterByClient && (
                <Badge className="bg-[#1E3A8A] text-white text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  1
                </Badge>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            
            {showFilterMenu && (
              <>
                <div 
                  className="fixed inset-0 z-[60]" 
                  onClick={() => setShowFilterMenu(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-64 bg-background dark:bg-slate-900 border-[0.5px] border-border rounded-xl shadow-2xl overflow-hidden z-[70] backdrop-blur-[16px] max-h-[300px] overflow-y-auto">
                  <div className="py-2">
                    {/* Client Filter Header */}
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-[#1E3A8A]" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client Name</p>
                      </div>
                      
                      {/* Client List */}
                      <div className="space-y-1">
                        {uniqueClients.map(client => (
                          <button
                            key={client}
                            onClick={() => {
                              setFilterByClient(filterByClient === client ? null : client);
                              setShowFilterMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              filterByClient === client ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-semibold' : 'text-foreground hover:bg-accent'
                            }`}
                          >
                            {filterByClient === client && <Check className="w-3.5 h-3.5 inline mr-2" />}
                            {client}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filterByClient && (
                      <>
                        <div className="h-px bg-border my-2" />
                        <div className="px-3 py-2">
                          <button
                            onClick={() => {
                              setFilterByClient(null);
                              setShowFilterMenu(false);
                            }}
                            className="w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium"
                          >
                            Clear Filter
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Back Button with Current Location */}
        {breadcrumbs.length > 1 && (
          <div className="mb-6 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBreadcrumbClick(breadcrumbs.length - 2)}
              className="hover:bg-accent h-10 px-4 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <h2 className="text-lg font-semibold text-foreground">
              {breadcrumbs[breadcrumbs.length - 1].name}
            </h2>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              {searchQuery ? (
                <Search className="w-10 h-10 text-muted-foreground" />
              ) : (
                <FolderOpen className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <h4 className="text-lg font-bold text-foreground mb-2">
              {searchQuery ? 'No results found' : 'This folder is empty'}
            </h4>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery
                ? `No files or folders match "${searchQuery}"`
                : 'Upload files or create folders to get started with your document organization'}
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredItems.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => item.type === 'folder' && handleOpenFolder(item.id, item.name)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({ x: e.clientX, y: e.clientY, itemId: item.id });
                  }}
                  className="group relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:border-primary/40 hover:bg-card hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-3.5 transition-transform group-hover:scale-105">
                      {item.type === 'folder' ? (
                        <Folder className="w-12 h-12 text-foreground" />
                      ) : (
                        <div className="scale-[2]">
                          {getFileIcon(item.fileType)}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h5 className="text-[13px] font-semibold text-foreground mb-2 line-clamp-2 w-full leading-snug">
                      {item.name}
                    </h5>

                    {/* Info */}
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
                      <Clock className="w-3 h-3" />
                      {item.modified}
                    </div>
                    {item.size && (
                      <div className="mt-2 px-2 py-0.5 rounded-md bg-muted/40 text-[10px] font-medium text-muted-foreground">
                        {item.size}
                      </div>
                    )}
                  </div>

                  {/* Hover actions */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextMenu({
                        x: e.currentTarget.getBoundingClientRect().right,
                        y: e.currentTarget.getBoundingClientRect().top,
                        itemId: item.id
                      });
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:border-primary/30"
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* List View */}
        {viewMode === 'list' && filteredItems.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-bold text-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-foreground uppercase tracking-wider">
                    Modified
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-foreground uppercase tracking-wider">
                    Size
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onDoubleClick={() => item.type === 'folder' && handleOpenFolder(item.id, item.name)}
                    className="hover:bg-accent transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.type === 'folder'
                            ? 'bg-primary/10 text-primary'
                            : `bg-muted ${getFileColor(item.fileType)}`
                        }`}>
                          {item.type === 'folder' ? (
                            <Folder className="w-5 h-5" />
                          ) : (
                            getFileIcon(item.fileType)
                          )}
                        </div>
                        <span className="font-semibold text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.modified}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.size || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu({
                            x: e.currentTarget.getBoundingClientRect().left - 150,
                            y: e.currentTarget.getBoundingClientRect().bottom,
                            itemId: item.id
                          });
                        }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 w-48 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            style={{
              top: contextMenu.y,
              left: contextMenu.x
            }}
          >
            <button
              onClick={() => {
                setShareDialog({ isOpen: true, itemId: contextMenu.itemId });
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => {
                setRenameDialog({ isOpen: true, itemId: contextMenu.itemId });
                setRenameValue(items.find(i => i.id === contextMenu.itemId)?.name || '');
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Rename
            </button>
            <div className="h-px bg-border my-1" />
            <button
              onClick={() => {
                setDeleteDialog({ isOpen: true, itemId: contextMenu.itemId });
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      )}

      {/* Share Dialog */}
      {shareDialog.isOpen && shareDialog.itemId && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShareDialog({ isOpen: false, itemId: null })}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-card relative rounded-[20px] w-full max-w-md pointer-events-auto">
              <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_32px_-4px_rgba(30,58,138,0.12),0px_3px_12px_-2px_rgba(30,58,138,0.06)]" />
              
              <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
                {/* Top Content */}
                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start pt-[32px] px-[24px] relative w-full">
                    {/* Header with icon and text */}
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                      <div className="bg-primary/10 content-stretch flex items-center justify-center p-[11.667px] relative rounded-[8px] shrink-0 size-[40px]">
                        <Share2 className="w-5 h-5 text-primary" />
                        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.429px_1.429px_0px_rgba(255,255,255,0.35)]" />
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px not-italic relative">
                        <p className="font-semibold leading-[1.15] relative shrink-0 text-foreground text-[20px] w-full">Share {items.find(i => i.id === shareDialog.itemId)?.type === 'folder' ? 'Folder' : 'File'}</p>
                        <p className="font-normal leading-[1.5] relative shrink-0 text-muted-foreground text-[14px] w-full">{items.find(i => i.id === shareDialog.itemId)?.name}</p>
                      </div>
                    </div>
                    <div className="h-[20px] shrink-0 w-full" />
                    <div className="h-px relative shrink-0 w-full bg-border" />
                    
                    {/* Close Button */}
                    <div className="absolute content-stretch flex items-center p-[12px] right-0 top-[-0.5px]">
                      <button
                        onClick={() => setShareDialog({ isOpen: false, itemId: null })}
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
                    {/* Copy Link Section */}
                    <div className="mb-4 p-4 bg-muted/50 border border-border rounded-xl w-full">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Shareable Link
                        </label>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://jubee.app/share/${shareDialog.itemId}`);
                            toast.success('Link copied to clipboard!');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy Link
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Anyone with this link can access this {items.find(i => i.id === shareDialog.itemId)?.type === 'folder' ? 'folder' : 'file'}</p>
                    </div>

                    {/* Divider */}
                    <div className="relative my-4 w-full">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white dark:bg-card px-2 text-muted-foreground font-semibold">OR SHARE VIA EMAIL</span>
                      </div>
                    </div>

                    {/* Email Share Section */}
                    <div className="space-y-4 w-full">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Recipient Email
                        </label>
                        <div className="bg-input-background h-[44px] min-h-[44px] relative rounded-[14px] w-full">
                          <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[14px] shadow-[0px_0.5px_1px_0px_rgba(0,0,0,0.04)]" />
                          <input
                            type="email"
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && shareEmail && shareEmail.includes('@')) {
                                toast.success(`Shared with ${shareEmail} successfully!`);
                                setShareDialog({ isOpen: false, itemId: null });
                                setShareEmail('');
                                setSharePermission('view');
                              }
                            }}
                            placeholder="colleague@lawfirm.com"
                            className="h-full w-full px-[16px] py-[8px] bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none rounded-[14px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Permission Level</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSharePermission('view')}
                            className={`p-3 rounded-[12px] border-2 transition-all ${
                              sharePermission === 'view'
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border hover:border-primary/50 text-muted-foreground'
                            }`}
                          >
                            <Eye className="w-4 h-4 mx-auto mb-1" />
                            <p className="text-xs font-semibold">Can View</p>
                          </button>
                          <button
                            onClick={() => setSharePermission('edit')}
                            className={`p-3 rounded-[12px] border-2 transition-all ${
                              sharePermission === 'edit'
                                ? 'border-primary bg-primary/10 text-foreground'
                                : 'border-border hover:border-primary/50 text-muted-foreground'
                            }`}
                          >
                            <Edit2 className="w-4 h-4 mx-auto mb-1" />
                            <p className="text-xs font-semibold">Can Edit</p>
                          </button>
                        </div>
                      </div>
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
                            if (shareEmail && shareEmail.includes('@')) {
                              toast.success(`Shared with ${shareEmail} successfully!`);
                              setShareDialog({ isOpen: false, itemId: null });
                              setShareEmail('');
                              setSharePermission('view');
                            } else {
                              toast.error('Please enter a valid email address');
                            }
                          }}
                          disabled={!shareEmail}
                          className="bg-gradient-to-b from-primary to-primary/90 content-stretch flex gap-[6px] h-[40px] items-center justify-center min-h-[32px] px-[14px] py-[12px] relative rounded-[12px] disabled:opacity-50 w-full"
                        >
                          <div aria-hidden="true" className="absolute border-primary/20 border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px] shadow-[0px_2px_3px_0px_rgba(30,58,138,0.21)]" />
                          <Share2 className="w-4 h-4 text-primary-foreground" />
                          <div className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-primary-foreground">
                            <p className="leading-[1.15]">Send Invitation</p>
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
        </>
      )}

      {/* New Folder Dialog */}
      {newFolderDialog && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
            onClick={() => {
              setNewFolderDialog(false);
              setNewFolderName('');
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-card relative rounded-[20px] w-full max-w-md pointer-events-auto">
              <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_32px_-4px_rgba(30,58,138,0.12),0px_3px_12px_-2px_rgba(30,58,138,0.06)]" />
              
              <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
                {/* Top Content */}
                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start pt-[32px] px-[24px] relative w-full">
                    {/* Header with icon and text */}
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                      <div className="bg-primary/10 content-stretch flex items-center justify-center p-[11.667px] relative rounded-[8px] shrink-0 size-[40px]">
                        <FolderPlus className="w-5 h-5 text-primary" />
                        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.429px_1.429px_0px_rgba(255,255,255,0.35)]" />
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px not-italic relative">
                        <p className="font-semibold leading-[1.15] relative shrink-0 text-foreground text-[20px] w-full">Create New Folder</p>
                        <p className="font-normal leading-[1.5] relative shrink-0 text-muted-foreground text-[14px] w-full">Enter a name for your new folder</p>
                      </div>
                    </div>
                    <div className="h-[20px] shrink-0 w-full" />
                    <div className="h-px relative shrink-0 w-full bg-border" />
                    
                    {/* Close Button */}
                    <div className="absolute content-stretch flex items-center p-[12px] right-0 top-[-0.5px]">
                      <button
                        onClick={() => {
                          setNewFolderDialog(false);
                          setNewFolderName('');
                        }}
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
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      <div className="flex flex-col font-medium justify-center leading-[0] not-italic relative shrink-0 text-foreground text-[14px] w-full">
                        <p className="leading-[1.15]">Folder Name</p>
                      </div>
                      <div className="bg-input-background h-[44px] min-h-[44px] relative rounded-[14px] shrink-0 w-full">
                        <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[14px] shadow-[0px_0.5px_1px_0px_rgba(0,0,0,0.04)]" />
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                          placeholder="e.g., Case Documents, Legal Research..."
                          autoFocus
                          className="h-full w-full px-[16px] py-[8px] bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none rounded-[14px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full">
                  <div className="relative shrink-0 w-full">
                    <div className="flex flex-row justify-center size-full">
                      <div className="content-stretch flex items-center justify-center pb-[24px] px-[24px] relative w-full">
                        <button
                          onClick={handleCreateFolder}
                          disabled={!newFolderName.trim()}
                          className="bg-gradient-to-b from-primary to-primary/90 content-stretch flex gap-[6px] h-[40px] items-center justify-center min-h-[32px] px-[14px] py-[12px] relative rounded-[12px] disabled:opacity-50 w-full"
                        >
                          <div aria-hidden="true" className="absolute border-primary/20 border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px] shadow-[0px_2px_3px_0px_rgba(30,58,138,0.21)]" />
                          <FolderPlus className="w-4 h-4 text-primary-foreground" />
                          <div className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-primary-foreground">
                            <p className="leading-[1.15]">Create Folder</p>
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
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.isOpen && deleteDialog.itemId && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
            onClick={() => setDeleteDialog({ isOpen: false, itemId: null })}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
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
                        <p className="font-semibold leading-[1.15] relative shrink-0 text-foreground text-[20px] w-full">Delete {items.find(i => i.id === deleteDialog.itemId)?.type === 'folder' ? 'Folder' : 'File'}</p>
                        <p className="font-normal leading-[1.5] relative shrink-0 text-muted-foreground text-[14px] w-full">This action cannot be undone</p>
                      </div>
                    </div>
                    <div className="h-[20px] shrink-0 w-full" />
                    <div className="h-px relative shrink-0 w-full bg-border" />
                    
                    {/* Close Button */}
                    <div className="absolute content-stretch flex items-center p-[12px] right-0 top-[-0.5px]">
                      <button
                        onClick={() => setDeleteDialog({ isOpen: false, itemId: null })}
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
                    {/* Item Info */}
                    <div className="mb-4 p-4 bg-muted/50 border border-border rounded-xl w-full">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          items.find(i => i.id === deleteDialog.itemId)?.type === 'folder'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted'
                        }`}>
                          {items.find(i => i.id === deleteDialog.itemId)?.type === 'folder' ? (
                            <Folder className="w-5 h-5" />
                          ) : (
                            getFileIcon(items.find(i => i.id === deleteDialog.itemId)?.fileType)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {items.find(i => i.id === deleteDialog.itemId)?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {items.find(i => i.id === deleteDialog.itemId)?.size || 'Folder'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Warning Message */}
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg w-full">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {items.find(i => i.id === deleteDialog.itemId)?.type === 'folder'
                          ? 'Deleting this folder will also remove all files and subfolders inside it.'
                          : 'Once deleted, this file cannot be recovered.'}
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
                            if (deleteDialog.itemId) {
                              handleDeleteItem(deleteDialog.itemId);
                              toast.success(`${items.find(i => i.id === deleteDialog.itemId)?.type === 'folder' ? 'Folder' : 'File'} deleted successfully`);
                              setDeleteDialog({ isOpen: false, itemId: null });
                            }
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
        </>
      )}

      {/* Rename Dialog */}
      {renameDialog.isOpen && renameDialog.itemId && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
            onClick={() => setRenameDialog({ isOpen: false, itemId: null })}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-card relative rounded-[20px] w-full max-w-md pointer-events-auto">
              <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_32px_-4px_rgba(30,58,138,0.12),0px_3px_12px_-2px_rgba(30,58,138,0.06)]" />
              
              <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
                {/* Top Content */}
                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start pt-[32px] px-[24px] relative w-full">
                    {/* Header with icon and text */}
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                      <div className="bg-primary/10 content-stretch flex items-center justify-center p-[11.667px] relative rounded-[8px] shrink-0 size-[40px]">
                        <Edit2 className="w-5 h-5 text-primary" />
                        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.429px_1.429px_0px_rgba(255,255,255,0.35)]" />
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px not-italic relative">
                        <p className="font-semibold leading-[1.15] relative shrink-0 text-foreground text-[20px] w-full">Rename {items.find(i => i.id === renameDialog.itemId)?.type === 'folder' ? 'Folder' : 'File'}</p>
                        <p className="font-normal leading-[1.5] relative shrink-0 text-muted-foreground text-[14px] w-full">{items.find(i => i.id === renameDialog.itemId)?.name}</p>
                      </div>
                    </div>
                    <div className="h-[20px] shrink-0 w-full" />
                    <div className="h-px relative shrink-0 w-full bg-border" />
                    
                    {/* Close Button */}
                    <div className="absolute content-stretch flex items-center p-[12px] right-0 top-[-0.5px]">
                      <button
                        onClick={() => setRenameDialog({ isOpen: false, itemId: null })}
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
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      <div className="flex flex-col font-medium justify-center leading-[0] not-italic relative shrink-0 text-foreground text-[14px] w-full">
                        <p className="leading-[1.15]">New Name</p>
                      </div>
                      <div className="bg-input-background h-[44px] min-h-[44px] relative rounded-[14px] shrink-0 w-full">
                        <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[14px] shadow-[0px_0.5px_1px_0px_rgba(0,0,0,0.04)]" />
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleRenameItem(renameDialog.itemId, renameValue)}
                          placeholder="Enter new name..."
                          autoFocus
                          className="h-full w-full px-[16px] py-[8px] bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none rounded-[14px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full">
                  <div className="relative shrink-0 w-full">
                    <div className="flex flex-row justify-center size-full">
                      <div className="content-stretch flex items-center justify-center pb-[24px] px-[24px] relative w-full">
                        <button
                          onClick={() => handleRenameItem(renameDialog.itemId, renameValue)}
                          disabled={!renameValue.trim()}
                          className="bg-gradient-to-b from-primary to-primary/90 content-stretch flex gap-[6px] h-[40px] items-center justify-center min-h-[32px] px-[14px] py-[12px] relative rounded-[12px] disabled:opacity-50 w-full"
                        >
                          <div aria-hidden="true" className="absolute border-primary/20 border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[12.5px] shadow-[0px_2px_3px_0px_rgba(30,58,138,0.21)]" />
                          <Edit2 className="w-4 h-4 text-primary-foreground" />
                          <div className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-primary-foreground">
                            <p className="leading-[1.15]">Rename</p>
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
        </>
      )}
    </div>
  );
}