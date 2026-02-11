import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { SignIn } from '@/app/components/auth/SignIn';
import { SignUp } from '@/app/components/auth/SignUp';
import { ForgotPassword } from '@/app/components/auth/ForgotPassword';
import { DashboardLayout } from '@/app/components/DashboardLayout';
import { ViewRenderer } from '@/app/components/ViewRenderer';
import { useAppState } from '@/app/hooks/useAppState';
import { sessionConversations } from '@/app/data/mockData';

function AppContent() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    activeView,
    selectedSession,
    selectedCase,
    showLogoutConfirm,
    resetResearchBoard,
    setActiveView,
    setSelectedCase,
    setShowLogoutConfirm,
    handleSignIn,
    handleSignUp,
    handleLogout,
    handleNavigate,
    handleBackToMain,
    handleSelectSession,
    handleClearSession,
  } = useAppState();

  const sessionMessages = selectedSession ? sessionConversations[selectedSession.id] : [];

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignIn
              onSignIn={handleSignIn}
              onSwitchToSignUp={() => navigate('/signup')}
              onForgotPassword={() => navigate('/forgot-password')}
            />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => navigate('/login')} />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ForgotPassword onBackToSignIn={() => navigate('/login')} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <DashboardLayout
              activeView={activeView}
              selectedCase={selectedCase}
              showLogoutConfirm={showLogoutConfirm}
              onNavigate={setActiveView}
              onLogout={() => setShowLogoutConfirm(true)}
              onClearSession={handleClearSession}
              onBackToCases={() => setSelectedCase(null)}
              onNavigateFromCase={(view) => {
                setActiveView(view);
                setSelectedCase(null);
              }}
              onCloseLogoutConfirm={() => setShowLogoutConfirm(false)}
              onConfirmLogout={handleLogout}
            >
              <ViewRenderer
                activeView={activeView}
                selectedSession={selectedSession}
                sessionMessages={sessionMessages}
                resetResearchBoard={resetResearchBoard}
                onBackToMain={handleBackToMain}
                onNavigate={handleNavigate}
                onSelectSession={handleSelectSession}
                onSelectCase={setSelectedCase}
                onClearSession={handleClearSession}
                onLogout={() => setShowLogoutConfirm(true)}
                setActiveView={setActiveView}
              />
            </DashboardLayout>
          )
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
