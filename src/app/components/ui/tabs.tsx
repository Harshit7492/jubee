import React from 'react';

interface TabsProps {
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ children, className = '' }: TabsProps) {
  return (
    <div className={`relative border-b border-border ${className}`}>
      {children}
    </div>
  );
}

interface TabProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Tab({ active = false, onClick, children, className = '' }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-3 text-sm whitespace-nowrap transition-all
        ${active 
          ? 'text-foreground font-semibold' 
          : 'text-muted-foreground font-normal hover:text-foreground'
        }
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
      )}
      {!active && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent" />
      )}
    </button>
  );
}