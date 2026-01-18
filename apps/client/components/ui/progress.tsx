import * as React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as ProgressPrimitive from '@rn-primitives/progress';
import { cn } from '@/lib/utils';

const AnimatedIndicator = Animated.createAnimatedComponent(ProgressPrimitive.Indicator);

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
  }
>(({ className, value, indicatorClassName, ...props }, ref) => {
  const progress = useSharedValue(value || 0);

  React.useEffect(() => {
    progress.value = withSpring(value || 0, {
      overshootClamping: true,
    });
  }, [value]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: `${progress.value - 100}%` as any,
        },
      ],
    };
  });

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}
    >
      <AnimatedIndicator
        className={cn('h-full w-full flex-1 bg-primary', indicatorClassName)}
        style={animatedIndicatorStyle}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
