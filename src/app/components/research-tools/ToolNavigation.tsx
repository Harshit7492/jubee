import { Search, FileText, Languages, Type, PenTool, Scale, MessageSquare, FileSearch } from 'lucide-react';

type ToolType = 'research' | 'drafting' | 'translation' | 'typing' | 'draftsman' | 'si' | 'cross-examiner' | 'precheck';

interface ToolNavigationProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

const tools: Tool[] = [
  { id: 'research', name: 'Legal Research', icon: Search, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/30', activeBg: 'bg-blue-600 dark:bg-blue-500' },
  { id: 'drafting', name: 'AI Drafting', icon: FileText, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/30', activeBg: 'bg-amber-600 dark:bg-amber-500' },
  { id: 'translation', name: 'Jubee Bhasha', icon: Languages, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-950/30', activeBg: 'bg-purple-600 dark:bg-purple-500' },
  { id: 'typing', name: 'Court Typing', icon: Type, color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-50 dark:bg-teal-950/30', activeBg: 'bg-teal-600 dark:bg-teal-500' },
  { id: 'draftsman', name: 'Jubee Counsel', icon: PenTool, color: 'text-pink-600 dark:text-pink-400', bgColor: 'bg-pink-50 dark:bg-pink-950/30', activeBg: 'bg-pink-600 dark:bg-pink-500' },
  { id: 'si', name: 'SI Analysis', icon: Scale, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/30', activeBg: 'bg-amber-600 dark:bg-amber-500' },
  { id: 'cross-examiner', name: 'Cross-Examiner', icon: MessageSquare, color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-950/30', activeBg: 'bg-cyan-600 dark:bg-cyan-500' },
  { id: 'precheck', name: 'Scrutiny', icon: FileSearch, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-950/30', activeBg: 'bg-yellow-600 dark:bg-yellow-500' },
];

export function ToolNavigation({
  activeTool,
  onToolChange,
}: ToolNavigationProps) {
  // Don't render the navigation - users must go back to select different tool
  return null;
}