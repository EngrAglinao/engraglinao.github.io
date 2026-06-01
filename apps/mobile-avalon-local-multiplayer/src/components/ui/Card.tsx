import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'gold' | 'red' | 'green' | 'none';
}

export function Card({ children, className, glow = 'none' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border bg-slate-900/80 backdrop-blur-sm',
        {
          'border-slate-700/50': glow === 'none',
          'border-blue-500/40 shadow-lg shadow-blue-500/20': glow === 'blue',
          'border-yellow-500/40 shadow-lg shadow-yellow-500/20': glow === 'gold',
          'border-red-500/40 shadow-lg shadow-red-500/20': glow === 'red',
          'border-green-500/40 shadow-lg shadow-green-500/20': glow === 'green',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
