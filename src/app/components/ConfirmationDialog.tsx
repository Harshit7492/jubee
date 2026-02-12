import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-500 bg-red-500/10';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'info':
        return 'text-primary bg-primary/10';
      default:
        return 'text-yellow-500 bg-yellow-500/10';
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'info':
        return 'bg-primary hover:bg-primary/90 text-white';
      default:
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md pointer-events-auto">
          {/* Icon */}
          <div className="flex mb-6">
            <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-[#3B82F6]" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
          </div>

          {/* Subtext */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex-1 h-12 border-[#1E293B] hover:bg-[#1E293B]/50"
            >
              {cancelText}
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold shadow-lg shadow-[#3B82F6]/20 hover:shadow-[#3B82F6]/30"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}