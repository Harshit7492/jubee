import { useState } from 'react';
import { CalendarDays, Clock, FileText, Bell, TrendingUp, AlertCircle, Scale, CheckCircle, Zap, Sparkles, ChevronRight, MoreVertical, BookOpen, ChevronLeft, ChevronUp, ChevronDown, Languages } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ResearchBoardModal } from '@/app/components/ResearchBoardModal';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { WorkspaceQuote, WORKSPACE_QUOTES } from '@/app/components/WorkspaceQuote';

interface CauseListItem {
  id: number;
  itemNo: string;
  caseTitle: string;
  petitioner: string;
  respondent: string;
  court: string;
  bench: string;
  courtRoom: string;
  advocates: string[];
}

interface Reminder {
  id: number;
  caseNumber: string;
  status: string;
  parties: string;
  linkingDate: string;
}

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps = {}) {
  const [isResearchBoardOpen, setIsResearchBoardOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date()); // For calendar month/year navigation

  const causeList: CauseListItem[] = [
    {
      id: 1,
      itemNo: '10\nSupply 40-47.3\nEffective Item\nNo.10',
      caseTitle: 'ARBIT PETITON No. 1/2026\nEASY HANDLING LLC\nVersus\nPRADHAAN AIR EXPRESS PRIVATE LIMITED.',
      petitioner: 'EASY HANDLING LLC',
      respondent: 'PRADHAAN AIR EXPRESS',
      court: 'Supreme Court',
      bench: 'Court No.01',
      courtRoom: 'HON\'BLE THE CHIEF JUSTICE',
      advocates: ['MR. JUSTICE JOYPALYA BACCHI', 'MR. JUSTICE VIPUL M. PANCHOL']
    },
    {
      id: 2,
      itemNo: '10\nSupply 40-47.3\nEffective Item\nNo.10',
      caseTitle: 'ARBIT PETITON No. 1/2026\nEASY HANDLING LLC\nVersus\nPRADHAAN AIR EXPRESS PRIVATE LIMITED.',
      petitioner: 'EASY HANDLING LLC',
      respondent: 'PRADHAAN AIR EXPRESS',
      court: 'Supreme Court',
      bench: 'Court No.01',
      courtRoom: 'HON\'BLE THE CHIEF JUSTICE',
      advocates: ['MR. JUSTICE JOYPALYA BACCHI', 'MR. JUSTICE VIPUL M. PANCHOL']
    },
    {
      id: 3,
      itemNo: '10\nSupply 40-47.3\nEffective Item\nNo.10',
      caseTitle: 'ARBIT PETITON No. 1/2026\nEASY HANDLING LLC\nVersus\nPRADHAAN AIR EXPRESS PRIVATE LIMITED.',
      petitioner: 'EASY HANDLING LLC',
      respondent: 'PRADHAAN AIR EXPRESS',
      court: 'Supreme Court',
      bench: 'Court No.01',
      courtRoom: 'HON\'BLE THE CHIEF JUSTICE',
      advocates: ['MR. JUSTICE JOYPALYA BACCHI', 'MR. JUSTICE VIPUL M. PANCHOL']
    }
  ];

  const reminders: Reminder[] = [
    { id: 1, caseNumber: 'CS(COMM) - 706/2025', status: 'Order/ Judgement', parties: 'RL Kaht, Arvind Sinha', linkingDate: '29/11/25' },
    { id: 2, caseNumber: 'CS(COMM) - 706/2025', status: 'Order/ Judgement', parties: 'RL Kaht, Arvind Sinha', linkingDate: '29/11/25' },
    { id: 3, caseNumber: 'CS(COMM) - 706/2025', status: 'Order/ Judgement', parties: 'RL Kaht, Arvind Sinha', linkingDate: '29/11/25' },
    { id: 4, caseNumber: 'CS(COMM) - 706/2025', status: 'Order/ Judgement', parties: 'RL Kaht, Arvind Sinha', linkingDate: '29/11/25' },
    { id: 5, caseNumber: 'CS(COMM) - 706/2025', status: 'Order/ Judgement', parties: 'RL Kaht, Arvind Sinha', linkingDate: '29/11/25' }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
  };

  // Date validation
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Calendar helper functions
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handleMonthChange = (direction: 'up' | 'down') => {
    const newDate = new Date(viewDate);
    if (direction === 'up') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }

    // Only allow navigation within the one month range
    if (newDate >= oneMonthAgo && newDate <= today) {
      setViewDate(newDate);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (newDate >= oneMonthAgo && newDate <= today) {
      setSelectedDate(newDate);
      setIsCalendarOpen(false);
    }
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return date < oneMonthAgo || date > today;
  };

  const isDateSelected = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];

    // Previous month days (grayed out)
    const prevMonthDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0);
    const daysInPrevMonth = prevMonthDate.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <button
          key={`prev-${day}`}
          disabled
          className="h-9 text-xs text-muted-foreground/30 font-medium"
        >
          {day}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const selected = isDateSelected(day);
      const todayDate = isToday(day);

      days.push(
        <button
          key={day}
          onClick={() => !disabled && handleDateClick(day)}
          disabled={disabled}
          className={`h-9 text-xs font-medium rounded-lg transition-all ${
            selected
              ? 'bg-primary text-primary-foreground'
              : disabled
              ? 'text-muted-foreground/30 cursor-not-allowed'
              : todayDate
              ? 'text-primary hover:bg-primary/10'
              : 'text-foreground hover:bg-accent'
          }`}
        >
          {day}
        </button>
      );
    }

    // Next month days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <button
          key={`next-${day}`}
          disabled
          className="h-9 text-xs text-muted-foreground/30 font-medium"
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="flex-1 h-screen overflow-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-foreground text-[22px] font-bold">Today's Board</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Your daily dashboard and scheduled hearings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Workspace Quote */}
      <div className="px-8 pt-6">
        <WorkspaceQuote quotes={WORKSPACE_QUOTES['mydiary']} />
      </div>

      <div className="px-8 py-8 space-y-8 min-h-full">
        {/* Today's Cause List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-foreground text-xl font-bold mb-1">Today's Cause List</h2>
              <p className="text-muted-foreground text-sm font-medium">Your scheduled hearings for today</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center gap-2 text-sm px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 hover:bg-primary/15 hover:border-primary/30 transition-all cursor-pointer"
              >
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="text-foreground font-semibold">{formatDate(selectedDate)}</span>
              </button>

              {/* Calendar Popup */}
              {isCalendarOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsCalendarOpen(false)}
                  />

                  {/* Calendar Modal */}
                  <div className="absolute right-0 top-full mt-2 z-50 bg-card rounded-2xl border border-border shadow-2xl p-5 w-[340px]">
                    {/* Month and Year Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-foreground font-bold text-base">
                        {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                      </h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMonthChange('up')}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-all"
                        >
                          <ChevronUp className="w-4 h-4 text-foreground" />
                        </button>
                        <button
                          onClick={() => handleMonthChange('down')}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-all"
                        >
                          <ChevronDown className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="space-y-1">
                      {/* Day Names */}
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {dayNames.map((dayName) => (
                          <div key={dayName} className="h-8 flex items-center justify-center text-xs text-muted-foreground font-semibold">
                            {dayName}
                          </div>
                        ))}
                      </div>

                      {/* Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {renderCalendarDays()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                      <button
                        onClick={() => {
                          setSelectedDate(new Date());
                          setViewDate(new Date());
                          setIsCalendarOpen(false);
                        }}
                        className="text-primary font-semibold hover:underline transition-all text-sm"
                      >
                        Clear
                      </button>
                      <div className="flex-1"></div>
                      <button
                        onClick={() => {
                          setSelectedDate(new Date());
                          setViewDate(new Date());
                          setIsCalendarOpen(false);
                        }}
                        className="text-primary font-semibold hover:underline transition-all text-sm"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cause List Table */}
          <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary border-b border-border">
                    <th className="px-4 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider w-16">S.No.</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider w-32">Item No.</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">Case Title</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">Advocate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {causeList.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-accent transition-colors duration-150 group"
                    >
                      <td className="px-4 py-4 text-sm text-muted-foreground font-medium">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div className="text-xs leading-relaxed text-foreground whitespace-pre-line font-medium">
                          {item.itemNo}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-foreground leading-relaxed whitespace-pre-line">
                            {item.caseTitle}
                          </div>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-md">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                              {item.court}
                            </span>
                            <span className="px-2 py-1 bg-accent rounded-md font-medium">{item.bench}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          <div className="text-xs font-semibold text-foreground">{item.courtRoom}</div>
                          {item.advocates.map((advocate, i) => (
                            <div key={i} className="text-xs text-muted-foreground">{advocate}</div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border px-6 py-4 flex justify-center bg-muted/50">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10 font-semibold"
                onClick={() => onNavigate?.('cause-lists')}
              >
                View More
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Today's Reminders & Limitation Tracker */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Reminders */}
          <section className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-foreground text-xl font-bold mb-1">Today's Reminders</h2>
                <p className="text-muted-foreground text-sm font-medium">Critical deadlines and pending actions</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary border-b border-border">
                      <th className="px-4 py-3.5 text-left text-xs font-bold text-foreground uppercase tracking-wider w-16 whitespace-nowrap">Item No.</th>
                      <th className="px-4 py-3.5 text-left text-xs font-bold text-foreground uppercase tracking-wider">Case Number</th>
                      <th className="px-4 py-3.5 text-left text-xs font-bold text-foreground uppercase tracking-wider">Case Status</th>
                      <th className="px-4 py-3.5 text-left text-xs font-bold text-foreground uppercase tracking-wider">Petitioner Vs. Respondent</th>
                      <th className="px-4 py-3.5 text-left text-xs font-bold text-foreground uppercase tracking-wider">Linking Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reminders.map((reminder, index) => (
                      <tr key={reminder.id} className="hover:bg-accent transition-colors duration-150">
                        <td className="px-4 py-4 text-sm text-muted-foreground font-medium">{index + 1}</td>
                        <td className="px-4 py-4 text-sm text-foreground font-semibold">{reminder.caseNumber}</td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 font-semibold">
                            {reminder.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground font-medium">{reminder.parties}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground font-medium">{reminder.linkingDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border px-6 py-4 flex justify-center bg-muted/50">
                <Button variant="ghost" className="text-primary hover:bg-primary/10 font-semibold">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Limitation Tracker */}
          <section>
            <div className="mb-6">
              <h2 className="text-foreground text-xl font-bold mb-1">Limitation Tracker</h2>
              <p className="text-muted-foreground text-sm font-medium">Critical deadlines under Limitation Act</p>
            </div>

            <div className="space-y-4">
              {/* Urgent Deadline Card */}
              <div className="bg-card rounded-xl border-2 border-red-500/30 shadow-lg p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center ring-2 ring-red-500/20">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-semibold">CS(COMM) - 425/2025</div>
                        <div className="text-sm font-bold text-foreground">Filing of Rejoinder</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">Time Remaining</span>
                      <span className="font-bold text-red-500">3 days</span>
                    </div>
                    <Progress value={85} className="h-2 bg-red-500/10" indicatorClassName="bg-gradient-to-r from-red-500 to-red-600" />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-2 bg-red-500/5 rounded-lg">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-semibold">Due: 25/01/2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Normal Deadline Card */}
              <div className="bg-card rounded-xl border border-primary/20 shadow-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                      <AlertCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-semibold">ARB.P. - 142/2025</div>
                      <div className="text-sm font-bold text-foreground">Appeal Filing</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-semibold">Time Remaining</span>
                    <span className="font-bold text-primary">15 days</span>
                  </div>
                  <Progress value={45} className="h-2 bg-primary/10" indicatorClassName="bg-gradient-to-r from-primary to-primary/80" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-2 bg-primary/5 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-semibold">Due: 07/02/2026</span>
                  </div>
                </div>
              </div>

              {/* Another Deadline */}
              <div className="bg-card rounded-xl border border-border shadow-lg p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center ring-2 ring-border">
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-semibold">CRL.M.C. - 892/2025</div>
                      <div className="text-sm font-bold text-foreground">Counter Affidavit</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-semibold">Time Remaining</span>
                    <span className="font-bold text-foreground">22 days</span>
                  </div>
                  <Progress value={30} className="h-2 bg-muted" indicatorClassName="bg-gradient-to-r from-muted-foreground to-muted-foreground/80" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-2 bg-muted rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-semibold">Due: 14/02/2026</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Research Board Modal */}
      <ResearchBoardModal
        isOpen={isResearchBoardOpen}
        onClose={() => setIsResearchBoardOpen(false)}
      />
    </div>
  );
}