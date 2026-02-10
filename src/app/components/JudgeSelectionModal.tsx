import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';

interface Judge {
  id: string;
  name: string;
  gender: 'Mr.' | 'Ms.';
}

interface JudgeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedJudges: Judge[]) => void;
}

const judges: Judge[] = [
  { id: '1', name: 'D.Y. Chandrachud', gender: 'Mr.' },
  { id: '2', name: 'Sanjiv Khanna', gender: 'Mr.' },
  { id: '3', name: 'B.R. Gavai', gender: 'Mr.' },
  { id: '4', name: 'Surya Kant', gender: 'Mr.' },
  { id: '5', name: 'Hrishikesh Roy', gender: 'Mr.' },
  { id: '6', name: 'Abhay S. Oka', gender: 'Mr.' },
  { id: '7', name: 'B.V. Nagarathna', gender: 'Ms.' },
  { id: '8', name: 'J.K. Maheshwari', gender: 'Mr.' },
  { id: '9', name: 'Vikram Nath', gender: 'Mr.' },
  { id: '10', name: 'Sudhanshu Dhulia', gender: 'Mr.' },
  { id: '11', name: 'Bela M. Trivedi', gender: 'Ms.' },
  { id: '12', name: 'Dipankar Datta', gender: 'Mr.' },
  { id: '13', name: 'Pamidighantam Sri Narasimha', gender: 'Mr.' },
  { id: '14', name: 'Manoj Misra', gender: 'Mr.' },
  { id: '15', name: 'Satish Chandra Sharma', gender: 'Mr.' },
  { id: '16', name: 'Prashant Kumar Mishra', gender: 'Mr.' },
  { id: '17', name: 'K.V. Viswanathan', gender: 'Mr.' },
  { id: '18', name: 'Ujjal Bhuyan', gender: 'Mr.' },
  { id: '19', name: 'Rajesh Bindal', gender: 'Mr.' },
  { id: '20', name: 'S.C. Sharma', gender: 'Mr.' },
  { id: '21', name: 'Augustine George Masih', gender: 'Mr.' },
  { id: '22', name: 'Nongmeikapam Kotiswar Singh', gender: 'Mr.' },
  { id: '23', name: 'Pankaj Mithal', gender: 'Mr.' },
  { id: '24', name: 'Sanjay Karol', gender: 'Mr.' },
  { id: '25', name: 'Manmohan', gender: 'Mr.' },
  { id: '26', name: 'Vikas Mahajan', gender: 'Mr.' },
  { id: '27', name: 'Sandeep Mehta', gender: 'Mr.' },
  { id: '28', name: 'Ahsanuddin Amanullah', gender: 'Mr.' },
  { id: '29', name: 'Rajendra Menon', gender: 'Mr.' },
  { id: '30', name: 'Aravind Kumar', gender: 'Mr.' },
  { id: '31', name: 'Jaswant Singh', gender: 'Mr.' },
  { id: '32', name: 'Dharmesh Sharma', gender: 'Mr.' },
  { id: '33', name: 'Yashwant Varma', gender: 'Mr.' },
  { id: '34', name: 'Neela Gokhale', gender: 'Ms.' },
  { id: '35', name: 'Pratibha M. Singh', gender: 'Ms.' },
  { id: '36', name: 'Sanjeev Sachdeva', gender: 'Mr.' },
  { id: '37', name: 'C. Hari Shankar', gender: 'Mr.' },
  { id: '38', name: 'Subramonium Prasad', gender: 'Mr.' },
];

export function JudgeSelectionModal({ isOpen, onClose, onConfirm }: JudgeSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJudges, setSelectedJudges] = useState<Set<string>>(new Set());

  const filteredJudges = useMemo(() => {
    if (!searchQuery.trim()) return judges;
    
    const query = searchQuery.toLowerCase();
    return judges.filter(judge => 
      judge.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleToggleJudge = (judgeId: string) => {
    setSelectedJudges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(judgeId)) {
        newSet.delete(judgeId);
      } else {
        newSet.add(judgeId);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    const selected = judges.filter(judge => selectedJudges.has(judge.id));
    onConfirm(selected);
    setSelectedJudges(new Set());
    setSearchQuery('');
  };

  const handleClose = () => {
    setSelectedJudges(new Set());
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
              <h2 className="text-xl font-bold text-foreground">Name of the Hon'ble Judge</h2>
              <p className="text-sm text-muted-foreground mt-1">Select one or more for contextual prompting</p>
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
              placeholder="Search by name..."
              className="h-12 pl-11 pr-4 rounded-xl border-[0.5px] border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto">
          {filteredJudges.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-sm text-muted-foreground">No judges found matching your search</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredJudges.map((judge) => {
                const isSelected = selectedJudges.has(judge.id);
                
                return (
                  <button
                    key={judge.id}
                    onClick={() => handleToggleJudge(judge.id)}
                    className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-primary/10' : 'hover:bg-muted/30'
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">
                      Hon'ble {judge.gender} Justice {judge.name}
                    </span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleJudge(judge.id)}
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
            disabled={selectedJudges.size === 0}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Selection ({selectedJudges.size} Selected)
          </Button>
        </div>
      </div>
    </div>
  );
}
