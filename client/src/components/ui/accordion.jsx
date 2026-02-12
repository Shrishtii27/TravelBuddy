import * as AccordionPrimitive from '@radix-ui/react-accordion';
import React from 'react';

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = AccordionPrimitive.Item;

export const AccordionTrigger = React.forwardRef(({ children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className="flex w-full items-center justify-between py-3 text-left text-slate-800"
      {...props}
    >
      {children}
      <span className="ml-2">▾</span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef(({ children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="pb-4 text-slate-600"
    {...props}
  >
    {children}
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = 'AccordionContent';
