import { JubeeSidebar } from '@/app/components/JubeeSidebar';
import { JubeeFooter } from '@/app/components/JubeeFooter';
import { CaseDetailView } from '@/app/components/CaseDetailView';
import { ConfirmationDialog } from '@/app/components/ConfirmationDialog';
import { Toaster } from '@/app/components/ui/sonner';

interface DashboardLayoutProps {
  activeView: string;
  selectedCase: any;
  showLogoutConfirm: boolean;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onClearSession: () => void;
  onBackToCases: () => void;
  onNavigateFromCase: (view: string) => void;
  onCloseLogoutConfirm: () => void;
  onConfirmLogout: () => void;
  children: React.ReactNode;
}

export function DashboardLayout({
  activeView,
  selectedCase,
  showLogoutConfirm,
  onNavigate,
  onLogout,
  onClearSession,
  onBackToCases,
  onNavigateFromCase,
  onCloseLogoutConfirm,
  onConfirmLogout,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="h-screen flex bg-background transition-colors duration-300">
      {activeView !== 'diary' && activeView !== 'profile' && !selectedCase && (
        <JubeeSidebar
          activeView={activeView}
          onNavigate={onNavigate}
          onLogout={onLogout}
          onClearSession={onClearSession}
        />
      )}
      <div className="flex-1 overflow-y-auto">
        {selectedCase ? (
          <CaseDetailView
            caseData={selectedCase}
            onBack={onBackToCases}
            onNavigate={onNavigateFromCase}
          />
        ) : (
          <>
            <div className="min-h-[1024px]">{children}</div>
            <JubeeFooter onNavigate={onNavigate} />
          </>
        )}
      </div>
      <Toaster position="top-right" />
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={onCloseLogoutConfirm}
        onConfirm={onConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />
    </div>
  );
}
