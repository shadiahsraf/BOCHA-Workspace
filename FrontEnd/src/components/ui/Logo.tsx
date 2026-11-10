import { cn } from '@/lib/utils';

export interface LogoProps {
  collapsed?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  onClick?: () => void;
  title?: string;
}

export function LogoIcon({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeMap = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <div
      className={cn(
        'relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-rose to-brand-rose-hover text-white shadow-xs ring-1 ring-white/15 transition-transform group-hover:scale-105',
        sizeMap[size],
        className
      )}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[75%] w-[75%]"
        aria-hidden="true"
      >
        {/* Geometric Abstract B Monogram */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7 6C7 4.89543 7.89543 4 9 4H18C21.3137 4 24 6.68629 24 10C24 12.0199 22.9995 13.8058 21.4648 14.8872C23.5358 15.9622 25 18.2323 25 21C25 24.866 21.866 28 18 28H9C7.89543 28 7 27.1046 7 26V6ZM11.5 13H17.5C19.1569 13 20.5 11.6569 20.5 10C20.5 8.34315 19.1569 7 17.5 7H11.5V13ZM11.5 25H18C20.2091 25 22 23.2091 22 21C22 18.7909 20.2091 17 18 17H11.5V25Z"
          fill="currentColor"
        />
        {/* Minimalist warm beige architectural dot */}
        <circle cx="21.5" cy="10" r="1.5" fill="#F5F2EB" />
      </svg>
    </div>
  );
}

export function Logo({
  collapsed = false,
  showText = true,
  size = 'md',
  theme = 'auto',
  className,
  onClick,
  title = 'BOCHA Workspace',
}: LogoProps) {
  const shouldShowText = showText && !collapsed;

  const titleColor =
    theme === 'dark'
      ? 'text-white'
      : theme === 'light'
      ? 'text-brand-wood'
      : 'text-brand-wood dark:text-brand-beige';

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 select-none transition-all',
        onClick && 'cursor-pointer',
        className
      )}
      title={title}
    >
      <LogoIcon size={size} />

      {shouldShowText && (
        <div className="flex flex-col text-start overflow-hidden leading-tight">
          <span
            className={cn(
              'text-sm font-bold tracking-wider font-heading truncate',
              titleColor
            )}
          >
            BOCHA
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-brand-rose uppercase truncate">
            Workspace
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
