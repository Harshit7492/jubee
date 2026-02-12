import { useState } from 'react';
import { XCircle, FileText, Edit, Eye, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, FileCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/components/ui/utils';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { toast } from 'sonner';

interface DefectReportProps {
  onFixDefect: (defectType: string) => void;
  onEditDefect: (defectType: string) => void;
  onIgnoreDefect: (defectType: string) => void;
  onBack?: () => void;
}

export function PreCheckDefectReport({ onFixDefect, onEditDefect, onIgnoreDefect, onBack }: DefectReportProps) {
  const [highlightedDefect, setHighlightedDefect] = useState<string | null>(null);
  const [showAllDocuments, setShowAllDocuments] = useState(false);

  // Simplified to only 2 defects as specified
  const defects = [
    {
      id: 1,
      type: 'Annexure not uploaded',
      severity: 'must-fix',
      description: 'Annexure A-2 mentioned in prayer but not attached',
      solution: 'Upload the missing annexure document or remove the reference from the petition',
      page: 8
    }
  ];

  const mockDocuments = [
    { name: 'Main Petition', pages: 15, type: 'petition' },
    { name: 'Annexure A-1', pages: 3, type: 'annexure' },
    { name: 'Annexure A-3', pages: 5, type: 'annexure' },
    { name: 'Affidavit', pages: 2, type: 'document' }
  ];

  const handleDefectClick = (defectType: string, page: number) => {
    setHighlightedDefect(defectType);
    // Scroll to page in document viewer (simulated)
    toast.info(`Navigating to Page ${page}`, {
      description: 'Document viewer will highlight the error area'
    });
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-background via-background to-[#1E3A8A]/5 p-8">
      <div className="w-full max-w-[1600px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center ring-4 ring-[#1E3A8A]/20">
              <FileCheck className="w-8 h-8 text-[#1E3A8A]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Scrutiny Defect Report</h1>
          <p className="text-muted-foreground">Review and resolve defects found in your document submission</p>

          {/* Back Button */}
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="w-9 h-9 hover:bg-primary/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Defect Report Content */}
        <div className="bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="h-[calc(100vh-300px)] flex gap-4 p-6">
            {/* Left Pane - Defects List */}
            <div className="w-[600px] flex flex-col gap-4">
              {defects.map((defect) => (
                <div
                  key={defect.id}
                  className={cn(
                    "bg-card rounded-xl border-[0.5px] transition-all flex flex-col",
                    highlightedDefect === defect.type
                      ? "border-[#1E3A8A] shadow-lg shadow-[#1E3A8A]/20"
                      : "border-border hover:border-[#1E3A8A]/50"
                  )}
                >
                  {/* Card Header */}
                  <div className="p-5 border-b-[0.5px] border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-foreground mb-2">{defect.type}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-red-50 text-red-600 border-[0.5px] border-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 text-xs font-semibold">
                            MUST FIX
                          </Badge>
                          {defect.page && (
                            <button
                              onClick={() => handleDefectClick(defect.type, defect.page)}
                              className="flex items-center gap-1.5 text-xs text-[#1E3A8A] hover:underline font-semibold"
                            >
                              <Eye className="w-3 h-3" />
                              Page {defect.page}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4 flex-grow bg-card/50 backdrop-blur-md">
                    {/* Error */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Error</p>
                      <p className="text-sm text-foreground leading-relaxed">{defect.description}</p>
                    </div>

                    {/* Solution */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Solution</p>
                      <p className="text-sm text-foreground leading-relaxed">{defect.solution}</p>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="p-4 border-t-[0.5px] border-border flex gap-2 bg-muted/30">
                    <Button
                      onClick={() => onFixDefect(defect.type)}
                      size="sm"
                      className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold h-9"
                    >
                      Fix Now
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditDefect(defect.type)}
                      className="w-9 h-9 p-0 text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onIgnoreDefect(defect.type)}
                      className="flex-1 border-[0.5px] border-border hover:bg-accent font-semibold h-9"
                    >
                      Ignore
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Pane - Document Reference */}
            <div className="flex-1 bg-card border-[0.5px] border-border rounded-xl overflow-hidden flex flex-col backdrop-blur-md">
              {/* Document Header */}
              <div className="px-6 py-4 border-b-[0.5px] border-border bg-gradient-to-r from-[#1E3A8A]/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-foreground">Document Preview</h2>
                      <p className="text-xs text-muted-foreground">Main Petition - Page {highlightedDefect ? defects.find(d => d.type === highlightedDefect)?.page : 1} of 15</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllDocuments(!showAllDocuments)}
                    className="border-[0.5px] border-[#1E3A8A]/30 text-[#1E3A8A] hover:bg-[#1E3A8A]/10 font-semibold"
                  >
                    All Documents
                    {showAllDocuments ? <ChevronUp className="w-3.5 h-3.5 ml-1.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-1.5" />}
                  </Button>
                </div>
              </div>

              {/* Document List (Collapsible) */}
              {showAllDocuments && (
                <div className="px-6 py-4 bg-muted/50 border-b-[0.5px] border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">All Documents</p>
                  <div className="space-y-2">
                    {mockDocuments.map((doc, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border-[0.5px] border-border hover:border-[#1E3A8A]/50 hover:bg-accent transition-all text-left"
                      >
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.pages} pages • {doc.type}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Viewer */}
              <ScrollArea className="flex-1 px-8 py-6">
                <div className="max-w-3xl mx-auto">
                  {/* Mock Document Content */}
                  <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-lg p-12 border-[0.5px] border-border min-h-[800px] relative">
                    {/* Show highlighted area for defect */}
                    {highlightedDefect && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-24 bg-[#1E3A8A]/10 border-2 border-[#1E3A8A] rounded-lg animate-pulse flex items-center justify-center">
                          <p className="text-xs font-bold text-[#1E3A8A]">
                            {highlightedDefect}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Mock Content */}
                    <div className="text-foreground space-y-4" style={{ fontFamily: '"Source Serif Pro", Georgia, serif', fontSize: '14px', lineHeight: '1.8' }}>
                      <h1 className="text-2xl font-bold text-center mb-6">IN THE SUPREME COURT OF INDIA</h1>
                      <p className="text-center font-semibold mb-8">CIVIL ORIGINAL JURISDICTION</p>

                      <div className="mb-8">
                        <p className="font-semibold">Petitioner: <span className="font-normal">ABC Corporation</span></p>
                        <p className="text-center my-2">Versus</p>
                        <p className="font-semibold">Respondent: <span className="font-normal">State of Delhi & Ors.</span></p>
                      </div>

                      <p className="font-semibold text-center mb-4">PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA</p>

                      <p className="mb-4">TO,</p>
                      <p className="mb-4">THE HON'BLE CHIEF JUSTICE OF INDIA<br />AND HIS COMPANION JUSTICES OF THE SUPREME COURT OF INDIA</p>

                      <p className="mb-4">The humble Petition of the Petitioner above-named</p>
                      <p className="mb-6">MOST RESPECTFULLY SHOWETH:</p>

                      <ol className="list-decimal list-inside space-y-4">
                        <li>That the Petitioner is a company incorporated under the Companies Act, 2013, having its registered office at New Delhi, and is engaged in the business of manufacturing and trading of industrial equipment.</li>

                        <li>That the Respondent No. 1 is the State of Delhi, represented through its Chief Secretary, having jurisdiction over the subject matter of the present petition.</li>

                        <li>That the Petitioner has been aggrieved by the arbitrary action of the Respondents in rejecting the tender application without providing adequate reasons, which is in violation of the principles of natural justice.</li>

                        <li>That the Petitioner has filed this petition seeking relief as detailed in the prayer clause, and submits that this Hon'ble Court has the jurisdiction to entertain the same.</li>

                        <li>That the Petitioner relies upon the documents and annexures mentioned herein as Annexure A-1, Annexure A-2, and Annexure A-3, which form an integral part of this petition.</li>
                      </ol>

                      <p className="mt-8 font-semibold">PRAYER</p>
                      <p className="mb-4">In light of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:</p>

                      <ol className="list-alpha list-inside space-y-2">
                        <li>Issue a writ of mandamus directing the Respondents to reconsider the tender application;</li>
                        <li>Pass such other and further orders as this Hon'ble Court may deem fit in the interest of justice;</li>
                        <li>Award costs of this petition.</li>
                      </ol>

                      <div className="mt-12">
                        <p>AND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL DUTY BOUND FOREVER PRAY.</p>
                      </div>

                      <div className="mt-16 text-right">
                        <p className="font-semibold">FILED BY:</p>
                        <p className="mt-2">Advocate for the Petitioner</p>
                        <p className="text-sm text-muted-foreground mt-1">Place: New Delhi</p>
                        <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}