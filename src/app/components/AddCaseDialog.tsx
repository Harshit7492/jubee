import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';

interface AddCaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCase: (caseData: any) => void;
}

const courts = [
  'Supreme Court of India',
  'Delhi High Court'
];

const caseTypes = [
  'Arbitration',
  'Commercial Suit',
  'Criminal',
  'Writ Petition',
  'Civil Appeal',
  'Special Leave Petition',
  'Contempt',
  'Review Petition',
  'Transfer Petition'
];

interface CaseDetails {
  caseTitle: string;
  status: string;
  nextDate: string;
  client: string;
  type: string;
}

export function AddCaseDialog({ isOpen, onClose, onAddCase }: AddCaseDialogProps) {
  const [formData, setFormData] = useState({
    court: '',
    caseType: '',
    year: '',
    caseNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedDetails, setFetchedDetails] = useState<CaseDetails | null>(null);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.court) {
      newErrors.court = 'Court is required';
    }
    if (!formData.caseType) {
      newErrors.caseType = 'Case type is required';
    }
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (formData.year.length !== 4 || isNaN(Number(formData.year))) {
      newErrors.year = 'Enter valid 4-digit year';
    }
    if (!formData.caseNumber.trim()) {
      newErrors.caseNumber = 'Case number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    // Simulate API call to fetch case details
    setTimeout(() => {
      // Mock case details based on input
      const mockDetails: CaseDetails = {
        caseTitle: formData.caseType === 'Writ Petition' 
          ? 'AFSAR VS. STATE GOVT OF NCT DELHI'
          : `${formData.caseType.toUpperCase()} CASE ${formData.caseNumber}/${formData.year}`,
        status: 'D',
        nextDate: '29/12/2025',
        client: formData.caseType === 'Writ Petition' ? 'AFSAR' : 'Client Name',
        type: formData.caseType
      };

      setFetchedDetails(mockDetails);
      setIsLoading(false);
    }, 1500);
  };

  const handleContinue = () => {
    if (!fetchedDetails) return;

    const fullCaseNumber = `${formData.caseType === 'Writ Petition' ? 'W.P.(C)' : formData.caseType.substring(0, 3).toUpperCase()} ${formData.caseNumber}/${formData.year}`;

    const newCase = {
      id: Date.now().toString(),
      caseNumber: fullCaseNumber,
      title: fetchedDetails.caseTitle,
      client: fetchedDetails.client,
      court: formData.court,
      type: fetchedDetails.type,
      status: 'active' as const,
      nextHearing: fetchedDetails.nextDate,
      lastActivity: 'Just now'
    };

    onAddCase(newCase);
    toast.success('Case added successfully!');
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      court: '',
      caseType: '',
      year: '',
      caseNumber: ''
    });
    setErrors({});
    setFetchedDetails(null);
    setIsLoading(false);
    onClose();
  };

  const handleCancel = () => {
    setFetchedDetails(null);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-foreground">Add New Case</h2>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-xl hover:bg-accent flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Court */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Court <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.court}
              onChange={(e) => handleChange('court', e.target.value)}
              disabled={fetchedDetails !== null}
              className={`w-full h-11 px-4 bg-background border-2 rounded-lg text-foreground focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.court ? 'border-red-500' : 'border-border'
              }`}
            >
              <option value="">Select court</option>
              {courts.map(court => (
                <option key={court} value={court}>{court}</option>
              ))}
            </select>
            {errors.court && (
              <p className="text-xs text-red-500 mt-1">{errors.court}</p>
            )}
          </div>

          {/* Case Type, Year, Case Number Row */}
          <div className="grid grid-cols-12 gap-4 mb-6">
            <div className="col-span-5">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Case Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.caseType}
                onChange={(e) => handleChange('caseType', e.target.value)}
                disabled={fetchedDetails !== null}
                className={`w-full h-11 px-4 bg-background border-2 rounded-lg text-foreground focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.caseType ? 'border-red-500' : 'border-border'
                }`}
              >
                <option value="">Enter Case Type</option>
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.caseType && (
                <p className="text-xs text-red-500 mt-1">{errors.caseType}</p>
              )}
            </div>

            <div className="col-span-3">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                placeholder="YYYY"
                maxLength={4}
                disabled={fetchedDetails !== null}
                className={`h-11 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.year ? 'border-red-500' : ''
                }`}
              />
              {errors.year && (
                <p className="text-xs text-red-500 mt-1">{errors.year}</p>
              )}
            </div>

            <div className="col-span-4">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Case Number <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.caseNumber}
                onChange={(e) => handleChange('caseNumber', e.target.value)}
                placeholder="Enter"
                disabled={fetchedDetails !== null}
                className={`h-11 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.caseNumber ? 'border-red-500' : ''
                }`}
              />
              {errors.caseNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.caseNumber}</p>
              )}
            </div>
          </div>

          {/* Submit Button (Step 1) */}
          {!fetchedDetails && (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          )}

          {/* Case Details Preview (Step 2) */}
          {fetchedDetails && (
            <div className="space-y-4">
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-r border-border">
                        Case Title
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-r border-border">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                        Next Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-card">
                      <td className="px-4 py-4 text-sm text-foreground border-r border-border">
                        {fetchedDetails.caseTitle}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground border-r border-border">
                        {fetchedDetails.status}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {fetchedDetails.nextDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cancel & Continue Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContinue}
                  className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}