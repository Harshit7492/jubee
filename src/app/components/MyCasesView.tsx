import { useState } from 'react';
import { Plus, Search, Clock, FolderOpen, Gavel, FileText, Calendar, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { AddCaseDialog } from '@/app/components/AddCaseDialog';
import { SearchWithDropdown } from '@/app/components/ui/search-with-dropdown';
import { WorkspaceQuote, WORKSPACE_QUOTES } from '@/app/components/WorkspaceQuote';

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  client: string;
  court: string;
  status: 'active' | 'pending' | 'closed';
  nextHearing: string;
  lastActivity: string;
  type: string;
}

const mockCases: Case[] = [
  {
    id: '1',
    caseNumber: 'ARBIT.P. 142/2025',
    title: 'Easy Handling LLC vs. Pradhaan Air Express Pvt. Ltd.',
    client: 'Easy Handling LLC',
    court: 'Delhi High Court',
    status: 'active',
    nextHearing: '28/01/2026',
    lastActivity: '2 hours ago',
    type: 'Arbitration'
  },
  {
    id: '2',
    caseNumber: 'CS(COMM) - 425/2025',
    title: 'Tech Solutions India vs. Digital Innovations',
    client: 'Tech Solutions India',
    court: 'Delhi High Court',
    status: 'active',
    nextHearing: '02/02/2026',
    lastActivity: '5 hours ago',
    type: 'Commercial Suit'
  },
  {
    id: '3',
    caseNumber: 'CRL.M.C. 892/2025',
    title: 'Rajesh Kumar vs. State of Delhi',
    client: 'Rajesh Kumar',
    court: 'Delhi High Court',
    status: 'pending',
    nextHearing: '10/02/2026',
    lastActivity: '1 day ago',
    type: 'Criminal'
  },
  {
    id: '4',
    caseNumber: 'W.P.(C) 8245/2024',
    title: 'Citizens Forum vs. Union of India',
    client: 'Citizens Forum',
    court: 'Supreme Court',
    status: 'active',
    nextHearing: '15/02/2026',
    lastActivity: '3 days ago',
    type: 'Writ Petition'
  },
  {
    id: '5',
    caseNumber: 'ARB.A. 78/2024',
    title: 'Global Trading Co. vs. Merchant Exports',
    client: 'Global Trading Co.',
    court: 'Delhi High Court',
    status: 'closed',
    nextHearing: 'N/A',
    lastActivity: '2 weeks ago',
    type: 'Appeal'
  }
];

interface MyCasesViewProps {
  onSelectCase: (caseData: Case) => void;
}

export function MyCasesView({ onSelectCase }: MyCasesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [selectedCourt, setSelectedCourt] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  const searchRecommendations = [
    { id: '1', text: 'ARBIT.P.', category: 'Arbitration Cases' },
    { id: '2', text: 'CS(COMM)', category: 'Commercial Suits' },
    { id: '3', text: 'CRL.M.C.', category: 'Criminal Cases' },
    { id: '4', text: 'W.P.(C)', category: 'Writ Petitions' },
    { id: '5', text: 'Delhi High Court', category: 'Court' },
    { id: '6', text: 'Supreme Court', category: 'Court' },
    { id: '7', text: 'Active cases', category: 'Status' },
    { id: '8', text: 'Pending cases', category: 'Status' },
  ];

  const handleAddCase = (newCase: Case) => {
    setCases(prev => [newCase, ...prev]);
  };

  // Filter and sort logic
  let filteredCases = cases.filter(c => {
    const matchesSearch = c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourt = selectedCourt === 'all' || c.court === selectedCourt;
    
    const matchesClient = selectedClient === 'all' || c.client === selectedClient;
    
    return matchesSearch && matchesCourt && matchesClient;
  });

  // Sort cases
  filteredCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return 0; // Keep original order (most recent first)
      case 'oldest':
        return 0; // Reverse order would be implemented with actual dates
      case 'caseNumber':
        return a.caseNumber.localeCompare(b.caseNumber);
      case 'client':
        return a.client.localeCompare(b.client);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'closed':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Gavel className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Cases</h1>
            </div>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-6 gap-2 font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add New Case
          </Button>
        </div>
      </div>

      {/* Workspace Quote */}
      <div className="px-8 pt-6">
        <WorkspaceQuote quotes={WORKSPACE_QUOTES['mycases']} />
      </div>

      {/* Filter and Sort Controls */}
      <div className="px-8 pt-6">
        <div className="flex flex-col gap-4">
          {/* Filter Options */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">Filter:</span>
            </div>
            
            {/* Court Filter Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Court:</label>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="h-9 px-3 rounded-xl text-xs font-semibold bg-card border border-border text-foreground hover:border-primary/50 focus:outline-none focus:border-primary transition-all cursor-pointer min-w-[200px]"
              >
                <option value="all">All Courts</option>
                <option value="Delhi High Court">Delhi High Court</option>
                <option value="Supreme Court">Supreme Court</option>
              </select>
            </div>

            {/* Client Filter Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Client:</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="h-9 px-3 rounded-xl text-xs font-semibold bg-card border border-border text-foreground hover:border-primary/50 focus:outline-none focus:border-primary transition-all cursor-pointer min-w-[200px]"
              >
                <option value="all">All Clients</option>
                <option value="Easy Handling LLC">Easy Handling LLC</option>
                <option value="Tech Solutions India">Tech Solutions India</option>
                <option value="Rajesh Kumar">Rajesh Kumar</option>
                <option value="Citizens Forum">Citizens Forum</option>
                <option value="Global Trading Co.">Global Trading Co.</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 rounded-xl text-xs font-semibold bg-card border border-border text-foreground hover:border-primary/50 focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="w-full">
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem)}
                className="w-full p-4 bg-card border border-border hover:border-primary hover:bg-card/80 rounded-xl transition-all text-left group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {caseItem.caseNumber}
                      </span>
                    </div>
                    <p className="text-sm text-[rgb(247,247,247)] font-medium mb-1.5 truncate">
                      {caseItem.title}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{caseItem.type}</span>
                      <span>Client: {caseItem.client}</span>
                      <span>{caseItem.court}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{caseItem.lastActivity}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No cases found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Case Dialog */}
      <AddCaseDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddCase={handleAddCase}
      />
    </div>
  );
}