import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { cn } from './utils';

interface SearchRecommendation {
  id: string;
  text: string;
  category?: string;
}

interface SearchWithDropdownProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (recommendation: SearchRecommendation) => void;
  placeholder?: string;
  recommendations?: SearchRecommendation[];
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  showIcon?: boolean;
  autoFocus?: boolean;
}

export function SearchWithDropdown({
  value,
  onChange,
  onSelect,
  placeholder = 'Search...',
  recommendations = [],
  className = '',
  inputClassName = '',
  dropdownClassName = '',
  showIcon = true,
  autoFocus = false
}: SearchWithDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter recommendations based on search value
  const filteredRecommendations = value.trim()
    ? recommendations.filter(rec =>
        rec.text.toLowerCase().includes(value.toLowerCase())
      )
    : recommendations;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleInputFocus = () => {
    if (filteredRecommendations.length > 0) {
      setIsOpen(true);
    }
  };

  const handleRecommendationClick = (rec: SearchRecommendation) => {
    onChange(rec.text);
    if (onSelect) {
      onSelect(rec);
    }
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredRecommendations.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredRecommendations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleRecommendationClick(filteredRecommendations[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      {showIcon && (
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
      )}

      {/* Dropdown */}
      {isOpen && filteredRecommendations.length > 0 && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto',
            '[&::-webkit-scrollbar]:w-2',
            '[&::-webkit-scrollbar-track]:bg-transparent',
            '[&::-webkit-scrollbar-thumb]:bg-border',
            '[&::-webkit-scrollbar-thumb]:rounded-full',
            '[&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/50',
            dropdownClassName
          )}
        >
          {/* Recommendations */}
          <div className="py-2">
            {filteredRecommendations.map((rec, index) => (
              <button
                key={rec.id}
                onClick={() => handleRecommendationClick(rec)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  'w-full px-4 py-3 text-left transition-all flex items-start group',
                  focusedIndex === index
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent text-foreground'
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium truncate',
                    focusedIndex === index ? 'text-primary' : 'text-foreground'
                  )}>
                    {rec.text}
                  </p>
                  {rec.category && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {rec.category}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}