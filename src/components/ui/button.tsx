import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

/**
 * Button variants and sizes configured according to LifeOS design tokens.
 * Notice: 'relative' is part of the base classes to support absolutely centered loading spinners.
 */
export const buttonVariants = cva(
  'relative inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-surface dark:text-background hover:bg-primary/90 active:bg-primary/95 shadow-sm',
        secondary:
          'bg-surface-secondary text-text-primary hover:bg-surface-secondary/80 border border-border active:bg-surface-secondary/90',
        outline:
          'border border-border bg-transparent text-text-primary hover:bg-surface-secondary active:bg-surface-secondary/80',
        ghost:
          'bg-transparent text-text-primary hover:bg-surface-secondary active:bg-surface-secondary/80',
        danger:
          'bg-destructive text-surface dark:text-background hover:bg-destructive/90 active:bg-destructive/95 shadow-sm',
      },
      size: {
        sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
        md: 'h-9 px-4 text-sm gap-2 rounded-md',
        lg: 'h-10 px-5 text-base gap-2.5 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const spinnerSizeMap: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, 'sm' | 'md'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

export interface CommonButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof buttonVariants> {}

export type RegularButtonProps = CommonButtonProps & {
  asChild?: false;
  /**
   * When true, disables the button, displays an absolutely centered loading spinner,
   * hides button content without shifting layout dimensions, and sets aria-busy="true".
   */
  isLoading?: boolean;
  /**
   * Standard HTML button disabled attribute.
   */
  disabled?: boolean;
};

export type SlottedButtonProps = CommonButtonProps & {
  /**
   * When true, delegates rendering to the immediate child element using Radix Slot.
   *
   * Note on Accessibility & Semantics:
   * Slotted elements such as anchors (<a>) do not support native button disabled semantics.
   * Passing `disabled` or `isLoading` with `asChild` is disallowed at the type level.
   * To render a disabled action, use a regular `<Button disabled>` or manage the slotted element directly.
   */
  asChild: true;
  isLoading?: never;
  disabled?: never;
};

export type ButtonProps = RegularButtonProps | SlottedButtonProps;

/**
 * Standard LifeOS Button primitive supporting multiple variants, sizes, Radix Slot polymorphism,
 * and zero-layout-shift loading states.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = 'md',
      asChild = false,
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    const disabled = 'disabled' in props ? (props.disabled as boolean | undefined) : undefined;

    if (import.meta.env.DEV) {
      if (asChild) {
        if (isLoading) {
          console.error(
            'LifeOS [Button]: `isLoading` cannot be used in conjunction with `asChild`. Slotted elements cannot guarantee native button disabled semantics. Render a standard <Button> when loading states are required.'
          );
        }
        if (disabled) {
          console.error(
            'LifeOS [Button]: `disabled` cannot be used in conjunction with `asChild`. Slotted elements (such as <a>) do not support native button disabled semantics and remain focusable and clickable. Use a standard <Button disabled> or manage the link state directly.'
          );
        }
      }
    }

    if (asChild) {
      // Strip any accidental 'disabled' prop so invalid HTML attributes are not passed to slotted elements
      const { disabled: _dis, ...slotProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          {...slotProps}
        >
          {children}
        </Slot>
      );
    }

    const effectiveSize = size || 'md';
    const spinnerSize = spinnerSizeMap[effectiveSize] || 'sm';
    const isButtonDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        disabled={isButtonDisabled}
        aria-busy={isLoading ? 'true' : undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="invisible inline-flex items-center justify-center gap-[inherit]">
              {children}
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <Spinner size={spinnerSize} aria-hidden={true} />
            </span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
