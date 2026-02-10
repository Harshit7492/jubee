import { useState } from 'react';
import { X, FileText, RotateCcw, Edit3, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';

interface SelectiveTranslationWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPages: number[];
  totalPages: number;
  onApprove: (translatedContent: string) => void;
  onEdit: (content: string) => void;
  onRedo: () => void;
}

export function SelectiveTranslationWorkspace({
  isOpen,
  onClose,
  selectedPages,
  totalPages,
  onApprove,
  onEdit,
  onRedo
}: SelectiveTranslationWorkspaceProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [translatedContent, setTranslatedContent] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const currentPage = selectedPages[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === selectedPages.length - 1;

  // Mock original (vernacular) content
  const originalContent = `निविदा सूचना संख्या: DDA/2023/045

दिल्ली विकास प्राधिकरण

विषय: द्वारका सेक्टर 12 में प्लॉट आवंटन

सेवा में,
श्री राजेश कुमार शर्मा
प्लॉट संख्या 45, सेक्टर 12
द्वारका, नई दिल्ली - 110075

महोदय,

आपके दिनांक 15 जनवरी 2023 के आवेदन के संदर्भ में, यह सूचित किया जाता है कि प्लॉट संख्या 45, सेक्टर 12, द्वारका में आपका आवंटन रद्द कर दिया गया है।

यह निर्णय दिल्ली विकास प्राधिकरण अधिनियम 1957 की धारा 12(3) के तहत लिया गया है।

किसी भी स्पष्टीकरण के लिए कृपया हमारे कार्यालय से संपर्क करें।

भवदीय,
संजय कुमार
उप निदेशक (आवंटन)
दिल्ली विकास प्राधिकरण

दिनांक: 15 अप्रैल 2023`;

  // Mock translated content
  const mockTranslatedContent = `TENDER NOTICE NO: DDA/2023/045

DELHI DEVELOPMENT AUTHORITY

Subject: Plot Allotment in Dwarka Sector 12

To,
Shri Rajesh Kumar Sharma
Plot No. 45, Sector 12
Dwarka, New Delhi - 110075

Dear Sir,

With reference to your application dated 15th January 2023, this is to inform you that your allotment of Plot No. 45, Sector 12, Dwarka has been cancelled.

This decision has been taken under Section 12(3) of the Delhi Development Authority Act, 1957.

For any clarification, please contact our office.

Yours faithfully,
Sanjay Kumar
Deputy Director (Allotment)
Delhi Development Authority

Date: 15th April 2023`;

  const handleApprove = () => {
    onApprove(mockTranslatedContent);
  };

  const handleEdit = () => {
    onEdit(mockTranslatedContent);
  };

  const goToNextPage = () => {
    if (!isLastPage) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-slate-900 border-[0.5px] border-[#1E3A8A]/30 dark:border-[#1E3A8A] rounded-2xl shadow-2xl w-full max-w-[1400px] h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 border-b-[0.5px] border-[#1E3A8A]/20 dark:border-[#1E3A8A]/40 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-[#1E3A8A]" />
              <div>
                <h3 className="text-lg font-bold text-[#1E3A8A] dark:text-[#1E3A8A]">Translation Comparison</h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
                  Page {currentPage} of {totalPages} • Annexure P-5.pdf
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

        {/* Split Screen Content */}
        <div className="flex-1 flex min-h-0">
          {/* Left: Original (Vernacular) */}
          <div className="w-1/2 flex flex-col border-r-[0.5px] border-border dark:border-white/10">
            <div className="bg-accent/30 dark:bg-slate-800/50 border-b-[0.5px] border-border dark:border-white/10 px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <p className="text-sm font-semibold text-foreground dark:text-white">Original (Hindi)</p>
              </div>
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-8">
                <div className="bg-white dark:bg-slate-800 border-[0.5px] border-border dark:border-white/20 rounded-xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground dark:text-slate-300">
                  {originalContent}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right: Translated (English) */}
          <div className="w-1/2 flex flex-col">
            <div className="bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 border-b-[0.5px] border-[#1E3A8A]/20 dark:border-[#1E3A8A]/40 px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1E3A8A] animate-pulse" />
                <p className="text-sm font-semibold text-[#1E3A8A]">Translated (English)</p>
              </div>
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-8">
                <div className="bg-white dark:bg-slate-700 border-[0.5px] border-[#1E3A8A]/30 dark:border-[#1E3A8A] rounded-xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-900 dark:text-slate-100 shadow-lg ring-2 ring-[#1E3A8A]/20 dark:ring-[#1E3A8A]/40">
                  {mockTranslatedContent}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer - Action Trio + Navigation */}
        <div className="bg-accent/30 dark:bg-slate-800/50 border-t-[0.5px] border-border dark:border-white/10 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                onClick={goToPreviousPage}
                disabled={isFirstPage}
                variant="outline"
                size="sm"
                className="border-[0.5px] border-border dark:border-white/30 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground dark:text-slate-400 min-w-[100px] text-center">
                {currentPageIndex + 1} of {selectedPages.length}
              </span>
              <Button
                onClick={goToNextPage}
                disabled={isLastPage}
                variant="outline"
                size="sm"
                className="border-[0.5px] border-border dark:border-white/30 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Trio */}
            <div className="flex items-center gap-3">
              <Button
                onClick={onRedo}
                variant="outline"
                className="border-[0.5px] border-[#1E3A8A]/30 dark:border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10 dark:hover:bg-[#1E3A8A]/20"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Redo
              </Button>
              <Button
                onClick={handleEdit}
                variant="outline"
                className="border-[0.5px] border-[#1E3A8A]/30 dark:border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10 dark:hover:bg-[#1E3A8A]/20"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}