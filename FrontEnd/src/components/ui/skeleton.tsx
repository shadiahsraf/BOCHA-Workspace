import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Visual-only loading placeholder using LifeOS secondary surface tokens.
 *
 * Accessibility Contract:
 * Skeletons are strictly visual placeholders and always render with aria-hidden="true".
 * They do not declare live regions or status roles. The parent container owns
 * `aria-busy="true"` and communicates loading state to assistive technologies.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'animate-pulse motion-reduce:animate-none rounded-md bg-surface-secondary',
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
