'use client';

import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseStyles = 'bg-[var(--muted)] rounded';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };
  
  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-[wave_1.6s_ease-in-out_infinite]',
    none: '',
  };
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  const combinedClassName = `${baseStyles} ${variants[variant]} ${animations[animation]} ${className}`;
  
  return (
    <div className={combinedClassName} style={style} aria-busy="true" aria-live="polite">
      {animation === 'wave' && (
        <style jsx>{`
          @keyframes wave {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          .animate-\\[wave_1\\.6s_ease-in-out_infinite\\] {
            background: linear-gradient(
              90deg,
              var(--muted) 0%,
              var(--accent) 50%,
              var(--muted) 100%
            );
            background-size: 200% 100%;
            animation: wave 1.6s ease-in-out infinite;
          }
        `}</style>
      )}
    </div>
  );
};

