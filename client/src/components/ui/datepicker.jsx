import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { cn } from '../../lib/utils';

export const DatePicker = React.forwardRef(
  ({ mode = 'single', selected, onSelect, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-slate-200 bg-white p-2 shadow-soft',
          className
        )}
      >
        <DayPicker mode={mode} selected={selected} onSelect={onSelect} {...props} />
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
