import { useState } from 'react';
import { X, Search, CheckCircle2, AlertCircle, ChevronRight, FileText, Calendar, Scale, Building2, Users, Clock, Sparkles, XCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';

interface CaseResult {
  id: string;
  caseNumber: string;
  caseTitle: string;
  petitioner: string;
  respondent: string;
  court: string;
  caseType: string;
  filingDate: string;
  status: 'Active' | 'Pending' | 'Closed';
  nextHearingDate: string | null;
  stage: string;
  judge: string;
}

interface AddNewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseAdded?: (caseData: CaseResult) => void;
}

type FlowStage = 'form' | 'searching' | 'results' | 'success' | 'error';

export function AddNewCaseModal({ isOpen, onClose, onCaseAdded }: AddNewCaseModalProps) {
  const [stage, setStage] = useState<FlowStage>('form');
  
  // Form fields
  const [selectedCourt, setSelectedCourt] = useState('');
  const [caseType, setCaseType] = useState('');
  const [year, setYear] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  
  // Results
  const [searchResults, setSearchResults] = useState<CaseResult[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const courts = [
    'Supreme Court of India',
    'Delhi High Court'
  ];

  const caseTypes = [
    'Civil Suit',
    'Writ Petition',
    'Criminal Case',
    'Arbitration Petition',
    'Company Petition',
    'Execution Petition',
    'Appeal',
    'Revision Petition',
    'Application'
  ];

  const handleSubmit = () => {
    // Validation
    if (!selectedCourt || !caseType || !year || !caseNumber) {
      setErrorMessage('Please fill all required fields');
      return;
    }

    // Start search
    setStage('searching');
    setErrorMessage('');

    // Simulate API call to court system
    setTimeout(() => {
      // Mock search results
      const mockResults: CaseResult[] = [
        {
          id: '1',
          caseNumber: `${caseType.toUpperCase().substring(0, 3)} ${caseNumber}/${year}`,
          caseTitle: 'Ramesh Kumar vs. State of Delhi',
          petitioner: 'Ramesh Kumar',
          respondent: 'State of Delhi',
          court: selectedCourt,
          caseType: caseType,
          filingDate: '15/12/2025',
          status: 'Active',
          nextHearingDate: '29/12/2025',
          stage: 'Arguments Stage',
          judge: 'Hon\'ble Justice S.K. Sharma'
        },
        {
          id: '2',
          caseNumber: `${caseType.toUpperCase().substring(0, 3)} ${parseInt(caseNumber) + 1}/${year}`,
          caseTitle: 'Ramesh Kumar vs. Municipal Corporation of Delhi',
          petitioner: 'Ramesh Kumar',
          respondent: 'Municipal Corporation of Delhi',
          court: selectedCourt,
          caseType: caseType,
          filingDate: '18/12/2025',
          status: 'Pending',
          nextHearingDate: '05/01/2026',
          stage: 'Notice Stage',
          judge: 'Hon\'ble Justice R.K. Verma'
        }
      ];

      // Simulate: 70% chance of finding results
      if (Math.random() > 0.3) {
        setSearchResults(mockResults);
        setStage('results');
      } else {
        setErrorMessage('No case found with the provided details. Please verify the case number, year, and court.');
        setStage('error');
      }
    }, 2000);
  };

  const handleSelectCase = (caseData: CaseResult) => {
    setSelectedCase(caseData);
  };

  const handleContinue = () => {
    if (!selectedCase) return;
    
    setStage('success');
    
    // Call parent callback after a short delay
    setTimeout(() => {
      if (onCaseAdded) {
        onCaseAdded(selectedCase);
      }
      // Close modal after showing success
      setTimeout(() => {
        handleClose();
      }, 1500);
    }, 1000);
  };

  const handleClose = () => {
    // Reset all states
    setStage('form');
    setSelectedCourt('');
    setCaseType('');
    setYear('');
    setCaseNumber('');
    setSearchResults([]);
    setSelectedCase(null);
    setErrorMessage('');
    onClose();
  };

  const handleRetry = () => {
    setStage('form');
    setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              Add New Case
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new case workspace to manage documents, deadlines, and legal research
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* STAGE 1: FORM */}
          {stage === 'form' && (
            <div className="space-y-6">
              {/* Court Selection */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Court <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="w-full h-12 px-4 text-base border border-border rounded-xl bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select court</option>
                  {courts.map((court) => (
                    <option key={court} value={court}>{court}</option>
                  ))}
                </select>
              </div>

              {/* Case Type, Year, Case Number Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Case Type */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Case Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full h-12 px-4 text-base border border-border rounded-xl bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    {caseTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="YYYY"
                    min="1900"
                    max="2099"
                    className="h-12 text-base bg-input-background border-border focus:border-primary focus:ring-primary text-foreground"
                  />
                </div>

                {/* Case Number */}
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Case Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="Enter"
                    className="h-12 text-base bg-input-background border-border focus:border-primary focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              {/* AI Suggestion Box */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-[#FEF3C7] dark:to-[#FBBF24]/20 rounded-xl border border-primary/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground mb-1">💡 Pro Tip</p>
                    <p className="text-sm text-muted-foreground">
                      Enter the exact case number as it appears in court records. Jubee will automatically fetch case details, parties, and hearing dates from the court system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSubmit}
                  className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground text-base font-bold shadow-lg shadow-primary/30"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search & Fetch Case
                </Button>
              </div>
            </div>
          )}

          {/* STAGE 2: SEARCHING */}
          {stage === 'searching' && (
            <div className="py-16 text-center">
              <div className="relative w-20 h-20 mb-6">
                <Search className="w-12 h-12 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              </div>
              <h3 className="text-[22px] font-bold text-foreground mb-2">Searching Court Records...</h3>
              <p className="text-muted-foreground font-medium mb-6">
                Fetching case details from {selectedCourt}
              </p>
              <div className="max-w-md mx-auto space-y-3">
                {[
                  'Connecting to court server',
                  'Verifying case number',
                  'Fetching case details',
                  'Loading parties & status'
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted animate-pulse"
                    style={{ animationDelay: `${idx * 0.2}s` }}
                  >
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 3: RESULTS */}
          {stage === 'results' && (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/30">
                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Found {searchResults.length} case{searchResults.length > 1 ? 's' : ''} matching your search
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please select the correct case to add to your workspace
                </p>
              </div>

              {/* Case Results */}
              <div className="space-y-3">
                {searchResults.map((caseData) => (
                  <div
                    key={caseData.id}
                    onClick={() => handleSelectCase(caseData)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCase?.id === caseData.id
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-border hover:border-primary/50 bg-card hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-primary text-primary-foreground font-bold">
                            {caseData.caseNumber}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              caseData.status === 'Active'
                                ? 'border-primary/30 text-primary bg-primary/10 font-semibold'
                                : caseData.status === 'Pending'
                                ? 'border-yellow-300 text-yellow-600 bg-yellow-50 dark:bg-[#FBBF24]/10 font-semibold'
                                : 'border-border text-muted-foreground font-semibold'
                            }
                          >
                            {caseData.status}
                          </Badge>
                        </div>
                        <h3 className="text-base font-bold text-foreground mb-1">
                          {caseData.caseTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          {caseData.caseType} • {caseData.stage}
                        </p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedCase?.id === caseData.id
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {selectedCase?.id === caseData.id && (
                          <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Case Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Petitioner</p>
                          <p className="text-sm text-foreground font-semibold">{caseData.petitioner}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Respondent</p>
                          <p className="text-sm text-foreground font-semibold">{caseData.respondent}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Court</p>
                          <p className="text-sm text-foreground font-semibold">{caseData.court}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Next Hearing</p>
                          <p className="text-sm text-foreground font-semibold">
                            {caseData.nextHearingDate || 'Not Scheduled'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Filing Date</p>
                          <p className="text-sm text-foreground font-semibold">{caseData.filingDate}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Scale className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">Presiding Judge</p>
                          <p className="text-sm text-foreground font-semibold">{caseData.judge}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-12 border-border hover:bg-accent font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!selectedCase}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to My Cases
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STAGE 4: SUCCESS */}
          {stage === 'success' && (
            <div className="py-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-[22px] font-bold text-foreground mb-2">Case Added Successfully!</h3>
              <p className="text-muted-foreground font-medium mb-6">
                {selectedCase?.caseTitle} has been added to your workspace
              </p>
              <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/30">
                <p className="text-sm text-foreground font-semibold mb-3">
                  ✨ You can now:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Track hearings and deadlines
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Upload and organize case documents
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Generate AI-powered drafts
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    Access precedent research
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* STAGE 5: ERROR */}
          {stage === 'error' && (
            <div className="py-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-500/10 dark:to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-[22px] font-bold text-foreground mb-2">Case Not Found</h3>
              <p className="text-muted-foreground font-medium mb-6 max-w-md mx-auto">
                {errorMessage}
              </p>

              {/* Suggestions */}
              <div className="max-w-md mx-auto p-6 bg-muted rounded-xl border border-border mb-6">
                <p className="text-sm font-bold text-foreground mb-3 text-left">
                  💡 Suggestions:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Double-check the case number format (e.g., 142/2025)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Verify you selected the correct court
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    Ensure the case year is accurate
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    The case may not be digitized yet in the court system
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 max-w-md mx-auto">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-12 border-border hover:bg-accent font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRetry}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/30"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}