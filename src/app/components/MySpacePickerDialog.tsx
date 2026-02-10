import { useState } from 'react';
import { X, Search, FolderOpen, FileText, Check, ChevronRight, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedDate: string;
  folder: string;
}

interface Folder {
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface MySpacePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (documents: Document[]) => void;
}

// Mock data - same as in MySpaceView
const mockDocuments: Document[] = [
  { id: '1', name: 'Sale Deed Agreement.pdf', type: 'PDF', size: '2.4 MB', uploadedDate: 'Jan 15, 2025', folder: 'contracts' },
  { id: '2', name: 'Property Documents.pdf', type: 'PDF', size: '1.8 MB', uploadedDate: 'Jan 18, 2025', folder: 'contracts' },
  { id: '3', name: 'Client Brief - Sharma v. State.docx', type: 'DOCX', size: '845 KB', uploadedDate: 'Jan 20, 2025', folder: 'briefs' },
  { id: '4', name: 'Written Arguments Draft.docx', type: 'DOCX', size: '1.2 MB', uploadedDate: 'Jan 22, 2025', folder: 'briefs' },
  { id: '5', name: 'SC Judgment - Kesavananda Bharati.pdf', type: 'PDF', size: '5.6 MB', uploadedDate: 'Jan 10, 2025', folder: 'research' },
  { id: '6', name: 'Research Notes - Article 370.pdf', type: 'PDF', size: '982 KB', uploadedDate: 'Jan 12, 2025', folder: 'research' },
  { id: '7', name: 'Notice to Appear.pdf', type: 'PDF', size: '456 KB', uploadedDate: 'Jan 8, 2025', folder: 'notices' },
  { id: '8', name: 'Legal Notice - Defamation.pdf', type: 'PDF', size: '678 KB', uploadedDate: 'Jan 14, 2025', folder: 'notices' },
];

const folders: Folder[] = [
  { id: 'all', name: 'All Documents', icon: FileText, color: 'text-primary' },
  { id: 'contracts', name: 'Contracts & Agreements', icon: FileText, color: 'text-blue-500' },
  { id: 'briefs', name: 'Case Briefs', icon: FileText, color: 'text-purple-500' },
  { id: 'research', name: 'Research & Citations', icon: FileText, color: 'text-amber-500' },
  { id: 'notices', name: 'Notices & Letters', icon: FileText, color: 'text-emerald-500' },
];

export function MySpacePickerDialog({ isOpen, onClose, onSelect }: MySpacePickerDialogProps) {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const toggleDocument = (docId: string) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocuments(newSelected);
  };

  const handleAttach = () => {
    const selected = mockDocuments.filter(doc => selectedDocuments.has(doc.id));
    onSelect(selected);
    setSelectedDocuments(new Set());
    onClose();
  };

  const getFileIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-destructive" />;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">My Space - Choose Files</h2>
              <p className="text-sm text-muted-foreground">Select documents to attach</p>
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

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-2 text-primary hover:text-primary hover:bg-primary/10"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-2 hover:bg-muted"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedDocuments.size} {selectedDocuments.size === 1 ? 'file' : 'files'} selected
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Folders */}
          <div className="w-64 border-r border-border bg-muted/5 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">FOLDERS</h3>
            <div className="space-y-1">
              {folders.map((folder) => {
                const Icon = folder.icon;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      selectedFolder === folder.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${selectedFolder === folder.id ? 'text-primary' : folder.color}`} />
                    <span className="text-sm font-medium flex-1 text-left truncate">{folder.name}</span>
                    {selectedFolder === folder.id && (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Documents List */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full h-10 pl-9 pr-4 text-sm bg-background border border-border rounded-xl focus:border-primary"
                />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-12"></th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Size</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc, index) => (
                    <tr
                      key={doc.id}
                      onClick={() => toggleDocument(doc.id)}
                      className={`border-b border-border hover:bg-muted/20 cursor-pointer transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/5'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedDocuments.has(doc.id)
                              ? 'bg-primary border-primary'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {selectedDocuments.has(doc.id) && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                            {getFileIcon(doc.type)}
                          </div>
                          <span className="text-sm font-medium text-foreground truncate">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground uppercase">{doc.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{doc.size}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground">{doc.uploadedDate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredDocuments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'No documents found' : 'No documents in this folder'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
          <div className="text-sm text-muted-foreground">
            {selectedDocuments.size > 0 ? (
              <span className="font-medium text-foreground">
                {selectedDocuments.size} {selectedDocuments.size === 1 ? 'document' : 'documents'} selected
              </span>
            ) : (
              'Select documents to attach'
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="h-10 px-6 rounded-xl border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAttach}
              disabled={selectedDocuments.size === 0}
              className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Attach Selected Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}