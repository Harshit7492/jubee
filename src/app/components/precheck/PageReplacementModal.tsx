import { FileText, X, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface PageReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: () => void;
  onAppend: () => void;
  onAppendAfterOriginal: () => void;
  selectedPages: number[];
  totalPages: number;
}

export function PageReplacementModal({
  isOpen,
  onClose,
  onReplace,
  onAppend,
  onAppendAfterOriginal,
  selectedPages,
  totalPages
}: PageReplacementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-[60]">
      <div className="bg-card dark:bg-slate-900 border-[0.5px] border-[#1E3A8A]/30 dark:border-[#1E3A8A] rounded-2xl shadow-2xl w-[550px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 border-b-[0.5px] border-[#1E3A8A]/20 dark:border-[#1E3A8A]/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1E3A8A] dark:text-[#1E3A8A]">Finalize Translation</h3>
              <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
                Choose how to apply the translated pages
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
        <div className="p-6 space-y-4">
          {/* Summary */}
          <div className="bg-[#1E3A8A]/5 dark:bg-[#1E3A8A]/10 border-[0.5px] border-[#1E3A8A]/20 dark:border-[#1E3A8A]/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#1E3A8A]" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground dark:text-white">Annexure P-5.pdf</p>
                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
                  <span className="font-semibold text-[#1E3A8A]">{selectedPages.length} page(s)</span> translated: {selectedPages.sort((a, b) => a - b).join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Replace Option */}
          <button
            onClick={onReplace}
            className="w-full p-5 bg-background dark:bg-slate-800 border-[0.5px] border-border dark:border-white/20 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 dark:hover:bg-[#1E3A8A]/10 text-left transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 dark:group-hover:bg-[#1E3A8A]/30 transition-colors flex-shrink-0">
                <FileText className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground dark:text-white mb-1">Replace Pages</p>
                <p className="text-xs text-muted-foreground dark:text-slate-400 leading-relaxed">
                  Replace page(s) {selectedPages.sort((a, b) => a - b).join(', ')} in the original document with translated versions. The document will remain {totalPages} pages.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 border-[0.5px] border-[#1E3A8A]/20 dark:border-[#1E3A8A]/30 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A]" />
                  <span className="text-[10px] font-semibold text-[#1E3A8A]">Recommended</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors flex-shrink-0 mt-2" />
            </div>
          </button>

          {/* Append Option */}
          <button
            onClick={onAppend}
            className="w-full p-5 bg-background dark:bg-slate-800 border-[0.5px] border-border dark:border-white/20 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 dark:hover:bg-[#1E3A8A]/10 text-left transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 dark:group-hover:bg-[#1E3A8A]/30 transition-colors flex-shrink-0">
                <FileText className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground dark:text-white mb-1">Append Pages</p>
                <p className="text-xs text-muted-foreground dark:text-slate-400 leading-relaxed">
                  Add translated pages at the end of the document. Original pages remain unchanged. Total pages will become {totalPages + selectedPages.length}.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors flex-shrink-0 mt-2" />
            </div>
          </button>

          {/* Append After Original Option */}
          <button
            onClick={() => {
              console.log('Append After Original button clicked');
              onAppendAfterOriginal();
            }}
            className="w-full p-5 bg-background dark:bg-slate-800 border-[0.5px] border-border dark:border-white/20 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 dark:hover:bg-[#1E3A8A]/10 text-left transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 dark:group-hover:bg-[#1E3A8A]/30 transition-colors flex-shrink-0">
                <FileText className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground dark:text-white mb-1">Append After Original Pages</p>
                <p className="text-xs text-muted-foreground dark:text-slate-400 leading-relaxed">
                  Insert translated version(s) immediately after their respective original pages. Original pages remain unchanged. Total pages will become {totalPages + selectedPages.length}.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors flex-shrink-0 mt-2" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-accent/30 dark:bg-slate-800/50 border-t-[0.5px] border-border dark:border-white/10 px-6 py-4">
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full border-[0.5px] border-border dark:border-white/30"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}