import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  dir?: 'ltr' | 'rtl';
}

/**
 * Accessible progress bar primitive supporting smooth hardware-accelerated transitions
 * and bilingual LTR / RTL fill geometry.
 */
export const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, dir, ...props }, ref) => {
  const { isRtl } = useDirection(dir);
  const clampedValue = Math.min(100, Math.max(0, value ?? 0));
  const offset = 100 - clampedValue;
  const transform = isRtl ? `translateX(${offset}%)` : `translateX(-${offset}%)`;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-surface-secondary',
        className
      )}
      value={value}
      dir={dir}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
        style={{ transform }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = 'Progress';
