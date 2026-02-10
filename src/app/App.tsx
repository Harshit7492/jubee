import { useState } from "react";
import { JubeeSidebar } from "@/app/components/JubeeSidebar";
import { JubeeFooter } from "@/app/components/JubeeFooter";
import { ResearchBoardView } from "@/app/components/ResearchBoardView";
import { MyCasesView } from "@/app/components/MyCasesView";
import { MyDiaryView } from "@/app/components/MyDiaryView";
import { PreCheckWorkflow } from "@/app/components/research-tools/PreCheckWorkflow";
import { PrecedentRadarView } from "@/app/components/PrecedentRadarView";
import { MySpaceView } from "@/app/components/MySpaceView";
import { RecentActivityView } from "@/app/components/RecentActivityView";
import { AlertsView } from "@/app/components/AlertsView";
import { LegalUpdatesView } from "@/app/components/LegalUpdatesView";
import { CaseDetailView } from "@/app/components/CaseDetailView";
import { ResearchToolChat } from "@/app/components/tools/ResearchToolChat";
import { DraftingToolChat } from "@/app/components/tools/DraftingToolChat";
import { TranslationToolChat } from "@/app/components/tools/TranslationToolChat";
import { TranslationView } from "@/app/components/TranslationView";
import { DraftsmanToolChat } from "@/app/components/tools/DraftsmanToolChat";
import { CrossExaminerToolChat } from "@/app/components/tools/CrossExaminerToolChat";
import { CrossExaminerTool } from "@/app/components/research-tools/CrossExaminerTool";
import { ProfileView } from "@/app/components/ProfileView";
import { NoteTakingView } from "@/app/components/NoteTakingView";
import { SignIn } from "@/app/components/auth/SignIn";
import { SignUp } from "@/app/components/auth/SignUp";
import { ForgotPassword } from "@/app/components/auth/ForgotPassword";
import { ConfirmationDialog } from "@/app/components/ConfirmationDialog";
import { Toaster } from "@/app/components/ui/sonner";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { X, Send } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import jubeeLogo from '@/assets/jubee-logo.png';

interface SessionData {
  id: string;
  toolName: string;
  title: string;
}

// Map session conversations with proper messages format
const sessionConversations: Record<string, any> = {
  "1": [
    {
      id: "m1",
      type: "user",
      content:
        "I need to research Section 138 NI Act precedents for a dishonored cheque case",
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: "m2",
      type: "ai",
      content:
        "I found relevant Supreme Court precedents on this topic. Here are the key cases:",
      timestamp: new Date(Date.now() - 7190000),
      cases: [
        {
          name: "Rangappa v. Sri Mohan",
          citation: "(2010) 11 SCC 441",
          summary:
            "Landmark judgment establishing burden of proof in Section 138 NI Act cases. Once dishonor is proved, burden shifts to the accused.",
        },
        {
          name: "Kumar Exports v. Sharma Carpets",
          citation: "(2009) 2 SCC 513",
          summary:
            "Clarified the limitation period for filing complaints under Section 138 of the Negotiable Instruments Act.",
        },
        {
          name: "M.M.T.C. Ltd. v. Medchl Chemicals",
          citation: "(2002) 1 SCC 234",
          summary:
            "Explained the statutory presumption under Section 139 regarding consideration for cheque issuance.",
        },
      ],
    },
    {
      id: "m3",
      type: "user",
      content: "Give me more details on the Rangappa case",
      timestamp: new Date(Date.now() - 7100000),
    },
    {
      id: "m4",
      type: "ai",
      content:
        "I found relevant Supreme Court precedents on this topic. Here are the key cases:",
      timestamp: new Date(Date.now() - 7090000),
      cases: [
        {
          name: "Rangappa v. Sri Mohan - Detailed Analysis",
          citation: "(2010) 11 SCC 441",
          summary:
            "**Key Holdings:** This landmark judgment clarified that once the complainant proves dishonor of cheque with proper notice, the burden shifts to the accused. The accused must prove by preponderance of probabilities that the cheque was not issued for any debt or liability. The Court emphasized that mere denial is insufficient - the defense must lead cogent evidence to rebut the presumption.",
        },
      ],
    },
  ],
  "2": [
    {
      id: "m1",
      type: "user",
      content:
        "Draft a bail application for anticipatory bail in a Section 420 IPC case",
      timestamp: new Date(Date.now() - 18000000),
    },
    {
      id: "m2",
      type: "ai",
      content:
        "I'll draft an anticipatory bail application under Section 438 CrPC. Here's the complete draft:",
      timestamp: new Date(Date.now() - 17990000),
      draftDocument: {
        title: "Anticipatory Bail Application",
        content: `IN THE COURT OF SESSIONS JUDGE AT [DISTRICT]

CRIMINAL MISC. APPLICATION NO. ___ OF 2026
U/S 438 Cr.P.C.

[Applicant Name] ... Applicant

VERSUS

State of [State] & Anr. ... Respondents

APPLICATION FOR ANTICIPATORY BAIL

Most Respectfully Showeth:

1. That the applicant apprehends arrest in connection with FIR No. ___ dated ___ registered at P.S. ___ for offences punishable under Section 420 IPC.

2. That the applicant is a law-abiding citizen with deep roots in the community, having permanent residence at [Address] and has no criminal antecedents whatsoever.

3. That the allegations are false, frivolous and motivated to settle personal scores.

GROUNDS FOR GRANTING ANTICIPATORY BAIL:

A. Deep roots in community: The applicant has been residing at the same address for the past [X] years, owns immovable property worth Rs. [Amount], and is engaged in the business of [Business Details].

B. No flight risk: The applicant has cooperated with the investigation at every stage and has no intention to abscond or flee from justice.

C. False implication: The allegations are motivated and have been leveled to harass the applicant.

D. Settled law on Section 438: The Hon'ble Supreme Court in Sushila Aggarwal v. State (NCT of Delhi) (2020) has held that anticipatory bail should not be refused merely because the offence is serious.

PRAYER

In the light of facts & circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to grant anticipatory bail to the applicant.

Place: [City]
Date: [Date]                                     (Advocate for Applicant)`,
      },
    },
    {
      id: "m3",
      type: "user",
      content:
        "Can you add more grounds regarding the applicant's medical condition?",
      timestamp: new Date(Date.now() - 17900000),
    },
    {
      id: "m4",
      type: "ai",
      content:
        "I've added additional grounds regarding medical condition:",
      timestamp: new Date(Date.now() - 17890000),
      draftDocument: {
        title: "Additional Grounds - Medical Condition",
        content: `E. MEDICAL CONDITION OF APPLICANT:

That the applicant is suffering from [Medical Condition] and is under regular medical treatment at [Hospital Name]. The applicant requires constant medical supervision and specialized care which cannot be provided in custody.

The applicant is physically unfit to undergo the rigors of police custody and detention would seriously jeopardize the applicant's health and life.

Medical certificates and prescription records are annexed herewith as Annexure-A.

The Hon'ble Supreme Court in Sushila Aggarwal v. State (NCT of Delhi) (2020) 13 SCC 1 has held that the health condition of the applicant is a relevant factor to be considered while granting anticipatory bail.`,
      },
    },
  ],
  "3": [
    {
      id: "m1",
      type: "user",
      content:
        "I have a High Court judgment in Hindi that I need translated to English. Let me upload it.",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "m2",
      type: "ai",
      content:
        "📎 **Document received:** HC_Judgment_Hindi.pdf (12 pages)\n\nI'll translate this High Court judgment from Hindi to English while preserving legal terminology and formatting. Processing...",
      timestamp: new Date(Date.now() - 86390000),
      attachment: {
        name: "HC_Judgment_Hindi.pdf",
        type: "pdf",
        size: "2.4 MB",
      },
    },
    {
      id: "m3",
      type: "ai",
      content:
        "✅ **Translation Complete**\n\n**HIGH COURT OF ALLAHABAD**\n**Civil Appeal No. 1234 of 2023**\n\n**IN THE MATTER OF:**\nRam Prasad ... Appellant\nVERSUS\nShyam Lal & Ors. ... Respondents\n\n**JUDGMENT**\n\nThis appeal arises from the impugned order dated 15.03.2023 passed by the learned Civil Judge (Senior Division), Lucknow in Civil Suit No. 567/2022, whereby the learned Trial Court dismissed the suit filed by the appellant for partition and separate possession of ancestral property...\n\n[Full 12-page translation completed]\n\nThe translated document maintains all legal citations, party names, and formatting from the original Hindi judgment.",
      timestamp: new Date(Date.now() - 86300000),
      downloadLink: {
        name: "HC_Judgment_English.pdf",
        url: "#",
      },
    },
    {
      id: "m4",
      type: "user",
      content: "Give me a summary of the judgment",
      timestamp: new Date(Date.now() - 86200000),
    },
    {
      id: "m5",
      type: "ai",
      content:
        "📋 **Judgment Summary**\n\n**Case:** Partition suit for ancestral property\n**Court:** Allahabad High Court\n**Result:** Appeal dismissed\n\n**Key Points:**\n1. The appellant claimed 1/4th share in ancestral property as legal heir\n2. Trial Court rejected the suit finding that the property was self-acquired by respondent's father\n3. High Court upheld the finding noting:\n   • Property was purchased through documented sale deed in 1985\n   • Clear evidence of consideration paid from self-earned income\n   • Appellant failed to prove joint family property status\n4. Court relied on Hindu Succession Act provisions regarding self-acquired property\n\n**Conclusion:** Property belongs absolutely to the respondents as self-acquired property of their father.\n\nWould you like me to translate any other documents or explain specific legal terms?",
      timestamp: new Date(Date.now() - 86190000),
    },
  ],
  "4": [
    {
      id: "m1",
      type: "user",
      content:
        "I have a service agreement contract that needs review and editing. Let me upload it.",
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: "m2",
      type: "ai",
      content:
        "📎 **Document received:** Service_Agreement_Draft.docx (8 pages)\n\nI'll review this service agreement and provide AI-assisted suggestions for improvements. Analyzing contract structure, clauses, and potential legal issues...",
      timestamp: new Date(Date.now() - 172790000),
      attachment: {
        name: "Service_Agreement_Draft.docx",
        type: "docx",
        size: "1.2 MB",
      },
    },
    {
      id: "m3",
      type: "ai",
      content:
        "✅ **Contract Review Complete**\n\nI've analyzed your service agreement and identified several areas for improvement:",
      timestamp: new Date(Date.now() - 172700000),
      review: {
        critical: [
          "Clause 4.2 - Payment Terms: Ambiguous payment schedule. Recommend specific dates and milestone-based payments.",
          "Clause 7 - Termination: No cure period mentioned before termination for breach.",
          "Clause 9 - Liability Cap: Missing limitation of liability clause exposing both parties to unlimited damages.",
        ],
        moderate: [
          "Clause 3 - Scope of Services: Too vague, should include detailed deliverables and acceptance criteria",
          "Clause 10 - Dispute Resolution: Add arbitration clause before litigation to reduce costs",
        ],
        suggestions: [
          "Add Force Majeure clause to protect against unforeseen circumstances like pandemics",
          "Include confidentiality obligations for both parties with specific time periods",
          "Add intellectual property rights clause defining ownership of work product",
        ],
      },
    },
    {
      id: "m4",
      type: "user",
      content:
        "Can you draft an improved version of Clause 4.2 on payment terms?",
      timestamp: new Date(Date.now() - 172600000),
    },
    {
      id: "m5",
      type: "ai",
      content:
        "✅ **Improved Clause 4.2 - Payment Terms**\n\nHere's a revised version with clear milestones and payment schedule:\n\n**CLAUSE 4.2 - PAYMENT TERMS**\n\n4.2.1 The Client shall pay the Service Provider a total fee of Rs. [Amount] (Rupees [Amount in Words] only) excluding applicable taxes.\n\n4.2.2 The payment shall be made in the following manner:\n\n(a) 30% (Thirty Percent) as advance payment within 7 days of signing this Agreement\n(b) 40% (Forty Percent) upon completion and acceptance of Phase 1 deliverables\n(c) 30% (Thirty Percent) upon final delivery and acceptance of all work\n\n4.2.3 All payments shall be made within 15 days of receipt of invoice via bank transfer to the account specified in Schedule-A.\n\n4.2.4 Delayed payments beyond 30 days shall attract interest at 18% per annum.\n\nThis revised clause provides clear payment schedule, specific timelines, and consequences for delays.",
      timestamp: new Date(Date.now() - 172590000),
    },
  ],
  "6": [
    {
      id: "m1",
      type: "user",
      content:
        "I need to prepare cross-examination questions for a hostile witness in a criminal trial. The witness is claiming to have seen the incident but their statement has inconsistencies.",
      timestamp: new Date(Date.now() - 345600000),
    },
    {
      id: "m2",
      type: "ai",
      content:
        "I've prepared a strategic cross-examination framework to expose the witness's inconsistencies:",
      timestamp: new Date(Date.now() - 345590000),
      questions: [
        {
          phase: "Phase 1: Establishing Credibility Issues",
          items: [
            "You stated in your examination-in-chief that you witnessed the incident at 9:30 PM. Is that correct?",
            "Can you tell the court what the weather conditions were at that time?",
            "Was there adequate street lighting at the location?",
            "From what distance were you observing the incident?",
            "Were you wearing spectacles or any visual aids?",
          ],
        },
        {
          phase: "Phase 2: Exposing Timeline Inconsistencies",
          items: [
            "In your FIR statement dated [Date], you mentioned the time as 9:00 PM. Can you explain the 30-minute discrepancy?",
            "You stated you immediately called the police. What time did you make that call?",
            "[Show call records] These records show you called police at 10:15 PM. How do you explain this delay?",
            "Were you doing anything else during this time between the incident and calling police?",
          ],
        },
        {
          phase: "Phase 3: Challenging Identification",
          items: [
            "You claim you could clearly see and identify the accused from 50 feet away. Correct?",
            "You mentioned it was 9:30 PM in December. Would you agree it was dark?",
            "If the nearest street light was non-functional, how could you see clearly?",
            "Had you ever met the accused before this incident?",
            "Is it not true that you only saw a silhouette and not actual features?",
          ],
        },
      ],
    },
    {
      id: "m3",
      type: "user",
      content:
        "Add questions to challenge the witness about their relationship with the complainant",
      timestamp: new Date(Date.now() - 345500000),
    },
    {
      id: "m4",
      type: "ai",
      content:
        "I've added Phase 4 to expose potential bias based on relationship with complainant:",
      timestamp: new Date(Date.now() - 345490000),
      questions: [
        {
          phase: "Phase 4: Establishing Bias and Interest",
          items: [
            "How long have you known the complainant?",
            "Would you describe the complainant as your friend or relative?",
            "Have you received any financial benefit from the complainant before or after this incident?",
            "Are you aware that the accused and complainant had a business dispute pending?",
            "Is it not true that you were present at the complainant's house just one day before filing your statement?",
            "I put it to you that you are deposing falsely to help your friend, the complainant.",
            "I suggest to you that you never witnessed this incident and are testifying based on what the complainant told you.",
          ],
        },
      ],
    },
  ],
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<
    "signin" | "signup" | "forgot-password"
  >("signin");
  const [activeView, setActiveView] =
    useState("research-board");
  const [previousView, setPreviousView] = useState<string>("research-board"); // Track previous view
  const [selectedSession, setSelectedSession] =
    useState<SessionData | null>(null);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [resetResearchBoard, setResetResearchBoard] = useState(false);
  
  // Global AI Chat states
  const [showGlobalChat, setShowGlobalChat] = useState(false);
  const [globalChatInput, setGlobalChatInput] = useState('');
  const [isGlobalAITyping, setIsGlobalAITyping] = useState(false);
  const [globalChatMessages, setGlobalChatMessages] = useState<Array<{
    id: string;
    text: string;
    isAI: boolean;
    timestamp: Date;
  }>>([]);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
  };

  const handleSwitchToSignUp = () => {
    setAuthView("signup");
  };

  const handleSwitchToSignIn = () => {
    setAuthView("signin");
  };

  const handleForgotPassword = () => {
    setAuthView("forgot-password");
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView("research-board");
    setSelectedSession(null);
    setSelectedCase(null);
    setAuthView("signin");
  };

  const handleBackToMain = () => {
    // Go back to previous view instead of always "research-board"
    const fallbackView = previousView && previousView !== activeView ? previousView : "research-board";
    setActiveView(fallbackView);
    setSelectedSession(null);
  };

  const handleNavigate = (newView: string) => {
    // Track the current view as previous before navigating
    if (activeView !== newView) {
      setPreviousView(activeView);
    }
    setActiveView(newView);
  };

  const handleSelectSession = (
    sessionId: string,
    toolName: string,
    title: string,
  ) => {
    setSelectedSession({ id: sessionId, toolName, title });

    // Route to the appropriate tool view
    const toolViewMap: Record<string, string> = {
      "Legal Research": "research-tool",
      "AI Drafting": "drafting-tool",
      "Jubee Bhasha": "translation-tool",
      "Jubee Counsel": "draftsman-tool",
      "Cross-Examiner": "cross-examiner-tool",
    };

    setActiveView(toolViewMap[toolName] || "research-board");
  };

  const handleSelectCase = (caseData: any) => {
    setSelectedCase(caseData);
  };

  const handleBackToCases = () => {
    setSelectedCase(null);
  };

  const handleNavigateFromCase = (view: string) => {
    setActiveView(view);
    setSelectedCase(null); // Clear case selection when navigating away
  };

  const handleSendGlobalChatMessage = () => {
    if (!globalChatInput.trim()) return;

    // Add user message
    setGlobalChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: globalChatInput,
      isAI: false,
      timestamp: new Date()
    }]);

    setGlobalChatInput('');
    setIsGlobalAITyping(true);

    // Simulate AI response based on current view
    setTimeout(() => {
      setIsGlobalAITyping(false);
      let aiResponse = "I'm Jubee, your AI legal assistant. How can I help you today?";
      
      if (activeView === "research-board") {
        aiResponse = "I can help you with legal research, case law analysis, and finding relevant precedents. What would you like to research?";
      } else if (activeView === "precedent") {
        aiResponse = "I can help you find and analyze precedents from Supreme Court of India and Delhi High Court. What case law are you looking for?";
      } else if (activeView === "myspace") {
        aiResponse = "I can help you organize your documents, find saved files, or assist with document management. What do you need?";
      } else if (activeView === "cases") {
        aiResponse = "I can help you manage your cases, track deadlines, or provide case-specific insights. How can I assist?";
      }

      setGlobalChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isAI: true,
        timestamp: new Date()
      }]);
    }, 1500);
  };

  const renderView = () => {
    const sessionMessages = selectedSession
      ? sessionConversations[selectedSession.id]
      : [];

    switch (activeView) {
      case "research-board":
        return (
          <ResearchBoardView
            sessionData={null}
            onClearSession={() => setSelectedSession(null)}
            onNavigate={handleNavigate}
            resetToDefault={resetResearchBoard}
          />
        );
      case "recent-activity":
        return (
          <RecentActivityView
            onBack={handleBackToMain}
            onSelectSession={handleSelectSession}
          />
        );
      case "research-tool":
        return (
          <ResearchToolChat
            onBack={handleBackToMain}
            sessionId={selectedSession?.id}
            initialMessages={sessionMessages}
            sessionTitle={selectedSession?.title}
          />
        );
      case "drafting-tool":
        return (
          <DraftingToolChat
            onBack={handleBackToMain}
            sessionId={selectedSession?.id}
            initialMessages={sessionMessages}
            sessionTitle={selectedSession?.title}
          />
        );
      case "translation-tool":
        return (
          <TranslationToolChat
            onBack={handleBackToMain}
            sessionId={selectedSession?.id}
            initialMessages={sessionMessages}
            sessionTitle={selectedSession?.title}
          />
        );
      case "draftsman-tool":
        return (
          <DraftsmanToolChat
            onBack={handleBackToMain}
            sessionId={selectedSession?.id}
            initialMessages={sessionMessages}
            sessionTitle={selectedSession?.title}
          />
        );
      case "cross-examiner-tool":
        return (
          <CrossExaminerToolChat
            onBack={handleBackToMain}
            sessionId={selectedSession?.id}
            initialMessages={sessionMessages}
            sessionTitle={selectedSession?.title}
          />
        );
      case "myspace":
        return <MySpaceView />;
      case "cases":
        return <MyCasesView onSelectCase={handleSelectCase} />;
      case "diary":
        return (
          <MyDiaryView
            onBack={handleBackToMain}
            onNavigateToResearchBoard={() =>
              handleNavigate("research-board")
            }
            onNavigate={handleNavigate}
            onLogout={handleLogoutClick}
          />
        );
      case "precedent":
        return <PrecedentRadarView onBack={handleBackToMain} />;
      case "translation":
        return <TranslationView onBack={handleBackToMain} />;
      case "cross-examiner":
        return <CrossExaminerTool onBack={handleBackToMain} />;
      case "legal-updates":
        return <LegalUpdatesView onBack={handleBackToMain} />;
      case "alerts":
        return <AlertsView />;
      case "profile":
        return (
          <ProfileView
            onBack={handleBackToMain}
            onNavigate={setActiveView}
            onLogout={handleLogoutClick}
          />
        );
      case "note-taking":
        return <NoteTakingView />;
      default:
        return (
          <ResearchBoardView
            sessionData={null}
            onClearSession={() => setSelectedSession(null)}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        authView === "signin" ? (
          <SignIn
            onSignIn={handleSignIn}
            onSwitchToSignUp={handleSwitchToSignUp}
            onForgotPassword={handleForgotPassword}
          />
        ) : authView === "signup" ? (
          <SignUp
            onSignUp={handleSignUp}
            onSwitchToSignIn={handleSwitchToSignIn}
          />
        ) : (
          <ForgotPassword
            onBackToSignIn={handleSwitchToSignIn}
          />
        )
      ) : (
        <div className="h-screen flex bg-background transition-colors duration-300">
          {activeView !== "diary" &&
            activeView !== "profile" &&
            !selectedCase && (
              <JubeeSidebar
                activeView={activeView}
                onNavigate={setActiveView}
                onLogout={handleLogoutClick}
                onClearSession={() => {
                  setSelectedSession(null);
                  setResetResearchBoard(true);
                  setTimeout(() => setResetResearchBoard(false), 100);
                }}
              />
            )}
          <div className="flex-1 overflow-y-auto">
            {selectedCase ? (
              <CaseDetailView
                caseData={selectedCase}
                onBack={handleBackToCases}
                onNavigate={handleNavigateFromCase}
              />
            ) : (
              <>
                <div className="min-h-[1024px]">
                  {renderView()}
                </div>
                <JubeeFooter onNavigate={setActiveView} />
              </>
            )}
          </div>
          <Toaster position="top-right" />
          <ConfirmationDialog
            isOpen={showLogoutConfirm}
            onClose={() => setShowLogoutConfirm(false)}
            onConfirm={handleLogout}
            title="Confirm Logout"
            message="Are you sure you want to log out?"
          />
        </div>
      )}
    </ThemeProvider>
  );
}