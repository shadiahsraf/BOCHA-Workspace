import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const inputVariants = cva(
  'flex w-full rounded-md border bg-surface text-text-primary transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-secondary/40 read-only:cursor-default read-only:bg-surface-secondary/20',
  {
    variants: {
      inputSize: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-3.5 text-base',
      },
      error: {
        true: 'border-destructive focus-visible:ring-destructive',
        false: 'border-border focus-visible:ring-primary',
      },
    },
    defaultVariants: {
      inputSize: 'md',
      error: false,
    },
  }
);

const adornmentPadding = {
  sm: { start: 'ps-8', end: 'pe-8' },
  md: { start: 'ps-9', end: 'pe-9' },
  lg: { start: 'ps-10', end: 'pe-10' },
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Optional adornment element anchored at the inline-start edge */
  startAdornment?: React.ReactNode;
  /** Optional adornment element anchored at the inline-end edge */
  endAdornment?: React.ReactNode;
  /** Optional className for the wrapper container when adornments are present */
  containerClassName?: string;
}

/**
 * Accessible single-line input primitive supporting sizes, error states,
 * and decorative or interactive adornments with logical padding.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type = 'text',
      inputSize = 'md',
      error = false,
      startAdornment,
      endAdornment,
      disabled,
      ...props
    },
    ref
  ) => {
    const isInvalid = error || props['aria-invalid'] === true || props['aria-invalid'] === 'true';
    const effectiveSize = inputSize || 'md';

    if (!startAdornment && !endAdornment) {
      return (
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={isInvalid ? 'true' : undefined}
          className={cn(inputVariants({ inputSize, error: isInvalid }), className)}
          {...props}
        />
      );
    }

    return (
      <div className={cn('relative flex items-center w-full', containerClassName)}>
        {startAdornment ? (
          <span className="absolute start-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-text-secondary pointer-events-none [&>button]:pointer-events-auto [&>a]:pointer-events-auto [&_[role=button]]:pointer-events-auto">
            {startAdornment}
          </span>
        ) : null}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={isInvalid ? 'true' : undefined}
          className={cn(
            inputVariants({ inputSize, error: isInvalid }),
            startAdornment && adornmentPadding[effectiveSize].start,
            endAdornment && adornmentPadding[effectiveSize].end,
            className
          )}
          {...props}
        />
        {endAdornment ? (
          <span className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-text-secondary pointer-events-none [&>button]:pointer-events-auto [&>a]:pointer-events-auto [&_[role=button]]:pointer-events-auto">
            {endAdornment}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
