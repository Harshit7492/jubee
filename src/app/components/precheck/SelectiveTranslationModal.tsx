import { useState } from 'react';
import { X, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface SelectiveTranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranslate: (selectedPages: number[]) => void;
  totalPages: number;
  vernacularPages: number[];
}

export function SelectiveTranslationModal({
  isOpen,
  onClose,
  onTranslate,
  totalPages,
  vernacularPages
}: SelectiveTranslationModalProps) {
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  if (!isOpen) return null;

  const togglePage = (page: number) => {
    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter(p => p !== page));
    } else {
      setSelectedPages([...selectedPages, page]);
    }
  };

  const handleTranslate = () => {
    if (selectedPages.length === 0) return;
    onTranslate(selectedPages);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-50">
      <div className="bg-card dark:bg-slate-900 border-[0.5px] border-[#1E3A8A]/30 dark:border-[#1E3A8A] rounded-2xl shadow-2xl w-[600px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 border-b-[0.5px] border-[#1E3A8A]/20 dark:border-[#1E3A8A]/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1E3A8A] dark:text-[#1E3A8A]">Translate with Jubee</h3>
              <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
                Select pages to translate from vernacular to English
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-[#1E3A8A]/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Document Info */}
          <div className="bg-[#1E3A8A]/5 dark:bg-[#1E3A8A]/10 border-[0.5px] border-[#1E3A8A]/20 dark:border-[#1E3A8A]/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-[#1E3A8A]" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground dark:text-white">Document: Annexure P-5.pdf</p>
                <p className="text-xs text-muted-foreground dark:text-slate-400">Total Pages: {totalPages}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground dark:text-slate-400">
              <span className="font-semibold text-[#1E3A8A]">{vernacularPages.length} page(s)</span> detected in vernacular language
            </div>
          </div>

          {/* Page Selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-foreground dark:text-white mb-3">Select Pages to Translate:</p>
            <div className="grid grid-cols-10 gap-2 max-h-[300px] overflow-y-auto p-2">
              {vernacularPages.map((page) => (
                <button
                  key={page}
                  onClick={() => togglePage(page)}
                  className={`aspect-square rounded-lg border-[0.5px] flex items-center justify-center text-sm font-semibold transition-all ${
                    selectedPages.includes(page)
                      ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-lg'
                      : 'bg-card dark:bg-slate-800 border-border dark:border-white/20 text-foreground dark:text-white hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/10'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {/* Selection Summary */}
          {selectedPages.length > 0 && (
            <div className="bg-[#1E3A8A]/5 dark:bg-[#1E3A8A]/10 border-[0.5px] border-[#1E3A8A]/20 dark:border-[#1E3A8A]/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-foreground dark:text-white">
                <span className="font-bold text-[#1E3A8A]">{selectedPages.length} page(s)</span> selected: {selectedPages.sort((a, b) => a - b).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-accent/30 dark:bg-slate-800/50 border-t-[0.5px] border-border dark:border-white/10 px-6 py-4 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-[0.5px] border-border dark:border-white/30"
          >
            Cancel
          </Button>
          <Button
            onClick={handleTranslate}
            disabled={selectedPages.length === 0}
            className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Translate {selectedPages.length > 0 && `(${selectedPages.length})`}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
