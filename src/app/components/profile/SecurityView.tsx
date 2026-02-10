import { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

export function SecurityView() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    // Mock password change functionality
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Changing password...');
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const passwordRequirements = [
    { text: 'Length: Minimum 8 characters.', met: newPassword.length >= 8 },
    { text: 'Complexity: Mix of uppercase, lowercase, numbers, and symbols.', met: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword) },
    { text: 'No Personal Info: Avoid names, birthdays, or common words.', met: true },
    { text: 'Unique & Updated: Use different passwords for each account and update regularly.', met: true }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-[22px] font-bold text-foreground">Security & Privacy</h3>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-6">
        {/* All Password Fields in One Box */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6">
          <label className="text-sm font-semibold text-foreground mb-4 block">Current Password</label>
          <div className="relative mb-6">
            <Input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="h-12 pr-12 bg-background border-border text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <label className="text-sm font-semibold text-foreground mb-4 block">New Password</label>
          <div className="relative mb-6">
            <Input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="h-12 pr-12 bg-background border-border text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <label className="text-sm font-semibold text-foreground mb-4 block">Re-Enter Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="h-12 pr-12 bg-background border-border text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Password Requirements</h3>
          <ul className="space-y-3">
            {passwordRequirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className={`mt-0.5 ${req.met && newPassword ? 'text-[#10B981]' : 'text-muted-foreground'}`}>
                  {req.met && newPassword ? '✓' : '•'}
                </span>
                <span className={req.met && newPassword ? 'text-[#10B981]' : 'text-muted-foreground'}>
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Change Password Button */}
        <Button
          onClick={handleChangePassword}
          disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Change Password
        </Button>

        {/* Password Match Warning */}
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="mt-4 text-sm text-destructive">
            ⚠️ Passwords do not match
          </p>
        )}
      </div>
    </div>
  );
}