import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

export function PersonalInformationView() {
  const [firstName, setFirstName] = useState('Vipul');
  const [lastName, setLastName] = useState('Wadhwa');
  const [contactNumber, setContactNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('vipul@lawfirm.com');
  const [enrollmentNumber, setEnrollmentNumber] = useState('D/123/2015');
  const [position, setPosition] = useState('Advocate');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingEnrollment, setIsEditingEnrollment] = useState(false);
  const [isEditingPosition, setIsEditingPosition] = useState(false);

  const positions = [
    'Advocate',
    'Senior Advocate',
    'Junior',
    'Associate',
    'Partner',
    'Law Student',
    'Legal Researcher',
    'Others'
  ];

  const handleSaveChanges = () => {
    // Mock save functionality
    console.log('Saving changes:', { firstName, lastName, contactNumber, email, enrollmentNumber, position });
    setIsEditingName(false);
    setIsEditingContact(false);
    setIsEditingEmail(false);
    setIsEditingEnrollment(false);
    setIsEditingPosition(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-[22px] font-bold text-foreground">Personal Information</h3>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-6">
        {/* Profile Photo Section */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-5">
          <label className="text-sm font-semibold text-foreground mb-4 block">Profile Photo</label>

          <div className="flex items-center gap-6">
            {/* Profile Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">VW</span>
              </div>

              {/* Upload Overlay */}
              <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Upload/Remove Actions */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Name Field - Split into First and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* First Name Field */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">First Name</label>
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors uppercase"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingName ? (
              <div className="flex gap-2">
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="flex-1 h-11 bg-background border-border text-foreground"
                />
                <Button
                  onClick={() => setIsEditingName(false)}
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-foreground font-medium">{firstName}</div>
            )}
          </div>

          {/* Last Name Field */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">Last Name</label>
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors uppercase"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingName ? (
              <div className="flex gap-2">
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="flex-1 h-11 bg-background border-border text-foreground"
                />
                <Button
                  onClick={() => setIsEditingName(false)}
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-foreground font-medium">{lastName}</div>
            )}
          </div>
        </div>

        {/* Contact Information Grid - Mobile & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Mobile Number Field */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">
                Mobile Number <span className="text-destructive">*</span>
              </label>
              {!isEditingContact && (
                <button
                  onClick={() => setIsEditingContact(true)}
                  className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors uppercase"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingContact ? (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-11 px-3 bg-background border border-border rounded-xl text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <Input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Enter mobile"
                    className="flex-1 h-11 bg-background border-border text-foreground"
                  />
                </div>
                <Button
                  onClick={() => setIsEditingContact(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                {contactNumber ? `${countryCode} ${contactNumber}` : 'No mobile number added'}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">Email Address</label>
              {!isEditingEmail && (
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors uppercase"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingEmail ? (
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-11 bg-background border-border text-foreground"
                />
                <Button
                  onClick={() => setIsEditingEmail(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="text-foreground font-medium">{email}</div>
            )}
          </div>
        </div>

        {/* Professional Information Grid - Enrollment & Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Enrollment Number Field */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">Enrollment Number</label>
              {!isEditingEnrollment && (
                <button
                  onClick={() => setIsEditingEnrollment(true)}
                  className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors uppercase"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingEnrollment ? (
              <div className="flex flex-col gap-2">
                <Input
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  className="flex-1 h-11 bg-background border-border text-foreground"
                />
                <Button
                  onClick={() => setIsEditingEnrollment(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="text-foreground font-medium">{enrollmentNumber}</div>
            )}
          </div>

          {/* Position Field */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">Position</label>
              {!isEditingPosition && (
                <button
                  onClick={() => setIsEditingPosition(true)}
                  className="text-xs font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors uppercase"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingPosition ? (
              <div className="flex flex-col gap-2">
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="h-11 px-4 bg-background border border-border rounded-xl text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                <Button
                  onClick={() => setIsEditingPosition(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="text-foreground font-medium">{position}</div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSaveChanges}
          className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}