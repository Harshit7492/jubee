import { Scale, Building2, Mail, Phone, MapPin, FileText, Shield, HelpCircle, BookOpen, Sparkles } from 'lucide-react';
import jubeeLogo from '@/assets/jubee-logo.png';

interface JubeeFooterProps {
  onNavigate?: (view: string) => void;
}

export function JubeeFooter({ onNavigate }: JubeeFooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <footer className="bg-card border-t border-border mt-auto w-full">
      {/* Main Footer Content */}
      <div className="w-full px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <img src={jubeeLogo} alt="Jubee Logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Jubee</h3>
              </div>
            </div>
          </div>

          {/* Product Navigation */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Platform</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleNavigation('research-board')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors"></span>
                  Research Board
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('registry')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors"></span>
                  Registry Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('precedent')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors"></span>
                  Jubee Radar
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('cases')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors"></span>
                  My Cases
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('diary')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors"></span>
                  My Diary
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('myspace')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors"></span>
                  My Space
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('scrutiny')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors"></span>
                  Jubee Scrutiny
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Courts */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Supported Courts</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Supreme Court of India</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>All High Courts across India</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <BookOpen className="w-4 h-4 group-hover:text-primary transition-colors" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <HelpCircle className="w-4 h-4 group-hover:text-primary transition-colors" />
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Contact Us</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href="mailto:support@jubee.legal"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
                  support@jubee.legal
                </a>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <Phone className="w-4 h-4 group-hover:text-primary transition-colors" />
                  +91 12345 67890
                </a>
              </li>
              <li>
                <div className="text-sm text-muted-foreground flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>New Delhi, India</span>
                </div>
              </li>
            </ul>

            <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <FileText className="w-4 h-4 group-hover:text-primary transition-colors" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <Shield className="w-4 h-4 group-hover:text-primary transition-colors" />
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}