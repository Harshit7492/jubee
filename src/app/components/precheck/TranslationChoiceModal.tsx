import { X, Languages, Upload } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface TranslationChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranslateWithJubee: () => void;
  onUploadNew: () => void;
}

export function TranslationChoiceModal({
  isOpen,
  onClose,
  onTranslateWithJubee,
  onUploadNew,
}: TranslationChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-50">
      <div className="bg-card border-[0.5px] border-[#1E3A8A]/30 rounded-2xl shadow-2xl w-[500px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 border-b-[0.5px] border-[#1E3A8A]/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1E3A8A]">Fix Translation Defect</h3>
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
          <p className="text-sm text-muted-foreground mb-6">
            Choose how you want to resolve the vernacular document issue
          </p>

          {/* Translate with Jubee */}
          <button
            onClick={onTranslateWithJubee}
            className="w-full p-4 bg-background border-[0.5px] border-border rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                <Languages className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">Translate with Jubee</p>
                <p className="text-xs text-muted-foreground">Generate certified English translation with AI</p>
              </div>
            </div>
          </button>

          {/* Upload New Document */}
          <button
            onClick={onUploadNew}
            className="w-full p-4 bg-background border-[0.5px] border-border rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                <Upload className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">Upload New Document</p>
                <p className="text-xs text-muted-foreground">Replace with an existing translated version</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-accent/30 border-t-[0.5px] border-border px-6 py-4">
          <Button
            onClick={onClose}
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
