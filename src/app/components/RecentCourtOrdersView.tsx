import { useState } from 'react';
import { ArrowLeft, FileText, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface CourtOrder {
  sNo: number;
  caseNumber: string;
  caseStatus: string;
  parties: string;
  listingDetails: string;
}

interface RecentCourtOrdersViewProps {
  caseNumber: string;
  clientName: string;
  onBack: () => void;
}

const mockCourtOrders: CourtOrder[] = [
  {
    sNo: 1,
    caseNumber: 'CS(COMM) - 706/2025',
    caseStatus: 'Order/ Judgement',
    parties: 'State Vs. Amit Kumar',
    listingDetails: '29/11/25'
  },
  {
    sNo: 2,
    caseNumber: 'CS(COMM) - 706/2025',
    caseStatus: 'Order/ Judgement',
    parties: 'State Vs. Amit Kumar',
    listingDetails: '29/11/25'
  },
  {
    sNo: 3,
    caseNumber: 'CS(COMM) - 706/2025',
    caseStatus: 'Order/ Judgement',
    parties: 'State Vs. Amit Kumar',
    listingDetails: '29/11/25'
  },
  {
    sNo: 4,
    caseNumber: 'CS(COMM) - 706/2025',
    caseStatus: 'Order/ Judgement',
    parties: 'State Vs. Amit Kumar',
    listingDetails: '29/11/25'
  },
  {
    sNo: 5,
    caseNumber: 'ARB.P. 142/2025',
    caseStatus: 'Order/ Judgement',
    parties: 'Easy Handling LLC Vs. Pradhaan Air Express',
    listingDetails: '23/01/26'
  },
  {
    sNo: 6,
    caseNumber: 'ARB.P. 142/2025',
    caseStatus: 'Notice Issued',
    parties: 'Easy Handling LLC Vs. Pradhaan Air Express',
    listingDetails: '20/01/26'
  }
];

export function RecentCourtOrdersView({ caseNumber, clientName, onBack }: RecentCourtOrdersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const filteredOrders = mockCourtOrders.filter(order =>
    order.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.parties.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.caseStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Recent Court Orders
              </h1>
              <p className="text-xs text-muted-foreground">
                Court orders against {clientName} • Last updated: Just now
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-border hover:bg-accent font-semibold"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by case number, parties, or status..."
                className="w-full h-10 pl-9 pr-4 text-sm bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800">
                <div className="grid grid-cols-[60px_1.5fr_1.2fr_2fr_1fr] px-6 py-4">
                  <div className="text-sm font-bold text-white">S.No</div>
                  <div className="text-sm font-bold text-white">Case Number</div>
                  <div className="text-sm font-bold text-white">Case Status</div>
                  <div className="text-sm font-bold text-white">Petitioner Vs. Respondent</div>
                  <div className="text-sm font-bold text-white">Listing Details</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {filteredOrders.map((order, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[60px_1.5fr_1.2fr_2fr_1fr] px-6 py-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="text-sm text-foreground font-medium">{order.sNo}</div>
                    <div className="text-sm text-foreground font-medium">{order.caseNumber}</div>
                    <div className="text-sm text-foreground">{order.caseStatus}</div>
                    <div className="text-sm text-foreground">{order.parties}</div>
                    <div className="text-sm text-foreground">{order.listingDetails}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? 'No orders found' : 'No court orders yet'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {searchQuery
                  ? `No orders match your search "${searchQuery}"`
                  : 'Recent court orders will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}