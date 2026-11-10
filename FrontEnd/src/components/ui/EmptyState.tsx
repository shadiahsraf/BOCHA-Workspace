import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  actionButton?: React.ReactNode;
  className?: string;
}

/**
 * Reusable Minimalist & Premium Empty State component.
 * Displays a soft icon, heading-font title, subdued description, and optional action button.
 */
export function EmptyState({
  title,
  description,
  icon: Icon,
  actionButton,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-dashed border-border/80 bg-surface/40 backdrop-blur-xs select-none transition-all duration-300',
        className
      )}
    >
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-rose/10 text-brand-rose mb-4 shadow-xs">
          <Icon className="h-8 w-8 stroke-[1.5]" />
        </div>
      )}
      <h3 className="font-heading text-lg font-bold tracking-wide text-brand-wood dark:text-brand-beige mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionButton && <div className="mt-1">{actionButton}</div>}
    </div>
  );
}

export default EmptyState;
