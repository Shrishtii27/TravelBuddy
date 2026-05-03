import * as React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      default: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary-light shadow-sm shadow-rose-200',
      outline: 'border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40',
      ghost: 'bg-transparent text-primary hover:bg-primary/10',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-rose-100',
      rose: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-11 px-6 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
