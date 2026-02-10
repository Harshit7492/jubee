interface OnboardingStep {
  title: string;
  description: string;
  imageUrl: string;
}

interface ToolOnboardingSteps {
  [key: string]: OnboardingStep[];
}

export const toolOnboardingSteps: ToolOnboardingSteps = {
  research: [
    {
      title: 'Welcome to Legal Research',
      description: 'Search through Supreme Court and High Court judgments, find relevant precedents, and analyze case law with AI-powered insights.',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80'
    },
    {
      title: 'Search with Natural Language',
      description: 'Simply type your legal query in plain English. Our AI understands context and finds the most relevant cases for your research.',
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80'
    },
    {
      title: 'Get Instant Precedents',
      description: 'Receive comprehensive case citations, key holdings, and relevant legal principles instantly. Filter by court, date, and relevance.',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80'
    },
    {
      title: 'Analyze & Export',
      description: 'Deep dive into judgments, get AI summaries, and export formatted citations for your pleadings and submissions.',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80'
    }
  ],
  drafting: [
    {
      title: 'Welcome to AI Drafting',
      description: 'Draft pleadings, notices, applications, and legal documents with AI assistance tailored for Indian legal practice.',
      imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80'
    },
    {
      title: 'Choose Your Document Type',
      description: 'Select from various templates - petitions, bail applications, notices, contracts, or start from scratch with custom requirements.',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'
    },
    {
      title: 'Provide Case Details',
      description: 'Input your case facts, parties, and key points. Our AI will structure the document following court format and legal standards.',
      imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80'
    },
    {
      title: 'Review & Refine',
      description: 'Get a complete draft with proper citations, legal arguments, and formatting. Edit, refine, and download in Word or PDF format.',
      imageUrl: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80'
    }
  ],
  translation: [
    {
      title: 'Welcome to Legal Translation',
      description: 'Translate legal documents across 22+ Indian languages while preserving legal terminology and context accuracy.',
      imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80'
    },
    {
      title: 'Upload Your Document',
      description: 'Upload judgments, deeds, affidavits, or any legal document in PDF, Word, or image format. We support all major file types.',
      imageUrl: 'https://images.unsplash.com/photo-1618044619888-009e412ff12a?w=800&q=80'
    },
    {
      title: 'AI-Powered Translation',
      description: 'Our legal-context AI translates while maintaining legal accuracy, preserving legal terms, and formatting structure.',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80'
    },
    {
      title: 'Download & Verify',
      description: 'Review the translated document with side-by-side comparison, verify accuracy, and download in your preferred format.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    }
  ],
  typing: [
    {
      title: 'Welcome to Court Typing',
      description: 'Convert your documents to court-compliant format with proper typing, spacing, and formatting as per court rules.',
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'
    },
    {
      title: 'Upload Source Document',
      description: 'Upload your draft document in any format - handwritten notes, Word files, PDFs, or scanned images.',
      imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80'
    },
    {
      title: 'Auto-Format to Court Standards',
      description: 'AI automatically applies correct margins, line spacing, font size, and paragraph numbering as per court requirements.',
      imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80'
    },
    {
      title: 'Print-Ready Output',
      description: 'Get a perfectly formatted, print-ready document compliant with Supreme Court and High Court typing rules.',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80'
    }
  ],
  draftsman: [
    {
      title: 'Welcome to Jubee Counsel',
      description: 'Your AI drafting assistant that provides intelligent suggestions, edits, and improvements while you write legal documents.',
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'
    },
    {
      title: 'Start Writing or Upload',
      description: 'Begin typing your document or upload an existing draft. Jubee Counsel works alongside you in real-time.',
      imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80'
    },
    {
      title: 'Get Smart Suggestions',
      description: 'Receive AI-powered suggestions for better phrasing, stronger legal arguments, relevant citations, and structural improvements.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
    },
    {
      title: 'Collaborate with AI',
      description: 'Accept, reject, or modify suggestions. Ask questions about specific clauses and get instant explanations and alternatives.',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80'
    }
  ],
  psi: [
    {
      title: 'Welcome to PSI Analysis',
      description: 'Precedent Strength Index - Evaluate how strongly a case or judgment supports your legal arguments with AI-powered scoring.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
    },
    {
      title: 'Input Your Precedent',
      description: 'Upload or cite the case you want to analyze. You can also paste case text or provide case citations.',
      imageUrl: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&q=80'
    },
    {
      title: 'AI Strength Scoring',
      description: 'Get comprehensive analysis including binding nature, jurisdictional strength, citation count, and judicial authority score.',
      imageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80'
    },
    {
      title: 'Strategic Insights',
      description: 'Understand which precedents to cite prominently, which need supporting cases, and how to structure your legal arguments.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    }
  ],
  'cross-examiner': [
    {
      title: 'Welcome to Cross-Examiner',
      description: 'AI-assisted cross-examination preparation tool that helps you develop strategic questions to expose weaknesses in witness testimony.',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80'
    },
    {
      title: 'Upload Witness Statement',
      description: 'Provide the witness examination-in-chief, affidavit, or statement. AI will analyze for inconsistencies and weak points.',
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80'
    },
    {
      title: 'AI Identifies Weaknesses',
      description: 'Advanced AI highlights contradictions, timeline issues, credibility concerns, and areas vulnerable to cross-examination.',
      imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80'
    },
    {
      title: 'Generate Question Strategy',
      description: 'Get structured cross-examination questions organized by theme, with suggested follow-ups and impeachment strategies.',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80'
    }
  ]
};