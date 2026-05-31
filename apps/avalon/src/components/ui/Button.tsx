import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'font-cinzel font-semibold rounded-xl transition-all duration-200 active:scale-95 select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        {
          'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/50 border border-blue-400/30 hover:from-blue-400 hover:to-blue-600':
            variant === 'primary',
          'bg-gradient-to-b from-slate-600 to-slate-800 text-slate-200 shadow-lg border border-slate-500/30 hover:from-slate-500 hover:to-slate-700':
            variant === 'secondary',
          'bg-gradient-to-b from-red-600 to-red-800 text-white shadow-lg shadow-red-900/50 border border-red-500/30 hover:from-red-500 hover:to-red-700':
            variant === 'danger',
          'bg-transparent text-slate-300 hover:text-white hover:bg-white/10 border border-slate-600/50':
            variant === 'ghost',
          'bg-gradient-to-b from-yellow-500 to-amber-700 text-black shadow-lg shadow-amber-900/50 border border-yellow-400/50 hover:from-yellow-400 hover:to-amber-600':
            variant === 'gold',
        },
        {
          'px-3 py-1.5 text-xs': size === 'sm',
          'px-4 py-2.5 text-sm': size === 'md',
          'px-6 py-3.5 text-base': size === 'lg',
        },
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
