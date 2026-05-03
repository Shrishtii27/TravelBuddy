import * as React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition-all duration-200',
      className
    )}
    {...props}
  />
));

Input.displayName = 'Input';
