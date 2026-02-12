import { useEffect, useState } from 'react';
import { Radar, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface RadarPreviewProps {
  proposition: string;
  jurisdictions: string[];
  onConfirm: () => void;
  onEdit: () => void;
}

export function RadarPreview({ proposition, jurisdictions, onConfirm, onEdit }: RadarPreviewProps) {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    // Auto-advance after animation
    const timer = setTimeout(() => {
      setScanning(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Radar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Radar Configuration Preview</h1>
            <p className="text-sm text-muted-foreground">Review your setup before activation</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 relative">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgb(59 130 246 / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(59 130 246 / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Centered Content */}
        <div className="flex items-center justify-center min-h-full relative z-10">
          <div className="w-full max-w-3xl">
            {/* Radar Animation Container */}
            <div className="bg-card border-2 border-primary/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Radar Animation */}
              <div className="p-12 flex items-center justify-center bg-gradient-to-br from-primary/5 via-transparent to-primary/5 relative">
                <div className="relative w-80 h-80">
                  {/* Concentric circles */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                  <div className="absolute inset-8 rounded-full border border-primary/15" />
                  <div className="absolute inset-16 rounded-full border border-primary/10" />
                  <div className="absolute inset-24 rounded-full border border-primary/5" />

                  {/* Center dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50" />

                  {/* Rotating scanning beam */}
                  {scanning && (
                    <div
                      className="absolute top-1/2 left-1/2 w-1/2 h-1 origin-left"
                      style={{
                        background: 'linear-gradient(to right, rgba(59, 130, 246, 0.8), transparent)',
                        animation: 'radar-scan 2s linear infinite',
                        transformOrigin: 'left center'
                      }}
                    />
                  )}

                  {/* Success checkmark (appears after scanning) */}
                  {!scanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                        <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
                      </div>
                    </div>
                  )}

                  {/* Pulsing dots indicating jurisdictions */}
                  {scanning && (
                    <>
                      <div className="absolute top-[15%] right-[25%] w-3 h-3 bg-primary/60 rounded-full animate-pulse-slow" />
                      <div className="absolute bottom-[20%] right-[15%] w-3 h-3 bg-primary/60 rounded-full animate-pulse-slow delay-150" />
                      <div className="absolute bottom-[25%] left-[20%] w-3 h-3 bg-primary/60 rounded-full animate-pulse-slow delay-300" />
                      <div className="absolute top-[30%] left-[15%] w-3 h-3 bg-primary/60 rounded-full animate-pulse-slow delay-450" />
                    </>
                  )}
                </div>

                {/* Status Text */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <p className="text-sm font-semibold text-primary animate-pulse">
                    {scanning ? 'Calibrating radar parameters...' : 'Configuration ready'}
                  </p>
                </div>
              </div>

              {/* Configuration Details */}
              <div className="px-8 pb-8 space-y-6">
                {/* Proposition Preview */}
                <div className="bg-accent/30 border border-border rounded-xl p-5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                    Target Proposition
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    {proposition}
                  </p>
                </div>

                {/* Jurisdictions Preview */}
                <div className="bg-accent/30 border border-border rounded-xl p-5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                    Monitoring Jurisdictions ({jurisdictions.length})
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2">
                    {jurisdictions.map((jurisdiction, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-primary/10 text-primary border border-primary/20 text-xs"
                      >
                        {jurisdiction}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-accent/30 border-t border-border px-8 py-5 flex items-center justify-between gap-4">
                <Button
                  onClick={onEdit}
                  variant="ghost"
                  className="flex-1 border-2 border-border hover:bg-accent font-semibold"
                >
                  Edit Configuration
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={scanning}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {scanning ? 'Calibrating...' : 'Set Radar Live'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes radar-scan {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-150 {
          animation-delay: 150ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-450 {
          animation-delay: 450ms;
        }
      `}</style>
    </div>
  );
}