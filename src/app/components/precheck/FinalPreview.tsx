import { Download, Save, Eye, CheckCircle, FileText, RotateCcw, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { toast } from 'sonner';
import { MySpaceSaveDialog } from '@/app/components/MySpaceSaveDialog';
import { useState } from 'react';
import type { IntakeData, CompiledDocument } from '@/app/components/research-tools/PreCheckWorkflow';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface FinalPreviewProps {
  intakeData: IntakeData;
  documents: CompiledDocument[];
  onBack: () => void;
  onStartOver: () => void;
}

export function FinalPreview({ intakeData, documents, onBack, onStartOver }: FinalPreviewProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'doc'>('pdf');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'doc'>('pdf');

  const handleExport = (format: 'pdf' | 'doc') => {
    toast.success(`Court-compliant filing exported as ${format.toUpperCase()} successfully!`);
  };

  const handleSaveComplete = () => {
    toast.success('Filing saved to My Space');
    setShowSaveDialog(false);
  };

  const totalPages = documents.reduce((acc, doc) => {
    const range = doc.pageRange.split('-');
    const endPage = parseInt(range[range.length - 1]);
    return Math.max(acc, endPage);
  }, 0);

  return (
    <div className="h-full flex bg-[#F9F9F9] dark:bg-background">
      {/* Left Sidebar - Filing Summary */}
      <div className="w-80 border-r border-border/50 bg-card flex flex-col">
        <div className="px-6 py-5 border-b border-border/50 bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Ready to File</h3>
              <p className="text-xs text-muted-foreground">All checks passed</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-6">
            {/* Case Details */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Case Details</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Court</p>
                  <p className="text-sm font-semibold text-foreground">
                    {intakeData.court === 'supreme-court' ? 'Supreme Court of India' : 'Delhi High Court'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Case Type</p>
                  <Badge variant="outline" className="font-semibold">
                    {intakeData.caseType.replace(/-/g, ' ').toUpperCase()}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Petitioner</p>
                  <p className="text-sm font-medium text-foreground">{intakeData.petitioner}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Respondent</p>
                  <p className="text-sm font-medium text-foreground">{intakeData.respondent}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Filing Statistics */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Filing Statistics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Documents</span>
                  <span className="text-sm font-bold text-foreground">{documents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Pages</span>
                  <span className="text-sm font-bold text-foreground">{totalPages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Defects Cured</span>
                  <span className="text-sm font-bold text-green-500">5/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">OCR Status</span>
                  <Badge className="bg-green-500 text-white font-semibold text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Features Applied */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Applied Features</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Continuous page numbering</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Table of contents generated</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Digital bookmarks added</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>OCR-enabled & searchable</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Court-compliant formatting</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Archive Status */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <h4 className="text-sm font-semibold text-foreground">Archive Status</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scrutiny history and all resolved defect logs have been archived for future reference.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Content Area - Document Preview */}
      <div className="flex-1 flex flex-col">
        {/* Header Actions */}
        <div className="px-8 py-5 border-b border-border/50 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Final Court-Compliant Filing</h2>
              <p className="text-sm text-muted-foreground">Preview your compiled petition ready for e-filing</p>
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-primary to-[#008080] hover:from-primary/90 hover:to-[#008080]/90 text-white font-semibold shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Filing
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => {
                      setExportFormat('pdf');
                      handleExport('pdf');
                    }}
                    className="cursor-pointer font-semibold"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setExportFormat('doc');
                      handleExport('doc');
                    }}
                    className="cursor-pointer font-semibold"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as DOC
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-primary to-[#008080] hover:from-primary/90 hover:to-[#008080]/90 text-white font-semibold shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save to My Space
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedFormat('pdf');
                      setShowSaveDialog(true);
                    }}
                    className="cursor-pointer font-semibold"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedFormat('doc');
                      setShowSaveDialog(true);
                    }}
                    className="cursor-pointer font-semibold"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Save as DOC
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Document Preview */}
        <ScrollArea className="flex-1 min-h-0 bg-[#E5E5E5] dark:bg-background">
          <div className="p-8 min-h-full">
            <div className="max-w-4xl mx-auto pb-8">
              {/* Preview Card */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                {/* Document Header */}
                <div className="px-12 py-8 bg-gradient-to-b from-card to-accent/20 border-b border-border">
                  <div className="text-center space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      IN THE {intakeData.court === 'supreme-court' ? 'SUPREME COURT OF INDIA' : 'HIGH COURT OF DELHI AT NEW DELHI'}
                    </p>
                    <p className="text-sm text-muted-foreground">{intakeData.caseType.replace(/-/g, ' ').toUpperCase()} NO. _____ OF 2024</p>

                    <div className="py-6 space-y-3">
                      <div>
                        <p className="font-bold text-lg text-foreground">{intakeData.petitioner}</p>
                        <p className="text-sm text-muted-foreground">...Petitioner</p>
                      </div>

                      <p className="text-muted-foreground font-semibold">versus</p>

                      <div>
                        <p className="font-bold text-lg text-foreground">{intakeData.respondent}</p>
                        <p className="text-sm text-muted-foreground">...Respondent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Index/Table of Contents */}
                <div className="px-12 py-8 border-b border-border">
                  <h3 className="text-center font-bold text-foreground mb-6">INDEX</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left py-2 font-bold text-foreground">S. No.</th>
                        <th className="text-left py-2 font-bold text-foreground">Particulars</th>
                        <th className="text-right py-2 font-bold text-foreground">Page No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, index) => (
                        <tr key={doc.id} className="border-b border-border/50">
                          <td className="py-3 text-muted-foreground">{index + 1}.</td>
                          <td className="py-3 text-foreground font-medium">{doc.name}</td>
                          <td className="py-3 text-right text-muted-foreground">{doc.pageRange}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sample Content Preview */}
                <div className="px-12 py-8 space-y-6 text-sm leading-relaxed">
                  <div className="text-center">
                    <p className="font-bold text-foreground mb-2">PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA</p>
                    <p className="text-xs text-muted-foreground">(Preview - First Page)</p>
                  </div>

                  <div className="space-y-4 text-justify">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">TO,</span><br />
                      The Hon'ble Chief Justice and His Companion Justices of the {intakeData.court === 'supreme-court' ? 'Supreme Court of India' : 'High Court of Delhi'}
                    </p>

                    <p className="text-muted-foreground">
                      The humble petition of the Petitioner above named respectfully showeth:
                    </p>

                    <div className="space-y-3">
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">1.</span> That the petitioner is filing the present petition seeking the following reliefs...
                      </p>

                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">2.</span> That the petitioner is a law-abiding citizen and has been residing at the said property for over 20 years with valid ownership documents...
                      </p>

                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">3.</span> That the actions of the respondent are arbitrary, illegal, and in violation of the principles of natural justice...
                      </p>
                    </div>

                    <div className="py-4 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent border border-border">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Full document preview available after export</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page Number Footer */}
                <div className="px-12 py-4 border-t border-border bg-accent/20">
                  <p className="text-center text-xs text-muted-foreground">- Page 1 of {totalPages} -</p>
                </div>
              </div>

              {/* Success Banner */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-2 border-green-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg mb-2">Registry-Compliant Filing Ready!</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Your petition has been successfully scrutinized, all defects have been cured, and the filing
                      has been compiled according to court standards. The document is ready for e-filing submission.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">All Registry checks passed</span>
                      <span>•</span>
                      <span>Scrutiny logs archived</span>
                      <span>•</span>
                      <span>Ready for {intakeData.court === 'supreme-court' ? 'Supreme Court' : 'Delhi High Court'} filing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-border/50 bg-card">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={onStartOver}
                className="font-semibold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New Pre-Check
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <MySpaceSaveDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          format={selectedFormat}
          onSave={(folderPath, fileName, format) => {
            toast.success(`Filing saved to ${folderPath}/${fileName} (${format.toUpperCase()})`);
            setShowSaveDialog(false);
          }}
          defaultFileName={`${intakeData.petitioner.split(' ')[0]} v. ${intakeData.respondent.split(' ')[0]} - Pre-Check Filing.pdf`}
        />
      )}
    </div>
  );
}