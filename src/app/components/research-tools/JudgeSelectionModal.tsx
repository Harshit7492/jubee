import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

interface JudgeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedJudges: string[]) => void;
}

// Comprehensive list of judges with proper naming
const JUDGES_LIST = [
  { name: "Sanjiv Khanna", gender: "Mr." },
  { name: "B.R. Gavai", gender: "Mr." },
  { name: "Surya Kant", gender: "Mr." },
  { name: "Hrishikesh Roy", gender: "Mr." },
  { name: "Abhay S. Oka", gender: "Mr." },
  { name: "Prashant Kumar Mishra", gender: "Mr." },
  { name: "J.K. Maheshwari", gender: "Mr." },
  { name: "B.V. Nagarathna", gender: "Ms." },
  { name: "Ujjal Bhuyan", gender: "Mr." },
  { name: "Satish Chandra Sharma", gender: "Mr." },
  { name: "Augustine George Masih", gender: "Mr." },
  { name: "Pankaj Mithal", gender: "Mr." },
  { name: "Sanjay Karol", gender: "Mr." },
  { name: "P.V. Sanjay Kumar", gender: "Mr." },
  { name: "Manoj Misra", gender: "Mr." },
  { name: "K.V. Viswanathan", gender: "Mr." },
  { name: "Sudhanshu Dhulia", gender: "Mr." },
  { name: "Ahsanuddin Amanullah", gender: "Mr." },
  { name: "Dipankar Datta", gender: "Mr." },
  { name: "Rajesh Bindal", gender: "Mr." },
  { name: "S.C. Sharma", gender: "Mr." },
  { name: "Nongmeikapam Kotiswar Singh", gender: "Mr." },
  { name: "Sandeep Mehta", gender: "Mr." },
  { name: "Prasanna Bhalachandra Varale", gender: "Mr." },
  { name: "Manmohan", gender: "Ms." },
  { name: "Rajesh Shakdher", gender: "Mr." },
  { name: "Tushar Rao Gedela", gender: "Mr." },
  { name: "Devendra Kumar Upadhyaya", gender: "Mr." },
  { name: "Pamidighantam Sri Narasimha", gender: "Mr." },
  { name: "Aravind Kumar", gender: "Mr." },
  { name: "Vikram Nath", gender: "Mr." },
  { name: "Yashwant Varma", gender: "Mr." },
  { name: "Sanjeev Sachdeva", gender: "Mr." },
  { name: "Dinesh Maheshwari", gender: "Mr." },
  { name: "C. Hari Shankar", gender: "Mr." },
];

export function JudgeSelectionModal({
  isOpen,
  onClose,
  onConfirm,
}: JudgeSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJudges, setSelectedJudges] = useState<Set<string>>(new Set());

  const filteredJudges = useMemo(() => {
    if (!searchQuery.trim()) return JUDGES_LIST;
    const query = searchQuery.toLowerCase();
    return JUDGES_LIST.filter((judge) =>
      judge.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleToggleJudge = (judgeName: string) => {
    const newSelected = new Set(selectedJudges);
    if (newSelected.has(judgeName)) {
      newSelected.delete(judgeName);
    } else {
      newSelected.add(judgeName);
    }
    setSelectedJudges(newSelected);
  };

  const handleConfirm = () => {
    const selected = Array.from(selectedJudges);
    onConfirm(selected);
    setSelectedJudges(new Set());
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setSelectedJudges(new Set());
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center animate-in slide-in-from-bottom md:fade-in duration-300">
        <div className="bg-[#1a1a1a] rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl md:max-h-[80vh] flex flex-col shadow-2xl border border-white/10">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Name of the Hon'ble Judge
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Select one or more for contextual prompting
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by judge name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1E3A8A] transition-colors"
              />
            </div>
          </div>

          {/* Judge List */}
          <div className="flex-1 overflow-y-auto">
            {filteredJudges.length > 0 ? (
              <div>
                {filteredJudges.map((judge, index) => {
                  const fullName = `${judge.gender} Justice ${judge.name}`;
                  const isSelected = selectedJudges.has(judge.name);

                  return (
                    <button
                      key={index}
                      onClick={() => handleToggleJudge(judge.name)}
                      className={`w-full flex items-center justify-between px-6 py-4 border-b border-white/5 transition-all ${
                        isSelected
                          ? "bg-[#1E3A8A]/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span className="text-white text-left">
                        Hon'ble {fullName}
                      </span>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-[#1E3A8A] border-[#1E3A8A]"
                            : "border-white/30"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-400">No judges found matching your search</p>
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="p-6 border-t border-white/10 bg-[#1a1a1a]">
            <button
              onClick={handleConfirm}
              disabled={selectedJudges.size === 0}
              className="w-full h-12 rounded-xl bg-[#1E3A8A] text-white font-medium hover:bg-[#1E3A8A]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Confirm Selection ({selectedJudges.size} Selected)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}