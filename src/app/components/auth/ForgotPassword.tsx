import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import jubeeLogoImage from '@/assets/jubee-logo-auth.png';

interface ForgotPasswordProps {
  onBackToSignIn: () => void;
}

export function ForgotPassword({ onBackToSignIn }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Quotes for the right side (matching SignIn style)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

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

        {/* Left Side - Form/Success Container */}
        <div className="w-full flex flex-col items-center justify-center z-10 pl-5">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="max-h-14 w-auto flex items-center justify-center">
              <img src={jubeeLogoImage} alt="Jubee Logo" className="max-h-10 w-auto object-contain" />
            </div>
            {!isSubmitted && <p className="text-[#94A3B8] text-base font-semibold tracking-wide">For the Record</p>}
          </div>

          <div className="w-full max-w-[420px] bg-[#0F172A] border border-[rgba(148,163,184,0.15)] rounded-2xl p-8 mb-6 shadow-2xl backdrop-blur-md">
            {isSubmitted ? (
              /* Success State */
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-[#3B82F6]" />
                </div>
                <h2 className="text-white text-2xl font-semibold mb-3">Check your email</h2>
                <p className="text-[#94A3B8] text-base mb-2">We've sent a password reset link to:</p>
                <p className="text-white text-base font-medium mb-6">{email}</p>
                <p className="text-[#94A3B8] text-sm mb-8">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                <div className="w-full space-y-3">
                  <button
                    onClick={onBackToSignIn}
                    className="w-full h-12 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all"
                  >
                    Back to Sign In
                  </button>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="w-full text-[#3B82F6] text-sm font-medium hover:text-[#60A5FA] transition-colors py-3"
                  >
                    Didn't receive the email? Resend
                  </button>
                </div>
              </div>
            ) : (
              /* Reset Form State */
              <>
                <button
                  onClick={onBackToSignIn}
                  className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors mb-6 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">Back to Sign In</span>
                </button>

                <div className="mb-8">
                  <h1 className="text-white text-2xl font-semibold mb-2 leading-tight">Reset your password</h1>
                  <p className="text-[#94A3B8] text-sm">No worries. We'll help you get back in.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-white text-sm font-medium mb-2.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="advocate@example.com"
                      className="w-full h-12 px-4 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl text-white text-sm placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-xl font-semibold text-base hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Help/Footer Text */}
          <div className="text-center">
            {isSubmitted ? (
              <p className="text-[#64748B] text-xs">
                If you don't see the email, check your spam folder or contact{' '}
                <a href="mailto:support@jubee.ai" className="text-white hover:underline transition-colors">
                  support@jubee.ai
                </a>
              </p>
            ) : (
              <p className="text-[#64748B] text-xs">
                Remember your password?{' '}
                <button
                  onClick={onBackToSignIn}
                  className="text-[#3B82F6] font-semibold hover:text-[#60A5FA] transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Rotating Quotes (Matching SignIn) */}
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