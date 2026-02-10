import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  ChevronRight, ChevronLeft, GripVertical, FileText, Check, SkipForward,
  Hash, BookOpen, FileSearch, Eye
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import type { CompiledDocument } from '@/app/components/research-tools/PreCheckWorkflow';

interface CompilationStepperProps {
  documents: CompiledDocument[];
  onDocumentsUpdate: (documents: CompiledDocument[]) => void;
  onComplete: () => void;
  onBack: () => void;
}

type StepId = 'order' | 'pagination' | 'indexation' | 'bookmarking' | 'ocr';

interface Step {
  id: StepId;
  title: string;
  description: string;
  icon: any;
  skippable: boolean;
}

const steps: Step[] = [
  {
    id: 'order',
    title: 'Arrange Document Order',
    description: 'Set the sequence of documents for court filing',
    icon: FileText,
    skippable: false,
  },
  {
    id: 'pagination',
    title: 'Page Numbering',
    description: 'Apply continuous or section-wise pagination',
    icon: Hash,
    skippable: true,
  },
  {
    id: 'indexation',
    title: 'Generate Index',
    description: 'Create Table of Contents with page numbers',
    icon: BookOpen,
    skippable: true,
  },
  {
    id: 'bookmarking',
    title: 'Digital Bookmarks',
    description: 'Add PDF bookmarks for easy navigation',
    icon: BookOpen,
    skippable: true,
  },
  {
    id: 'ocr',
    title: 'OCR & Searchability',
    description: 'Ensure all documents are text-searchable',
    icon: FileSearch,
    skippable: false,
  },
];

interface DraggableDocumentProps {
  document: CompiledDocument;
  index: number;
  moveDocument: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableDocument({ document, index, moveDocument }: DraggableDocumentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'document',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'document',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveDocument(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-3 p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-primary">{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{document.name}</p>
        <p className="text-xs text-muted-foreground">Pages: {document.pageRange}</p>
      </div>
      <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </div>
  );
}

export function CompilationStepper({
  documents,
  onDocumentsUpdate,
  onComplete,
  onBack,
}: CompilationStepperProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [skippedSteps, setSkippedSteps] = useState<Set<StepId>>(new Set());

  // Step-specific state
  const [paginationMode, setPaginationMode] = useState<'continuous' | 'sectional'>('continuous');
  const [enableIndexation, setEnableIndexation] = useState(true);
  const [enableBookmarking, setEnableBookmarking] = useState(true);
  const [ocrProgress, setOcrProgress] = useState(0);

  const currentStep = steps[currentStepIndex];

  const moveDocument = (dragIndex: number, hoverIndex: number) => {
    const updatedDocs = [...documents];
    const [draggedDoc] = updatedDocs.splice(dragIndex, 1);
    updatedDocs.splice(hoverIndex, 0, draggedDoc);
    
    // Update order numbers
    const reordered = updatedDocs.map((doc, index) => ({
      ...doc,
      order: index + 1,
    }));
    
    onDocumentsUpdate(reordered);
  };

  const handleNext = () => {
    setCompletedSteps(new Set(completedSteps).add(currentStep.id));
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    setSkippedSteps(new Set(skippedSteps).add(currentStep.id));
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      onBack();
    }
  };

  const simulateOCR = () => {
    setOcrProgress(0);
    const interval = setInterval(() => {
      setOcrProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'order':
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Filing Sequence</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag and drop to reorder documents
                  </p>
                </div>
                <Badge variant="outline" className="font-semibold">
                  {documents.length} Documents
                </Badge>
              </div>
              
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <DraggableDocument
                    key={doc.id}
                    document={doc}
                    index={index}
                    moveDocument={moveDocument}
                  />
                ))}
              </div>
            </div>
          </DndProvider>
        );

      case 'pagination':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Page Numbering Style</h3>
              <p className="text-sm text-muted-foreground">
                Sequential numbering from 1 to N across all documents
              </p>
            </div>

            <div className="p-5 rounded-xl border-2 border-[#008080] bg-[#008080]/5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#008080]">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Continuous Pagination</h4>
                  <p className="text-sm text-muted-foreground">
                    Sequential numbering from 1 to N across all documents (e.g., 1, 2, 3... 45)
                  </p>
                </div>
                <Check className="w-5 h-5 text-[#008080] flex-shrink-0" />
              </div>
            </div>
          </div>
        );

      case 'indexation':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Table of Contents</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically generate an index with document titles and page numbers
                </p>
              </div>
              <Switch
                checked={enableIndexation}
                onCheckedChange={setEnableIndexation}
                className="data-[state=checked]:bg-[#008080]"
              />
            </div>

            {enableIndexation && (
              <>
                <div className="p-6 rounded-xl border-2 border-border bg-card">
                  <h4 className="font-semibold text-foreground text-sm mb-4 text-center">Index Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="font-semibold text-foreground">S. No.</span>
                      <span className="font-semibold text-foreground flex-1 text-center">Document</span>
                      <span className="font-semibold text-foreground">Page(s)</span>
                    </div>
                    {documents.map((doc, index) => (
                      <div key={doc.id} className="flex items-center justify-between py-2 text-muted-foreground">
                        <span className="w-12">{index + 1}.</span>
                        <span className="flex-1">{doc.name}</span>
                        <span className="w-16 text-right">{doc.pageRange}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-2 text-muted-foreground">
                      <span className="w-12">8.</span>
                      <span className="flex-1">Application</span>
                      <span className="w-16 text-right">46-50</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!enableIndexation && (
              <div className="p-6 rounded-xl border-2 border-dashed border-border bg-accent/20 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Index generation disabled. You can add it manually later.
                </p>
              </div>
            )}
          </div>
        );

      case 'bookmarking':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-2">PDF Bookmarks</h3>
                <p className="text-sm text-muted-foreground">
                  Add digital bookmarks for easy navigation in the compiled PDF
                </p>
              </div>
              <Switch
                checked={enableBookmarking}
                onCheckedChange={setEnableBookmarking}
                className="data-[state=checked]:bg-[#008080]"
              />
            </div>

            {enableBookmarking && (
              <>
                <div className="p-6 rounded-xl border-2 border-border bg-card">
                  <h4 className="font-semibold text-foreground text-sm mb-4">Bookmark Structure</h4>
                  <div className="space-y-1 text-sm">
                    {documents.map((doc, index) => (
                      <div key={doc.id} className="flex items-center gap-2 py-2 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {index > 0 && <div className="w-4 h-px bg-border" />}
                          <BookOpen className="w-4 h-4 text-[#008080]" />
                        </div>
                        <span className="font-medium">{doc.name}</span>
                        <span className="text-xs">({doc.pageRange})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!enableBookmarking && (
              <div className="p-6 rounded-xl border-2 border-dashed border-border bg-accent/20 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Bookmarking disabled. The PDF will not have navigation bookmarks.
                </p>
              </div>
            )}
          </div>
        );

      case 'ocr':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">OCR & Text Searchability</h3>
              <p className="text-sm text-muted-foreground">
                Ensure all scanned documents are OCR-enabled and fully searchable
              </p>
            </div>

            {ocrProgress === 0 && (
              <div className="p-8 rounded-xl border-2 border-dashed border-border bg-accent/20 text-center">
                <FileSearch className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="font-semibold text-foreground mb-2">Ready to Process</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Click the button below to scan and apply OCR to all documents
                </p>
                <Button
                  onClick={simulateOCR}
                  className="bg-gradient-to-r from-primary to-[#008080] hover:from-primary/90 hover:to-[#008080]/90 text-white font-semibold shadow-lg"
                >
                  <FileSearch className="w-4 h-4 mr-2" />
                  Start OCR Processing
                </Button>
              </div>
            )}

            {ocrProgress > 0 && ocrProgress < 100 && (
              <div className="p-6 rounded-xl border-2 border-[#008080]/30 bg-[#008080]/5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-foreground">Processing documents...</p>
                  <span className="text-2xl font-bold text-[#008080]">{ocrProgress}%</span>
                </div>
                <div className="h-3 bg-accent rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-[#008080] transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Applying optical character recognition to scanned pages...
                </p>
              </div>
            )}

            {ocrProgress === 100 && (
              <div className="p-6 rounded-xl border-2 border-green-500/30 bg-green-50 dark:bg-green-900/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">OCR Complete</p>
                    <p className="text-sm text-muted-foreground">All documents are now searchable</p>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{doc.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStep.id === 'ocr') {
      return ocrProgress === 100;
    }
    return true;
  };

  return (
    <div className="h-full flex bg-[#F9F9F9] dark:bg-background">
      {/* Left Sidebar - Stepper Progress */}
      <div className="w-80 border-r border-border/50 bg-card flex flex-col">
        <div className="px-6 py-5 border-b border-border/50 bg-accent/20">
          <h3 className="font-bold text-foreground mb-1">Compilation Pipeline</h3>
          <p className="text-xs text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isSkipped = skippedSteps.has(step.id);
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-5 top-12 w-0.5 h-12 ${
                        isCompleted || isSkipped ? 'bg-[#008080]' : 'bg-border'
                      }`}
                    />
                  )}

                  {/* Step Card */}
                  <div
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isCurrent
                        ? 'border-[#008080] bg-[#008080]/5 shadow-lg'
                        : isCompleted
                        ? 'border-green-500/30 bg-green-50 dark:bg-green-900/10'
                        : isSkipped
                        ? 'border-border/50 bg-accent/20'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Step Icon/Status */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isCurrent
                            ? 'bg-[#008080] text-white'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : isSkipped
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-accent text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : isSkipped ? (
                          <SkipForward className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold text-sm mb-1 ${
                            isCurrent
                              ? 'text-foreground'
                              : isSkipped
                              ? 'text-muted-foreground line-through'
                              : 'text-foreground'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                        {step.skippable && !isCompleted && !isSkipped && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Optional
                          </Badge>
                        )}
                        {isSkipped && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            Skipped
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-8 max-w-4xl mx-auto">
            {/* Step Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#008080]/10 flex items-center justify-center">
                  <currentStep.icon className="w-6 h-6 text-[#008080]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{currentStep.title}</h2>
                  <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {renderStepContent()}
          </div>
        </ScrollArea>

        {/* Footer Navigation */}
        <div className="px-8 py-5 border-t border-border/50 bg-card">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={handleBack}
              className="font-semibold"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <div className="flex gap-3">
              {currentStep.skippable && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="font-semibold"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-primary to-[#008080] hover:from-primary/90 hover:to-[#008080]/90 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                {currentStepIndex === steps.length - 1 ? 'Complete' : 'Next Step'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}