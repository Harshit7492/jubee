import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';

interface Court {
  id: string;
  name: string;
}

interface CourtSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedCourts: Court[]) => void;
}

const courts: Court[] = [
  { id: '1', name: 'Supreme Court of India' },
  { id: '2', name: 'Delhi High Court' },
  { id: '3', name: 'Bombay High Court' },
  { id: '4', name: 'Calcutta High Court' },
  { id: '5', name: 'Madras High Court' },
  { id: '6', name: 'Karnataka High Court' },
  { id: '7', name: 'Allahabad High Court' },
  { id: '8', name: 'Gujarat High Court' },
  { id: '9', name: 'Kerala High Court' },
  { id: '10', name: 'Rajasthan High Court' },
  { id: '11', name: 'Madhya Pradesh High Court' },
  { id: '12', name: 'Patna High Court' },
  { id: '13', name: 'Orissa High Court' },
  { id: '14', name: 'Andhra Pradesh High Court' },
  { id: '15', name: 'Punjab & Haryana High Court' },
  { id: '16', name: 'Gauhati High Court' },
  { id: '17', name: 'Jharkhand High Court' },
  { id: '18', name: 'Uttarakhand High Court' },
  { id: '19', name: 'Chhattisgarh High Court' },
  { id: '20', name: 'Jammu & Kashmir High Court' },
  { id: '21', name: 'Himachal Pradesh High Court' },
  { id: '22', name: 'Telangana High Court' },
  { id: '23', name: 'Tripura High Court' },
  { id: '24', name: 'Meghalaya High Court' },
  { id: '25', name: 'Manipur High Court' },
  { id: '26', name: 'Sikkim High Court' },
];

export function CourtSelectionModal({ isOpen, onClose, onConfirm }: CourtSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourts, setSelectedCourts] = useState<Set<string>>(new Set());

  const filteredCourts = useMemo(() => {
    if (!searchQuery.trim()) return courts;
    
    const query = searchQuery.toLowerCase();
    return courts.filter(court => 
      court.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleToggleCourt = (courtId: string) => {
    setSelectedCourts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courtId)) {
        newSet.delete(courtId);
      } else {
        newSet.add(courtId);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    const selected = courts.filter(court => selectedCourts.has(court.id));
    onConfirm(selected);
    setSelectedCourts(new Set());
    setSearchQuery('');
  };

  const handleClose = () => {
    setSelectedCourts(new Set());
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[16px]"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-[#121212] border-[0.5px] border-border rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Select Court</h2>
              <p className="text-sm text-muted-foreground mt-1">Choose one or more courts for contextual prompting</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by court name..."
              className="h-12 pl-11 pr-4 rounded-xl border-[0.5px] border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto">
          {filteredCourts.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-muted-foreground">No courts found matching your search</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredCourts.map((court) => {
                const isSelected = selectedCourts.has(court.id);
                
                return (
                  <button
                    key={court.id}
                    onClick={() => handleToggleCourt(court.id)}
                    className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-primary/10' : 'hover:bg-muted/30'
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {court.name}
                    </span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleCourt(court.id)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-border/50">
          <Button
            onClick={handleConfirm}
            disabled={selectedCourts.size === 0}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Selection ({selectedCourts.size} Selected)
          </Button>
        </div>
      </div>
    </div>
  );
}
