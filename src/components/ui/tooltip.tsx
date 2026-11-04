import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

/**
 * Tooltip provider with sensible default hover delay duration (300ms).
 */
export const TooltipProvider: React.FC<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
> = ({ delayDuration = 300, ...props }) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
);

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * High-contrast floating tooltip bubble.
 * Rendered into a portal with automatic collision positioning.
 */
export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-text-primary px-3 py-1.5 text-xs text-surface shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border dark:border-border dark:bg-surface-secondary dark:text-text-primary',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = 'TooltipContent';
