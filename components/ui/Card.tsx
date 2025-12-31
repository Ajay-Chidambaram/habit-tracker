'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-sm ${className}`}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-4 border-b border-[var(--border)] ${className}`}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-4 ${className}`}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-6 py-4 border-t border-[var(--border)] ${className}`}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

