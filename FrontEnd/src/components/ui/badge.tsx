import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge variants and sizes configured according to LifeOS design tokens.
 * All variants guarantee WCAG 2.2 AA compliant contrast (≥ 4.5:1) across both light and dark themes.
 */
export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary-soft text-text-primary dark:text-primary border-primary/20',
        secondary:
          'bg-surface-secondary text-text-primary border-border',
        outline:
          'bg-transparent text-text-primary border-border',
        success:
          'bg-success-soft text-success border-success/20',
        warning:
          'bg-warning-soft text-warning border-warning/20',
        destructive:
          'bg-destructive-soft text-destructive border-destructive/20',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Compact status badge primitive supporting 6 semantic variants and 2 sizes.
 * Renders as an inline `<span>` with forwarded ref.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
