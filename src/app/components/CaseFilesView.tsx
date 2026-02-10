import { useState, useRef } from 'react';
import { ArrowLeft, FileText, FileCheck, Gavel, FolderOpen, Search, Upload, FolderPlus, Folder, Check, X } from 'lucide-react';
import { CaseFolderView } from '@/app/components/CaseFolderView';
import { Button } from '@/app/components/ui/button';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedDate: string;
  size: string;
  folder: string;
}

interface CaseFilesViewProps {
  onBack: () => void;
  onDocumentClick: (doc: Document) => void;
  documents: Document[];
}

const folders = [
  { id: 'petitions', name: 'Petitions', icon: FileText, color: 'text-blue-500' },
  { id: 'applications', name: 'Applications', icon: FileCheck, color: 'text-purple-500' },
  { id: 'orders', name: 'Orders/Judgments', icon: Gavel, color: 'text-amber-500' },
  { id: 'misc', name: 'Misc', icon: FolderOpen, color: 'text-emerald-500' }
];

export function CaseFilesView({ onBack, onDocumentClick, documents }: CaseFilesViewProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      console.log('Creating folder:', newFolderName);
      // Add folder creation logic here
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
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

  const filteredDocuments = selectedFolder 
    ? documents.filter(doc => doc.folder === selectedFolder)
    : [];

  const getDocumentCount = (folderId: string) => {
    return documents.filter(d => d.folder === folderId).length;
  };

  // Show folder contents
  if (selectedFolder) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header removed - now handled in CaseDetailView with My Spaces style */}

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <CaseFolderView
              folder={selectedFolder}
              documents={filteredDocuments}
              onDocumentClick={onDocumentClick}
              onUploadClick={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show folders grid
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
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

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* New Folder Input */}
          {isCreatingFolder && (
            <div className="mb-6 p-4 bg-card border border-primary rounded-xl">
              <div className="flex items-center gap-3">
                <Folder className="w-5 h-5 text-primary" />
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                  placeholder="New folder name..."
                  autoFocus
                  className="flex-1 h-9 px-3 text-sm bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Create
                </Button>
                <Button
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  size="sm"
                  variant="ghost"
                  className="h-9 px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map((folder) => {
              const Icon = folder.icon;
              const count = getDocumentCount(folder.id);
              
              return (
                <button
                  key={folder.id}
                  onClick={() => handleFolderClick(folder.id)}
                  className="group p-6 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg transition-all text-center"
                >
                  <div className={`w-16 h-16 ${folder.color.replace('text-', 'bg-')}/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${folder.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                    {folder.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {count} document{count !== 1 ? 's' : ''}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}