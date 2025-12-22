import * as React from 'react';
import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 native:h-[20px] native:w-[20px]',
        props.checked && 'bg-primary text-primary-foreground',
        !props.checked && 'border-primary',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('items-center justify-center h-full w-full')}
      >
        <Check size={14} strokeWidth={3} className="text-primary-foreground" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
