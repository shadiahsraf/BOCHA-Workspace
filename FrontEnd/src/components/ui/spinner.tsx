import * as React from 'react';
import { cn } from '@/lib/utils';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

type BaseSpinnerProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: SpinnerSize;
  className?: string;
};

export type AccessibleSpinnerProps = BaseSpinnerProps & {
  'aria-hidden'?: false;
  /**
   * Accessible announcement label for screen readers.
   * Required when aria-hidden is not true. Must not be empty.
   */
  label: string;
};

export type HiddenSpinnerProps = BaseSpinnerProps & {
  /**
   * Hides the entire spinner and its label from assistive technologies.
   * Required when embedded inside an element that communicates loading via aria-busy.
   */
  'aria-hidden': true;
  label?: string;
};

export type SpinnerProps = AccessibleSpinnerProps | HiddenSpinnerProps;

/**
 * Accessible SVG-based loading indicator supporting standalone status announcements
 * and decorative embedded usage with zero layout shift.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = 'md', className, ...props }, ref) => {
    const isAriaHidden = props['aria-hidden'] === true;
    const label = 'label' in props ? props.label : undefined;
    const trimmedLabel = typeof label === 'string' ? label.trim() : '';
    const hasValidLabel = trimmedLabel.length > 0;

    if (import.meta.env.DEV) {
      if (!isAriaHidden && !hasValidLabel) {
        console.error(
          'LifeOS [Spinner]: Accessible spinner requires a non-empty `label` prop for screen-reader announcements. If embedded inside another accessible component (e.g., Button with aria-busy), pass `aria-hidden={true}`.'
        );
      }
    }

    const svgElement = (
      <svg
        aria-hidden="true"
        className={cn(
          'animate-spin motion-reduce:animate-none',
          sizeMap[size]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Explicitly hidden mode (e.g. inside Button) or invalid standalone usage (missing/whitespace label).
    // When no label exists, hide the element from assistive tech to avoid rendering an empty role="status" live region.
    if (isAriaHidden || !hasValidLabel) {
      const {
        'aria-hidden': _ah,
        label: _l,
        ...restProps
      } = props as HiddenSpinnerProps;

      return (
        <span
          ref={ref}
          aria-hidden="true"
          className={cn('inline-flex shrink-0 items-center justify-center', className)}
          {...restProps}
        >
          {svgElement}
        </span>
      );
    }

    const {
      'aria-hidden': _ah,
      label: _accessibleLabel,
      ...restProps
    } = props as AccessibleSpinnerProps;

    return (
      <span
        ref={ref}
        role="status"
        className={cn('inline-flex shrink-0 items-center justify-center', className)}
        {...restProps}
      >
        {svgElement}
        <span className="sr-only">{trimmedLabel}</span>
      </span>
    );
  }
);

Spinner.displayName = 'Spinner';
