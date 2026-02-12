import { useState } from 'react';
import { ArrowLeft, Bell, Download, Eye, Calendar, Building2, User, FileText, RefreshCw, Search, Filter, AlertCircle, Copy } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface CourtOrder {
  id: string;
  orderNumber: string;
  date: string;
  court: string;
  judge: string;
  caseTitle: string;
  caseNumber: string;
  orderType: string;
  status: 'urgent' | 'normal' | 'info';
  summary: string;
}

interface AutoCaveatViewProps {
  court: string;
  clientName: string;
  onBack: () => void;
  onNewCaveat?: () => void;
}

const mockOrders: CourtOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD/2026/0234',
    date: '23/01/2026',
    court: 'Delhi High Court',
    judge: 'Justice Rajesh Kumar',
    caseTitle: 'Pradhaan Air Express Pvt. Ltd. vs. Easy Handling LLC',
    caseNumber: 'CS(COMM) 245/2026',
    orderType: 'Interim Order',
    status: 'urgent',
    summary: 'Court has issued notice to the defendant to file reply within 4 weeks. Interim stay on enforcement of arbitral award granted.'
  },
  {
    id: '2',
    orderNumber: 'ORD/2026/0198',
    date: '20/01/2026',
    court: 'Delhi High Court',
    judge: 'Justice Priya Sharma',
    caseTitle: 'Easy Handling LLC vs. Continental Freight Services',
    caseNumber: 'ARB.P. 89/2026',
    orderType: 'Notice',
    status: 'normal',
    summary: 'Notice issued to respondent. Next hearing scheduled for 15th February 2026. Petitioner to file additional documents by 5th February.'
  },
  {
    id: '3',
    orderNumber: 'ORD/2026/0145',
    date: '15/01/2026',
    court: 'Supreme Court of India',
    judge: 'Justice A.K. Verma',
    caseTitle: 'Easy Handling LLC vs. State of Delhi',
    caseNumber: 'SLP (C) 1234/2026',
    orderType: 'Final Order',
    status: 'info',
    summary: 'Special Leave Petition dismissed. No costs. Liberty granted to approach appropriate forum.'
  },
  {
    id: '4',
    orderNumber: 'ORD/2026/0112',
    date: '10/01/2026',
    court: 'Delhi High Court',
    judge: 'Justice Mehta',
    caseTitle: 'Mumbai Logistics vs. Easy Handling LLC',
    caseNumber: 'CS 456/2025',
    orderType: 'Stay Order',
    status: 'urgent',
    summary: 'Temporary stay on proceedings granted for 2 weeks. Matter to be listed on 24th January 2026 for further consideration.'
  },
  {
    id: '5',
    orderNumber: 'ORD/2026/0089',
    date: '05/01/2026',
    court: 'Delhi High Court',
    judge: 'Justice Anand Singh',
    caseTitle: 'Easy Handling LLC vs. Air Cargo International',
    caseNumber: 'ARB.P. 23/2025',
    orderType: 'Directions',
    status: 'normal',
    summary: 'Directions issued for filing of counter-affidavit. Respondent to maintain status quo till next hearing.'
  }
];

export function AutoCaveatView({ court, clientName, onBack, onNewCaveat }: AutoCaveatViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'urgent' | 'normal' | 'info'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.caseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'normal':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'info':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'Action Required';
      case 'normal':
        return 'Active';
      case 'info':
        return 'For Information';
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="px-8 py-8 border-b-[0.5px] border-border">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-base font-semibold">Back</span>
          </button>
          <div className="h-6 w-px bg-border" />
          <h2 className="text-lg font-bold text-foreground">Auto Caveat Monitor</h2>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Automatic monitoring of court orders • Last updated: Just now
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="ghost"
            className="border-[0.5px] border-border hover:bg-accent/50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Monitoring Info */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-5 bg-accent/30 rounded-xl border-[0.5px] border-border">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Monitoring Court</p>
                <p className="text-sm font-semibold text-foreground">{court}</p>
              </div>
            </div>
          </div>
          <div className="p-5 bg-accent/30 rounded-xl border-[0.5px] border-border">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Client Name</p>
                <p className="text-sm font-semibold text-foreground">{clientName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-5 border-b-[0.5px] border-border">
        <div className="flex items-center justify-between gap-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by case title, number, or order..."
              className="w-full h-12 pl-10 pr-4 text-sm bg-background border-[0.5px] border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 bg-accent/30 rounded-xl p-1 border-[0.5px] border-border">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-5 py-2 text-sm rounded-lg transition-all ${filterStatus === 'all'
                ? 'bg-background text-foreground font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              All ({mockOrders.length})
            </button>
            <button
              onClick={() => setFilterStatus('urgent')}
              className={`px-5 py-2 text-sm rounded-lg transition-all ${filterStatus === 'urgent'
                ? 'bg-background text-foreground font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Urgent ({mockOrders.filter(o => o.status === 'urgent').length})
            </button>
            <button
              onClick={() => setFilterStatus('normal')}
              className={`px-5 py-2 text-sm rounded-lg transition-all ${filterStatus === 'normal'
                ? 'bg-background text-foreground font-semibold shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Active ({mockOrders.filter(o => o.status === 'normal').length})
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Stats */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Court Orders</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </p>
            </div>
            {onNewCaveat && (
              <Button
                onClick={onNewCaveat}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                New Caveat
              </Button>
            )}
          </div>

          {/* Orders */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border-[0.5px] border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-base font-semibold text-foreground">{order.caseTitle}</h3>
                        <Badge varient="outline" className={`${getStatusColor(order.status)} border-[0.5px] text-xs px-2 py-0.5`}>
                          {order.status === 'urgent' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          {order.caseNumber}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {order.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {order.court}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-[0.5px] border-border text-xs font-medium whitespace-nowrap px-3 py-1">
                      {order.orderType}
                    </Badge>
                  </div>

                  <div className="mb-5 p-4 bg-accent/20 rounded-xl border-[0.5px] border-border/50">
                    <p className="text-sm text-foreground/90 leading-relaxed">{order.summary}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs text-muted-foreground">
                      Judge: <span className="font-medium text-foreground">{order.judge}</span> •
                      Order No: <span className="font-medium text-foreground">{order.orderNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white text-xs h-9"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-accent/50 rounded-2xl flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {searchQuery ? 'No orders found' : 'No court orders yet'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {searchQuery
                  ? `No orders match your search "${searchQuery}"`
                  : 'Court orders will appear here as they are fetched automatically'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}