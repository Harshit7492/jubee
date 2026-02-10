import { useState } from 'react';
import { X, FolderOpen, Save, FileText, ChevronRight, FolderPlus, FileIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';

interface Folder {
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface MySpaceSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folderPath: string, fileName: string, format: 'pdf' | 'doc') => void;
  defaultFileName?: string;
  format?: 'pdf' | 'doc';
}

// Mock folders - same as in MySpaceView
const folders: Folder[] = [
  { id: 'root', name: 'My Space (Root)', icon: FolderOpen, color: 'text-primary' },
  { id: 'contracts', name: 'Contracts & Agreements', icon: FolderOpen, color: 'text-blue-500' },
  { id: 'briefs', name: 'Case Briefs', icon: FolderOpen, color: 'text-purple-500' },
  { id: 'research', name: 'Research & Citations', icon: FolderOpen, color: 'text-amber-500' },
  { id: 'notices', name: 'Notices & Letters', icon: FolderOpen, color: 'text-emerald-500' },
  { id: 'drafts', name: 'My Drafts', icon: FolderOpen, color: 'text-pink-500' },
];

export function MySpaceSaveDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  defaultFileName = 'Untitled Document.txt',
  format = 'pdf'
}: MySpaceSaveDialogProps) {
  const [selectedFolder, setSelectedFolder] = useState('root');
  const [fileName, setFileName] = useState(defaultFileName);
  const [fileFormat, setFileFormat] = useState<'pdf' | 'doc'>(format);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!fileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    const selectedFolderName = folders.find(f => f.id === selectedFolder)?.name || 'My Space';
    onSave(selectedFolderName, fileName.trim(), fileFormat);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Save className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Save to My Space</h2>
              <p className="text-sm text-muted-foreground">Choose a folder and name your document</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-xl h-10 w-10 hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* File Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">
              File Name
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name..."
                className="w-full h-12 pl-10 pr-4 text-sm bg-background border border-border rounded-xl focus:border-primary"
              />
            </div>
          </div>

          {/* Folder Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Save to Folder
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {folders.map((folder) => {
                const Icon = folder.icon;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all border-2 ${ 
                      selectedFolder === folder.id
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-card border-border hover:border-primary/50 text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${selectedFolder === folder.id ? 'text-primary' : folder.color}`} />
                    <span className="text-sm font-semibold flex-1 text-left">{folder.name}</span>
                    {selectedFolder === folder.id && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create New Folder Option */}
          <button
            onClick={() => toast.info('Create folder feature coming soon!')}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            <span className="text-sm font-semibold">Create New Folder</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Saving to: <span className="font-semibold text-foreground">
              {folders.find(f => f.id === selectedFolder)?.name}
            </span>
            {' '}&bull;{' '}
            <span className="font-semibold text-foreground uppercase">
              {fileFormat}
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-border hover:bg-muted font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}