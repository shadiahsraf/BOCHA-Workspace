import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Alert variants configured according to LifeOS design tokens.
 * Features automated icon positioning using CSS logical properties (`start-4`, `ps-7`)
 * for seamless bilingual LTR and RTL support.
 */
export const alertVariants = cva(
  'relative w-full rounded-lg border p-4 text-sm [&>svg]:absolute [&>svg]:start-4 [&>svg]:top-4 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0 [&>svg~*]:ps-7',
  {
    variants: {
      variant: {
        default: 'bg-surface text-text-primary border-border',
        info: 'bg-primary-soft text-text-primary border-primary/20 [&>svg]:text-primary',
        success: 'bg-success-soft text-text-primary border-success/20 [&>svg]:text-success',
        warning: 'bg-warning-soft text-text-primary border-warning/20 [&>svg]:text-warning',
        destructive:
          'bg-destructive-soft text-text-primary border-destructive/20 [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>,
    VariantProps<typeof alertVariants> {
  /**
   * Accessible live region role.
   * - 'alert': Urgent, assertive notification for critical errors/actions (implicitly `aria-live="assertive"`).
   * - 'status': Polite status advisory for updates/success/warnings (implicitly `aria-live="polite"`).
   * - undefined (default): Static or initial page alert; avoids unprompted assistive announcements on page load.
   */
  role?: 'alert' | 'status';
}

/**
 * Alert feedback container primitive.
 * Decouples visual variant from screen-reader live region announcement behavior.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, role, ...props }, ref) => (
    <div
      ref={ref}
      role={role}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
Alert.displayName = 'Alert';

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * Semantic heading for Alert.
 */
export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        'font-semibold leading-none tracking-tight text-text-primary mb-1',
        className
      )}
      {...props}
    >
      {children}
    </h5>
  )
);
AlertTitle.displayName = 'AlertTitle';

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Accessible description container for Alert.
 */
export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  AlertDescriptionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-text-secondary [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';
