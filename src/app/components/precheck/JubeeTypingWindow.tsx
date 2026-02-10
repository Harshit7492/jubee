import { useState } from 'react';
import { X, Save, FileCheck, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface JubeeTypingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  court: string;
  initialContent: string;
  onSave: (content: string) => void;
  onReplace: (content: string) => void;
}

export function JubeeTypingWindow({
  isOpen,
  onClose,
  fileName,
  court,
  initialContent,
  onSave,
  onReplace,
}: JubeeTypingWindowProps) {
  const [content, setContent] = useState(initialContent);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-[100] p-4">
      <div className="bg-card border-[0.5px] border-[#1E3A8A]/30 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 border-b-[0.5px] border-[#1E3A8A]/20 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/20 flex items-center justify-center">
                <Type className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E3A8A]">Jubee Typing</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Court-Compliant Formatting · {court}
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

        {/* Court Template Info */}
        <div className="bg-[#F9F9F9] border-b-[0.5px] border-border px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-muted-foreground">Font:</span>
                <span className="ml-2 font-semibold text-foreground">Times New Roman 12pt</span>
              </div>
              <div>
                <span className="text-muted-foreground">Line Spacing:</span>
                <span className="ml-2 font-semibold text-foreground">1.5</span>
              </div>
              <div>
                <span className="text-muted-foreground">Margins:</span>
                <span className="ml-2 font-semibold text-foreground">Left 1.5" · Others 1"</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1E3A8A]/10 border-[0.5px] border-[#1E3A8A]/30 rounded-lg">
              <div className="w-2 h-2 bg-[#1E3A8A] rounded-full" />
              <span className="text-xs font-semibold text-[#1E3A8A]">Court Template Applied</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-card border-b-[0.5px] border-border px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r-[0.5px] border-border pr-3">
              <button
                onClick={() => setIsBold(!isBold)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isBold
                    ? 'bg-[#1E3A8A]/20 text-[#1E3A8A]'
                    : 'hover:bg-accent text-muted-foreground'
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsItalic(!isItalic)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isItalic
                    ? 'bg-[#1E3A8A]/20 text-[#1E3A8A]'
                    : 'hover:bg-accent text-muted-foreground'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsUnderline(!isUnderline)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isUnderline
                    ? 'bg-[#1E3A8A]/20 text-[#1E3A8A]'
                    : 'hover:bg-accent text-muted-foreground'
                }`}
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1">
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
                title="Justify"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            <div className="ml-auto text-xs text-muted-foreground">
              Editing: {fileName}
            </div>
          </div>
        </div>

        {/* Document Editor */}
        <div className="flex-1 overflow-y-auto bg-[#F9F9F9] p-8">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Page Content */}
            <div 
              className="p-16"
              style={{
                paddingLeft: '1.5in',
                paddingRight: '1in',
                paddingTop: '1in',
                paddingBottom: '1in',
              }}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[800px] border-none outline-none resize-none bg-transparent"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  fontSize: '12pt',
                  lineHeight: '1.5',
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: isUnderline ? 'underline' : 'none',
                }}
                placeholder="Start typing your document..."
              />
            </div>
          </div>
        </div>

        {/* Footer - Dual CTAs */}
        <div className="bg-card border-t-[0.5px] border-border px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              All formatting changes are automatically applied according to {court} requirements
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => onSave(content)}
                variant="outline"
                className="border-[0.5px] border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/5 font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={() => onReplace(content)}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Replace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
