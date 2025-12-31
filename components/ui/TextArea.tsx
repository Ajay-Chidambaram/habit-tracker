'use client';

import React, { useEffect, useRef } from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, autoResize = false, showCharacterCount = false, maxLength, className = '', value, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;
    
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [autoResize, value, textareaRef]);
    
    const baseStyles = 'w-full px-3 py-2 bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none';
    
    const inputClassName = error
      ? `${baseStyles} border-[var(--destructive)] focus:ring-[var(--destructive)] ${className}`
      : `${baseStyles} ${className}`;
    
    const currentLength = typeof value === 'string' ? value.length : 0;
    const characterCount = maxLength ? `${currentLength}/${maxLength}` : currentLength.toString();
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            {label}
            {props.required && <span className="text-[var(--destructive)] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={textareaRef as React.Ref<HTMLTextAreaElement>}
          className={inputClassName}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <div className="flex justify-between items-center mt-1.5">
          {error && (
            <p className="text-sm text-[var(--destructive)]">{error}</p>
          )}
          {showCharacterCount && (
            <p className={`text-sm ml-auto ${maxLength && currentLength >= maxLength ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}`}>
              {characterCount}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

