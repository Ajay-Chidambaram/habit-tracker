'use client';

import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', className = '' }, ref) => {
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    const variants = {
      success: 'bg-green-500/20 text-green-400 border border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border border-red-500/30',
      info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      default: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)]',
    };
    
    const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;
    
    return (
      <span ref={ref} className={combinedClassName}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

