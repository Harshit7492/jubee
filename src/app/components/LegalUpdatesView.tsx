import { useState } from 'react';
import { ArrowLeft, Clock, BookOpen, Filter, Scale, Building2, FileText, Newspaper } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Tabs, Tab } from '@/app/components/ui/tabs';

interface LegalUpdate {
  id: string;
  title: string;
  brief: string;
  timestamp: string;
  category: 'statute' | 'supreme-court' | 'high-court';
  court?: string;
  isRead: boolean;
  isSaved: boolean;
  fullContent?: string;
  caseNumber?: string;
  judgeName?: string;
  datePublished?: string;
  keyPoints?: string[];
  impact?: string;
}

const mockUpdates: LegalUpdate[] = [
  {
    id: '1',
    title: 'Supreme Court Clarifies Section 138 NI Act',
    brief: 'Recent judgment on the liability of directors in cheque bounce cases establishes burden of proof guidelines for corporate transactions.',
    timestamp: '2h',
    category: 'supreme-court',
    court: 'Supreme Court of India',
    isRead: false,
    isSaved: false,
    caseNumber: 'Criminal Appeal No. 1234/2024',
    judgeName: 'Justice D.Y. Chandrachud & Justice Hrishikesh Roy',
    datePublished: 'January 28, 2026',
    fullContent: `The Supreme Court has delivered a landmark judgment clarifying the scope of liability of directors under Section 138 of the Negotiable Instruments Act, 1881. The Court held that mere designation as a director is insufficient to attract vicarious liability for dishonour of cheques issued by a company.\n\nThe bench emphasized that the complainant must specifically allege and prove that the accused director was in charge of and responsible for the conduct of business at the time of the offence. The Court observed that automatic liability cannot be fastened merely based on holding a directorial position.\n\nThis judgment resolves conflicting interpretations across High Courts and provides definitive guidance on establishing criminal liability in cheque bounce cases involving corporate entities.`,
    keyPoints: [
      'Mere designation as director insufficient for liability under Section 138 NI Act',
      'Complainant must prove director was responsible for business conduct',
      'Automatic vicarious liability cannot be imposed on all directors',
      'Specific averments required in complaint regarding role of accused director',
      'Burden of proof on prosecution to establish active involvement in company affairs'
    ],
    impact: 'This ruling significantly impacts corporate litigation by requiring specific allegations against directors in dishonoured cheque cases. It prevents blanket prosecution of all directors and mandates that only those actively involved in business operations face criminal liability.'
  },
  {
    id: '2',
    title: 'Delhi HC Revises Family Court Procedures',
    brief: 'New guidelines for expedited hearings in matrimonial disputes, reducing average case duration by implementing mandatory mediation.',
    timestamp: '5h',
    category: 'high-court',
    court: 'High Court of Delhi',
    isRead: false,
    isSaved: false,
    caseNumber: 'WP(C) 567/2024',
    judgeName: 'Justice Prathiba M. Singh',
    datePublished: 'January 28, 2026',
    fullContent: `The High Court of Delhi has issued comprehensive guidelines aimed at expediting family court proceedings and reducing the burden on matrimonial dispute resolution. The Court has mandated compulsory mediation before commencement of contested hearings in all matrimonial matters.\n\nThe new framework requires parties to undergo at least three mediation sessions within 60 days of filing. Only upon failure of mediation may the matter proceed to trial. The Court has also set strict timelines for completion of evidence recording and final arguments.\n\nThese reforms are expected to reduce the average case duration from 3-4 years to approximately 12-18 months, providing faster resolution to families in distress.`,
    keyPoints: [
      'Mandatory mediation before contested hearings in all matrimonial disputes',
      'Minimum three mediation sessions required within 60 days',
      'Strict timelines for evidence recording and arguments',
      'Expected reduction in case duration from 3-4 years to 12-18 months',
      'Special emphasis on child custody matters with priority listing'
    ],
    impact: 'These guidelines will substantially reduce pendency in family courts and provide faster relief to parties. The emphasis on mediation promotes amicable settlement and reduces adversarial litigation in sensitive family matters.'
  },
  {
    id: '3',
    title: 'Amendment to Consumer Protection Act 2019',
    brief: 'Parliament passes amendments extending jurisdiction of consumer forums and introducing penalties for unfair trade practices.',
    timestamp: '14h',
    category: 'statute',
    isRead: true,
    isSaved: false,
    datePublished: 'January 27, 2026',
    fullContent: `Parliament has passed the Consumer Protection (Amendment) Act, 2026, introducing significant changes to the consumer protection regime. The amendments extend the pecuniary jurisdiction of District Consumer Forums to Rs. 2 crore (from Rs. 1 crore) and State Commissions to Rs. 10 crore (from Rs. 5 crore).\n\nThe Act introduces stringent penalties for manufacturers and service providers engaging in unfair trade practices, including misleading advertisements and deficient services. Penalties now range up to Rs. 50 lakh for repeated violations.\n\nThe amendments also mandate e-commerce platforms to display country of origin, expiry dates, and comprehensive product information, holding them liable for deficiencies in products sold through their platforms.`,
    keyPoints: [
      'District Forum jurisdiction increased to Rs. 2 crore',
      'State Commission jurisdiction raised to Rs. 10 crore',
      'Penalties up to Rs. 50 lakh for unfair trade practices',
      'E-commerce platforms made liable for product deficiencies',
      'Mandatory display of country of origin and product details on online platforms'
    ],
    impact: 'The amendments significantly strengthen consumer rights and expand access to consumer forums. E-commerce accountability provisions address modern digital commerce challenges and protect online consumers.'
  },
  {
    id: '4',
    title: 'SC Landmark Ruling on Arbitration Act Section 9',
    brief: 'Supreme Court delineates the scope of interim measures in international commercial arbitration proceedings under Section 9.',
    timestamp: '1d',
    category: 'supreme-court',
    court: 'Supreme Court of India',
    isRead: true,
    isSaved: true,
    caseNumber: 'Civil Appeal No. 8901/2024',
    judgeName: 'Justice Sanjiv Khanna & Justice Bela M. Trivedi',
    datePublished: 'January 27, 2026',
    fullContent: `In a significant ruling for international commercial arbitration, the Supreme Court has clarified the scope of Section 9 of the Arbitration and Conciliation Act, 1996, particularly its application to international arbitrations seated outside India.\n\nThe Court held that Indian courts have jurisdiction to grant interim measures under Section 9 even when the arbitration is seated abroad, provided that the subject matter has sufficient connection with India. However, such jurisdiction should be exercised sparingly and only in exceptional circumstances.\n\nThe bench emphasized that party autonomy and the principle of minimal judicial intervention in arbitration must be respected. Courts should refrain from granting interim relief if similar relief can be obtained from courts at the seat of arbitration.`,
    keyPoints: [
      'Section 9 available for foreign-seated arbitrations with Indian nexus',
      'Jurisdiction to be exercised sparingly in exceptional circumstances',
      'Party autonomy and minimal judicial intervention principles upheld',
      'Courts should defer if relief available at seat of arbitration',
      'Sufficient connection with India required for invoking Section 9'
    ],
    impact: 'This judgment provides clarity on a contentious issue in international arbitration and balances the need for interim protection with respect for arbitral autonomy and foreign court jurisdiction.'
  },
  {
    id: '5',
    title: 'Delhi HC on Digital Evidence Admissibility',
    brief: 'High Court establishes comprehensive framework for authentication and admissibility of digital evidence in civil proceedings.',
    timestamp: '1d',
    category: 'high-court',
    court: 'High Court of Delhi',
    isRead: true,
    isSaved: false,
    caseNumber: 'CS(OS) 345/2024',
    judgeName: 'Justice Rajiv Shakdher',
    datePublished: 'January 27, 2026',
    fullContent: `The High Court of Delhi has laid down comprehensive guidelines for authentication and admissibility of digital evidence in civil proceedings, addressing the challenges posed by modern electronic communications and data storage.\n\nThe Court held that electronic records under Section 65B of the Evidence Act require proper certification, but established a practical framework for satisfying this requirement. Screenshots, emails, WhatsApp messages, and other digital communications must be authenticated through certificate under Section 65B(4) or through examination of witnesses who can verify the source and integrity of the evidence.\n\nThe judgment provides detailed procedures for production of evidence from social media platforms, encrypted messaging services, and cloud storage, balancing evidentiary requirements with technological realities.`,
    keyPoints: [
      'Comprehensive framework for digital evidence authentication established',
      'Section 65B certificate mandatory but practical procedures outlined',
      'Screenshots and social media content admissible with proper authentication',
      'Guidelines for evidence from encrypted messaging and cloud storage',
      'Balance between strict evidentiary standards and technological practicalities'
    ],
    impact: 'This judgment addresses critical challenges in modern litigation where digital evidence is increasingly central. It provides practical guidance for lawyers and litigants on presenting electronic evidence while maintaining evidentiary integrity.'
  },
  {
    id: '6',
    title: 'New IT Rules for Data Protection',
    brief: 'Ministry issues guidelines on cross-border data transfer compliance requirements for Indian entities handling personal data.',
    timestamp: '2d',
    category: 'statute',
    isRead: false,
    isSaved: false,
    datePublished: 'January 26, 2026',
    fullContent: `The Ministry of Electronics and Information Technology has notified the Information Technology (Cross-Border Data Transfer) Rules, 2026, establishing comprehensive compliance requirements for transfer of personal data outside India.\n\nThe Rules mandate that entities must obtain explicit consent from data principals before transferring personal data to foreign jurisdictions. Organizations must ensure that the recipient country provides adequate level of data protection comparable to Indian standards.\n\nData fiduciaries must conduct transfer impact assessments and maintain detailed records of all cross-border transfers. The Rules also establish restrictions on transfer of sensitive personal data and require appointment of data protection officers for entities handling large volumes of personal data.`,
    keyPoints: [
      'Explicit consent required for cross-border personal data transfer',
      'Recipient country must provide adequate data protection level',
      'Transfer impact assessments mandatory before data transfer',
      'Detailed records of all cross-border transfers must be maintained',
      'Data protection officers required for large-scale data handlers'
    ],
    impact: 'These Rules significantly impact technology companies, BPOs, and multinational corporations operating in India. Compliance will require substantial changes to data handling practices and international data sharing agreements.'
  }
];

interface LegalUpdatesViewProps {
  onBack?: () => void;
}

export function LegalUpdatesView({ onBack }: LegalUpdatesViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [updates, setUpdates] = useState<LegalUpdate[]>(mockUpdates);
  const [selectedUpdate, setSelectedUpdate] = useState<LegalUpdate | null>(null);

  const filters = [
    { id: 'all', label: 'All Updates', icon: FileText },
    { id: 'statute', label: 'Statutes', icon: BookOpen },
    { id: 'high-court', label: 'High Court of Delhi', icon: Building2 },
    { id: 'supreme-court', label: 'Supreme Court', icon: Scale }
  ];

  const filteredUpdates = activeFilter === 'all' 
    ? updates 
    : updates.filter(update => update.category === activeFilter);

  const handleUpdateClick = (update: LegalUpdate) => {
    setUpdates(updates.map(u => 
      u.id === update.id ? { ...u, isRead: true } : u
    ));
    setSelectedUpdate(update);
  };

  const handleBackToList = () => {
    setSelectedUpdate(null);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'statute':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'supreme-court':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'high-court':
        return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'statute':
        return 'Statute';
      case 'supreme-court':
        return 'SC';
      case 'high-court':
        return 'HC';
      default:
        return category;
    }
  };

  // If viewing a specific update, show detail view
  if (selectedUpdate) {
    return (
      <div className="h-full flex flex-col bg-[#F9F9F9] dark:bg-background">
        {/* Detail Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="gap-2 text-foreground hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <h2 className="text-lg font-bold text-foreground">Legal Update</h2>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryBadge(selectedUpdate.category)}`}>
                    {getCategoryLabel(selectedUpdate.category)}
                  </span>
                  {selectedUpdate.court && (
                    <span className="text-sm text-muted-foreground">{selectedUpdate.court}</span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">{selectedUpdate.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {selectedUpdate.datePublished && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{selectedUpdate.datePublished}</span>
                    </div>
                  )}
                  {selectedUpdate.caseNumber && (
                    <span className="font-medium">{selectedUpdate.caseNumber}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Judge Name */}
            {selectedUpdate.judgeName && (
              <div className="bg-card border border-border rounded-xl p-5 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Bench</p>
                <p className="text-base font-semibold text-foreground">{selectedUpdate.judgeName}</p>
              </div>
            )}

            {/* Key Points */}
            {selectedUpdate.keyPoints && selectedUpdate.keyPoints.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  Key Points
                </h2>
                <div className="space-y-3">
                  {selectedUpdate.keyPoints.map((point, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Content */}
            {selectedUpdate.fullContent && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  Detailed Analysis
                </h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="prose prose-sm max-w-none">
                    {selectedUpdate.fullContent.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-sm text-foreground leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Impact */}
            {selectedUpdate.impact && (
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  Practical Impact
                </h2>
                <p className="text-sm text-foreground leading-relaxed">{selectedUpdate.impact}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F9F9F9] dark:bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Legal Updates</h1>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <Tabs className="mt-1">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <Tab
                  key={filter.id}
                  active={isActive}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </Tab>
              );
            })}
          </Tabs>
        </div>
      </div>

      {/* Updates Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="space-y-4">
            {filteredUpdates.map((update) => {
              return (
                <div
                  key={update.id}
                  onClick={() => handleUpdateClick(update)}
                  className={`
                    relative cursor-pointer
                    bg-card backdrop-blur-sm rounded-xl p-6 
                    border transition-all duration-200
                    ${!update.isRead 
                      ? 'border-border hover:border-cyan-500/40' 
                      : 'border-border hover:border-border'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Unread dot indicator */}
                    {!update.isRead ? (
                      <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0 mt-2" />
                    ) : (
                      <div className="w-2 h-2 flex-shrink-0 mt-2" />
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Category Badge & Timestamp */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCategoryBadge(update.category)}`}>
                          {getCategoryLabel(update.category)}
                        </span>
                        {update.court && (
                          <span className="text-xs text-muted-foreground">{update.court}</span>
                        )}
                        <div className="flex-1" />
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">{update.timestamp} ago</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold mb-2 leading-snug text-foreground">
                        {update.title}
                      </h3>

                      {/* Brief */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {update.brief}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredUpdates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Filter className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">No updates found for this filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}