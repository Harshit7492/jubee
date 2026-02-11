import { ResearchBoardView } from '@/app/components/ResearchBoardView';
import { MyCasesView } from '@/app/components/MyCasesView';
import { MyDiaryView } from '@/app/components/MyDiaryView';
import { PrecedentRadarView } from '@/app/components/PrecedentRadarView';
import { MySpaceView } from '@/app/components/MySpaceView';
import { RecentActivityView } from '@/app/components/RecentActivityView';
import { AlertsView } from '@/app/components/AlertsView';
import { LegalUpdatesView } from '@/app/components/LegalUpdatesView';
import { ResearchToolChat } from '@/app/components/tools/ResearchToolChat';
import { DraftingToolChat } from '@/app/components/tools/DraftingToolChat';
import { TranslationToolChat } from '@/app/components/tools/TranslationToolChat';
import { TranslationView } from '@/app/components/TranslationView';
import { DraftsmanToolChat } from '@/app/components/tools/DraftsmanToolChat';
import { CrossExaminerToolChat } from '@/app/components/tools/CrossExaminerToolChat';
import { CrossExaminerTool } from '@/app/components/research-tools/CrossExaminerTool';
import { ProfileView } from '@/app/components/ProfileView';
import { NoteTakingView } from '@/app/components/NoteTakingView';

interface ViewRendererProps {
  activeView: string;
  selectedSession: any;
  sessionMessages: any[];
  resetResearchBoard: boolean;
  onBackToMain: () => void;
  onNavigate: (view: string) => void;
  onSelectSession: (id: string, toolName: string, title: string) => void;
  onSelectCase: (caseData: any) => void;
  onClearSession: () => void;
  onLogout: () => void;
  setActiveView: (view: string) => void;
}

export function ViewRenderer({
  activeView,
  selectedSession,
  sessionMessages,
  resetResearchBoard,
  onBackToMain,
  onNavigate,
  onSelectSession,
  onSelectCase,
  onClearSession,
  onLogout,
  setActiveView,
}: ViewRendererProps) {
  switch (activeView) {
    case 'research-board':
      return (
        <ResearchBoardView
          sessionData={null}
          onClearSession={onClearSession}
          onNavigate={onNavigate}
          resetToDefault={resetResearchBoard}
        />
      );
    case 'recent-activity':
      return <RecentActivityView onBack={onBackToMain} onSelectSession={onSelectSession} />;
    case 'research-tool':
      return (
        <ResearchToolChat
          onBack={onBackToMain}
          sessionId={selectedSession?.id}
          initialMessages={sessionMessages}
          sessionTitle={selectedSession?.title}
        />
      );
    case 'drafting-tool':
      return (
        <DraftingToolChat
          onBack={onBackToMain}
          sessionId={selectedSession?.id}
          initialMessages={sessionMessages}
          sessionTitle={selectedSession?.title}
        />
      );
    case 'translation-tool':
      return (
        <TranslationToolChat
          onBack={onBackToMain}
          sessionId={selectedSession?.id}
          initialMessages={sessionMessages}
          sessionTitle={selectedSession?.title}
        />
      );
    case 'draftsman-tool':
      return (
        <DraftsmanToolChat
          onBack={onBackToMain}
          sessionId={selectedSession?.id}
          initialMessages={sessionMessages}
          sessionTitle={selectedSession?.title}
        />
      );
    case 'cross-examiner-tool':
      return (
        <CrossExaminerToolChat
          onBack={onBackToMain}
          sessionId={selectedSession?.id}
          initialMessages={sessionMessages}
          sessionTitle={selectedSession?.title}
        />
      );
    case 'myspace':
      return <MySpaceView />;
    case 'cases':
      return <MyCasesView onSelectCase={onSelectCase} />;
    case 'diary':
      return (
        <MyDiaryView
          onBack={onBackToMain}
          onNavigateToResearchBoard={() => onNavigate('research-board')}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      );
    case 'precedent':
      return <PrecedentRadarView onBack={onBackToMain} />;
    case 'translation':
      return <TranslationView onBack={onBackToMain} />;
    case 'cross-examiner':
      return <CrossExaminerTool onBack={onBackToMain} />;
    case 'legal-updates':
      return <LegalUpdatesView onBack={onBackToMain} />;
    case 'alerts':
      return <AlertsView />;
    case 'profile':
      return <ProfileView onBack={onBackToMain} onNavigate={setActiveView} onLogout={onLogout} />;
    case 'note-taking':
      return <NoteTakingView />;
    default:
      return <ResearchBoardView sessionData={null} onClearSession={onClearSession} />;
  }
}
