import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CheckedState = CheckboxPrimitive.CheckedState;

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Visual error state that sets aria-invalid */
  error?: boolean;
}

/**
 * Accessible Checkbox primitive supporting controlled, uncontrolled, and indeterminate states.
 * Wrapped in Framer Motion for tactile micro-interactions (whileTap scale).
 */
export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, error, ...props }, ref) => {
  const isInvalid = error || props['aria-invalid'] === true || props['aria-invalid'] === 'true';

  return (
    <motion.div whileTap={{ scale: 0.9 }} className="inline-flex items-center justify-center">
      <CheckboxPrimitive.Root
        ref={ref}
        aria-invalid={isInvalid ? 'true' : undefined}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border transition-colors select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'bg-surface hover:border-brand-rose/60',
          isInvalid
            ? 'border-destructive focus-visible:ring-destructive'
            : 'border-border focus-visible:ring-brand-rose',
          'data-[state=checked]:bg-brand-rose data-[state=checked]:text-white data-[state=checked]:border-brand-rose',
          'data-[state=indeterminate]:bg-brand-rose data-[state=indeterminate]:text-white data-[state=indeterminate]:border-brand-rose',
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <Check aria-hidden="true" className="h-3.5 w-3.5 stroke-[3] hidden [[data-state=checked]_&]:block" />
          <Minus aria-hidden="true" className="h-3.5 w-3.5 stroke-[3] hidden [[data-state=indeterminate]_&]:block" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </motion.div>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
