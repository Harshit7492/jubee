import { X, Edit3, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import type { DefectItem } from '@/app/components/research-tools/PreCheckWorkflow';

interface NarrationResolutionDialogProps {
  defect: DefectItem;
  onClose: () => void;
  onResolve: (option: 'update-petition' | 'replace-annexure') => void;
}

export function NarrationResolutionDialog({ defect, onClose, onResolve }: NarrationResolutionDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-yellow-50 dark:bg-yellow-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">Narration Mismatch Detected</h2>
                <p className="text-xs text-muted-foreground">Date inconsistency between petition and annexure</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-accent"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Problem Statement */}
          <div className="p-4 rounded-xl border-2 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/10">
            <h3 className="font-semibold text-foreground text-sm mb-3">Conflict Details:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Petition states:</p>
                  <p className="text-sm text-muted-foreground">
                    "...the incident occurred on <span className="font-bold text-foreground bg-yellow-200 dark:bg-yellow-700 px-1">1st October 2024</span>"
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Annexure P-4 shows:</p>
                  <p className="text-sm text-muted-foreground">
                    Document dated <span className="font-bold text-foreground bg-yellow-200 dark:bg-yellow-700 px-1">21st March 2024</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Choose resolution method:</h3>
            
            {/* Option 1: Update Petition */}
            <button
              onClick={() => onResolve('update-petition')}
              className="w-full p-5 rounded-xl border-2 border-border hover:border-primary bg-accent/20 hover:bg-accent/40 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Edit3 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Option 1: Update Petition Text</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Modify the petition narration to match the annexure date (21st March 2024). 
                    Jubee will automatically update all references in the petition.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary">
                    <span>Recommended when:</span>
                    <span className="text-muted-foreground font-normal">The annexure date is correct</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Option 2: Replace Annexure */}
            <button
              onClick={() => onResolve('replace-annexure')}
              className="w-full p-5 rounded-xl border-2 border-border hover:border-primary bg-accent/20 hover:bg-accent/40 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Option 2: Replace Annexure Document</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload the correct annexure document that matches the petition date (1st October 2024). 
                    The existing Annexure P-4 will be replaced.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary">
                    <span>Recommended when:</span>
                    <span className="text-muted-foreground font-normal">The petition date is correct</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Warning Note */}
          <div className="p-3 rounded-lg bg-accent border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Note:</span> Narration inconsistencies may cause 
              Registry objections. Ensure the corrected version accurately reflects the actual facts of the case.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-accent/20">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full font-semibold"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
