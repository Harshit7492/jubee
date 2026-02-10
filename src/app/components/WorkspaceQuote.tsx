import { useState, useEffect } from 'react';

interface WorkspaceQuoteProps {
  quotes: Array<{ text: string; author: string }>;
  rotationInterval?: number; // in milliseconds
}

export function WorkspaceQuote({ quotes, rotationInterval = 15000 }: WorkspaceQuoteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [quotes.length, rotationInterval]);

  const currentQuote = quotes[currentIndex];

  return (
    <div className="mb-6 px-6 py-4 bg-gradient-to-r from-[#4A5F7F] to-[#5A708F] rounded-xl shadow-md">
      <p className="text-white text-sm font-serif italic leading-relaxed transition-opacity duration-300">
        {currentQuote.text} — {currentQuote.author}
      </p>
    </div>
  );
}

// Quote collections for each workspace
export const WORKSPACE_QUOTES = {
  home: [
    { text: "It is not that I'm so smart, but I stay with the questions much longer.", author: "Albert Einstein" },
    { text: "If I knew what we were doing, it wouldn't be called research, would it?", author: "Albert Einstein" },
    { text: "Translation is that which transforms everything so that nothing changes.", author: "Umberto Eco" },
    { text: "There is no better way of exercising the imagination than the study of law.", author: "Jean Giraudoux" },
    { text: "The Constitution of India is supreme, and all three wings have to work as per it.", author: "Judiciary/Parliament" },
    { text: "Imagination is more important than knowledge. Imagination encircles the world.", author: "Albert Einstein" },
    { text: "The Lakshman Rekha can be crossed only when it is necessary... for a good cause.", author: "Fali Nariman" },
    { text: "Every case is simple, until you read the file.", author: "Unknown" },
    { text: "Judiciary is the guardian of civilised life.", author: "Dr. A.P.J. Abdul Kalam" },
    { text: "Any system treating a woman with indignity... invites the wrath of the Constitution.", author: "Justice Dipak Mishra" },
    { text: "Law must be stable, but it must not stand still.", author: "Roscoe Pound" },
    { text: "If there were no bad people, there would be no good lawyers.", author: "Charles Dickens" },
    { text: "He is no lawyer who cannot take both sides.", author: "Charles Lamb" },
    { text: "Champions are made from... a desire, a dream, a vision.", author: "M.K. Gandhi" },
    { text: "The power of concentration is the only key to the treasure-house of knowledge.", author: "Swami Vivekananda" }
  ],
  'research-board': [
    {
      text: "If I knew what we were doing, it wouldn't be called research, would it?",
      author: "Albert Einstein"
    },
    {
      text: "Research is to see what everybody else has seen, and to think what nobody else has thought.",
      author: "Albert Szent-Györgyi"
    },
    {
      text: "The important thing is not to stop questioning.",
      author: "Albert Einstein"
    }
  ],
  scrutiny: [
    {
      text: "No man is above the law, and no man is below it.",
      author: "Theodore Roosevelt"
    },
    {
      text: "The first duty of society is justice.",
      author: "Alexander Hamilton"
    },
    {
      text: "Equal justice under law.",
      author: "U.S. Supreme Court Motto"
    }
  ],
  author: [
    {
      text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
      author: "Albert Einstein"
    },
    {
      text: "The pen is mightier than the sword.",
      author: "Edward Bulwer-Lytton"
    },
    {
      text: "Words are, of course, the most powerful drug used by mankind.",
      author: "Rudyard Kipling"
    }
  ],
  probe: [
    {
      text: "There comes a time when silence is betrayal.",
      author: "Martin Luther King Jr."
    },
    {
      text: "The truth is rarely pure and never simple.",
      author: "Oscar Wilde"
    },
    {
      text: "In a time of deceit, telling the truth is a revolutionary act.",
      author: "George Orwell"
    }
  ],
  translation: [
    {
      text: "Translation is that which transforms everything so that nothing changes.",
      author: "Umberto Eco"
    },
    {
      text: "To translate is to betray.",
      author: "Italian Proverb"
    },
    {
      text: "Language is the road map of a culture.",
      author: "Rita Mae Brown"
    }
  ],
  steno: [
    {
      text: "There is no better way of exercising the imagination than the study of law.",
      author: "Jean Giraudoux"
    },
    {
      text: "The devil is in the details.",
      author: "Ludwig Mies van der Rohe"
    },
    {
      text: "Precision is the soul of legislation.",
      author: "Jeremy Bentham"
    }
  ],
  radar: [
    {
      text: "Law must be stable, but it must not stand still.",
      author: "Roscoe Pound"
    },
    {
      text: "Precedent is a dangerous source of authority.",
      author: "Benjamin N. Cardozo"
    },
    {
      text: "The life of the law has not been logic; it has been experience.",
      author: "Oliver Wendell Holmes Jr."
    }
  ],
  verbatim: [
    {
      text: "The power of concentration is the only key to the treasure-house of knowledge.",
      author: "Swami Vivekananda"
    },
    {
      text: "The spoken word belongs half to him who speaks, and half to him who listens.",
      author: "French Proverb"
    },
    {
      text: "Listen with the intent to understand, not the intent to reply.",
      author: "Stephen R. Covey"
    }
  ],
  precedent: [
    {
      text: "Law must be stable, but it must not stand still.",
      author: "Roscoe Pound"
    },
    {
      text: "Precedent is a dangerous source of authority.",
      author: "Benjamin N. Cardozo"
    },
    {
      text: "The life of the law has not been logic; it has been experience.",
      author: "Oliver Wendell Holmes Jr."
    }
  ],
  'cross-examiner': [
    {
      text: "There comes a time when silence is betrayal.",
      author: "Martin Luther King Jr."
    },
    {
      text: "The truth is rarely pure and never simple.",
      author: "Oscar Wilde"
    },
    {
      text: "In a time of deceit, telling the truth is a revolutionary act.",
      author: "George Orwell"
    }
  ],
  case: [
    {
      text: "The good lawyer is not the man who has an eye to every side and angle of contingency.",
      author: "Judge Learned Hand"
    },
    {
      text: "The first duty of society is justice.",
      author: "Alexander Hamilton"
    },
    {
      text: "Justice is the constant and perpetual will to allot to every man his due.",
      author: "Ulpian"
    }
  ],
  myspace: [
    {
      text: "Organization is what you do before you do something, so that when you do it, it is not all mixed up.",
      author: "A.A. Milne"
    },
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain"
    },
    {
      text: "Order is the shape upon which beauty depends.",
      author: "Pearl S. Buck"
    }
  ],
  mycases: [
    {
      text: "The good lawyer is not the man who has an eye to every side and angle of contingency.",
      author: "Judge Learned Hand"
    },
    {
      text: "In law, nothing is certain but the expense.",
      author: "Samuel Butler"
    },
    {
      text: "The study of law was a duty which he owed to his family and to himself.",
      author: "Jane Austen"
    }
  ],
  mydiary: [
    {
      text: "Time is what we want most, but what we use worst.",
      author: "William Penn"
    },
    {
      text: "The key is in not spending time, but in investing it.",
      author: "Stephen R. Covey"
    },
    {
      text: "Lost time is never found again.",
      author: "Benjamin Franklin"
    }
  ]
} as const;