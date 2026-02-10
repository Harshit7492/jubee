import { useState } from 'react';
import { X, Languages, ArrowRight, FileText, Sparkles, RefreshCw, Edit3, Send } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { MSWordWindow } from '@/app/components/MSWordWindow';
import type { DefectItem } from '@/app/components/research-tools/PreCheckWorkflow';

interface TranslationOverlayProps {
  defect: DefectItem;
  onClose: () => void;
  onComplete: (mode: 'append' | 'replace') => void;
}

export function TranslationOverlay({ defect, onClose, onComplete }: TranslationOverlayProps) {
  const [selectedMode, setSelectedMode] = useState<'append' | 'replace' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showRedoInput, setShowRedoInput] = useState(false);
  const [redoInstruction, setRedoInstruction] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showMSWord, setShowMSWord] = useState(false);
  const [translatedText, setTranslatedText] = useState(
    "This document is proof of ownership of the property. The petitioner is the lawful owner of this property and has been residing on it for the past 20 years."
  );

  // Mock original text
  const originalText = "यह दस्तावेज़ संपत्ति के स्वामित्व का प्रमाण है। पेटीशनर इस संपत्ति का वैध स्वामी है और पिछले 20 वर्षों से इस पर रह रहा है।";

  const handleRedo = () => {
    if (!redoInstruction.trim()) return;
    
    setIsRegenerating(true);
    
    // Simulate AI regeneration
    setTimeout(() => {
      // Mock response based on instruction
      if (redoInstruction.toLowerCase().includes('formal')) {
        setTranslatedText(
          "The present document serves as evidence of proprietary rights to the aforementioned property. The petitioner herein is the lawful and rightful owner of the said property and has been in continuous possession thereof for a period of twenty years."
        );
      } else if (redoInstruction.toLowerCase().includes('section 138')) {
        setTranslatedText(
          "This document is proof of ownership of the property pursuant to Section 138 of the Negotiable Instruments Act, 1881. The petitioner is the lawful owner of this property and has been residing on it for the past 20 years."
        );
      } else {
        setTranslatedText(
          "This document serves as proof of property ownership. The petitioner is the rightful owner of this property and has resided on it for the past 20 years."
        );
      }
      
      setIsRegenerating(false);
      setShowRedoInput(false);
      setRedoInstruction('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl h-[85vh] bg-card rounded-2xl border-[0.5px] border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b-[0.5px] border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Languages className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">Jubee Translation</h2>
                <p className="text-xs text-muted-foreground">Certified translation for Registry compliance</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-accent"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Original Document - Left Pane */}
          <div className="w-1/2 border-r-[0.5px] border-border flex flex-col">
            <div className="px-6 py-4 bg-accent/20 border-b-[0.5px] border-border">
              <h3 className="font-semibold text-foreground text-sm">Original Document (Hindi)</h3>
              <p className="text-xs text-muted-foreground mt-1">{defect.documentName}</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6">
                <div className="bg-white dark:bg-muted rounded-xl border-[0.5px] border-border p-6 min-h-[400px]">
                  <div className="text-center mb-6">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm font-semibold text-foreground">Annexure P-3</p>
                  </div>
                  <div className="space-y-4 text-base leading-relaxed" style={{ fontFamily: 'serif' }}>
                    <p className="text-justify">{originalText}</p>
                    <p className="text-justify text-muted-foreground italic">
                      [ Additional vernacular text would appear here... ]
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* AI Draft Translation - Right Pane */}
          <div className="w-1/2 flex flex-col">
            <div className="px-6 py-4 bg-primary/5 border-b-[0.5px] border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">AI-Generated Translation (English)</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Certified translation for court filing</p>
            </div>

            {/* Iterative Correction Toolbar */}
            <div className="px-6 py-3 bg-accent/10 border-b-[0.5px] border-border">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowRedoInput(!showRedoInput);
                  }}
                  disabled={isRegenerating}
                  className="border-[0.5px] dark:border-white/30 hover:border-primary hover:bg-primary/5"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                  Redo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowMSWord(true);
                    setShowRedoInput(false);
                  }}
                  disabled={isRegenerating}
                  className="border-[0.5px] dark:border-white/30 hover:border-primary hover:bg-primary/5"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>

              {/* Redo Instruction Input */}
              {showRedoInput && (
                <div className="mt-3 p-3 bg-background rounded-lg border-[0.5px] border-border">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    How should I improve the translation?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={redoInstruction}
                      onChange={(e) => setRedoInstruction(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRedo()}
                      placeholder='e.g., "Make it more formal" or "Correct legal terminology for Section 138"'
                      className="flex-1 px-3 py-2 text-sm bg-background border-[0.5px] border-border dark:border-white/30 rounded-lg focus:outline-none focus:border-primary"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleRedo}
                      disabled={!redoInstruction.trim() || isRegenerating}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {/* Quick Suggestions */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setRedoInstruction("Make it more formal")}
                      className="text-xs px-2 py-1 rounded bg-accent hover:bg-accent/80 text-muted-foreground"
                    >
                      Make it more formal
                    </button>
                    <button
                      onClick={() => setRedoInstruction("Simplify the language")}
                      className="text-xs px-2 py-1 rounded bg-accent hover:bg-accent/80 text-muted-foreground"
                    >
                      Simplify the language
                    </button>
                  </div>
                </div>
              )}
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <div className="bg-white dark:bg-muted rounded-xl border-[0.5px] border-primary/30 p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                      <Languages className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Certified English Translation</p>
                    <p className="text-xs text-muted-foreground mt-1">Annexure P-3 (Translation)</p>
                  </div>
                  
                  {/* Translation Content */}
                  <div className="space-y-4 text-base leading-relaxed">
                    <p className="text-justify">{translatedText}</p>
                    <p className="text-justify text-muted-foreground">
                      [ Corresponding English translation continues... ]
                    </p>
                    <p className="text-justify text-muted-foreground mt-4">
                      The petitioner further submits that all necessary documents have been duly verified and authenticated. 
                      The property in question has clear title and there are no encumbrances or disputes pending in any court of law.
                    </p>
                    <p className="text-justify text-muted-foreground">
                      The petitioner has been paying all municipal taxes and utility bills regularly without any default. 
                      The property is registered under registration number XYZ/2004 dated 15th March 2004 in the office of the Sub-Registrar.
                    </p>
                    <p className="text-justify text-muted-foreground">
                      It is humbly submitted that the petitioner has exhausted all alternative remedies available under law 
                      and this Hon'ble Court is the only recourse for justice in this matter.
                    </p>
                    <p className="text-justify text-muted-foreground">
                      The petitioner undertakes to abide by any orders or directions that this Hon'ble Court may be pleased to pass 
                      in the interest of justice and equity.
                    </p>
                  </div>

                  {/* Certification Note */}
                  <Separator className="my-6" />
                  <div className="text-xs text-muted-foreground italic space-y-2">
                    <p className="font-semibold">Translator's Certificate:</p>
                    <p>
                      I certify that this is a true and accurate translation of the original Hindi document 
                      to the best of my knowledge and ability. The translation has been prepared in accordance 
                      with the requirements of the {defect.documentName.includes('Supreme') ? 'Supreme Court of India' : 'Delhi High Court'}.
                    </p>
                    <p className="mt-4 font-semibold">
                      Date: {new Date().toLocaleDateString('en-IN')}<br />
                      Certified by: Jubee AI Translation Services
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t-[0.5px] border-border bg-accent/20">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-muted-foreground font-medium">
              Choose how to add the translation to your filing:
            </p>
            {selectedMode && (
              <div className="text-xs font-semibold text-primary">
                Mode: {selectedMode === 'append' ? 'Append as New Annexure' : 'Replace Original'}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Append Option */}
            <button
              onClick={() => setSelectedMode('append')}
              className={`p-4 rounded-xl border-[0.5px] transition-all text-left ${
                selectedMode === 'append'
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedMode === 'append' ? 'bg-primary' : 'bg-accent'
                }`}>
                  <FileText className={`w-4 h-4 ${
                    selectedMode === 'append' ? 'text-white' : 'text-muted-foreground'
                  }`} />
                </div>
                <h4 className="font-semibold text-sm text-foreground">Translate + Append</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add translation as a new annexure. Original document remains in the filing.
              </p>
            </button>

            {/* Replace Option */}
            <button
              onClick={() => setSelectedMode('replace')}
              className={`p-4 rounded-xl border-[0.5px] transition-all text-left ${
                selectedMode === 'replace'
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedMode === 'replace' ? 'bg-primary' : 'bg-accent'
                }`}>
                  <ArrowRight className={`w-4 h-4 ${
                    selectedMode === 'replace' ? 'text-white' : 'text-muted-foreground'
                  }`} />
                </div>
                <h4 className="font-semibold text-sm text-foreground">Translate + Replace</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Replace the vernacular document with its English translation only.
              </p>
            </button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 font-semibold border-[0.5px] dark:border-white/30"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedMode && onComplete(selectedMode)}
              disabled={!selectedMode || isRegenerating}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Translation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* MS Word Window */}
      {showMSWord && (
        <MSWordWindow
          isOpen={showMSWord}
          onClose={() => setShowMSWord(false)}
          content={translatedText}
          onContentChange={(newContent) => setTranslatedText(newContent)}
          fileName="Translation_Annexure_P3.docx"
          courtFormat={{
            font: 'Times New Roman',
            fontSize: 14,
            lineSpacing: 2.0
          }}
        />
      )}
    </div>
  );
}