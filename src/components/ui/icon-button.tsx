import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button, type buttonVariants } from '@/components/ui/button';

export type IconButtonSize = 'sm' | 'md' | 'lg';

type AccessibleByLabel = {
  /**
   * Accessible announcement label describing the button action for screen readers.
   * Required when aria-labelledby is not provided. Must not be empty.
   */
  'aria-label': string;
  'aria-labelledby'?: never;
};

type AccessibleByLabelledBy = {
  /**
   * ID of an element providing the accessible announcement label.
   * Required when aria-label is not provided. Must not be empty.
   */
  'aria-labelledby': string;
  'aria-label'?: never;
};

export type IconButtonAccessibleNameProps = AccessibleByLabel | AccessibleByLabelledBy;

export type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'aria-labelledby'
> &
  IconButtonAccessibleNameProps & {
    variant?: VariantProps<typeof buttonVariants>['variant'];
    size?: IconButtonSize;
    className?: string;
    isLoading?: boolean;
    /**
     * When true (default), expands the interactive touch target to a minimum 44x44px
     * using a centered pseudo-element without distorting the visual button box.
     *
     * Layout Requirement:
     * When touchTarget is enabled, adjacent IconButtons must maintain sufficient container gap
     * to prevent invisible hit-target overlap:
     * - size="sm" (32px visual, 6px overhang): minimum container gap-3 (12px)
     * - size="md" (36px visual, 4px overhang): minimum container gap-2 (8px)
     * - size="lg" (40px visual, 2px overhang): minimum container gap-1 (4px)
     *
     * In compact toolbars or attached button groups with smaller spacing, set `touchTarget={false}`
     * to constrain the interactive boundary strictly to the visible button bounds.
     */
    touchTarget?: boolean;
  };

/**
 * Square icon-only button primitive enforcing a strict 1:1 aspect ratio,
 * non-empty accessible name contracts, and a configurable 44x44px interactive hit target.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'ghost',
      size = 'md',
      touchTarget = true,
      className,
      ...props
    },
    ref
  ) => {
    if (import.meta.env.DEV) {
      const ariaLabel = props['aria-label'];
      const ariaLabelledBy = props['aria-labelledby'];
      const hasValidLabel = typeof ariaLabel === 'string' && ariaLabel.trim().length > 0;
      const hasValidLabelledBy = typeof ariaLabelledBy === 'string' && ariaLabelledBy.trim().length > 0;

      if (!hasValidLabel && !hasValidLabelledBy) {
        console.error(
          'LifeOS [IconButton]: Must be provided with a non-empty `aria-label` or `aria-labelledby` attribute for accessibility.'
        );
      }
    }

    const sizeClasses: Record<IconButtonSize, string> = {
      sm: 'h-8 w-8',
      md: 'h-9 w-9',
      lg: 'h-10 w-10',
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'aspect-square p-0 shrink-0',
          touchTarget &&
            "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:min-w-[44px] after:min-h-[44px]",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';
