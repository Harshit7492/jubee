import { useState, useRef } from 'react';
import { FileText, Upload, Search, MoreVertical, Download, Trash2, MessageSquare, Calendar, FolderPlus, Share2, Edit2, X, Copy, LinkIcon, ChevronRight, FolderOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedDate: string;
  folder: string;
}

interface CaseFolderViewProps {
  folder: string;
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
  onUploadClick: () => void;
  onBackToFiles?: () => void;
}

const folderColors: Record<string, string> = {
  'petitions': 'text-blue-500',
  'applications': 'text-purple-500',
  'orders': 'text-amber-500',
  'misc': 'text-emerald-500'
};

const folderLabels: Record<string, string> = {
  'petitions': 'Petitions',
  'applications': 'Applications',
  'orders': 'Orders/Judgments',
  'misc': 'Miscellaneous'
};

export function CaseFolderView({ folder, documents, onDocumentClick, onUploadClick, onBackToFiles }: CaseFolderViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; docId: string } | null>(null);
  const [shareDialog, setShareDialog] = useState<{ isOpen: boolean; docId: string | null }>({ isOpen: false, docId: null });
  const [renameDialog, setRenameDialog] = useState<{ isOpen: boolean; docId: string | null }>({ isOpen: false, docId: null });
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; docId: string | null }>({ isOpen: false, docId: null });
  const [renameValue, setRenameValue] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState<'view' | 'edit'>('view');

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    return <FileText className={`w-5 h-5 ${folderColors[folder] || 'text-foreground'}`} />;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic here
      console.log('Uploading files:', files);
      // You can call onUploadClick or implement your own upload logic
    }
  };

  const handleFolderUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle folder upload logic here
      console.log('Uploading folder:', files);
    }
  };

  const handleCreateFolder = () => {
    setIsCreatingFolder(true);
    // Handle create folder logic here
    console.log('Creating new folder');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Back Button */}
      <div className="mb-6">
        {/* Back Button with Current Location */}
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToFiles}
            className="hover:bg-accent h-10 px-4 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <h2 className="text-lg font-semibold text-foreground">
            {folderLabels[folder]}
          </h2>
        </div>
        
        {/* Document Count */}
        <div>
          <p className="text-sm text-muted-foreground">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
          </p>
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

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className="w-full h-12 pl-12 pr-4 text-base bg-background border-2 border-border rounded-xl focus:border-primary"
        />
      </div>

      {/* Documents Table */}
      {filteredDocuments.length > 0 ? (
        <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col style={{ width: '40%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead className="bg-muted/30 border-b border-border sticky top-0">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Size</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Uploaded</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className={`border-b border-border hover:bg-muted/20 cursor-pointer transition-colors ${
                      index % 2 === 0 ? 'bg-card' : 'bg-muted/5'
                    }`}
                    onClick={() => onDocumentClick(doc)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground uppercase">{doc.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{doc.size}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{doc.uploadedDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu({
                            x: e.currentTarget.getBoundingClientRect().left - 150,
                            y: e.currentTarget.getBoundingClientRect().bottom,
                            docId: doc.id
                          });
                        }}
                        className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/5">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? 'No documents found' : `No documents in ${folderLabels[folder]}`}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {searchQuery ? 'Try adjusting your search query' : 'Upload documents to get started'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-6 gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            )}
          </div>
        </div>
      )}

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
                setShareDialog({ isOpen: true, docId: contextMenu.docId });
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button 
              onClick={() => {
                toast.success('Download started!');
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => {
                setRenameDialog({ isOpen: true, docId: contextMenu.docId });
                setRenameValue(documents.find(d => d.id === contextMenu.docId)?.name || '');
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
                setDeleteDialog({ isOpen: true, docId: contextMenu.docId });
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
      {shareDialog.isOpen && shareDialog.docId && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShareDialog({ isOpen: false, docId: null })}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-card relative rounded-[20px] w-full max-w-md pointer-events-auto">
              <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_32px_-4px_rgba(30,58,138,0.12),0px_3px_12px_-2px_rgba(30,58,138,0.06)]" />
              
              <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start pt-[32px] px-[24px] relative w-full">
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                      <div className="bg-primary/10 content-stretch flex items-center justify-center p-[11.667px] relative rounded-[8px] shrink-0 size-[40px]">
                        <Share2 className="w-5 h-5 text-primary" />
                        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.429px_1.429px_0px_rgba(255,255,255,0.35)]" />
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px not-italic relative">
                        <p className="font-semibold leading-[1.15] relative shrink-0 text-foreground text-[20px] w-full">Share Document</p>
                        <p className="font-normal leading-[1.5] relative shrink-0 text-muted-foreground text-[14px] w-full">{documents.find(d => d.id === shareDialog.docId)?.name}</p>
                      </div>
                    </div>
                    <div className="h-[20px] shrink-0 w-full" />
                    <div className="h-px relative shrink-0 w-full bg-border" />
                    
                    <div className="absolute content-stretch flex items-center p-[12px] right-0 top-[-0.5px]">
                      <button
                        onClick={() => setShareDialog({ isOpen: false, docId: null })}
                        className="content-stretch flex items-center justify-center overflow-clip p-[6.588px] relative rounded-[7.529px] shrink-0 size-[32px] hover:bg-accent transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start pt-[24px] px-[24px] relative w-full">
                    <div className="mb-4 p-4 bg-muted/50 border border-border rounded-xl w-full">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Shareable Link
                        </label>
                        <button
                          onClick={() => {
                            try {
                              navigator.clipboard.writeText(`https://jubee.app/share/${shareDialog.docId}`);
                              toast.success('Link copied to clipboard!');
                            } catch (error) {
                              // Fallback: Create a temporary input to copy text
                              const textarea = document.createElement('textarea');
                              textarea.value = `https://jubee.app/share/${shareDialog.docId}`;
                              textarea.style.position = 'fixed';
                              textarea.style.opacity = '0';
                              document.body.appendChild(textarea);
                              textarea.select();
                              try {
                                document.execCommand('copy');
                                toast.success('Link copied to clipboard!');
                              } catch (fallbackError) {
                                toast.error('Failed to copy link');
                              }
                              document.body.removeChild(textarea);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy Link
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Anyone with this link can access this document</p>
                    </div>
                  </div>
                </div>

                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[12px] items-center justify-end pb-[24px] px-[24px] pt-[12px] relative w-full">
                    <Button
                      onClick={() => setShareDialog({ isOpen: false, docId: null })}
                      variant="outline"
                      className="rounded-xl h-12 px-6"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Rename Dialog */}
      {renameDialog.isOpen && renameDialog.docId && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
            onClick={() => setRenameDialog({ isOpen: false, docId: null })}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-card relative rounded-[20px] w-full max-w-md pointer-events-auto">
              <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_32px_-4px_rgba(30,58,138,0.12),0px_3px_12px_-2px_rgba(30,58,138,0.06)]" />
              
              <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start pt-[32px] px-[24px] relative w-full">
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                      <div className="bg-primary/10 content-stretch flex items-center justify-center p-[11.667px] relative rounded-[8px] shrink-0 size-[40px]">
                        <Edit2 className="w-5 h-5 text-primary" />
                        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.429px_1.429px_0px_rgba(255,255,255,0.35)]" />
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px not-italic relative">
                        <p className="font-semibold leading-[1.15] relative shrink-0 text-foreground text-[20px] w-full">Rename Document</p>
                        <p className="font-normal leading-[1.5] relative shrink-0 text-muted-foreground text-[14px] w-full">Enter a new name for this document</p>
                      </div>
                    </div>
                    <div className="h-[20px] shrink-0 w-full" />
                    <div className="h-px relative shrink-0 w-full bg-border" />
                    
                    <div className="absolute content-stretch flex items-center p-[12px] right-0 top-[-0.5px]">
                      <button
                        onClick={() => setRenameDialog({ isOpen: false, docId: null })}
                        className="content-stretch flex items-center justify-center overflow-clip p-[6.588px] relative rounded-[7.529px] shrink-0 size-[32px] hover:bg-accent transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start pt-[24px] px-[24px] relative w-full">
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      placeholder="Document name"
                      className="w-full h-12 px-4 rounded-xl"
                    />
                  </div>
                </div>

                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[12px] items-center justify-end pb-[24px] px-[24px] pt-[12px] relative w-full">
                    <Button
                      onClick={() => setRenameDialog({ isOpen: false, docId: null })}
                      variant="outline"
                      className="rounded-xl h-12 px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        toast.success('Document renamed successfully!');
                        setRenameDialog({ isOpen: false, docId: null });
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-6"
                    >
                      Rename
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Dialog */}
      {deleteDialog.isOpen && deleteDialog.docId && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
            onClick={() => setDeleteDialog({ isOpen: false, docId: null })}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-card relative rounded-[20px] w-full max-w-md pointer-events-auto">
              <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_32px_-4px_rgba(30,58,138,0.12),0px_3px_12px_-2px_rgba(30,58,138,0.06)]" />
              
              <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start pt-[32px] px-[24px] relative w-full">
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                      <div className="bg-red-500/10 content-stretch flex items-center justify-center p-[11.667px] relative rounded-[8px] shrink-0 size-[40px]">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1.429px_1.429px_0px_rgba(255,255,255,0.35)]" />
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-h-px min-w-px not-italic relative">
                        <p className="font-semibold leading-[1.15] relative shrink-0 text-foreground text-[20px] w-full">Delete Document</p>
                        <p className="font-normal leading-[1.5] relative shrink-0 text-muted-foreground text-[14px] w-full">Are you sure you want to delete "{documents.find(d => d.id === deleteDialog.docId)?.name}"?</p>
                      </div>
                    </div>
                    <div className="h-[20px] shrink-0 w-full" />
                    <div className="h-px relative shrink-0 w-full bg-border" />
                    
                    <div className="absolute content-stretch flex items-center p-[12px] right-0 top-[-0.5px]">
                      <button
                        onClick={() => setDeleteDialog({ isOpen: false, docId: null })}
                        className="content-stretch flex items-center justify-center overflow-clip p-[6.588px] relative rounded-[7.529px] shrink-0 size-[32px] hover:bg-accent transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start pt-[24px] px-[24px] relative w-full">
                    <p className="text-sm text-muted-foreground">This action cannot be undone. The document will be permanently deleted.</p>
                  </div>
                </div>

                <div className="relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[12px] items-center justify-end pb-[24px] px-[24px] pt-[12px] relative w-full">
                    <Button
                      onClick={() => setDeleteDialog({ isOpen: false, docId: null })}
                      variant="outline"
                      className="rounded-xl h-12 px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        toast.success('Document deleted successfully!');
                        setDeleteDialog({ isOpen: false, docId: null });
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 px-6"
                    >
                      Delete
                    </Button>
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