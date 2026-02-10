import { useState } from 'react';
import { X, FileText, ChevronDown, Settings, Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface JubeeTypingSetupProps {
  onSave?: () => void;
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileSize: string;
  preSelectedCourt: string;
  initialContent: string;
  onContinue: (selectedCourt: string, content: string) => void;
}

export function JubeeTypingSetup({
  isOpen,
  onClose,
  fileName,
  fileSize,
  preSelectedCourt,
  initialContent,
  onContinue,
  onSave,
}: JubeeTypingSetupProps) {
  const [selectedCourt, setSelectedCourt] = useState(preSelectedCourt);
  const [showCustomize, setShowCustomize] = useState(false);

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-[100] p-4">
      <div className="bg-card border-[0.5px] border-[#1E3A8A]/30 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
        {/* File Header */}
        <div className="bg-[#1E3A8A]/5 border-b-[0.5px] border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{fileName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{fileSize}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs font-semibold text-[#1E3A8A]">PDF</span>
                </div>
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
          {/* Court Selection */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              Select Court <span className="text-muted-foreground font-normal">(Optional)</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {courts.map((court) => (
                <button
                  key={court.id}
                  onClick={() => setSelectedCourt(court.id)}
                  className={`p-4 border-[0.5px] rounded-xl text-left transition-all ${
                    selectedCourt === court.id
                      ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                      : 'border-border bg-background hover:border-[#1E3A8A]/50 hover:bg-[#1E3A8A]/5'
                  }`}
                >
                  <p className="font-bold text-foreground mb-3">{court.name}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Font: {court.font}</p>
                    <p>Size: {court.size}</p>
                    <p>Spacing: {court.spacing}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Tip */}
            <div className="mt-4 flex items-start gap-2 p-3 bg-[#1E3A8A]/5 border-[0.5px] border-[#1E3A8A]/20 rounded-lg">
              <Lightbulb className="w-4 h-4 text-[#1E3A8A] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-[#1E3A8A]">Tip:</span> Selecting the court will allow us to change the document into the desired court-prescribed format.
              </p>
            </div>
          </div>

          {/* Customize Formatting - Collapsible */}
          <div>
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className="w-full flex items-center justify-between p-3 hover:bg-accent/50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-sm font-bold text-foreground">Customize Formatting</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showCustomize ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showCustomize && (
              <div className="mt-3 p-4 bg-accent/30 border-[0.5px] border-border rounded-xl space-y-4">
                {/* Font Family */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Font Family
                  </label>
                  <select className="w-full px-3 py-2 border-[0.5px] border-border rounded-lg text-sm bg-background">
                    <option>Times New Roman</option>
                    <option>Arial</option>
                    <option>Calibri</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Font Size
                  </label>
                  <select className="w-full px-3 py-2 border-[0.5px] border-border rounded-lg text-sm bg-background">
                    <option>12pt</option>
                    <option>14pt</option>
                    <option>16pt</option>
                  </select>
                </div>

                {/* Line Spacing */}
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-2">
                    Line Spacing
                  </label>
                  <select className="w-full px-3 py-2 border-[0.5px] border-border rounded-lg text-sm bg-background">
                    <option>1</option>
                    <option>1.5</option>
                    <option>2</option>
                  </select>
                </div>

                {/* Margins */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-2">
                      Left Margin
                    </label>
                    <input
                      type="text"
                      defaultValue="1.5 in"
                      className="w-full px-3 py-2 border-[0.5px] border-border rounded-lg text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-2">
                      Right Margin
                    </label>
                    <input
                      type="text"
                      defaultValue="1 in"
                      className="w-full px-3 py-2 border-[0.5px] border-border rounded-lg text-sm bg-background"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-card border-t-[0.5px] border-border px-6 py-4">
          <Button
            onClick={() => onContinue(selectedCourt, initialContent)}
            className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold py-6 text-base"
          >
            Apply Formatting
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}