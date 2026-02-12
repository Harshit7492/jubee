import { useState } from 'react';
import { X, Folder, FileText, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface MySpaceBrowserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (files: { name: string; size: string; type: 'pdf' | 'docx' }[]) => void;
}

interface FileItem {
  id: string;
  name: string;
  type: 'file';
  fileType: 'pdf' | 'docx';
  size: string;
  folder: string;
}

interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  fileCount: number;
}

const mockFolders: FolderItem[] = [
  { id: '1', name: 'Civil Cases', type: 'folder', fileCount: 12 },
  { id: '2', name: 'Criminal Cases', type: 'folder', fileCount: 8 },
  { id: '3', name: 'Supreme Court Matters', type: 'folder', fileCount: 5 },
  { id: '4', name: 'Delhi High Court', type: 'folder', fileCount: 15 }
];

const mockFiles: FileItem[] = [
  { id: 'f1', name: 'Petition_Draft_Hindi.pdf', type: 'file', fileType: 'pdf', size: '245 KB', folder: '1' },
  { id: 'f2', name: 'Evidence_Document_Marathi.docx', type: 'file', fileType: 'docx', size: '128 KB', folder: '1' },
  { id: 'f3', name: 'Affidavit_Telugu.pdf', type: 'file', fileType: 'pdf', size: '189 KB', folder: '2' },
  { id: 'f4', name: 'Notice_Reply_Tamil.docx', type: 'file', fileType: 'docx', size: '97 KB', folder: '3' },
  { id: 'f5', name: 'Legal_Brief_Hindi.pdf', type: 'file', fileType: 'pdf', size: '312 KB', folder: '4' }
];

export function MySpaceBrowserDialog({ isOpen, onClose, onSelect }: MySpaceBrowserDialogProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentFiles = selectedFolder
    ? mockFiles.filter(f => f.folder === selectedFolder)
    : mockFiles;

  const filteredFiles = currentFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileToggle = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleAddFiles = () => {
    const files = mockFiles
      .filter(f => selectedFiles.includes(f.id))
      .map(f => ({
        name: f.name,
        size: f.size,
        type: f.fileType
      }));
    onSelect(files);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">Add from My Space</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select documents to translate
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Folders Sidebar */}
          <div className="w-56 border-r border-border bg-muted/30 p-3 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">FOLDERS</p>
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${selectedFolder === null
                  ? 'bg-primary text-white'
                  : 'hover:bg-accent text-foreground'
                }`}
            >
              <Folder className="w-4 h-4" />
              All Files
            </button>
            {mockFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${selectedFolder === folder.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-accent text-foreground'
                  }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Folder className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{folder.name}</span>
                </div>
                <span className={`text-xs ${selectedFolder === folder.id ? 'text-white/80' : 'text-muted-foreground'
                  }`}>
                  {folder.fileCount}
                </span>
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No files found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFiles.includes(file.id);
                  return (
                    <button
                      key={file.id}
                      onClick={() => handleFileToggle(file.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 bg-background'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                        <FileText className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAddFiles}
              disabled={selectedFiles.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              Add Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}