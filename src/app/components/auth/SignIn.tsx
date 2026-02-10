import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import jubeeLogoImage from '@/assets/jubee-logo-auth.png';
import { TermsOfService } from './TermsOfService';
import { PrivacyPolicy } from './PrivacyPolicy';

interface SignInProps {
  onSignIn: () => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

type ViewState = 'signin' | 'terms' | 'privacy';

export function SignIn({ onSignIn, onSwitchToSignUp, onForgotPassword }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('signin');

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
  }, [quotes.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn();
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn();
    }, 1000);
  };

  if (currentView === 'terms') return <TermsOfService onBack={() => setCurrentView('signin')} />;
  if (currentView === 'privacy') return <PrivacyPolicy onBack={() => setCurrentView('signin')} />;

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center p-12 overflow-hidden">
      <div className="relative w-full max-w-[1600px] grid grid-cols-2 gap-12 items-center">
        
        {/* Pixel Perfect Vertical Divider */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[90%] opacity-40"
          style={{
            background: 'linear-gradient(to bottom, transparent, #94A3B8, transparent)',
            boxShadow: '0 0 1px rgba(148, 163, 184, 0.1)'
          }}
        />

        {/* Left Side - Sign In Form */}
        <div className="w-full flex flex-col items-center justify-center z-10 pl-5">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="max-h-14 w-auto flex items-center justify-center">
              <img src={jubeeLogoImage} alt="Jubee Logo" className="max-h-10 w-auto object-contain" />
            </div>
            <p className="text-[#94A3B8] text-base font-semibold tracking-wide">For the Record</p>
          </div>

          <div className="w-full max-w-[420px] bg-[#0F172A] border border-[rgba(148,163,184,0.15)] rounded-2xl p-8 mb-6 shadow-2xl backdrop-blur-md">
            <div className="mb-8">
              <h2 className="text-white text-2xl font-semibold mb-1 leading-tight">
                Secure access to your legal ecosystem
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-white text-sm font-medium mb-2.5">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="advocate@example.com or +91 98765 43210"
                  className="w-full h-12 px-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 pr-12 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[#94A3B8] text-sm font-normal hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#94A3B8] text-sm">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToSignUp}
                  className="text-[#3B82F6] font-semibold hover:text-[#60A5FA] transition-colors"
                >
                  Create account
                </button>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full max-w-[420px] mb-6">
            <div className="flex-1 h-px bg-[rgba(148,163,184,0.15)]"></div>
            <p className="text-[#64748B] text-sm font-medium">or continue with</p>
            <div className="flex-1 h-px bg-[rgba(148,163,184,0.15)]"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-[420px] h-12 bg-[#0F172A] border border-[rgba(148,163,184,0.2)] rounded-xl flex items-center justify-center gap-3 hover:bg-[#1E293B] hover:border-[rgba(148,163,184,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-white text-base font-semibold">Sign in with Google</span>
          </button>

          <p className="text-[#64748B] text-xs text-center mt-8">
            By signing in, you agree to our{' '}
            <span className="text-white hover:underline cursor-pointer" onClick={() => setCurrentView('terms')}>Terms of Service</span>
            {' '}and{' '}
            <span className="text-white hover:underline cursor-pointer" onClick={() => setCurrentView('privacy')}>Privacy Policy</span>
          </p>
        </div>

        {/* Right Side - Rotating Quotes */}
        <div className="flex-1 flex items-center justify-center z-10 pl-12">
          <div className="max-w-2xl text-center md:text-left">
            <p className="text-white/90 text-4xl font-serif italic leading-relaxed mb-8 transition-all duration-700 ease-in-out">
              "{quotes[currentQuoteIndex].text}"
            </p>
            <p className="text-white/60 text-xl font-serif tracking-wide transition-all duration-700 ease-in-out">
              — {quotes[currentQuoteIndex].author}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}