import { useState, useEffect } from 'react';
import { X, Minimize2, Maximize2, Save, FileDown, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Table, Type, Undo, Redo, Search, Printer, ChevronLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface MSWordWindowProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onContentChange: (content: string) => void;
  fileName: string;
  onSave?: () => void;
  courtFormat?: {
    font: string;
    fontSize: number;
    lineSpacing: number;
  };
  isFullWindow?: boolean;
  highlightedText?: string;
  saveButtonText?: string;
}

export function MSWordWindow({ isOpen, onClose, content, onContentChange, fileName, onSave, courtFormat, isFullWindow, highlightedText, saveButtonText }: MSWordWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [editableContent, setEditableContent] = useState(content);

  // Update editableContent when content prop changes
  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  if (!isOpen) return null;

  const handleContentEdit = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerText;
    setEditableContent(newContent);
  };

  const handleSaveToJubee = () => {
    onContentChange(editableContent);
    onSave?.();
    onClose();
  };

  // Helper function to highlight specific text
  const getHighlightedContent = (text: string, highlightText?: string) => {
    if (!highlightText) {
      return text.replace(/\n/g, '<br/>');
    }

    const highlighted = text.replace(
      new RegExp(`(${highlightText})`, 'gi'),
      '<mark style="background-color: #1E3A8A20; color: inherit; padding: 2px 0;">$1</mark>'
    );

    return highlighted.replace(/\n/g, '<br/>');
  };

  return (
    <div className={`${isFullWindow ? 'w-full h-screen' : 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'}`}>
      <div
        className={`bg-background ${isFullWindow ? '' : 'border border-border shadow-2xl'} flex flex-col transition-all duration-300 ${isFullWindow ? 'w-full h-full' : isMaximized ? 'w-full h-full' : 'w-[95%] h-[95%] rounded-xl'
          }`}
      >
        {/* MS Word Title Bar */}
        <div className="bg-card border-b border-border flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 bg-black dark:bg-black border-border/60 hover:border-primary/50 hover:bg-black"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileDown className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground">Microsoft Word - Jubee Translation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <Maximize2 className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
              title="Close"
            >
              <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
            </button>
          </div>
        </div>

        {/* MS Word Menu Bar */}
        <div className="bg-card border-b border-border px-4 py-2">
          <div className="flex items-center gap-6 text-sm">
            <button className="font-medium text-foreground hover:text-primary transition-colors">File</button>
            <button className="font-medium text-foreground hover:text-primary transition-colors">Home</button>
            <button className="font-medium text-foreground hover:text-primary transition-colors">Insert</button>
            <button className="font-medium text-foreground hover:text-primary transition-colors">Layout</button>
            <button className="font-medium text-foreground hover:text-primary transition-colors">References</button>
            <button className="font-medium text-foreground hover:text-primary transition-colors">Review</button>
            <button className="font-medium text-foreground hover:text-primary transition-colors">View</button>
          </div>
        </div>

        {/* MS Word Ribbon/Toolbar */}
        <div className="bg-black dark:bg-black border-b border-border px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1 pr-4 border-r border-border">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Undo">
                <Undo className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Redo">
                <Redo className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Font Formatting */}
            <div className="flex items-center gap-1 pr-4 border-r border-border">
              <select className="h-8 px-3 text-sm bg-background border border-border rounded-lg text-foreground">
                <option>Times New Roman</option>
                <option>Arial</option>
                <option>Calibri</option>
              </select>
              <select className="h-8 px-3 text-sm bg-background border border-border rounded-lg text-foreground w-16">
                <option>14</option>
                <option>12</option>
                <option>16</option>
              </select>
            </div>

            {/* Text Formatting */}
            <div className="flex items-center gap-1 pr-4 border-r border-border">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Bold">
                <Bold className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Italic">
                <Italic className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Underline">
                <Underline className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 pr-4 border-r border-border">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Align Left">
                <AlignLeft className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Align Center">
                <AlignCenter className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Align Right">
                <AlignRight className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Justify">
                <AlignJustify className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 pr-4 border-r border-border">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Bullet List">
                <List className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Numbered List">
                <ListOrdered className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Other Tools */}
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Insert Table">
                <Table className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Find">
                <Search className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Print">
                <Printer className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Document Editor */}
        <div className="flex-1 overflow-y-auto bg-[#F9F9F9] dark:bg-background p-8">
          <div className="max-w-[8.5in] mx-auto">
            {/* MS Word Page */}
            <div className="bg-black dark:bg-black shadow-2xl min-h-[11in] p-[1in] border border-border/50">
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={handleContentEdit}
                className="focus:outline-none text-white"
                style={{
                  fontFamily: courtFormat?.font || 'Times New Roman',
                  fontSize: `${courtFormat?.fontSize || 14}pt`,
                  lineHeight: courtFormat?.lineSpacing || 2.0,
                }}
                dangerouslySetInnerHTML={{ __html: getHighlightedContent(content, highlightedText) }}
              />
            </div>
          </div>
        </div>

        {/* MS Word Status Bar & Actions */}
        <div className="border-t border-border bg-card px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>Page: 1 of 1</span>
              <span>Words: {editableContent.split(/\s+/).length}</span>
              <span className="flex items-center gap-1.5">
                <Type className="w-3 h-3" />
                {courtFormat?.font} - {courtFormat?.fontSize}pt
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="h-9 bg-black dark:bg-black border-border/60 hover:border-primary/50 hover:bg-black"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveToJubee}
                className="h-9 bg-primary hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveButtonText || "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}