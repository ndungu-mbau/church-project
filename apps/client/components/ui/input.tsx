import * as React from 'react';
import { TextInput, type TextInputProps, Platform } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'web:flex h-10 native:h-12 w-full rounded-md border border-input bg-background dark:bg-input/30 px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-input',
        filled: 'bg-muted/50 border-0',
        outline: 'border-2',
        ghost: 'border-0 bg-transparent shadow-none',
        file: 'bg-transparent border-0',
      },
      size: {
        default: 'h-10 native:h-12',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps & VariantProps<typeof inputVariants>
>(({ className, variant, size, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        inputVariants({ variant, size, className }),
        props.editable === false && "opacity-50 web:cursor-not-allowed web:select-none",
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-muted-foreground/50',
        })
      )}
      placeholderTextColor={props.placeholderTextColor ?? '#CACACA'}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
