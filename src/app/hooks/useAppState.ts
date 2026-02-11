import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SessionData {
  id: string;
  toolName: string;
  title: string;
}

export function useAppState() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('research-board');
  const [previousView, setPreviousView] = useState<string>('research-board');
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [resetResearchBoard, setResetResearchBoard] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('research-board');
    setSelectedSession(null);
    setSelectedCase(null);
    navigate('/login');
  };

  const handleNavigate = (newView: string) => {
    if (activeView !== newView) {
      setPreviousView(activeView);
    }
    setActiveView(newView);
  };

  const handleBackToMain = () => {
    const fallbackView = previousView && previousView !== activeView ? previousView : 'research-board';
    setActiveView(fallbackView);
    setSelectedSession(null);
  };

  const handleSelectSession = (sessionId: string, toolName: string, title: string) => {
    setSelectedSession({ id: sessionId, toolName, title });
    const toolViewMap: Record<string, string> = {
      'Legal Research': 'research-tool',
      'AI Drafting': 'drafting-tool',
      'Jubee Bhasha': 'translation-tool',
      'Jubee Counsel': 'draftsman-tool',
      'Cross-Examiner': 'cross-examiner-tool',
    };
    setActiveView(toolViewMap[toolName] || 'research-board');
  };

  const handleClearSession = () => {
    setSelectedSession(null);
    setResetResearchBoard(true);
    setTimeout(() => setResetResearchBoard(false), 100);
  };

  return {
    isAuthenticated,
    activeView,
    previousView,
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
  };
}
