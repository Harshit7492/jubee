import { useState } from 'react';
import { X, Bell, User, Building2, CheckCircle2, Hash, FileText } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface AutoCaveatSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (court: string, clientName: string) => void;
}

const courts = [
  'Supreme Court of India',
  'Delhi High Court'
];

export function AutoCaveatSetupDialog({ isOpen, onClose, onSubmit }: AutoCaveatSetupDialogProps) {
  const [selectedCourt, setSelectedCourt] = useState('');
  const [clientName, setClientName] = useState('');
  const [courtOrder, setCourtOrder] = useState('');
  const [courtNumber, setCourtNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedCourt && clientName.trim()) {
      onSubmit(selectedCourt, clientName.trim());
      // Reset form
      setSelectedCourt('');
      setClientName('');
      setCourtNumber('');
      setCourtOrder('');
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-lg pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Auto Caveat Monitoring</h3>
                <p className="text-xs text-muted-foreground">Jubee automatically monitors court orders filed against your client.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Court Selection */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                Select Court
              </label>
              <div className="space-y-2">
                {courts.map((court) => (
                  <button
                    key={court}
                    onClick={() => setSelectedCourt(court)}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                      selectedCourt === court
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedCourt === court
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}>
                        {selectedCourt === court && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{court}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Name Input */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name to monitor..."
                className="w-full h-11 px-4 text-sm bg-input-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Enter the exact name as it appears in court records
              </p>
            </div>

            {/* Court Number Input */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                Case Number
              </label>
              <input
                type="text"
                value={courtNumber}
                onChange={(e) => setCourtNumber(e.target.value)}
                placeholder="e.g., CS(COMM) - 425/2025"
                className="w-full h-11 px-4 text-sm bg-input-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-primary transition-colors"
              />
            </div>

            {/* Court Order Input */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                Date of Order
              </label>
              <input
                type="text"
                value={courtOrder}
                onChange={(e) => setCourtOrder(e.target.value)}
                placeholder="Enter specific order reference..."
                className="w-full h-11 px-4 text-sm bg-input-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-border hover:bg-accent font-semibold h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedCourt || !clientName.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold disabled:opacity-50 h-11"
            >
              <Bell className="w-4 h-4 mr-2" />
              Start Monitoring
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}