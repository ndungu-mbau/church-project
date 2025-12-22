import * as React from 'react';
import { View, Text, Pressable, type ViewStyle, type TextStyle } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react-native';
import { cn } from '@/lib/utils';

const chipVariants = cva(
  'flex-row items-center justify-center gap-1.5 self-start overflow-hidden',
  {
    variants: {
      variant: {
        solid: '',
        bordered: 'border',
        light: 'bg-transparent',
        flat: '',
        faded: 'border',
        dot: 'bg-transparent border border-border',
      },
      color: {
        default: '',
        primary: '',
        secondary: '',
        success: '',
        danger: '',
      },
      size: {
        sm: 'h-6 px-2 py-0.5',
        md: 'h-8 px-3 py-1',
        lg: 'h-10 px-4 py-1.5',
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    compoundVariants: [
      // Solid
      { variant: 'solid', color: 'default', className: 'bg-muted' },
      { variant: 'solid', color: 'primary', className: 'bg-primary' },
      { variant: 'solid', color: 'secondary', className: 'bg-secondary' },
      { variant: 'solid', color: 'success', className: 'bg-success' },
      { variant: 'solid', color: 'danger', className: 'bg-danger' },
      // Bordered
      { variant: 'bordered', color: 'default', className: 'border-border' },
      { variant: 'bordered', color: 'primary', className: 'border-primary' },
      { variant: 'bordered', color: 'secondary', className: 'border-secondary' },
      { variant: 'bordered', color: 'success', className: 'border-success' },
      { variant: 'bordered', color: 'danger', className: 'border-danger' },
      // Flat
      { variant: 'flat', color: 'default', className: 'bg-muted/30' },
      { variant: 'flat', color: 'primary', className: 'bg-primary/20' },
      { variant: 'flat', color: 'secondary', className: 'bg-secondary/20' },
      { variant: 'flat', color: 'success', className: 'bg-success/20' },
      { variant: 'flat', color: 'danger', className: 'bg-danger/20' },
      // Faded
      { variant: 'faded', color: 'default', className: 'bg-muted/10 border-border' },
      { variant: 'faded', color: 'primary', className: 'bg-primary/10 border-primary/30' },
      { variant: 'faded', color: 'secondary', className: 'bg-secondary/10 border-secondary/30' },
      { variant: 'faded', color: 'success', className: 'bg-success/10 border-success/30' },
      { variant: 'faded', color: 'danger', className: 'bg-danger/10 border-danger/30' },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'default',
      size: 'md',
      radius: 'full',
    },
  }
);

const chipTextVariants = cva('font-medium', {
  variants: {
    color: {
      default: 'text-muted-foreground',
      primary: '',
      secondary: '',
      success: '',
      danger: '',
    },
    variant: {
      solid: '',
      bordered: '',
      light: '',
      flat: '',
      faded: '',
      dot: '',
    },
    size: {
      sm: 'text-[10px]',
      md: 'text-xs',
      lg: 'text-sm',
    },
  },
  compoundVariants: [
    // Solid text
    { variant: 'solid', color: 'default', className: 'text-foreground' },
    { variant: 'solid', color: 'primary', className: 'text-primary-foreground' },
    { variant: 'solid', color: 'secondary', className: 'text-secondary-foreground' },
    { variant: 'solid', color: 'success', className: 'text-success-foreground' },
    { variant: 'solid', color: 'danger', className: 'text-danger-foreground' },
    // Bordered/Light/Flat text
    { variant: ['bordered', 'light', 'flat', 'faded', 'dot'], color: 'default', className: 'text-foreground' },
    { variant: ['bordered', 'light', 'flat', 'faded', 'dot'], color: 'primary', className: 'text-primary' },
    { variant: ['bordered', 'light', 'flat', 'faded', 'dot'], color: 'secondary', className: 'text-secondary' },
    { variant: ['bordered', 'light', 'flat', 'faded', 'dot'], color: 'success', className: 'text-success' },
    { variant: ['bordered', 'light', 'flat', 'faded', 'dot'], color: 'danger', className: 'text-danger' },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'default',
    size: 'md',
  },
});

export interface ChipProps
  extends React.ComponentPropsWithoutRef<typeof View>,
  VariantProps<typeof chipVariants> {
  label?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onClose?: () => void;
  onPress?: () => void;
  textClassName?: string;
  textStyle?: TextStyle;
}

const Chip = React.forwardRef<View, ChipProps>(
  (
    {
      className,
      variant,
      color,
      size,
      radius,
      label,
      children,
      startContent,
      endContent,
      onClose,
      onPress,
      textClassName,
      textStyle,
      ...props
    },
    ref
  ) => {
    const Component = onPress ? Pressable : View;

    // Dot variant specifically needs a dot
    const isDot = variant === 'dot';

    // Size-based adjustments for dot/close icon
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;

    return (
      <Component
        ref={ref as any}
        onPress={onPress}
        className={cn(chipVariants({ variant, color, size, radius, className }))}
        {...props}
      >
        {isDot && (
          <View
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              color === 'primary' && 'bg-primary',
              color === 'secondary' && 'bg-secondary',
              color === 'success' && 'bg-success',
              color === 'danger' && 'bg-danger',
              color === 'default' && 'bg-muted-foreground'
            )}
          />
        )}

        {startContent}

        {label ? (
          <Text
            className={cn(chipTextVariants({ variant, color, size, className: textClassName }))}
            style={textStyle}
          >
            {label}
          </Text>
        ) : (
          children
        )}

        {endContent}

        {onClose && (
          <Pressable
            onPress={onClose}
            hitSlop={8}
            className="ml-1 opacity-70 active:opacity-100"
          >
            <X size={iconSize} color="currentColor" className={cn(chipTextVariants({ variant, color, size }))} />
          </Pressable>
        )}
      </Component>
    );
  }
);

Chip.displayName = 'Chip';

export { Chip, chipVariants, chipTextVariants };
