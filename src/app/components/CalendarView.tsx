import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, CalendarDays } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface CalendarEvent {
  id: number;
  title: string;
  caseNumber: string;
  time: string;
  location: string;
  type: 'hearing' | 'filing' | 'meeting';
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 22)); // January 22, 2026
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Sample events
  const events: { [key: string]: CalendarEvent[] } = {
    '22': [
      { id: 1, title: 'Hearing', caseNumber: 'ARBIT.P. 142/2025', time: '10:30 AM', location: 'Court 3, Delhi HC', type: 'hearing' },
      { id: 2, title: 'Client Meeting', caseNumber: 'CS(COMM) - 425/2025', time: '3:00 PM', location: 'Office', type: 'meeting' }
    ],
    '25': [
      { id: 3, title: 'Filing Deadline', caseNumber: 'CS(COMM) - 425/2025', time: '5:00 PM', location: 'Registry', type: 'filing' }
    ],
    '28': [
      { id: 4, title: 'Hearing', caseNumber: 'W.P.(C) 8245/2024', time: '11:00 AM', location: 'Court 1, Supreme Court', type: 'hearing' }
    ]
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, and adjust others
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date(2026, 0, 22); // Fixed "today" for demo
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const hasEvents = (day: number | null) => {
    return day !== null && events[day.toString()];
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'hearing':
        return <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">Hearing</Badge>;
      case 'filing':
        return <Badge className="bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 text-xs font-semibold">Filing</Badge>;
      case 'meeting':
        return <Badge className="bg-[#E0E7FF] text-[#6366F1] border-[#6366F1]/20 text-xs font-semibold">Meeting</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 h-screen overflow-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-foreground text-[22px] font-bold">Calendar</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Schedule management and upcoming events</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border shadow-lg p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousMonth}
                    className="border-border hover:bg-accent font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextMonth}
                    className="border-border hover:bg-accent font-semibold"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-bold text-muted-foreground uppercase py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {generateCalendarDays().map((day, index) => (
                  <button
                    key={index}
                    disabled={!day}
                    className={`
                      aspect-square p-2 rounded-xl text-sm font-semibold transition-all duration-200 relative
                      ${!day ? 'cursor-default' : 'cursor-pointer hover:bg-accent'}
                      ${isToday(day) ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/30' : 'text-foreground'}
                      ${!day ? 'text-transparent' : ''}
                      ${hasEvents(day) && !isToday(day) ? 'ring-2 ring-primary/30 bg-primary/5' : 'border border-border'}
                    `}
                  >
                    {day}
                    {hasEvents(day) && !isToday(day) && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Events */}
          <div>
            <div className="bg-card rounded-xl border border-border shadow-lg p-6">
              <h3 className="text-sm font-medium text-[rgb(221,221,221)] mb-2">Today's Schedule</h3>
              <div className="text-sm text-[rgb(255,255,255)] font-bold mb-4">Thursday, 22 January 2026</div>

              <div className="space-y-3">
                {events['22'] ? (
                  events['22'].map((event) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-xl border border-border hover:bg-accent transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        {getEventTypeBadge(event.type)}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-foreground mb-1">
                        {event.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold mb-2">
                        {event.caseNumber}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground font-medium">
                    No events scheduled for today
                  </div>
                )}

                {/* Separator */}
                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="text-sm font-medium text-[rgb(221,221,221)] mb-4">Upcoming Events</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer">
                      <div className="w-12 text-center">
                        <div className="text-lg font-bold text-foreground">25</div>
                        <div className="text-xs text-muted-foreground font-semibold">Jan</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-foreground">Filing Deadline</div>
                        <div className="text-xs text-muted-foreground font-semibold">CS(COMM) - 425/2025</div>
                      </div>
                      <Badge className="bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 text-xs font-semibold">
                        3 days
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer">
                      <div className="w-12 text-center">
                        <div className="text-lg font-bold text-foreground">28</div>
                        <div className="text-xs text-muted-foreground font-semibold">Jan</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-foreground">Hearing</div>
                        <div className="text-xs text-muted-foreground font-semibold">W.P.(C) 8245/2024</div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                        6 days
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}