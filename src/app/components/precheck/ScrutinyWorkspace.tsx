import { useState } from 'react';
import {
  FileText, Upload, Edit3, X, ChevronRight, FolderOpen, FileUp, Loader2, ChevronDown, File, MessageSquare, Send, Trash2, RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { toast } from 'sonner';
import { MSWordWindow } from '@/app/components/MSWordWindow';
import { MySpacePickerDialog } from '@/app/components/MySpacePickerDialog';
import { TranslationWorkspace } from '@/app/components/precheck/TranslationWorkspace';
import { TranslationChoiceModal } from '@/app/components/precheck/TranslationChoiceModal';
import { TranslationSetup } from '@/app/components/precheck/TranslationSetup';
import { FormatMismatchModal } from '@/app/components/precheck/FormatMismatchModal';
import { JubeeTypingSetup } from '@/app/components/precheck/JubeeTypingSetup';
import { SelectiveTranslationModal } from '@/app/components/precheck/SelectiveTranslationModal';
import { SelectiveTranslationWorkspace } from '@/app/components/precheck/SelectiveTranslationWorkspace';
import { PageReplacementModal } from '@/app/components/precheck/PageReplacementModal';
import { NarrationMismatchModal } from '@/app/components/precheck/NarrationMismatchModal';
import type { IntakeData } from '@/app/components/research-tools/PreCheckWorkflow';
import jubeeLogo from '@/assets/jubee-logo.png';

interface ScrutinyWorkspaceProps {
  intakeData: IntakeData;
  defects: any[];
  onDefectsUpdate: (defects: any[]) => void;
  onComplete: () => void;
  onBack: () => void;
}

// Specific defect items
interface SpecificDefect {
  id: string;
  title: string;
  description: string;
  documentName: string;
  pageNumber?: number;
  status: 'pending' | 'resolved' | 'ignored';
}

// Resolve Missing Annexure Modal - Main Resolution Popup
function ResolveMissingAnnexureModal({
  isOpen,
  onClose,
  onActionSelect
}: {
  isOpen: boolean;
  onClose: () => void;
  onActionSelect: (action: 'upload' | 'replace' | 'remove') => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[16px] flex items-center justify-center z-50">
      <div className="bg-[#0F172A] border-[0.5px] border-[#1E3A8A]/30 rounded-2xl shadow-2xl w-[560px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 border-b-[0.5px] border-[#1E3A8A]/20 px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1E3A8A]">Resolve Missing Annexure</h3>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-[#1E3A8A]/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content - Three Action Cards */}
        <div className="p-6 space-y-3">
          {/* Upload Document */}
          <button
            onClick={() => onActionSelect('upload')}
            className="w-full p-5 bg-background border-[0.5px] border-[#1E3A8A]/30 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors flex-shrink-0">
                <Upload className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground mb-1">Upload Document</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Add the missing file to your filing package.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors flex-shrink-0" />
            </div>
          </button>

          {/* Replace Reference */}
          <button
            onClick={() => onActionSelect('replace')}
            className="w-full p-5 bg-background border-[0.5px] border-[#1E3A8A]/30 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground mb-1">Replace Reference</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Map the mention of this annexure to an existing document already in your package.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors flex-shrink-0" />
            </div>
          </button>

          {/* Remove Reference */}
          <button
            onClick={() => onActionSelect('remove')}
            className="w-full p-5 bg-background border-[0.5px] border-[#1E3A8A]/30 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors flex-shrink-0">
                <Trash2 className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground mb-1">Remove Reference</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Surgically delete the mention of this missing annexure from the petition narration.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors flex-shrink-0" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-accent/30 border-t-[0.5px] border-[#1E3A8A]/20 px-6 py-4 flex justify-center">
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Upload Source Selection Modal (shown when Upload is selected)
function AnnexureUploadModal({
  isOpen,
  onClose,
  onUpload
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (source: 'myspace' | 'local') => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[16px] flex items-center justify-center z-50">
      <div className="bg-[#0F172A] border-[0.5px] border-[#1E3A8A]/30 rounded-2xl shadow-2xl w-[500px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 border-b-[0.5px] border-[#1E3A8A]/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1E3A8A]">Upload Missing Annexure</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-[#1E3A8A]/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-6">
            Choose the source to upload the missing annexure document
          </p>

          {/* Upload from My Space */}
          <button
            onClick={() => onUpload('myspace')}
            className="w-full p-4 bg-background border-[0.5px] border-[#1E3A8A]/30 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                <FolderOpen className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">Upload from My Space</p>
                <p className="text-xs text-muted-foreground">Browse existing case files and documents</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors" />
            </div>
          </button>

          {/* Upload Document */}
          <button
            onClick={() => onUpload('local')}
            className="w-full p-4 bg-background border-[0.5px] border-[#1E3A8A]/30 rounded-xl hover:border-[#1E3A8A] hover:bg-[#1E3A8A]/5 text-left transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center group-hover:bg-[#1E3A8A]/20 transition-colors">
                <FileUp className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">Upload Document</p>
                <p className="text-xs text-muted-foreground">Direct upload from your device</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#1E3A8A] transition-colors" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-accent/30 border-t-[0.5px] border-[#1E3A8A]/20 px-6 py-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-[0.5px] border-border"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// Checking Defect Loading Modal
function CheckingDefectModal({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[16px] flex items-center justify-center z-[60]">
      <div className="bg-card border-[0.5px] border-[#1E3A8A]/30 rounded-2xl shadow-2xl w-[450px] overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            {/* Animated Loader */}
            <div className="w-16 h-16 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-[#1E3A8A] animate-spin" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground mb-2">Verifying Index Document</h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">
              Checking document compliance and formatting...
            </p>

            {/* Progress indicator */}
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-[#1E3A8A] rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScrutinyWorkspace({
  intakeData,
  defects: originalDefects,
  onDefectsUpdate,
  onComplete,
  onBack,
}: ScrutinyWorkspaceProps) {
  // Override with exactly 5 specific defects
  const [specificDefects, setSpecificDefects] = useState<SpecificDefect[]>([
    {
      id: '1',
      title: 'Annexure missing',
      description: 'Annexure P-4 is mentioned in paragraph 8 of the petition but has not been found in the uploaded filing package.',
      documentName: intakeData.mainFile?.name || 'Petition.pdf',
      pageNumber: 8,
      status: 'pending'
    },
    {
      id: '2',
      title: 'Page margins not court-compliant',
      description: 'Left margin should be 1.5 inches for binding. Current margin is 1 inch. Court filing rules require specific margin formatting.',
      documentName: 'Property Documents.pdf',
      pageNumber: 3,
      status: 'pending'
    },
    {
      id: '3',
      title: 'Translation (Full Document)',
      description: 'Annexure P-3 is entirely in Hindi and requires a certified English translation as per court filing requirements.',
      documentName: 'Annexure P-3.pdf',
      status: 'pending'
    },
    {
      id: '4',
      title: 'Translation (Selective Page)',
      description: 'Page 3 of 40-page Annexure P-5 document is in vernacular language and requires English translation.',
      documentName: 'Annexure P-5.pdf',
      pageNumber: 3,
      status: 'pending'
    }
  ]);

  const [showResolveMissingAnnexureModal, setShowResolveMissingAnnexureModal] = useState(false);
  const [showAnnexureUploadModal, setShowAnnexureUploadModal] = useState(false);
  const [showNarrationModal, setShowNarrationModal] = useState(false);
  const [showTranslationChoiceModal, setShowTranslationChoiceModal] = useState(false);
  const [showTranslationSetup, setShowTranslationSetup] = useState(false);
  const [showTranslationWorkspace, setShowTranslationWorkspace] = useState(false);
  const [showSelectiveTranslationModal, setShowSelectiveTranslationModal] = useState(false);
  const [showSelectiveTranslationWorkspace, setShowSelectiveTranslationWorkspace] = useState(false);
  const [showPageReplacementModal, setShowPageReplacementModal] = useState(false);
  const [selectedPagesForTranslation, setSelectedPagesForTranslation] = useState<number[]>([]);
  const [translationDefect, setTranslationDefect] = useState<SpecificDefect | null>(null);
  const [showMSWord, setShowMSWord] = useState(false);
  const [msWordMode, setMsWordMode] = useState<'format' | 'translation' | 'selective-translation'>('format');
  const [documentContent, setDocumentContent] = useState('');
  const [selectedDefect, setSelectedDefect] = useState<SpecificDefect | null>(specificDefects[0]);
  const [showMySpacePicker, setShowMySpacePicker] = useState(false);
  const [mySpacePickerFor, setMySpacePickerFor] = useState<'annexure' | 'index' | 'translation' | null>(null);
  const [resolvingDefectId, setResolvingDefectId] = useState<string | null>(null);
  const [showDocumentInventory, setShowDocumentInventory] = useState(false);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [showCheckingModal, setShowCheckingModal] = useState(false);
  const [showJubeeTypingSetup, setShowJubeeTypingSetup] = useState(false);
  const [marginsCorrected, setMarginsCorrected] = useState(false);
  const [highlightMarginsText, setHighlightMarginsText] = useState(false);

  // Word editor state for removing annexure reference
  const [showRemoveAnnexureEditor, setShowRemoveAnnexureEditor] = useState(false);
  const [removeAnnexureContent, setRemoveAnnexureContent] = useState('');
  const [highlightedAnnexureText, setHighlightedAnnexureText] = useState('');

  // AI Chat states
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string; text: string; isAI: boolean; timestamp: Date}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);

  const pendingDefects = specificDefects.filter(d => d.status === 'pending');
  const resolvedDefects = specificDefects.filter(d => d.status === 'resolved');

  // Mock document list
  const uploadedDocuments = [
    { id: '1', name: 'Vakalatnama.pdf', pages: '1-2', size: '245 KB', errors: 0 },
    { id: '2', name: intakeData.mainFile?.name || 'Petition.pdf', pages: '3-15', size: '1.2 MB', errors: 1, errorPages: [12] },
    { id: '3', name: 'Annexure P-1.pdf', pages: '16-20', size: '456 KB', errors: 0 },
    { id: '4', name: 'Annexure P-2.pdf', pages: '21-25', size: '678 KB', errors: 0 },
    { id: '5', name: 'Annexure P-3.pdf', pages: '26-30', size: '892 KB', errors: 0 },
    { id: '6', name: 'Annexure P-4.pdf', pages: '31-35', size: '534 KB', errors: 0 },
  ];

  const totalErrors = uploadedDocuments.reduce((sum, doc) => sum + doc.errors, 0);

  const handleFixNow = (defectId: string) => {
    if (defectId === '1') {
      // Annexure defect - show main resolution modal
      setShowResolveMissingAnnexureModal(true);
    } else if (defectId === '2') {
      // Page margins defect - Direct fix workflow
      setResolvingDefectId('2');
      setHighlightMarginsText(false); // Remove highlight during fix

      setTimeout(() => {
        setResolvingDefectId(null);
        setMarginsCorrected(true); // Mark margins as corrected
        const updated = specificDefects.map(d =>
          d.id === '2' ? { ...d, status: 'resolved' as const } : d
        );
        setSpecificDefects(updated);
        toast.success('Page margins adjusted from 1 inch to 1.5 inches for court compliance');
      }, 2000);
    } else if (defectId === '3') {
      // Translation defect - show choice modal
      setTranslationDefect(specificDefects.find(d => d.id === '3') || null);
      setShowTranslationChoiceModal(true);
    } else if (defectId === '4') {
      // Selective translation defect - show choice modal
      setTranslationDefect(specificDefects.find(d => d.id === '4') || null);
      setShowSelectiveTranslationModal(true);
    }
  };

  const handleIgnore = (defectId: string) => {
    const updated = specificDefects.map(d =>
      d.id === defectId ? { ...d, status: 'ignored' as const } : d
    );
    setSpecificDefects(updated);
    toast.info('Defect ignored');
  };

  const handleResolutionAction = (action: 'upload' | 'replace' | 'remove') => {
    setShowResolveMissingAnnexureModal(false);

    if (action === 'upload') {
      // Show upload source selection modal
      setShowAnnexureUploadModal(true);
    } else if (action === 'replace') {
      // Show document picker to map to existing annexure
      setResolvingDefectId('1');
      toast.info('Select an existing document to replace this reference...');
      // For now, auto-resolve to demonstrate the flow
      setTimeout(() => {
        setResolvingDefectId(null);
        const updated = specificDefects.map(d =>
          d.id === '1' ? { ...d, status: 'resolved' as const } : d
        );
        setSpecificDefects(updated);
        toast.success('Reference mapped to Annexure P-2');
      }, 1500);
    } else if (action === 'remove') {
      // Open Word editor to surgically remove the reference from petition
      const mockPetitionContent = `IN THE SUPREME COURT OF INDIA

ORIGINAL CIVIL JURISDICTION

WRIT PETITION (CIVIL) NO. ______ OF 2026

IN THE MATTER OF:

Ramesh Kumar                                                  ...Petitioner

                                    VERSUS

State of Delhi & Ors.                                        ...Respondents

PETITION UNDER ARTICLE 32 OF THE CONSTITUTION OF INDIA

TO,
THE HON'BLE CHIEF JUSTICE OF INDIA AND
HIS COMPANION JUSTICES OF THE
SUPREME COURT OF INDIA

THE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED

MOST RESPECTFULLY SHOWETH:

1. That the petitioner is a resident of Delhi and is filing this petition under Article 32 of the Constitution of India for the protection of his fundamental rights.

2. That the petitioner was served with an arbitrary order dated 15th January 2026 by the respondent authorities without following due process of law.

3. That the said order is challenged on the grounds that it violates the petitioner's fundamental rights under Article 14 and Article 21 of the Constitution. A copy of the said order is annexed herewith and marked as Annexure P-2.

4. That the petitioner had earlier submitted representations dated 10th December 2025 and 5th January 2026, copies of which are annexed as Annexure P-3.

5. That despite repeated requests, the respondent authorities failed to provide any reasons for the impugned order.

6. That the petitioner's livelihood depends on the matter being resolved expeditiously.

7. That the impugned order was passed without giving the petitioner an opportunity to be heard, which is a clear violation of principles of natural justice.

8. That the petitioner had also submitted certain evidentiary documents on 20th November 2025, which are attached as Annexure P-4, demonstrating the petitioner's compliance with all applicable regulations.

9. That the petitioner has no other efficacious remedy except to approach this Hon'ble Court under Article 32 of the Constitution of India.

PRAYER

In light of the facts stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:

(a) Issue a writ of certiorari or any other appropriate writ quashing the impugned order dated 15th January 2026;

(b) Direct the respondent authorities to provide reasons for the impugned order;

(c) Pass any other order as this Hon'ble Court may deem fit in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE PETITIONER SHALL DUTY BOUND FOREVER PRAY.

ADVOCATE FOR THE PETITIONER
PLACE: NEW DELHI
DATE: 10TH FEBRUARY 2026`;

      setRemoveAnnexureContent(mockPetitionContent);
      setHighlightedAnnexureText('Annexure P-4');
      setShowRemoveAnnexureEditor(true);
    }
  };

  const handleSaveRemoveAnnexure = (content: string) => {
    // User has edited the petition and removed the annexure reference
    // Now mark the defect as resolved
    setShowRemoveAnnexureEditor(false);
    setResolvingDefectId('1');

    toast.info('Saving changes...');
    setTimeout(() => {
      setResolvingDefectId(null);
      const updated = specificDefects.map(d =>
        d.id === '1' ? { ...d, status: 'resolved' as const } : d
      );
      setSpecificDefects(updated);
      toast.success('Reference to Annexure P-4 removed successfully', {
        description: 'The defect has been resolved. Petition updated.'
      });
    }, 1000);
  };

  const handleAnnexureUpload = (source: 'myspace' | 'local') => {
    setShowAnnexureUploadModal(false);

    if (source === 'myspace') {
      setMySpacePickerFor('annexure');
      setShowMySpacePicker(true);
    } else {
      // Resolve the defect for local upload
      setResolvingDefectId('1');
      setTimeout(() => {
        setResolvingDefectId(null);
        const updated = specificDefects.map(d =>
          d.id === '1' ? { ...d, status: 'resolved' as const } : d
        );
        setSpecificDefects(updated);
        toast.success('Document uploaded successfully');
      }, 1500);
    }
  };

  const handleMySpaceSelect = (documents: any[]) => {
    setShowMySpacePicker(false);

    if (mySpacePickerFor === 'annexure') {
      setResolvingDefectId('1');
      setTimeout(() => {
        setResolvingDefectId(null);
        const updated = specificDefects.map(d =>
          d.id === '1' ? { ...d, status: 'resolved' as const } : d
        );
        setSpecificDefects(updated);
        toast.success(`Selected ${documents.length} document(s) from My Space`);
      }, 1500);
    } else if (mySpacePickerFor === 'index') {
      const updated = specificDefects.map(d =>
        d.id === '2' ? { ...d, status: 'resolved' as const } : d
      );
      setSpecificDefects(updated);
      toast.success(`Index document selected from My Space`);
    } else if (mySpacePickerFor === 'translation') {
      setResolvingDefectId('4');
      setTimeout(() => {
        setResolvingDefectId(null);
        const updated = specificDefects.map(d =>
          d.id === '4' ? { ...d, status: 'resolved' as const } : d
        );
        setSpecificDefects(updated);
        toast.success(`Translation document selected from My Space`);
      }, 1500);
    }

    setMySpacePickerFor(null);
  };

  const handleTranslationApprove = (translatedContent: string) => {
    // Close translation workspace
    setShowTranslationWorkspace(false);
    setTranslationDefect(null);

    // Resolve the translation defect
    setResolvingDefectId('4');
    setTimeout(() => {
      setResolvingDefectId(null);
      const updated = specificDefects.map(d =>
        d.id === '4' ? { ...d, status: 'resolved' as const } : d
      );
      setSpecificDefects(updated);

      // Show success message
      toast.success('Translation approved and document replaced successfully');
    }, 1500);
  };

  const handleTranslationChoice = (choice: 'translate' | 'upload') => {
    setShowTranslationChoiceModal(false);

    if (choice === 'translate') {
      // Open translation setup (shows court selection before translation)
      setShowTranslationSetup(true);
    } else {
      // Show My Space picker
      setMySpacePickerFor('translation');
      setShowMySpacePicker(true);
    }
  };

  const handleStartTranslation = () => {
    // Close setup and open translation workspace
    setShowTranslationSetup(false);
    setShowTranslationWorkspace(true);
  };

  const handleTranslationEdit = (content: string) => {
    // Save current translation content
    setDocumentContent(content);
    // Close translation workspace
    setShowTranslationWorkspace(false);
    // Open MS Word editor
    setMsWordMode('translation');
    setShowMSWord(true);
  };

  const handleTranslationRedo = () => {
    // Re-trigger translation
    toast.info('Regenerating translation with improvements...');
  };

  const handleTranslationMSWordSave = () => {
    // Close MS Word and return to translation workspace
    setShowMSWord(false);
    setShowTranslationWorkspace(true);
  };

  const handleSelectiveTranslationChoice = (choice: 'translate' | 'upload') => {
    setShowSelectiveTranslationModal(false);

    if (choice === 'translate') {
      // Open translation setup (shows court selection before translation)
      setShowTranslationSetup(true);
    } else {
      // Show My Space picker
      setMySpacePickerFor('translation');
      setShowMySpacePicker(true);
    }
  };

  const handleStartSelectiveTranslation = () => {
    // Close setup and open translation workspace
    setShowTranslationSetup(false);
    setShowSelectiveTranslationWorkspace(true);
  };

  const handleSelectiveTranslationEdit = (content: string) => {
    // Save current translation content
    setDocumentContent(content);
    // Close translation workspace
    setShowSelectiveTranslationWorkspace(false);
    // Open MS Word editor
    setMsWordMode('selective-translation');
    setShowMSWord(true);
  };

  const handleSelectiveTranslationRedo = () => {
    // Re-trigger translation
    toast.info('Regenerating translation with improvements...');
  };

  const handleSelectiveTranslationMSWordSave = () => {
    // Close MS Word and return to translation workspace
    setShowMSWord(false);
    setShowSelectiveTranslationWorkspace(true);
  };

  const handleFormatResolution = (action: 'open-typing' | 'upload-myspace' | 'upload-local') => {
    setShowFormatModal(false);

    if (action === 'open-typing') {
      // Open Jubee Typing with pre-filled petition content
      const mockPetitionContent = `IN THE ${intakeData.court.replace(/-/g, ' ').toUpperCase()}

PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA

IN THE MATTER OF:

RAJESH KUMAR SHARMA                                                    ...Petitioner

                                    VERSUS

DELHI DEVELOPMENT AUTHORITY & ANR.                                    ...Respondents

PETITION

1. The Petitioner respectfully submits as under:

2. That the Petitioner applied for allotment of Plot No. 45, Sector 12, Dwarka, New Delhi on 15th January 2023.

3. That the Respondent No. 1 issued an allotment letter dated 25th February 2023, stipulating payment of Rs. 45,00,000/- (Rupees Forty-Five Lakhs only).

4. That the Petitioner made timely payment of Rs. 15,00,000/- (Rupees Fifteen Lakhs) as the first installment on 10th March 2023.

5. That on 15th April 2023, the Respondent No. 1 unilaterally cancelled the allotment without providing any reason or opportunity of hearing.

6. That the Petitioner sent a legal notice on 20th May 2023 but received no response from the Respondents.

PRAYER

In light of the above, it is most humbly prayed that this Hon'ble Court may be pleased to:

a) Quash and set aside the cancellation order dated 15th April 2023;

b) Direct the Respondents to restore the allotment of Plot No. 45 in favor of the Petitioner;

c) Award compensation for mental harassment;

d) Pass any other order as deemed fit.

                                                        Respectfully submitted,

                                                        Advocate for the Petitioner`;

      setDocumentContent(mockPetitionContent);
      setShowJubeeTypingSetup(true);
    } else if (action === 'upload-myspace') {
      // Open My Space picker
      setMySpacePickerFor('index'); // Reuse for simplicity
      setShowMySpacePicker(true);
    } else {
      // Resolve immediately for local upload
      setResolvingDefectId('4');
      setTimeout(() => {
        setResolvingDefectId(null);
        const updated = specificDefects.map(d =>
          d.id === '4' ? { ...d, status: 'resolved' as const } : d
        );
        setSpecificDefects(updated);
        toast.success('Formatted document uploaded successfully');
      }, 1500);
    }
  };

  const handleTypingSave = (content: any) => {
    setShowJubeeTypingSetup(false);
    toast.success('Document saved with court-compliant formatting');
  };

  const handleTypingReplace = (content: any) => {
    setShowJubeeTypingSetup(false);
    setResolvingDefectId('4'); // Set loading on format defect

    // Simulate checking delay
    setTimeout(() => {
      setResolvingDefectId(null);

      // Resolve format defect
      const updated = specificDefects.map(d =>
        d.id === '4' ? { ...d, status: 'resolved' as const } : d
      );
      setSpecificDefects(updated);

      toast.success('Document replaced with court-compliant formatting');
    }, 2500);
  };

  const handleTypingSetupContinue = (selectedCourt: string, content: string) => {
    // Close setup and open MS Word window
    setShowJubeeTypingSetup(false);
    setDocumentContent(content);
    setMsWordMode('format');
    setShowMSWord(true);
  };

  const handleFormatMSWordSave = () => {
    setShowMSWord(false);
    setResolvingDefectId('4'); // Set loading on format defect

    // Simulate checking delay
    setTimeout(() => {
      setResolvingDefectId(null);

      // Resolve format defect
      const updated = specificDefects.map(d =>
        d.id === '4' ? { ...d, status: 'resolved' as const } : d
      );
      setSpecificDefects(updated);

      toast.success('Document replaced with court-compliant formatting');
    }, 2500);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      text: chatInput,
      isAI: false,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAITyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "I've reviewed the page margins defect. The left margin is currently 1 inch but should be 1.5 inches for court filing requirements. Would you like me to fix this automatically?",
        "Based on the document analysis, the Property Sale Deed requires formatting adjustments. I can help you understand which sections need attention.",
        "This defect relates to court compliance standards. The Delhi High Court requires specific margin formatting for all filed documents. I can guide you through the correction process.",
        "I'm analyzing the document structure. The margins issue affects the binding area which is critical for court filing. Would you like more details about this requirement?"
      ];

      const aiMessage = {
        id: `ai-${Date.now()}`,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        isAI: true,
        timestamp: new Date()
      };

      setIsAITyping(false);
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1500 + Math.random() * 1000);
  };

  const allResolved = pendingDefects.length === 0;

  return (
    <div className="h-full flex bg-background">
      {/* Left Pane - Defect List (65%) */}
      <div className="w-[65%] flex flex-col border-r-[0.5px] border-border overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b-[0.5px] border-border flex-shrink-0 bg-background">
          <h3 className="text-lg font-bold text-foreground mb-1">Pre-Check Report</h3>
          <p className="text-sm text-muted-foreground">
            {pendingDefects.length} pending · {resolvedDefects.length} resolved
          </p>
        </div>

        {/* Defect List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-8 space-y-6">
            {specificDefects.map((defect, index) => (
              <div
                key={defect.id}
                onClick={() => {
                  setSelectedDefect(defect);
                  // Highlight text for page margins defect
                  if (defect.id === '3' && defect.status === 'pending') {
                    setHighlightMarginsText(true);
                  }
                }}
                className={`border-[1.5px] rounded-xl transition-all cursor-pointer overflow-hidden relative ${
                  selectedDefect?.id === defect.id
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 shadow-lg shadow-[#3B82F6]/20'
                    : 'border-border dark:border-white/20 bg-card dark:bg-white/5 hover:border-[#3B82F6]/50 dark:hover:border-[#3B82F6] hover:bg-[#3B82F6]/5 dark:hover:bg-[#3B82F6]/10'
                } ${defect.status === 'resolved' ? 'opacity-60' : ''}`}
              >
                {/* Loading Overlay */}
                {resolvingDefectId === defect.id && (
                  <div className="absolute inset-0 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                    <div className="bg-card dark:bg-slate-800 border-[0.5px] border-[#3B82F6]/30 dark:border-[#3B82F6] rounded-xl px-6 py-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin" />
                        <div>
                          <p className="text-sm font-semibold text-[#3B82F6]">Verifying Document</p>
                          <p className="text-xs text-muted-foreground">Checking compliance...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 relative">
                  {/* Loading Overlay - Positioned within content */}
                  {resolvingDefectId === defect.id && (
                    <div className="absolute inset-0 bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
                      <div className="bg-card dark:bg-slate-800 border-[0.5px] border-[#3B82F6]/30 dark:border-[#3B82F6] rounded-xl px-6 py-4 shadow-lg">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin" />
                          <div>
                            <p className="text-sm font-semibold text-[#3B82F6]">Verifying Document</p>
                            <p className="text-xs text-muted-foreground">Checking compliance...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start gap-5 mb-5">
                    {/* Number/Status */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      defect.status === 'resolved'
                        ? 'bg-[#3B82F6]/20 dark:bg-[#3B82F6]/30 text-[#3B82F6]'
                        : 'bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 text-[#3B82F6]'
                    }`}>
                      {defect.status === 'resolved' ? '✓' : index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-foreground mb-2 leading-snug">
                        {defect.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {defect.description}
                      </p>
                    </div>
                  </div>

                  {/* Document Reference */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5 pl-[52px]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{defect.documentName}</span>
                    {defect.pageNumber && (
                      <>
                        <span>·</span>
                        <span>Page {defect.pageNumber}</span>
                      </>
                    )}
                  </div>

                  {/* Two-Button Actions */}
                  {defect.status === 'pending' && (
                    <div className="pl-[52px] flex gap-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFixNow(defect.id);
                        }}
                        className="flex-1 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-semibold"
                      >
                        Fix Now
                      </Button>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIgnore(defect.id);
                        }}
                        variant="outline"
                        className="flex-1 border-[1.5px] border-border dark:border-white/30 hover:border-[#3B82F6] hover:bg-[#3B82F6]/5 dark:hover:bg-[#3B82F6]/20 font-semibold"
                      >
                        Ignore
                      </Button>
                    </div>
                  )}

                  {/* Resolved Badge */}
                  {defect.status === 'resolved' && (
                    <div className="pl-[52px]">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1E3A8A]/10 dark:bg-[#1E3A8A]/20 border-[0.5px] border-[#1E3A8A]/30 dark:border-[#1E3A8A] rounded-lg">
                        <div className="w-2 h-2 bg-[#1E3A8A] rounded-full" />
                        <span className="text-xs font-semibold text-[#1E3A8A]">Resolved</span>
                      </div>
                    </div>
                  )}

                  {/* Ignored Badge */}
                  {defect.status === 'ignored' && (
                    <div className="pl-[52px]">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted dark:bg-white/10 border-[0.5px] border-border dark:border-white/20 rounded-lg">
                        <X className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground">Ignored</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer - Complete Button */}
        <div className="border-t-[0.5px] border-border dark:border-white/20 px-8 py-5 flex-shrink-0 bg-background">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {!allResolved && (
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  ⚠️ {pendingDefects.length} defect{pendingDefects.length !== 1 ? 's' : ''} remaining
                </span>
              )}
              {allResolved && (
                <span className="text-[#3B82F6] font-medium">
                  ✓ All defects addressed
                </span>
              )}
            </div>
            <Button
              onClick={onComplete}
              disabled={!allResolved}
              className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Compilation
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Pane - Document Reference (35%) */}
      <div className="w-[35%] flex flex-col bg-accent/30">
        {/* Header */}
        <div className="px-6 py-4 border-b-[0.5px] border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">Document Reference</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedDefect ? selectedDefect.documentName : 'Select a defect to view'}
              </p>
            </div>
            <Button
              onClick={() => setShowDocumentInventory(!showDocumentInventory)}
              variant="outline"
              size="sm"
              className="border-[0.5px] border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10 h-8 px-3"
            >
              <File className="w-3.5 h-3.5 mr-1.5" />
              All Documents
              <ChevronDown className={`w-3.5 h-3.5 ml-1.5 transition-transform ${showDocumentInventory ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Document Inventory - Collapsible */}
          {showDocumentInventory && (
            <div className="mt-3 bg-background border-[0.5px] border-border rounded-lg overflow-hidden">
              <div className="bg-[#1E3A8A]/5 px-3 py-2 border-b-[0.5px] border-border">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Filing Package Documents ({uploadedDocuments.length})</p>
                  {totalErrors > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border-[0.5px] border-red-500/30 rounded">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-500">{totalErrors} Error{totalErrors !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="px-3 py-2.5 hover:bg-[#1E3A8A]/5 border-b-[0.5px] border-border last:border-b-0 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
                          {doc.errors > 0 && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/10 border-[0.5px] border-red-500/30 rounded flex-shrink-0">
                              <div className="w-1 h-1 bg-red-500 rounded-full" />
                              <span className="text-[9px] font-bold text-red-600 dark:text-red-500">{doc.errors}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">Pages {doc.pages}</span>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <span className="text-[10px] text-muted-foreground">{doc.size}</span>
                          {doc.errors > 0 && doc.errorPages && (
                            <>
                              <span className="text-[10px] text-muted-foreground">•</span>
                              <span className="text-[10px] text-red-600 dark:text-red-500 font-medium">Error on page {doc.errorPages.join(', ')}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${doc.errors > 0 ? 'text-red-500' : 'text-[#1E3A8A]'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Document Preview */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {selectedDefect ? (
              <div className="bg-white dark:bg-slate-800 border-[2px] border-[#3B82F6]/60 dark:border-[#3B82F6] rounded-xl overflow-hidden shadow-xl ring-2 ring-[#3B82F6]/30 dark:ring-[#3B82F6]/50">
                {/* Document Name Header */}
                <div className="bg-[#1E3A8A]/5 dark:bg-[#3B82F6]/20 border-b-[0.5px] border-[#1E3A8A]/20 dark:border-[#3B82F6]/40 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1E3A8A] dark:text-[#3B82F6]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1E3A8A] dark:text-[#3B82F6] truncate">{selectedDefect.documentName}</p>
                      {selectedDefect.pageNumber && (
                        <p className="text-xs text-muted-foreground dark:text-slate-300">Page {selectedDefect.pageNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document Content */}
                <div className="p-6">
                  <div className="space-y-4 text-sm">
                    <div className="space-y-3 leading-relaxed">
                      {selectedDefect.id === '1' ? (
                        <>
                          <p className="font-semibold text-foreground dark:text-white">12. Documentary Evidence</p>
                          <p className="text-muted-foreground dark:text-slate-300">
                            That in support of the contentions hereinabove, the Petitioner relies upon the following documents:
                          </p>
                          <ul className="space-y-2 pl-6 text-muted-foreground dark:text-slate-300">
                            <li>(i) Copy of original lease agreement dated 15th January 2020 is annexed hereto and marked as Annexure P-5</li>
                            <li>(ii) Copy of rent receipts for the period January 2023 to December 2023 are collectively annexed hereto and marked as Annexure P-6</li>
                            <li className="relative">
                              <div className="font-semibold text-[#1E3A8A] dark:text-[#3B82F6] bg-[#1E3A8A]/10 dark:bg-[#3B82F6]/20 p-3 rounded-lg border-l-4 border-[#1E3A8A] dark:border-[#3B82F6] shadow-sm">
                                (iii) Copy of official notice dated 10th October 2024 is annexed hereto and marked as Annexure P-7
                                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1E3A8A] dark:bg-[#3B82F6] rounded-full animate-pulse" />
                              </div>
                            </li>
                          </ul>
                          <p className="text-muted-foreground dark:text-slate-300">
                            That the Petitioner has no other remedy except to approach this Hon'ble Court under Article 226 of the Constitution of India.
                          </p>
                        </>
                      ) : selectedDefect.id === '3' ? (
                        <>
                          <p className="font-semibold text-foreground dark:text-white mb-4">PROPERTY SALE DEED</p>
                          <p className="text-muted-foreground dark:text-slate-300 mb-4">
                            THIS DEED OF SALE is executed on this 15th day of March, 2024, at New Delhi between:
                          </p>

                          <div className={`p-4 rounded-lg border-l-4 shadow-sm transition-all mb-4 ${
                            highlightMarginsText
                              ? 'text-[#1E3A8A] dark:text-[#3B82F6] bg-[#1E3A8A]/10 dark:bg-[#3B82F6]/20 border-[#1E3A8A] dark:border-[#3B82F6] animate-pulse relative'
                              : 'text-foreground dark:text-white bg-background dark:bg-slate-700 border-border'
                          }`}>
                            {highlightMarginsText && !marginsCorrected && (
                              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1E3A8A] dark:bg-[#3B82F6] rounded-full animate-pulse" />
                            )}
                            <p className="font-semibold mb-2">1. THE VENDOR:</p>
                            <p className="mb-2">Mr. Rajesh Kumar Singh, son of Late Shri Mohan Singh, aged about 58 years, residing at House No. 234, Sector 15, Rohini, New Delhi - 110085</p>
                            <p className="font-semibold mb-2">2. THE PURCHASER:</p>
                            <p>Mrs. Anjali Sharma, wife of Mr. Vikram Sharma, aged about 42 years, residing at Flat No. 5B, Tower 3, Green Valley Apartments, Dwarka, New Delhi - 110075</p>
                          </div>

                          <p className="text-muted-foreground dark:text-slate-300 mb-3">
                            WHEREAS the Vendor is the absolute owner and in possession of the property bearing House No. 234, Sector 15, Rohini, New Delhi - 110085, more particularly described in Schedule A hereto.
                          </p>

                          <p className="text-muted-foreground dark:text-slate-300">
                            AND WHEREAS the Purchaser has agreed to purchase the said property from the Vendor for a total consideration of Rs. 2,50,00,000/- (Rupees Two Crores Fifty Lakhs Only).
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-foreground dark:text-white text-center mb-6">
                            {intakeData.court.replace(/-/g, ' ').toUpperCase()}
                          </p>
                          <p className="text-center font-semibold text-foreground dark:text-white mb-4">
                            PETITION UNDER ARTICLE 226
                          </p>
                          <div className="bg-[#1E3A8A]/10 dark:bg-[#3B82F6]/20 border-l-4 border-[#1E3A8A] dark:border-[#3B82F6] p-4 rounded-lg shadow-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-[#1E3A8A] dark:bg-[#3B82F6] rounded-full mt-1.5 animate-pulse" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-[#1E3A8A] dark:text-[#3B82F6] mb-2">
                                  Index Required
                                </p>
                                <p className="text-xs text-muted-foreground dark:text-slate-300">
                                  Court rules mandate an index listing all documents with their respective page numbers. This document is currently missing from your filing package.
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground dark:text-slate-300 text-center italic mt-6">
                            The index should appear at the beginning of the compiled filing package.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-[#1E3A8A]/50" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Select a defect to view document reference
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Floating Chat Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 group ${
          showChat ? 'scale-0' : 'scale-100'
        }`}
      >
        <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      </button>

      {/* AI Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-background border-l-[0.5px] border-border shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        showChat ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Chat Header */}
        <div className="px-6 py-4 border-b-[0.5px] border-border bg-gradient-to-r from-[#1E3A8A]/5 to-transparent flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center">
                <img src={jubeeLogo} alt="Jubee" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Jubee</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#1E3A8A] rounded-full animate-pulse" />
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Ask me anything about defects, court requirements, or document formatting
          </p>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 min-h-0 px-6 py-4">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A]/10 flex items-center justify-center mb-4">
                <img src={jubeeLogo} alt="Jubee" className="w-9 h-9 object-contain" />
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Start a conversation</h4>
              <p className="text-xs text-muted-foreground max-w-[280px]">
                Ask me about any defect, request clarification, or get help with court filing requirements
              </p>
              <div className="mt-6 space-y-2 w-full max-w-[280px]">
                <button
                  onClick={() => setChatInput("Explain the page margins issue")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  Explain the page margins issue
                </button>
                <button
                  onClick={() => setChatInput("What are Delhi High Court requirements?")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  What are court requirements?
                </button>
                <button
                  onClick={() => setChatInput("How do I fix multiple defects at once?")}
                  className="w-full text-left px-4 py-2.5 bg-muted hover:bg-[#1E3A8A]/10 rounded-lg text-xs text-foreground transition-colors border-[0.5px] border-border"
                >
                  Fix multiple defects at once?
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isAI ? 'items-start' : 'items-end flex-row-reverse'}`}
                >
                  {message.isAI && (
                    <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center flex-shrink-0">
                      <img src={jubeeLogo} alt="Jubee" className="w-5 h-5 object-contain" />
                    </div>
                  )}
                  <div
                    className={`max-w-[280px] rounded-2xl px-4 py-3 ${
                      message.isAI
                        ? 'bg-muted border-[0.5px] border-border'
                        : 'bg-[#1E3A8A] text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-[10px] mt-1.5 ${message.isAI ? 'text-muted-foreground' : 'text-white/70'}`}>
                      {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isAITyping && (
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center flex-shrink-0">
                    <img src={jubeeLogo} alt="Jubee" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="bg-muted border-[0.5px] border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#1E3A8A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#1E3A8A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#1E3A8A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Chat Input */}
        <div className="px-6 py-4 border-t-[0.5px] border-border bg-background flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChatMessage();
                }
              }}
              placeholder="Ask about defects..."
              className="flex-1 px-4 py-2.5 bg-muted border-[0.5px] border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={!chatInput.trim() || isAITyping}
              className="px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>

      {/* Modals */}
      <ResolveMissingAnnexureModal
        isOpen={showResolveMissingAnnexureModal}
        onClose={() => setShowResolveMissingAnnexureModal(false)}
        onActionSelect={handleResolutionAction}
      />

      <AnnexureUploadModal
        isOpen={showAnnexureUploadModal}
        onClose={() => setShowAnnexureUploadModal(false)}
        onUpload={handleAnnexureUpload}
      />

      <FormatMismatchModal
        isOpen={showFormatModal}
        onClose={() => setShowFormatModal(false)}
        onResolve={handleFormatResolution}
      />

      {/* MS Word Window */}
      {showMSWord && (
        <MSWordWindow
          isOpen={showMSWord}
          onClose={() => setShowMSWord(false)}
          fileName={msWordMode === 'translation' ? "Annexure P-3 (English Translation).docx" : msWordMode === 'selective-translation' ? "Annexure P-5 (Selective Translation).docx" : intakeData.mainFile?.name || 'Petition.pdf'}
          content={documentContent}
          onContentChange={setDocumentContent}
          onSave={msWordMode === 'translation' ? handleTranslationMSWordSave : msWordMode === 'selective-translation' ? handleSelectiveTranslationMSWordSave : handleFormatMSWordSave}
        />
      )}

      {/* MS Word Window - Remove Annexure Reference */}
      {showRemoveAnnexureEditor && (
        <MSWordWindow
          isOpen={showRemoveAnnexureEditor}
          onClose={() => setShowRemoveAnnexureEditor(false)}
          fileName={`${intakeData.mainFile?.name || 'Petition'} - Remove Annexure Reference.docx`}
          content={removeAnnexureContent}
          onContentChange={setRemoveAnnexureContent}
          onSave={handleSaveRemoveAnnexure}
          courtFormat={{
            font: 'Source Serif Pro',
            fontSize: 12,
            lineSpacing: 1.5
          }}
          isFullWindow={false}
          highlightedText={highlightedAnnexureText}
          saveButtonText="Save & Finalize"
        />
      )}

      {/* My Space Picker */}
      {showMySpacePicker && (
        <MySpacePickerDialog
          isOpen={showMySpacePicker}
          onClose={() => setShowMySpacePicker(false)}
          onSelect={handleMySpaceSelect}
        />
      )}

      {/* Checking Defect Modal */}
      {showCheckingModal && (
        <CheckingDefectModal
          isOpen={showCheckingModal}
        />
      )}

      {/* Translation Workspace */}
      {showTranslationWorkspace && translationDefect && (
        <TranslationWorkspace
          isOpen={showTranslationWorkspace}
          onClose={() => setShowTranslationWorkspace(false)}
          defect={translationDefect}
          courtLanguage="English"
          onApprove={handleTranslationApprove}
          onEdit={handleTranslationEdit}
          onRedo={handleTranslationRedo}
        />
      )}

      {/* Translation Choice Modal */}
      <TranslationChoiceModal
        isOpen={showTranslationChoiceModal}
        onClose={() => {
          setShowTranslationChoiceModal(false);
          setTranslationDefect(null);
        }}
        onTranslateWithJubee={() => handleTranslationChoice('translate')}
        onUploadNew={() => handleTranslationChoice('upload')}
      />

      {/* Translation Setup */}
      <TranslationSetup
        isOpen={showTranslationSetup}
        onClose={() => {
          setShowTranslationSetup(false);
          setTranslationDefect(null);
        }}
        fileName={translationDefect?.documentName || 'Annexure P-3.pdf'}
        sourceLanguage="Hindi"
        targetLanguage="English"
        court={intakeData.court}
        onStartTranslation={handleStartTranslation}
      />

      {/* Jubee Typing Window */}
      {showJubeeTypingSetup && (
        <JubeeTypingSetup
          isOpen={showJubeeTypingSetup}
          onClose={() => setShowJubeeTypingSetup(false)}
          fileName={intakeData.mainFile?.name || 'Petition.pdf'}
          fileSize="1.2 MB"
          preSelectedCourt={intakeData.court}
          initialContent={documentContent}
          onSave={handleTypingSave}
          onReplace={handleTypingReplace}
          onContinue={handleTypingSetupContinue}
        />
      )}

      {/* Selective Translation Choice Modal */}
      <SelectiveTranslationModal
        isOpen={showSelectiveTranslationModal}
        onClose={() => {
          setShowSelectiveTranslationModal(false);
          setTranslationDefect(null);
        }}
        onTranslate={(pages) => {
          setSelectedPagesForTranslation(pages);
          setShowSelectiveTranslationModal(false);
          setShowSelectiveTranslationWorkspace(true);
        }}
        totalPages={40}
        vernacularPages={[3, 7, 15, 22, 28]}
      />

      {/* Selective Translation Workspace */}
      {showSelectiveTranslationWorkspace && (
        <SelectiveTranslationWorkspace
          isOpen={showSelectiveTranslationWorkspace}
          onClose={() => setShowSelectiveTranslationWorkspace(false)}
          selectedPages={selectedPagesForTranslation.length > 0 ? selectedPagesForTranslation : [3]}
          totalPages={40}
          onApprove={(content) => {
            setShowSelectiveTranslationWorkspace(false);
            setShowPageReplacementModal(true);
          }}
          onEdit={handleSelectiveTranslationEdit}
          onRedo={handleSelectiveTranslationRedo}
        />
      )}

      {/* Page Replacement Modal */}
      {showPageReplacementModal && (
        <PageReplacementModal
          isOpen={showPageReplacementModal}
          onClose={() => setShowPageReplacementModal(false)}
          selectedPages={selectedPagesForTranslation.length > 0 ? selectedPagesForTranslation : [3]}
          totalPages={40}
          onReplace={() => {
            setShowPageReplacementModal(false);
            setResolvingDefectId('4');

            setTimeout(() => {
              setResolvingDefectId(null);
              const updated = specificDefects.map(d =>
                d.id === '4' ? { ...d, status: 'resolved' as const } : d
              );
              setSpecificDefects(updated);
              toast.success('Selective page translation completed and replaced');
            }, 2500);
          }}
          onAppend={() => {
            setShowPageReplacementModal(false);
            setResolvingDefectId('4');

            setTimeout(() => {
              setResolvingDefectId(null);
              const updated = specificDefects.map(d =>
                d.id === '4' ? { ...d, status: 'resolved' as const } : d
              );
              setSpecificDefects(updated);
              toast.success('Selective page translation completed and appended');
            }, 2500);
          }}
          onAppendAfterOriginal={() => {
            console.log('onAppendAfterOriginal handler triggered');
            setShowPageReplacementModal(false);
            setResolvingDefectId('4');

            setTimeout(() => {
              console.log('Updating defect 4 status to resolved');
              setResolvingDefectId(null);
              const updated = specificDefects.map(d =>
                d.id === '4' ? { ...d, status: 'resolved' as const } : d
              );
              setSpecificDefects(updated);
              toast.success('Translated pages inserted after originals');
            }, 2500);
          }}
        />
      )}

      {/* Narration Mismatch Modal */}
      {showNarrationModal && (
        <NarrationMismatchModal
          isOpen={showNarrationModal}
          onClose={() => setShowNarrationModal(false)}
          onResolve={(action) => {
            setShowNarrationModal(false);

            if (action === 'ignore') {
              const updated = specificDefects.map(d =>
                d.id === '3' ? { ...d, status: 'ignored' as const } : d
              );
              setSpecificDefects(updated);
              toast.info('Narration mismatch ignored');
            } else {
              setResolvingDefectId('3');

              setTimeout(() => {
                setResolvingDefectId(null);
                const updated = specificDefects.map(d =>
                  d.id === '3' ? { ...d, status: 'resolved' as const } : d
                );
                setSpecificDefects(updated);

                if (action === 'fix-petition') {
                  toast.success('Petition date updated to match Annexure A-1');
                } else if (action === 'fix-annexure') {
                  toast.success('Annexure A-1 date updated to match petition');
                }
              }, 2500);
            }
          }}
        />
      )}
    </div>
  );
}