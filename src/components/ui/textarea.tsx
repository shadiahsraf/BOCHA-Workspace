import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border bg-surface text-text-primary placeholder:text-text-secondary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-secondary/40 read-only:cursor-default read-only:bg-surface-secondary/20 resize-y',
  {
    variants: {
      textareaSize: {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-3.5 py-2.5 text-base',
      },
      error: {
        true: 'border-destructive focus-visible:ring-destructive',
        false: 'border-border focus-visible:ring-primary',
      },
    },
    defaultVariants: {
      textareaSize: 'md',
      error: false,
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  /** Visual error state that sets aria-invalid */
  error?: boolean;
}

/**
 * Standard LifeOS Textarea primitive with vertical resizing bounds,
 * design token compliance, and accessible validation states.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      textareaSize = 'md',
      error = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isInvalid = error || props['aria-invalid'] === true || props['aria-invalid'] === 'true';

    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={isInvalid ? 'true' : undefined}
        className={cn(textareaVariants({ textareaSize, error: isInvalid }), className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
