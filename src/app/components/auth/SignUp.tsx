import { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown, ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import jubeeLogoImage from '@/assets/jubee-logo-auth.png';
import { TermsOfService } from './TermsOfService';
import { PrivacyPolicy } from './PrivacyPolicy';

interface SignUpProps {
  onSignUp: () => void;
  onSwitchToSignIn: () => void;
}

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

type SignUpStep = 'details' | 'contact' | 'otp';
type ViewState = 'signup' | 'terms' | 'privacy';

export function SignUp({ onSignUp, onSwitchToSignIn }: SignUpProps) {
  const [currentStep, setCurrentStep] = useState<SignUpStep>('details');
  const [currentView, setCurrentView] = useState<ViewState>('signup');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    enrollmentNumber: '',
    position: 'Advocate',
    customPosition: '',
    email: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [contactMethod, setContactMethod] = useState<'email' | 'phone' | null>(null);

  // Quotes for the right side
  const quotes = [
    { text: "There is a higher Court than courts of justice and that is the court of conscience.", author: "M.K. Gandhi" },
    { text: "Education took us from thumb impression to signature; technology has taken us from signature to thumb impression, again.", author: "Justice A.K. Sikri" },
    { text: "Justice will not be served, until those who are unaffected are as outraged as those who are.", author: "Benjamin Franklin" },
    { text: "The Constitution is not merely a lawyer's document; it is a vehicle of life.", author: "Dr. B.R. Ambedkar" },
    { text: "Never mistake law for justice. Justice is an ideal, and law is a tool.", author: "L.E. Modesitt Jr." },
    { text: "Without translation, we would be living in provinces bordering on silence.", author: "George Steiner" },
    { text: "No man is above the law, and no man is below it.", author: "Theodore Roosevelt" },
    { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
    { text: "The ultimate measure of a man is... where he stands at times of challenge.", author: "Martin Luther King Jr." },
    { text: "There comes a time when silence is betrayal.", author: "Martin Luther King Jr." },
    { text: "The moment there is suspicion about a person's motives, everything becomes tainted.", author: "M.K. Gandhi" },
    { text: "When men are pure, laws are useless; when men are corrupt, laws are broken.", author: "Benjamin Disraeli" },
    { text: "To treat women as children of lesser god is to blink at the Constitution itself.", author: "Justice D.Y. Chandrachud" },
    { text: "Lawyers are the only persons in whom, ignorance of law is not punished.", author: "Jeremy Bentham" }
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    // Move to contact verification step
    setCurrentStep('contact');
  };

  const handleSendOTP = () => {
    if (!formData.email && !formData.phone) {
      alert('Please enter either email or mobile number');
      return;
    }

    setIsLoading(true);
    
    // Determine which method was filled
    const method = formData.email ? 'email' : 'phone';
    setContactMethod(method);

    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setCurrentStep('otp');
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      onSignUp();
    }, 1000);
  };

  const handleResendOTP = () => {
    setIsLoading(true);
    
    // Simulate resending OTP
    setTimeout(() => {
      setIsLoading(false);
      alert('OTP resent successfully');
    }, 1000);
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    
    // Simulate Google authentication
    setTimeout(() => {
      setIsLoading(false);
      onSignUp();
    }, 1000);
  };

  const handleBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('contact');
      setOtp('');
      setOtpSent(false);
    } else if (currentStep === 'contact') {
      setCurrentStep('details');
    }
  };

  // Show Terms of Service
  if (currentView === 'terms') {
    return <TermsOfService onBack={() => setCurrentView('signup')} />;
  }

  // Show Privacy Policy
  if (currentView === 'privacy') {
    return <PrivacyPolicy onBack={() => setCurrentView('signup')} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-12">
      <div className="w-full max-w-[1600px] grid grid-cols-2 gap-12 items-center">
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[90%] opacity-40"
          style={{
            background: 'linear-gradient(to bottom, transparent, #94A3B8, transparent)',
            boxShadow: '0 0 1px rgba(148, 163, 184, 0.1)'
          }}
        />
        {/* Left Side - Sign Up Form */}
        <div className="w-full flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="max-h-14 w-auto flex items-center justify-center">
              <img src={jubeeLogoImage} alt="Jubee Logo" className="max-h-10 w-auto object-contain" />
            </div>
            <p className="text-foreground text-base font-semibold tracking-wide">The Legal Benchmark</p>
          </div>

          {/* Sign Up Form Card */}
          <div className="w-full max-w-[420px] bg-[#0F172A] border border-[rgba(148,163,184,0.15)] rounded-2xl p-8 mb-6">
            {/* Back Button */}
            {currentStep !== 'details' && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}

            {/* Step 1: Account Details */}
            {currentStep === 'details' && (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-white text-2xl font-semibold mb-1">
                    Create your account
                  </h2>
                  <p className="text-[#94A3B8] text-sm">
                    Built for lawyers. Designed for real workflows.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleStep1Submit} className="space-y-5">
                  {/* First Name and Last Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Ramesh"
                        className="w-full h-11 px-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Kumar"
                        className="w-full h-11 px-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Username Field */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2.5">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="advocate123"
                      className="w-full h-11 px-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2.5">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Minimum 8 characters"
                        className="w-full h-11 px-4 pr-12 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Re-enter your password"
                        className="w-full h-11 px-4 pr-12 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Two Column Layout for Enrollment and Position */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Enrollment Number Field */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2.5">
                        Enrollment No.
                      </label>
                      <input
                        type="text"
                        value={formData.enrollmentNumber}
                        onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                        placeholder="Optional"
                        className="w-full h-11 px-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Position Dropdown */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2.5">
                        Position
                      </label>
                      <div className="relative">
                        <select
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="w-full h-11 px-4 pr-10 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                        >
                          {positions.map((pos) => (
                            <option key={pos} value={pos} className="bg-[#1E293B] text-white">{pos}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Custom Position Field (shown when "Others" is selected) */}
                  {formData.position === 'Others' && (
                    <div>
                      <label className="block text-white text-sm font-medium mb-2.5">
                        Specify Position *
                      </label>
                      <input
                        type="text"
                        value={formData.customPosition}
                        onChange={(e) => setFormData({ ...formData, customPosition: e.target.value })}
                        placeholder="Enter your position"
                        className="w-full h-11 px-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        required={formData.position === 'Others'}
                      />
                    </div>
                  )}

                  {/* Continue Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    Continue
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className="text-[#94A3B8] text-sm">
                    Already have an account?{' '}
                    <button
                      onClick={onSwitchToSignIn}
                      className="text-primary font-semibold hover:text-[#60A5FA] transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* Step 2: Contact Verification */}
            {currentStep === 'contact' && (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-white text-2xl font-semibold mb-2">
                    Verify your contact
                  </h2>
                  <p className="text-[#94A3B8] text-sm">
                    Enter your email or mobile number to receive OTP
                  </p>
                </div>

                {/* Contact Form */}
                <div className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value, phone: '' })}
                        placeholder="advocate@example.com"
                        className="w-full h-11 pl-12 pr-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        disabled={!!formData.phone}
                      />
                    </div>
                  </div>

                  {/* OR Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[rgba(148,163,184,0.15)]"></div>
                    <p className="text-[#64748B] text-xs font-medium">OR</p>
                    <div className="flex-1 h-px bg-[rgba(148,163,184,0.15)]"></div>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2.5">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value, email: '' })}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 pl-12 pr-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        disabled={!!formData.email}
                      />
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="bg-[#1E293B] border border-[rgba(59,130,246,0.2)] rounded-xl p-4">
                    <p className="text-[#94A3B8] text-xs leading-relaxed">
                      <span className="text-primary font-semibold">Note:</span> You need to enter either email or mobile number. We'll send a 6-digit OTP for verification.
                    </p>
                  </div>

                  {/* Send OTP Button */}
                  <button
                    onClick={handleSendOTP}
                    disabled={isLoading || (!formData.email && !formData.phone)}
                    className="w-full h-12 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              </>
            )}

            {/* Step 3: OTP Verification */}
            {currentStep === 'otp' && (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-white text-2xl font-semibold mb-2">
                    Verify OTP
                  </h2>
                  <p className="text-[#94A3B8] text-sm">
                    Enter the 6-digit code sent to{' '}
                    <span className="text-white font-medium">
                      {contactMethod === 'email' ? formData.email : formData.phone}
                    </span>
                  </p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  {/* OTP Input */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2.5">
                      Enter OTP *
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                      }}
                      placeholder="000000"
                      className="w-full h-11 px-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-lg tracking-widest text-center placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      maxLength={6}
                      required
                    />
                  </div>

                  {/* Resend OTP */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary text-sm font-semibold hover:text-[#60A5FA] transition-colors disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-12 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Google Sign Up - Only show on first step */}
          {currentStep === 'details' && (
            <>
              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-[rgba(148,163,184,0.15)]"></div>
                <p className="text-[#64748B] text-sm font-medium">or continue with</p>
                <div className="flex-1 h-px bg-[rgba(148,163,184,0.15)]"></div>
              </div>

              {/* Google Sign Up */}
              <button
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-[420px] h-12 bg-[#0F172A] border border-[rgba(148,163,184,0.2)] rounded-xl flex items-center justify-center gap-3 hover:bg-[#1E293B] hover:border-[rgba(148,163,184,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-white text-base font-semibold">
                  Sign up with Google
                </span>
              </button>

              {/* Footer */}
              <p className="text-[#64748B] text-xs text-center mt-8">
                By creating an account, you agree to our{' '}
                <span className="text-white hover:underline cursor-pointer" onClick={() => setCurrentView('terms')}>Terms of Service</span>
                {' '}and{' '}
                <span className="text-white hover:underline cursor-pointer" onClick={() => setCurrentView('privacy')}>Privacy Policy</span>
              </p>
            </>
          )}
        </div>

        {/* Right Side - Rotating Quotes */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl">
            <p className="text-white/90 text-3xl font-serif italic leading-relaxed mb-8 transition-opacity duration-500">
              "{quotes[currentQuoteIndex].text}"
            </p>
            <p className="text-white/60 text-lg font-serif transition-opacity duration-500">
              — {quotes[currentQuoteIndex].author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}