
import * as React from 'react';
import { View } from 'react-native';
import * as AccordionPrimitive from '@rn-primitives/accordion';
import { ChevronDown } from 'lucide-react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn(className)}
    {...props}
  />
));
Accordion.displayName = AccordionPrimitive.Root.displayName;

const accordionItemVariants = cva('overflow-hidden', {
  variants: {
    variant: {
      default: 'border-b border-border border-b-2',
      surface: 'bg-surface-2 border border-border dark:border-0 rounded-3xl mb-2 shadow-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
  VariantProps<typeof accordionItemVariants>
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
));
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

const accordionTriggerVariants = cva('flex flex-row items-center justify-between py-4 font-medium transition-all group text-foreground', {
  variants: {
    variant: {
      default: '',
      surface: 'px-5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});


const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> &
  VariantProps<typeof accordionTriggerVariants>
>(({ className, children, variant, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        accordionTriggerVariants({ variant }),
        className
      )}
      {...props}
    >
      {() => (
        <>
          {children}
          <ChevronDown
            size={18}
            className={cn(
              'text-muted-foreground shrink-0 transition-transform duration-200',
              'group-data-[state=open]:rotate-180'
            )}
          />
        </>
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const accordionContentVariants = cva('overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down', {
  variants: {
    variant: {
      default: '',
      surface: 'px-5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> &
  VariantProps<typeof accordionContentVariants>
>(({ className, children, variant, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      accordionContentVariants({ variant }),
      className
    )}
    {...props}
  >
    <View className={cn('pb-4 pt-0', className)}>
      {children}
    </View>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
