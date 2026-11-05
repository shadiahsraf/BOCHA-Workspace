import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with clsx and resolves Tailwind CSS class conflicts using tailwind-merge.
 *
 * @param inputs - Variable number of class values, objects, or arrays
 * @returns Clean merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
