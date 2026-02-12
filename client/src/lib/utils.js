import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and intelligently merges Tailwind classes.
 * @param  {...any} inputs - Strings, objects, or arrays of class names.
 * @returns {string} - The final merged class string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
