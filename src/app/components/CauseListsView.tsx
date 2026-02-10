import { useState } from 'react';
import { Search, Download, Filter, Calendar, Eye, MoreVertical, ChevronRight, ChevronLeft, FileText, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { SearchWithDropdown } from '@/app/components/ui/search-with-dropdown';

interface CauseListItem {
  id: number;
  itemNo: string;
  caseTitle: string;
  caseNumber: string;
  petitioner: string;
  respondent: string;
  court: string;
  courtRoom: string;
  bench: string;
  date: string;
}

export function CauseListsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const searchRecommendations = [
    { id: '1', text: 'ARBIT.P.', category: 'Arbitration Petitions' },
    { id: '2', text: 'C.A.', category: 'Civil Appeals' },
    { id: '3', text: 'W.P.(C)', category: 'Writ Petitions' },
    { id: '4', text: 'CS(COMM)', category: 'Commercial Suits' },
    { id: '5', text: 'CRL.M.C.', category: 'Criminal' },
    { id: '6', text: 'Supreme Court', category: 'Court' },
    { id: '7', text: 'Delhi High Court', category: 'Court' },
    { id: '8', text: 'Court No.01', category: 'Court Room' },
  ];

  const causeLists: CauseListItem[] = [
    {
      id: 1,
      itemNo: '10',
      caseTitle: 'ARBIT PETITON No. 1/2026',
      caseNumber: 'ARBIT.P. 1/2026',
      petitioner: 'EASY HANDLING LLC',
      respondent: 'PRADHAAN AIR EXPRESS PRIVATE LIMITED',
      court: 'Supreme Court',
      courtRoom: 'Court No.01',
      bench: 'HON\'BLE THE CHIEF JUSTICE',
      date: '22/01/2026'
    },
    {
      id: 2,
      itemNo: '15',
      caseTitle: 'CIVIL APPEAL No. 425/2025',
      caseNumber: 'C.A. 425/2025',
      petitioner: 'TECH SOLUTIONS INDIA PVT. LTD.',
      respondent: 'DIGITAL INNOVATIONS CORP',
      court: 'Supreme Court',
      courtRoom: 'Court No.02',
      bench: 'HON\'BLE MR. JUSTICE SANJAY KUMAR',
      date: '22/01/2026'
    },
    {
      id: 3,
      itemNo: '8',
      caseTitle: 'WRIT PETITION (CIVIL) No. 8245/2024',
      caseNumber: 'W.P.(C) 8245/2024',
      petitioner: 'CITIZENS FORUM',
      respondent: 'UNION OF INDIA',
      court: 'Supreme Court',
      courtRoom: 'Court No.03',
      bench: 'HON\'BLE MR. JUSTICE VIPUL M. PANCHOL',
      date: '22/01/2026'
    },
    {
      id: 4,
      itemNo: '12',
      caseTitle: 'CS(COMM) No. 892/2025',
      caseNumber: 'CS(COMM) 892/2025',
      petitioner: 'MERCHANT EXPORTS LTD',
      respondent: 'GLOBAL TRADING CO.',
      court: 'Delhi High Court',
      courtRoom: 'Court No.15',
      bench: 'HON\'BLE MR. JUSTICE RAJIV SHAKDHER',
      date: '23/01/2026'
    },
    {
      id: 5,
      itemNo: '25',
      caseTitle: 'CRL.M.C. No. 456/2025',
      caseNumber: 'CRL.M.C. 456/2025',
      petitioner: 'RAJESH KUMAR',
      respondent: 'STATE OF DELHI',
      court: 'Delhi High Court',
      courtRoom: 'Court No.08',
      bench: 'HON\'BLE MR. JUSTICE SURESH KUMAR KAIT',
      date: '23/01/2026'
    },
  ];

  const courts = ['All Courts', 'Supreme Court of India', 'Delhi High Court'];

  return (
    <div className="flex-1 h-screen overflow-auto bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-foreground text-2xl font-bold">Cause Lists</h1>
                <p className="text-muted-foreground text-sm mt-0.5">Court listings and scheduled hearings</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-border hover:bg-accent font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold shadow-lg shadow-primary/30">
                <Plus className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
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
            placeholder="Search by case number, party name, or bench..."
            recommendations={searchRecommendations}
            inputClassName="pl-10"
            className="flex-1"
          />
          <select
            value={selectedCourt}
            onChange={(e) => setSelectedCourt(e.target.value)}
            className="px-4 py-2 border border-border rounded-xl bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
          >
            {courts.map((court, index) => (
              <option key={index} value={court.toLowerCase().replace(' ', '-')}>
                {court}
              </option>
            ))}
          </select>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-6 mb-6">
          <div className="text-lg font-bold text-foreground">Thursday, 22 January 2026</div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border shadow-lg p-4">
            <div className="text-2xl font-bold text-foreground mb-0.5">24</div>
            <div className="text-sm text-muted-foreground font-semibold">Total Listings</div>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-lg p-4">
            <div className="text-2xl font-bold text-primary mb-0.5">8</div>
            <div className="text-sm text-muted-foreground font-semibold">Supreme Court</div>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-lg p-4">
            <div className="text-2xl font-bold text-primary mb-0.5">12</div>
            <div className="text-sm text-muted-foreground font-semibold">High Court</div>
          </div>
          <div className="bg-card rounded-xl border border-border shadow-lg p-4">
            <div className="text-2xl font-bold text-primary mb-0.5">4</div>
            <div className="text-sm text-muted-foreground font-semibold">Your Cases</div>
          </div>
        </div>

        {/* Cause Lists Table */}
        <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider w-20">
                    Item No.
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                    Case Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                    Parties
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                    Court & Bench
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider w-24">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {causeLists.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-accent transition-colors duration-150 group"
                  >
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-foreground">{item.itemNo}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <div className="text-sm font-semibold text-foreground mb-1">
                          {item.caseTitle}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">{item.caseNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="text-sm text-foreground font-medium">
                          <span className="text-muted-foreground text-xs font-semibold">Petitioner:</span> {item.petitioner}
                        </div>
                        <div className="text-sm text-foreground font-medium">
                          <span className="text-muted-foreground text-xs font-semibold">Respondent:</span> {item.respondent}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-xs font-semibold">
                          {item.court}
                        </Badge>
                        <div className="text-xs text-muted-foreground font-semibold">{item.courtRoom}</div>
                        <div className="text-xs text-muted-foreground font-medium">{item.bench}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-foreground font-semibold">{item.date}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border px-6 py-4 bg-muted/50 flex justify-between items-center">
            <div className="text-sm text-muted-foreground font-semibold">
              Showing <span className="font-bold text-foreground">1-5</span> of{' '}
              <span className="font-bold text-foreground">24</span> listings
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
    </div>
  );
}