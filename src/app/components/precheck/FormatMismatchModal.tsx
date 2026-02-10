import { useState } from 'react';
import { X, ChevronRight, Edit3, Upload, FolderOpen, FileUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface FormatMismatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (action: 'open-typing' | 'upload-myspace' | 'upload-local') => void;
}

export function FormatMismatchModal({
  isOpen,
  onClose,
  onResolve,
}: FormatMismatchModalProps) {
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-50">
      <div className="bg-card border-[0.5px] border-[#1E3A8A]/30 rounded-2xl shadow-2xl w-[500px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 border-b-[0.5px] border-[#1E3A8A]/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1E3A8A]">Fix Format Mismatch</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-[#1E3A8A]/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!showUploadOptions ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Choose how you want to fix the formatting issue
              </p>

              {/* Path A: Open with Jubee Typing */}
              <button
                onClick={() => onResolve('open-typing')}
                className="w-full p-4 bg-background border-[0.5px] border-border rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                    <Edit3 className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Open with Jubee Typing</p>
                    <p className="text-xs text-muted-foreground">Fix formatting using integrated editor with court-compliant templates</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors" />
                </div>
              </button>

              {/* Path B: Upload New Doc */}
              <button
                onClick={() => setShowUploadOptions(true)}
                className="w-full p-4 bg-background border-[0.5px] border-border rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                    <Upload className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Upload New Doc</p>
                    <p className="text-xs text-muted-foreground">Replace with a properly formatted document</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors" />
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowUploadOptions(false)}
                className="text-sm text-[#1E3A8A] hover:underline flex items-center gap-1 mb-4"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back
              </button>

              <p className="text-sm text-muted-foreground mb-6">
                Choose upload source for formatted document
              </p>

              {/* Upload from My Space */}
              <button
                onClick={() => onResolve('upload-myspace')}
                className="w-full p-4 bg-background border-[0.5px] border-border rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                    <FolderOpen className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Upload from My Space</p>
                    <p className="text-xs text-muted-foreground">Browse existing properly formatted documents</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors" />
                </div>
              </button>

              {/* Upload New Document */}
              <button
                onClick={() => onResolve('upload-local')}
                className="w-full p-4 bg-background border-[0.5px] border-border rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                    <FileUp className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">Upload New Document</p>
                    <p className="text-xs text-muted-foreground">Direct upload from your device</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors" />
                </div>
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-accent/30 border-t-[0.5px] border-border px-6 py-4">
          <Button
            onClick={() => {
              setShowUploadOptions(false);
              onClose();
            }}
            variant="outline"
            className="w-full border-[0.5px] border-border"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}