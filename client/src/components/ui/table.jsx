import * as React from 'react';
import { cn } from '../../lib/utils';

export const Table = React.forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-soft',
      className
    )}
    {...props}
  >
    <table className="w-full text-left text-sm">{children}</table>
  </div>
));
Table.displayName = 'Table';

export const THead = React.forwardRef(({ children, className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-slate-50 text-slate-600', className)} {...props}>
    {children}
  </thead>
));
THead.displayName = 'THead';

export const TBody = React.forwardRef(({ children, className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props}>
    {children}
  </tbody>
));
TBody.displayName = 'TBody';

export const TR = React.forwardRef(({ children, className, ...props }, ref) => (
  <tr ref={ref} className={cn('border-t border-slate-200', className)} {...props}>
    {children}
  </tr>
));
TR.displayName = 'TR';

export const TH = React.forwardRef(({ children, className, ...props }, ref) => (
  <th ref={ref} className={cn('px-4 py-3 font-semibold', className)} {...props}>
    {children}
  </th>
));
TH.displayName = 'TH';

export const TD = React.forwardRef(({ children, className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3', className)} {...props}>
    {children}
  </td>
));
TD.displayName = 'TD';
