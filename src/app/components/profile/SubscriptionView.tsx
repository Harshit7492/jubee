import { Check, Crown, Sparkles, ChevronRight, CreditCard } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

export function SubscriptionView() {
  const basicFeatures = [
    'Research Board',
    'Recent Activity',
    'Scrutiny',
    'Precedent Radar',
    'My Spaces'
  ];

  const premiumOnlyTools = [
    'Recent Activity',
    'Scrutiny',
    'Jubee Radar',
    'My Spaces'
  ];

  const premiumFeatures = [
    'My Cases Flow',
    'Add New Case',
    'View Case',
    'My Diary Flow',
    'Priority Support',
    'Advanced Analytics'
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-[22px] font-bold text-foreground">Subscription Model</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-6">
        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Plan */}
          <div className="bg-card rounded-2xl border-2 border-border shadow-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Basic Plan</h3>
                  <p className="text-xs text-muted-foreground">Essential tools for legal professionals</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">Free</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                  Standard Section
                </h4>
                <div className="space-y-2">
                  {basicFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <span className="text-sm text-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full border-primary/30 text-primary hover:bg-primary/10 font-semibold h-10"
                disabled
              >
                Current Plan
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-card rounded-2xl border-2 border-[#FBBF24] shadow-2xl overflow-hidden relative">
            {/* Premium Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white px-4 py-1.5 rounded-bl-2xl font-bold text-xs flex items-center gap-1.5 shadow-lg">
              <Crown className="w-3.5 h-3.5" />
              RECOMMENDED
            </div>

            <div className="p-6 border-b border-border bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] dark:from-[#FBBF24]/10 dark:to-[#F59E0B]/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#FBBF24] rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Premium Plan</h3>
                  <p className="text-xs text-muted-foreground">Advanced features for power users</p>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">₹2,999</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </div>

            <div className="p-6">
              {/* All Basic Features */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Everything in Basic, Plus:
                </h4>
                <div className="space-y-2">
                  {basicFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Exclusive Features */}
              <div className="mb-4 pt-4 border-t border-[#FBBF24]/30">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-[#FBBF24]" />
                  Enhanced Section
                </h4>
                <div className="space-y-2">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-sm text-foreground font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#FBBF24] text-white font-bold shadow-lg shadow-[#FBBF24]/30 h-10">
                Upgrade to Premium
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-card rounded-2xl border border-border shadow-lg p-8">
          <h3 className="text-xl font-bold text-foreground mb-6">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Can I switch plans anytime?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes, you can upgrade to Premium or downgrade to Basic at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">What happens to my data if I downgrade?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is safe. However, some Premium features like My Cases and My Diary will become inaccessible until you upgrade again.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-2">Is there a free trial for Premium?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes! New users get a 14-day free trial of Premium with full access to all features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}