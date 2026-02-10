import { useState } from 'react';
import { X, FileText, Languages, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface TranslationSetupProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  sourceLanguage: string;
  targetLanguage: string;
  court: string;
  onStartTranslation: () => void;
}

export function TranslationSetup({
  isOpen,
  onClose,
  fileName,
  sourceLanguage,
  targetLanguage,
  court,
  onStartTranslation,
}: TranslationSetupProps) {
  const [selectedCourt, setSelectedCourt] = useState(court);

  const courts = [
    {
      id: 'supreme-court-of-india',
      name: 'Supreme Court of India',
      font: 'Times New Roman',
      size: '14pt',
      spacing: '2',
    },
    {
      id: 'delhi-high-court',
      name: 'Delhi High Court',
      font: 'Times New Roman',
      size: '14pt',
      spacing: '1.5',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-50 p-4">
      <div className="bg-card border-[0.5px] border-[#1E3A8A]/30 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 border-b-[0.5px] border-[#1E3A8A]/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/20 flex items-center justify-center">
                <Languages className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E3A8A]">Translate with Jubee</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pre-filled document ready for translation
                </p>
              </div>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* File Info Card */}
          <div className="bg-background border-[0.5px] border-border rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground mb-2">File: {fileName}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="font-semibold text-foreground">{sourceLanguage} (Vernacular)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-semibold text-[#1E3A8A]">{targetLanguage} (English)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Translation Required Notice */}
          <div className="bg-yellow-500/10 border-[0.5px] border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-yellow-700 dark:text-yellow-500 mb-1">
                  Translation Required
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-600">
                  {fileName} is in {sourceLanguage} and requires a certified English translation as per court filing requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Target Language */}
          <div>
            <label className="text-sm font-bold text-foreground block mb-3">
              Target Language
            </label>
            <div className="bg-background border-[0.5px] border-border rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">English</span>
              <div className="px-2 py-1 bg-[#1E3A8A]/10 border-[0.5px] border-[#1E3A8A]/30 rounded text-xs font-semibold text-[#1E3A8A]">
                Default
              </div>
            </div>
          </div>

          {/* Select Court */}
          <div>
            <label className="text-sm font-bold text-foreground block mb-3">
              Select Court
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              {courts.map((courtOption) => (
                <button
                  key={courtOption.id}
                  onClick={() => setSelectedCourt(courtOption.id)}
                  className={`p-4 border-[0.5px] rounded-xl text-left transition-all ${
                    selectedCourt === courtOption.id
                      ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                      : 'border-border bg-background hover:border-[#1E3A8A]/50 hover:bg-[#1E3A8A]/5'
                  }`}
                >
                  <p className="font-bold text-foreground mb-3">{courtOption.name}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Font: {courtOption.font}</p>
                    <p>Size: {courtOption.size}</p>
                    <p>Spacing: {courtOption.spacing}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-[#1E3A8A]/5 border-[0.5px] border-[#1E3A8A]/20 rounded-lg p-3 text-xs text-muted-foreground">
            This will generate a certified English translation that complies with court requirements
          </div>
        </div>

        {/* Footer */}
        <div className="bg-card border-t-[0.5px] border-border px-6 py-4">
          <Button
            onClick={onStartTranslation}
            className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold py-6 text-base"
          >
            <Languages className="w-5 h-5 mr-2" />
            Translate to English
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
