import { useState } from 'react';
import { Bell, Clock, AlertCircle, CheckCircle2, Plus, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { SearchWithDropdown } from '@/app/components/ui/search-with-dropdown';
import { Progress } from '@/app/components/ui/progress';

interface Reminder {
  id: number;
  title: string;
  caseNumber: string;
  description: string;
  dueDate: string;
  daysRemaining: number;
  priority: 'high' | 'medium' | 'low';
  category: 'filing' | 'hearing' | 'response' | 'other';
  status: 'pending' | 'completed';
}

export function RemindersView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  const searchRecommendations = [
    { id: '1', text: 'Filing', category: 'Category' },
    { id: '2', text: 'Hearing', category: 'Category' },
    { id: '3', text: 'Response', category: 'Category' },
    { id: '4', text: 'High priority', category: 'Priority' },
    { id: '5', text: 'Due this week', category: 'Filter' },
    { id: '6', text: 'ARBIT.P.', category: 'Case Type' },
    { id: '7', text: 'CS(COMM)', category: 'Case Type' },
    { id: '8', text: 'Overdue', category: 'Status' },
  ];

  const reminders: Reminder[] = [
    {
      id: 1,
      title: 'Filing of Rejoinder',
      caseNumber: 'CS(COMM) - 425/2025',
      description: 'Submit rejoinder to respondent\'s written statement',
      dueDate: '25/01/2026',
      daysRemaining: 3,
      priority: 'high',
      category: 'filing',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Counter Affidavit Filing',
      caseNumber: 'CRL.M.C. - 892/2025',
      description: 'File counter affidavit with supporting documents',
      dueDate: '14/02/2026',
      daysRemaining: 22,
      priority: 'medium',
      category: 'filing',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Appeal Filing Deadline',
      caseNumber: 'ARB.P. - 142/2025',
      description: 'Last date to file appeal against arbitral award',
      dueDate: '07/02/2026',
      daysRemaining: 15,
      priority: 'high',
      category: 'filing',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Next Hearing Date',
      caseNumber: 'W.P.(C) 8245/2024',
      description: 'Arguments on interim relief application',
      dueDate: '28/01/2026',
      daysRemaining: 6,
      priority: 'medium',
      category: 'hearing',
      status: 'pending'
    },
    {
      id: 5,
      title: 'Document Production',
      caseNumber: 'CS(OS) 1245/2025',
      description: 'Submit original documents as per court direction',
      dueDate: '30/01/2026',
      daysRemaining: 8,
      priority: 'medium',
      category: 'other',
      status: 'pending'
    },
    {
      id: 6,
      title: 'Reply to Notice',
      caseNumber: 'ARB.A. 78/2024',
      description: 'Respond to arbitration notice from opposing party',
      dueDate: '20/01/2026',
      daysRemaining: -2,
      priority: 'high',
      category: 'response',
      status: 'completed'
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      case 'medium':
        return 'bg-[#FEF3C7] text-[#F59E0B] border-[#F59E0B]/20';
      case 'low':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryBadge = (category: string) => {
    const labels: { [key: string]: string } = {
      filing: 'Filing',
      hearing: 'Hearing',
      response: 'Response',
      other: 'Other'
    };
    return labels[category] || category;
  };

  const getUrgencyLevel = (days: number) => {
    if (days < 0) return { label: 'Overdue', color: 'text-red-600', progress: 100 };
    if (days <= 3) return { label: 'Critical', color: 'text-red-600', progress: 90 };
    if (days <= 7) return { label: 'Urgent', color: 'text-[#F59E0B]', progress: 60 };
    return { label: 'Normal', color: 'text-primary', progress: 30 };
  };

  const stats = [
    { label: 'Total Reminders', value: '24', icon: Bell },
    { label: 'High Priority', value: '8', icon: AlertCircle },
    { label: 'Due This Week', value: '5', icon: Clock },
    { label: 'Completed', value: '12', icon: CheckCircle2 },
  ];

  return (
    <div className="flex-1 h-screen overflow-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-foreground text-2xl font-bold">Reminders</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Task management and deadline tracking</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 py-8">
        {/* Search and Filters */}
        <div className="flex gap-3 mb-6">
          <SearchWithDropdown
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search reminders by title, case number..."
            recommendations={searchRecommendations}
            inputClassName="pl-10"
            className="flex-1"
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 border border-border rounded-xl bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            return (
              <div
                key={index}
                className="bg-card rounded-xl border border-border shadow-lg p-4 hover:shadow-xl transition-all duration-200"
              >
                <div className="mb-0.5">
                  <span className="text-2xl font-bold text-primary">{stat.value}</span>
                </div>
                <div className="text-sm text-muted-foreground font-semibold">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const urgency = getUrgencyLevel(reminder.daysRemaining);
            return (
              <div
                key={reminder.id}
                className={`bg-card rounded-xl border shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  reminder.status === 'completed' 
                    ? 'border-border opacity-60' 
                    : reminder.daysRemaining <= 3 
                      ? 'border-red-500/30 ring-2 ring-red-500/10' 
                      : 'border-border'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ring-2 ${
                      reminder.status === 'completed' 
                        ? 'bg-muted ring-border' 
                        : reminder.priority === 'high' 
                          ? 'bg-red-50 dark:bg-red-500/10 ring-red-200 dark:ring-red-500/20' 
                          : 'bg-primary/10 ring-primary/20'
                    }`}>
                      {reminder.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
                      ) : reminder.daysRemaining <= 3 ? (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-primary" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold ${
                              reminder.status === 'completed' 
                                ? 'text-muted-foreground line-through' 
                                : 'text-foreground'
                            }`}>
                              {reminder.title}
                            </h3>
                            <Badge className={getPriorityColor(reminder.priority) + ' font-semibold'}>
                              {reminder.priority}
                            </Badge>
                            <Badge variant="outline" className="border-border text-muted-foreground text-xs font-semibold">
                              {getCategoryBadge(reminder.category)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground font-semibold mb-1">{reminder.caseNumber}</div>
                          <p className="text-sm text-muted-foreground">{reminder.description}</p>
                        </div>
                      </div>

                      {/* Progress and Due Date */}
                      {reminder.status === 'pending' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground font-semibold">Due: {reminder.dueDate}</span>
                            </div>
                            <span className={`font-bold ${urgency.color}`}>
                              {reminder.daysRemaining < 0 
                                ? `${Math.abs(reminder.daysRemaining)} days overdue` 
                                : `${reminder.daysRemaining} days remaining`}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress 
                              value={urgency.progress} 
                              className={`h-2 flex-1 ${
                                reminder.daysRemaining < 0 || reminder.daysRemaining <= 3 
                                  ? 'bg-red-100 dark:bg-red-500/10' 
                                  : 'bg-primary/10'
                              }`}
                              indicatorClassName={
                                reminder.daysRemaining < 0 || reminder.daysRemaining <= 3 
                                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                  : reminder.daysRemaining <= 7 
                                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/80' 
                                    : 'bg-gradient-to-r from-primary to-primary/80'
                              }
                            />
                            <span className={`text-xs font-bold ${urgency.color}`}>
                              {urgency.label}
                            </span>
                          </div>
                        </div>
                      )}

                      {reminder.status === 'completed' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold px-3 py-1.5 bg-muted rounded-lg inline-flex">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {reminder.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold"
                          >
                            Mark Complete
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border hover:bg-accent font-semibold"
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-muted-foreground font-semibold">
            Showing <span className="font-bold text-foreground">1-6</span> of{' '}
            <span className="font-bold text-foreground">24</span> reminders
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={currentPage === pageNumber 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold min-w-[2.5rem]" 
                      : "hover:bg-accent text-foreground font-semibold min-w-[2.5rem]"
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}