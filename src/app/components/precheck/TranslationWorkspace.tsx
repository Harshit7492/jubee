import { useState, useRef, useEffect } from 'react';
import { X, FileText, Languages, RotateCcw, CheckCircle, Loader2, Edit3 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface TranslationWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  defect: {
    id: string;
    title: string;
    description: string;
    documentName: string;
  } | null;
  courtLanguage?: string;
  onApprove: (translatedContent: string) => void;
  onEdit: (content: string) => void;
  onRedo: () => void;
}

export function TranslationWorkspace({
  isOpen,
  onClose,
  defect,
  courtLanguage = 'English',
  onApprove,
  onEdit,
  onRedo,
}: TranslationWorkspaceProps) {
  const [translatedContent, setTranslatedContent] = useState('');
  const [improvementInstructions, setImprovementInstructions] = useState('');
  const [showRedoInput, setShowRedoInput] = useState(false);

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  // Mock original vernacular content
  const originalContent = `अदालत के समक्ष प्रस्तुत याचिका

माननीय न्यायालय में,

याचिकाकर्ता:
श्री राजेश कुमार शर्मा
निवासी: 123, नेहरू नगर, नई दिल्ली - 110065

विरुद्ध

प्रतिवादी:
1. दिल्ली विकास प्राधिकरण
   सीओ, विकास सदन, आईएनए, नई दिल्ली
2. भूमि एवं भवन विभाग
   दिल्ली सचिवालय, आईपी एस्टेट, नई दिल्ली

याचिका की विषय-वस्तु:

1. याचिकाकर्ता ने दिनांक 15 जनवरी 2023 को प्लॉट संख्या 45, सेक्टर 12, द्वारका के आवंटन के लिए आवेदन किया था।

2. प्रतिवादी संख्या 1 द्वारा दिनांक 25 फरवरी 2023 को आवंटन पत्र जारी किया गया था, जिसमें कुल राशि रु. 45,00,000/- (पैंतालीस लाख रुपये मात्र) का भुगतान निर्धारित किया गया था।

3. याचिकाकर्ता ने निर्धारित समय-सीमा के भीतर दिनांक 10 मार्च 2023 को प्रथम किस्त के रूप में रु. 15,00,000/- (पंद्रह लाख रुपये) का भुगतान किया।

4. तत्पश्चात, दिनांक 15 अप्रैल 2023 को प्रतिवादी संख्या 1 ने एकतरफा रूप से आवंटन रद्द कर दिया और कोई कारण नहीं बताया।

5. याचिकाकर्ता ने दिनांक 20 मई 2023 को प्रतिवादी को कानूनी नोटिस भेजा, लेकिन कोई उत्तर प्राप्त नहीं हुआ।

प्रार्थना:

इस माननीय न्यायालय से विनम्र निवेदन है कि:

क) प्रतिवादी संख्या 1 द्वारा पारित आवंटन रद्दीकरण आदेश को रद्द किया जाए;

ख) प्रतिवादी को याचिकाकर्ता के पक्ष में प्लॉट का आवंटन बहाल करने का निर्देश दिया जाए;

ग) प्रतिवादी को मानसिक प्रताड़ना के लिए रु. 5,00,000/- (पांच लाख रुपये) का मुआवजा देने का आदेश दिया जाए;

घ) ऐसा कोई अन्य आदेश पारित किया जाए जो माननीय न्यायालय उचित समझे।

न्याय की आशा में,

                                    विनीत निवेदक
                                    
                                    हस्ताक्षर: _____________
                                    याचिकाकर्ता के अधिवक्ता
                                    
दिनांक: 21 मार्च 2024
स्थान: नई दिल्ली`;

  // Mock translated content
  const generatedTranslation = `PETITION BEFORE THE HONORABLE COURT

Before the Hon'ble Court,

Petitioner:
Mr. Rajesh Kumar Sharma
Resident of: 123, Nehru Nagar, New Delhi - 110065

Versus

Respondents:
1. Delhi Development Authority
   Through, Vikas Sadan, INA, New Delhi
2. Land & Building Department
   Delhi Secretariat, IP Estate, New Delhi

SUBJECT MATTER OF THE PETITION:

1. The Petitioner applied for allotment of Plot No. 45, Sector 12, Dwarka on January 15, 2023.

2. An allotment letter was issued by Respondent No. 1 on February 25, 2023, stipulating payment of a total amount of Rs. 45,00,000/- (Rupees Forty-Five Lakhs only).

3. The Petitioner made payment of Rs. 15,00,000/- (Rupees Fifteen Lakhs) as the first installment on March 10, 2023, within the prescribed time limit.

4. Subsequently, on April 15, 2023, Respondent No. 1 unilaterally cancelled the allotment without providing any reason whatsoever.

5. The Petitioner sent a legal notice to the Respondent on May 20, 2023, but no response was received.

PRAYER:

It is humbly prayed before this Hon'ble Court that:

a) The allotment cancellation order passed by Respondent No. 1 be quashed and set aside;

b) The Respondent be directed to restore the allotment of the plot in favor of the Petitioner;

c) The Respondent be ordered to pay compensation of Rs. 5,00,000/- (Rupees Five Lakhs) for mental harassment;

d) Any other order be passed as this Hon'ble Court may deem fit and proper.

In the hope of justice,

                                    Respectfully submitted,
                                    
                                    Signature: _____________
                                    Advocate for the Petitioner
                                    
Date: March 21, 2024
Place: New Delhi`;

  // Synchronized scrolling
  const handleLeftScroll = () => {
    if (leftScrollRef.current && rightScrollRef.current) {
      const scrollPercentage =
        leftScrollRef.current.scrollTop /
        (leftScrollRef.current.scrollHeight - leftScrollRef.current.clientHeight);

      rightScrollRef.current.scrollTop =
        scrollPercentage *
        (rightScrollRef.current.scrollHeight - rightScrollRef.current.clientHeight);
    }
  };

  const handleRightScroll = () => {
    if (rightScrollRef.current && leftScrollRef.current) {
      const scrollPercentage =
        rightScrollRef.current.scrollTop /
        (rightScrollRef.current.scrollHeight - rightScrollRef.current.clientHeight);

      leftScrollRef.current.scrollTop =
        scrollPercentage *
        (leftScrollRef.current.scrollHeight - leftScrollRef.current.clientHeight);
    }
  };

  const handleTranslate = () => {
    setTranslatedContent('');

    // Simulate translation process
    setTimeout(() => {
      setTranslatedContent(generatedTranslation);
      toast.success('Translation completed successfully');
    }, 2500);
  };

  // Auto-start translation when workspace opens
  useEffect(() => {
    if (isOpen && translatedContent === '') {
      handleTranslate();
    }
  }, [isOpen]);

  const handleRedoClick = () => {
    if (!showRedoInput) {
      setShowRedoInput(true);
      return;
    }

    setTranslatedContent('');
    setShowRedoInput(false);

    // Simulate regeneration with improvements
    setTimeout(() => {
      toast.success('Translation regenerated with improvements');
      setTranslatedContent(generatedTranslation);
      setImprovementInstructions('');
    }, 2500);

    onRedo();
  };

  const handleApprove = () => {
    onApprove(translatedContent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[16px] flex items-center justify-center z-50 p-4">
      <div className="bg-card border-[0.5px] border-[#1E3A8A]/30 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1E3A8A]/10 border-b-[0.5px] border-[#1E3A8A]/20 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/20 flex items-center justify-center">
                <Languages className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E3A8A]">Translate with Jubee</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {translatedContent === '' && 'Generating translation...'}
                  {translatedContent !== '' && 'Review and verify translation before approval'}
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

        {/* Translating State */}
        {translatedContent === '' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#1E3A8A]/10 flex items-center justify-center mx-auto">
                <Loader2 className="w-10 h-10 text-[#1E3A8A] animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Generating Translation</h3>
                <p className="text-sm text-muted-foreground">
                  AI is translating your document to certified English...
                </p>
              </div>
              <div className="w-64 mx-auto bg-muted rounded-full h-2 overflow-hidden">
                <div className="h-full bg-[#1E3A8A] rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        )}

        {/* Review State - Dual Pane */}
        {translatedContent !== '' && (
          <>
            {/* Dual Pane Workspace */}
            <div className="flex-1 flex gap-0 overflow-hidden">
              {/* Left Window - Original Reference */}
              <div className="w-1/2 flex flex-col border-r-[0.5px] border-border">
                {/* Left Header */}
                <div className="bg-[#F9F9F9] dark:bg-muted border-b-[0.5px] border-border px-6 py-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1E3A8A]" />
                    <span className="text-sm font-bold text-[#1E3A8A]">Original Reference</span>
                    <span className="text-xs text-muted-foreground ml-auto">Hindi (Read-only)</span>
                  </div>
                </div>

                {/* Left Content - Non-editable */}
                <div
                  ref={leftScrollRef}
                  onScroll={handleLeftScroll}
                  className="flex-1 overflow-y-auto bg-[#F9F9F9] dark:bg-muted p-8"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div className="max-w-2xl mx-auto">
                    <pre className="font-['Noto_Sans_Devanagari',sans-serif] text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                      {originalContent}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Right Window - Translated Draft */}
              <div className="w-1/2 flex flex-col">
                {/* Right Header */}
                <div className="bg-[#1E3A8A]/5 border-b-[0.5px] border-[#1E3A8A]/20 px-6 py-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-[#1E3A8A]" />
                    <span className="text-sm font-bold text-[#1E3A8A]">Translated Draft</span>
                    <span className="text-xs text-muted-foreground ml-auto">English (Editable)</span>
                  </div>
                </div>

                {/* Right Content - Editable */}
                <div
                  ref={rightScrollRef}
                  onScroll={handleRightScroll}
                  className="flex-1 overflow-y-auto bg-white dark:bg-card p-8"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div className="max-w-2xl mx-auto">
                    <textarea
                      value={translatedContent}
                      onChange={(e) => setTranslatedContent(e.target.value)}
                      className="w-full min-h-full border-none outline-none resize-none font-serif text-sm leading-relaxed bg-transparent text-foreground"
                      style={{
                        fontFamily: '"Times New Roman", Times, serif',
                        lineHeight: '1.8'
                      }}
                    />
                  </div>
                </div>

                {/* Redo Input Bubble */}
                {showRedoInput && (
                  <div className="bg-[#1E3A8A]/5 border-t-[0.5px] border-[#1E3A8A]/20 px-6 py-4">
                    <label className="text-xs font-semibold text-[#1E3A8A] block mb-2">
                      How should I improve this?
                    </label>
                    <input
                      type="text"
                      value={improvementInstructions}
                      onChange={(e) => setImprovementInstructions(e.target.value)}
                      placeholder="e.g., Use more formal language, improve legal terminology..."
                      className="w-full px-4 py-2 border-[0.5px] border-[#1E3A8A]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 bg-white"
                      autoFocus
                    />
                  </div>
                )}

                {/* Action CTAs */}
                <div className="bg-card border-t-[0.5px] border-border px-6 py-4 flex gap-3 flex-shrink-0">
                  <Button
                    onClick={handleRedoClick}
                    variant="ghost"
                    className="flex-1 border-[0.5px] border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/5 font-semibold"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Redo
                  </Button>
                  <Button
                    onClick={() => onEdit(translatedContent)}
                    variant="ghost"
                    className="flex-1 border-[0.5px] border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/5 font-semibold"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
