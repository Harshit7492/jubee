import { useState } from 'react';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { IntakeModal } from '@/app/components/precheck/IntakeModal';
import { AnalysisLoadingScreen } from '@/app/components/precheck/AnalysisLoadingScreen';
import { ScrutinyWorkspace } from '@/app/components/precheck/ScrutinyWorkspace';
import { CompilationStepper } from '@/app/components/precheck/CompilationStepper';
import { FinalPreview } from '@/app/components/precheck/FinalPreview';
import { ToolNavigation } from '@/app/components/research-tools/ToolNavigation';

interface PreCheckWorkflowProps {
  onBack: () => void;
  onToolChange?: (tool: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner' | 'precheck') => void;
  activeTool?: 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner' | 'precheck';
}

export interface IntakeData {
  petitioner: string[];
  respondent: string[];
  court: string;
  caseType: string;
  mainFile: File | null;
  annexures: File[];
}

export interface DefectItem {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'suggestion';
  documentName: string;
  pageNumber?: number;
  aiSuggestion?: string;
  status: 'pending' | 'resolved' | 'ignored';
  resolutionType?: 'auto' | 'manual' | 'translation' | 'replace' | 'narration';
}

export interface CompiledDocument {
  id: string;
  name: string;
  order: number;
  pageRange: string;
  bookmarked: boolean;
}

type WorkflowPhase = 'intake' | 'analyzing' | 'scrutiny' | 'compilation' | 'preview';

export function PreCheckWorkflow({ onBack, onToolChange, activeTool }: PreCheckWorkflowProps) {
  const [phase, setPhase] = useState<WorkflowPhase>('intake');
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [defects, setDefects] = useState<DefectItem[]>([]);
  const [compiledDocuments, setCompiledDocuments] = useState<CompiledDocument[]>([]);

  const handleIntakeComplete = (data: IntakeData) => {
    setIntakeData(data);
    
    // Generate mock defects for demonstration
    const mockDefects: DefectItem[] = [
      {
        id: '1',
        category: 'A - Vakalatnama',
        title: 'Vakalatnama not properly stamped',
        description: 'The Vakalatnama requires a proper court fee stamp of Rs. 50/-',
        severity: 'critical',
        documentName: 'Vakalatnama.pdf',
        pageNumber: 1,
        status: 'pending'
      },
      {
        id: '2',
        category: 'B - Translation',
        title: 'Vernacular document without certified translation',
        description: 'Annexure P-3 is in Hindi and requires a certified English translation',
        severity: 'critical',
        documentName: 'Annexure P-3.pdf',
        pageNumber: 15,
        status: 'pending',
        resolutionType: 'translation'
      },
      {
        id: '3',
        category: 'D - Narration',
        title: 'Date mismatch in petition narration',
        description: 'Petition states incident occurred on "1st October 2024" but Annexure P-4 shows "21st March 2024"',
        severity: 'warning',
        documentName: data.mainFile?.name || 'Petition.pdf',
        pageNumber: 7,
        status: 'pending',
        resolutionType: 'narration'
      },
      {
        id: '4',
        category: 'E - Formatting',
        title: 'Page margins not court-compliant',
        description: 'Left margin should be 1.5 inches for binding. Current margin is 1 inch.',
        severity: 'warning',
        documentName: data.mainFile?.name || 'Petition.pdf',
        aiSuggestion: 'Adjust left margin to 1.5 inches throughout the document',
        status: 'pending'
      },
      {
        id: '5',
        category: 'F - Font',
        title: 'Font size inconsistency',
        description: 'Court requires Times New Roman 14pt. Some paragraphs are in 12pt.',
        severity: 'suggestion',
        documentName: data.mainFile?.name || 'Petition.pdf',
        aiSuggestion: 'Standardize all body text to Times New Roman 14pt',
        status: 'pending'
      }
    ];
    
    setDefects(mockDefects);
    // Move to analyzing phase instead of directly to scrutiny
    setPhase('analyzing');
  };

  const handleAnalysisComplete = () => {
    setPhase('scrutiny');
  };

  const handleScrutinyComplete = () => {
    // Generate compiled document structure
    const docs: CompiledDocument[] = [
      { id: '1', name: 'Index', order: 1, pageRange: '1', bookmarked: true },
      { id: '2', name: 'Vakalatnama', order: 2, pageRange: '2-3', bookmarked: true },
      { id: '3', name: intakeData?.mainFile?.name || 'Petition', order: 3, pageRange: '4-25', bookmarked: true },
      { id: '4', name: 'Annexure P-1', order: 4, pageRange: '26-28', bookmarked: true },
      { id: '5', name: 'Annexure P-2', order: 5, pageRange: '29-32', bookmarked: true },
      { id: '6', name: 'Annexure P-3 (Translation)', order: 6, pageRange: '33-35', bookmarked: true },
      { id: '7', name: 'Annexure P-4', order: 7, pageRange: '36-40', bookmarked: true },
    ];
    
    setCompiledDocuments(docs);
    setPhase('compilation');
  };

  const handleCompilationComplete = () => {
    setPhase('preview');
  };

  const handleBackToScrutiny = () => {
    setPhase('scrutiny');
  };

  const handleStartOver = () => {
    setPhase('intake');
    setIntakeData(null);
    setDefects([]);
    setCompiledDocuments([]);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="w-9 h-9 hover:bg-primary/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileSearch className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-foreground">
                  Scrutiny
                </h1>
                <p className="text-sm text-muted-foreground">
                  {phase === 'intake' && 'Prepared for Institutional scrutiny.'}
                  {phase === 'analyzing' && 'Analyzing Documents'}
                  {phase === 'scrutiny' && 'Prepared for Institutional scrutiny.'}
                  {phase === 'compilation' && 'Compiling Final Documents'}
                  {phase === 'preview' && 'Final Review'}
                </p>
              </div>
            </div>

            {/* Tool Navigation */}
            {onToolChange && (
              <ToolNavigation
                activeTool={activeTool || 'precheck'}
                onToolChange={onToolChange}
              />
            )}
          </div>
        </div>
      </header>

      {/* Phase Content */}
      <div className="flex-1 overflow-hidden">
        {phase === 'intake' && (
          <IntakeModal onComplete={handleIntakeComplete} />
        )}
        
        {phase === 'analyzing' && (
          <AnalysisLoadingScreen onComplete={handleAnalysisComplete} />
        )}
        
        {phase === 'scrutiny' && intakeData && (
          <ScrutinyWorkspace
            intakeData={intakeData}
            defects={defects}
            onDefectsUpdate={setDefects}
            onComplete={handleScrutinyComplete}
            onBack={handleStartOver}
          />
        )}
        
        {phase === 'compilation' && (
          <CompilationStepper
            documents={compiledDocuments}
            onDocumentsUpdate={setCompiledDocuments}
            onComplete={handleCompilationComplete}
            onBack={handleBackToScrutiny}
          />
        )}
        
        {phase === 'preview' && intakeData && (
          <FinalPreview
            intakeData={intakeData}
            documents={compiledDocuments}
            onBack={handleBackToScrutiny}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  );
}