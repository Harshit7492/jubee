import { useState } from 'react';
import { ArrowLeft, Sparkles, MessageSquare, Copy, Download, X, Send } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { cn } from '@/app/components/ui/utils';
import jubeeLogo from '@/assets/jubee-logo.png';

interface JudgmentWorkspaceProps {
  caseId: string;
  caseTitle: string;
  citation: string;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function JudgmentWorkspace({ caseId, caseTitle, citation, onBack }: JudgmentWorkspaceProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLimit, setChatLimit] = useState({ used: 0, total: 10 });
  const [showSummary, setShowSummary] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Mock judgment content
  const judgmentContent = `IN THE HIGH COURT OF DELHI AT NEW DELHI

SUBJECT: ARBITRATION ACT, 1996

ARB.P. 234/2024

ABC CORPORATION                                    ...Petitioner
                    versus
XYZ BANK LIMITED                                   ...Respondent

CORAM:
HON'BLE MR. JUSTICE [NAME]
HON'BLE MR. JUSTICE [NAME]

JUDGMENT

Per Justice [Name]:

1. The present petition has been filed under Section 9 of the Arbitration and Conciliation Act, 1996 seeking interim measures of protection, specifically restraining the respondent from invoking a bank guarantee furnished by the petitioner.

FACTS IN BRIEF

2. The petitioner and respondent entered into a contract dated 15th March 2023 for the supply of equipment worth Rs. 50 crores. As per the terms of the contract, the petitioner furnished an unconditional and irrevocable bank guarantee of Rs. 5 crores as performance security.

3. Disputes arose between the parties regarding alleged defects in the supplied equipment. The petitioner invoked the arbitration clause contained in the contract. Prior to the constitution of the arbitral tribunal, the respondent threatened to invoke the bank guarantee.

4. The petitioner contends that the invocation of the bank guarantee would be fraudulent and would cause irretrievable harm and injustice. The petitioner submits that there has been no breach of contract on its part and the equipment supplied is as per specifications.

SUBMISSIONS OF THE PETITIONER

5. Learned counsel for the petitioner submitted that:

   (a) The invocation of the bank guarantee is ex facie fraudulent as there has been no breach of contract on the part of the petitioner;
   
   (b) The petitioner has a prima facie case as the equipment supplied conforms to the agreed specifications;
   
   (c) The balance of convenience is in favor of the petitioner as invocation of the guarantee would cause irretrievable harm;
   
   (d) The court has jurisdiction under Section 9 of the Arbitration Act to grant interim relief restraining invocation of bank guarantees in exceptional circumstances.

6. The petitioner relied upon the judgments in State Bank of India v. Rahul Enterprises (2024) 1 SCC 567 and National Highway Authority v. Construction Co. 2024 SCC OnLine SC 234.

SUBMISSIONS OF THE RESPONDENT

7. Learned counsel for the respondent vehemently opposed the petition and submitted that:

   (a) Bank guarantees are independent contracts and invocation thereof cannot be restrained except in cases of established fraud or special equities;
   
   (b) The petitioner has failed to establish any prima facie case of fraud;
   
   (c) Mere pendency of arbitration proceedings is not a ground to stay invocation of bank guarantee;
   
   (d) The petitioner has breached the contract by supplying defective equipment which fails to meet the specified parameters.

8. The respondent relied upon the judgments in ABC Limited v. XYZ Corporation and Tech Solutions Pvt. Ltd. v. Infrastructure Development Corp.

LEGAL POSITION

9. It is well settled that bank guarantees are independent and unconditional contracts. The beneficiary of a bank guarantee is entitled to invoke it in accordance with its terms. Courts are generally reluctant to interfere with invocation of bank guarantees as it would undermine commercial certainty.

10. However, this Court has the power under Section 9 of the Arbitration Act to grant interim measures. The Supreme Court in various judgments has held that invocation of bank guarantees can be stayed in exceptional circumstances, particularly where:

    (a) There is established or prima facie fraud; or
    (b) Allowing invocation would lead to irretrievable injustice.

11. The threshold for establishing fraud is high. It must be of an "egregious nature" which would vitiate the entire underlying transaction. Mere allegations or suspicions are insufficient.

ANALYSIS AND FINDINGS

12. We have carefully considered the submissions of learned counsel for both parties and perused the record.

13. In the present case, the petitioner has produced certain test reports and certification documents which prima facie indicate that the equipment supplied may conform to the contractual specifications. The respondent's allegations of defects appear to require detailed examination.

14. While we are not making any final findings on the merits (which will be determined by the arbitral tribunal), we are of the prima facie view that this may not be a clear-cut case of breach justifying immediate invocation of the bank guarantee.

15. The invocation of a bank guarantee of Rs. 5 crores would cause significant financial prejudice to the petitioner. If the petitioner ultimately succeeds in arbitration, the recovery of such amounts may prove difficult.

16. On the other hand, the respondent's interests can be adequately protected by directing the petitioner to furnish additional security or by expediting the arbitration proceedings.

17. Balancing the equities and considering the prima facie case, we are inclined to grant limited interim relief to the petitioner.

ORDER

18. For the reasons stated above:

    (a) The respondent is restrained from invoking the bank guarantee dated 15th March 2023 for a period of 90 days from today;
    
    (b) The petitioner shall constitute the arbitral tribunal within 30 days;
    
    (c) The petitioner shall furnish an additional bank guarantee of Rs. 1 crore within 15 days;
    
    (d) The parties shall ensure that the first hearing before the arbitral tribunal takes place within 60 days.

19. This order is granted purely as an interim measure and shall not prejudice the rights of either party in the arbitration proceedings.

20. The petition is disposed of in the above terms.

                                                    (JUSTICE [NAME])
                                                    (JUSTICE [NAME])

NEW DELHI
JANUARY 15, 2024`;

  const summaryContent = `**Key Points:**

• **Issue**: Whether invocation of bank guarantee should be stayed under Section 9 of Arbitration Act 1996

• **Petitioner's Case**: Equipment supplied conforms to specifications; invocation would be fraudulent and cause irretrievable harm

• **Respondent's Case**: Equipment is defective; bank guarantees are independent contracts and cannot be interfered with absent established fraud

• **Legal Principle**: Courts can stay invocation of bank guarantees only in exceptional circumstances - established fraud or irretrievable injustice

• **Court's Finding**: Prima facie case exists; test reports indicate equipment may conform to specifications; requires detailed examination

• **Ratio Decidendi**: Balance of convenience favors temporary restraint as Rs. 5 crore invocation would cause significant financial prejudice while respondent's interests can be protected through additional security

• **Order**: Bank guarantee invocation stayed for 90 days; petitioner to constitute arbitral tribunal within 30 days and furnish additional Rs. 1 crore guarantee within 15 days

• **Precedents Cited**: State Bank of India v. Rahul Enterprises (2024) 1 SCC 567; National Highway Authority v. Construction Co. 2024 SCC OnLine SC 234`;

  const handleSendMessage = () => {
    if (!chatInput.trim() || chatLimit.used >= chatLimit.total) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setChatLimit({ ...chatLimit, used: chatLimit.used + 1 });

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(chatInput),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('ratio') || lowerQuery.includes('decidendi')) {
      return 'The ratio decidendi of this case is that courts can exercise discretion under Section 9 of the Arbitration Act to temporarily stay invocation of bank guarantees when there is a prima facie case and the balance of convenience favors the petitioner, even though such relief is exceptional.';
    }
    
    if (lowerQuery.includes('fraud')) {
      return 'The Court noted that while fraud must be of an "egregious nature" to warrant interference with bank guarantees, in this case there was sufficient prima facie evidence through test reports that required detailed examination, creating doubt about the respondent\'s fraud allegations.';
    }
    
    if (lowerQuery.includes('precedent') || lowerQuery.includes('relied')) {
      return 'The judgment relied on State Bank of India v. Rahul Enterprises (2024) 1 SCC 567 and National Highway Authority v. Construction Co. 2024 SCC OnLine SC 234 to establish the legal framework for granting interim relief against bank guarantee invocation.';
    }
    
    return 'Based on the judgment, the Court balanced the equities by considering the petitioner\'s prima facie case and the potential for irretrievable harm against the principle that bank guarantees are independent contracts. The 90-day stay with conditions for additional security represents this careful balancing.';
  };

  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);
    setTimeout(() => {
      setShowSummary(true);
      setIsGeneratingSummary(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="border-b-[0.5px] border-border bg-card/50 backdrop-blur-md shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-foreground mb-0.5 line-clamp-1">{caseTitle}</h1>
              <p className="text-xs text-muted-foreground font-mono">{citation}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[0.5px] hover:bg-accent text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[0.5px] hover:bg-accent text-xs"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Citation
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Width Judgment Reader */}
      <div className="flex-1 bg-background overflow-hidden flex flex-col">
        <div className="px-8 py-4 border-b-[0.5px] border-border bg-card/30">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Full Judgment</h2>
        </div>
        <ScrollArea className="flex-1 px-12 py-8">
          <div 
            className="max-w-4xl mx-auto text-foreground leading-relaxed"
            style={{ fontFamily: '"Source Serif Pro", Georgia, serif', fontSize: '15px', lineHeight: '1.8' }}
          >
            {judgmentContent.split('\n').map((line, idx) => (
              <p key={idx} className="mb-4 whitespace-pre-wrap">
                {line}
              </p>
            ))}
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

      {/* AI Assistant Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-[480px] bg-background border-l-[0.5px] border-border shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        showChat ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Assistant Header */}
        <div className="px-6 py-4 border-b-[0.5px] border-[#1E3A8A]/20 bg-gradient-to-r from-[#1E3A8A]/5 to-transparent flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center overflow-hidden">
                <img src={jubeeLogo} alt="Jubee" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">AI Judgment Assistant</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
            Analyze and query this judgment
          </p>
        </div>

        {/* Summary Section */}
        <div className={cn(
          "border-b-[0.5px] border-border transition-all flex-shrink-0",
          showSummary ? "px-6 py-3" : "px-6 py-4"
        )}>
          {!showSummary ? (
            <Button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold h-10"
            >
              {isGeneratingSummary ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  One-Click Summary
                </>
              )}
            </Button>
          ) : (
            <div className="bg-[#1E3A8A]/5 border-[0.5px] border-[#1E3A8A]/20 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b-[0.5px] border-[#1E3A8A]/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">Summary</span>
                </div>
                <button
                  onClick={() => setShowSummary(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <ScrollArea className="max-h-[240px] px-3 py-3">
                <div className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                  {summaryContent}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="px-6 py-3 border-b-[0.5px] border-border bg-accent/30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">Chat with Judgment</span>
              </div>
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded",
                chatLimit.used >= chatLimit.total 
                  ? "bg-red-500/10 text-red-600" 
                  : "bg-[#1E3A8A]/10 text-[#1E3A8A]"
              )}>
                {chatLimit.used}/{chatLimit.total} operations
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-6 py-4">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center mb-3">
                  <img src={jubeeLogo} alt="Jubee" className="w-7 h-7 object-contain" />
                </div>
                <p className="text-xs font-semibold text-foreground mb-1">Ask me anything about this judgment</p>
                <p className="text-[10px] text-muted-foreground max-w-[280px]">
                  Example: "What was the ratio decidendi?" or "Summarize the key arguments"
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed",
                        message.role === 'user'
                          ? 'bg-[#1E3A8A] text-white'
                          : 'bg-accent border-[0.5px] border-border text-foreground'
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Chat Input */}
          <div className="px-6 py-4 border-t-[0.5px] border-border bg-card/50 flex-shrink-0">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about this judgment..."
                disabled={chatLimit.used >= chatLimit.total}
                className="flex-1 px-3 py-2 bg-background border-[0.5px] border-border rounded-lg text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || chatLimit.used >= chatLimit.total}
                size="sm"
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-9 px-3"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
            
            {/* Chat Limit Warning */}
            {chatLimit.used >= chatLimit.total && (
              <p className="text-[10px] text-red-600 dark:text-red-500 font-semibold">
                Chat limit reached. Summary and download still available.
              </p>
            )}
          </div>
        </div>

        {/* Workflow Restriction Notice */}
        <div className="px-6 py-4 border-t-[0.5px] border-border bg-accent/20 flex-shrink-0">
          <div className="group relative">
            <Button
              disabled
              className="w-full bg-muted text-muted-foreground cursor-not-allowed opacity-60 h-9 text-xs font-semibold"
            >
              Integrate with Case Workflow
            </Button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-[#1E3A8A] text-white text-[10px] font-semibold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                Direct workflow integration is currently restricted for Radar results
              </div>
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground text-center mt-2">
            Radar cases are for research purposes only
          </p>
        </div>
      </div>
    </div>
  );
}
