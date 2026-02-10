import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface NarrationMismatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (action: 'fix-petition' | 'fix-annexure' | 'ignore') => void;
}

export function NarrationMismatchModal({
  isOpen,
  onClose,
  onResolve
}: NarrationMismatchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-50">
      <div className="bg-card dark:bg-slate-900 border-[0.5px] border-[#1E3A8A]/30 dark:border-[#1E3A8A] rounded-2xl shadow-2xl w-[550px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 border-b-[0.5px] border-[#1E3A8A]/20 dark:border-[#1E3A8A]/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="text-lg font-bold text-[#1E3A8A] dark:text-[#1E3A8A]">Resolve Narration Mismatch</h3>
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
          {/* Issue Description */}
          <div className="bg-yellow-500/10 dark:bg-yellow-500/20 border-[0.5px] border-yellow-500/30 dark:border-yellow-500/40 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground dark:text-white mb-2">Date Mismatch Detected</p>
                <div className="space-y-2 text-xs text-muted-foreground dark:text-slate-400">
                  <p><span className="font-semibold text-foreground dark:text-white">Petition (Page 5):</span> "...dated 10th October 2024..."</p>
                  <p><span className="font-semibold text-foreground dark:text-white">Annexure A-1:</span> "...dated 15th October 2024..."</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground dark:text-slate-400 mb-4">
            Choose which document to correct:
          </p>

          {/* Fix Petition */}
          <button
            onClick={() => onResolve('fix-petition')}
            className="w-full p-4 bg-background dark:bg-slate-800 border-[0.5px] border-border dark:border-white/20 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 dark:hover:bg-[#1E3A8A]/10 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 dark:group-hover:bg-[#1E3A8A]/30 transition-colors">
                <AlertTriangle className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground dark:text-white mb-1">Fix Petition Date</p>
                <p className="text-xs text-muted-foreground dark:text-slate-400">Update petition to match Annexure A-1 (15th October 2024)</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors" />
            </div>
          </button>

          {/* Fix Annexure */}
          <button
            onClick={() => onResolve('fix-annexure')}
            className="w-full p-4 bg-background dark:bg-slate-800 border-[0.5px] border-border dark:border-white/20 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 dark:hover:bg-[#1E3A8A]/10 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 dark:group-hover:bg-[#1E3A8A]/30 transition-colors">
                <AlertTriangle className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground dark:text-white mb-1">Fix Annexure Date</p>
                <p className="text-xs text-muted-foreground dark:text-slate-400">Update Annexure A-1 to match petition (10th October 2024)</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-accent/30 dark:bg-slate-800/50 border-t-[0.5px] border-border dark:border-white/10 px-6 py-4">
          <Button
            onClick={() => onResolve('ignore')}
            variant="outline"
            className="w-full border-[0.5px] border-border dark:border-white/30"
          >
            Ignore Mismatch
          </Button>
        </div>
      </div>
    </div>
  );
}
