import * as React from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as SwitchPrimitive from '@rn-primitives/switch';
import { cn } from '@/lib/utils';
import { useThemeColor } from '@/hooks/use-theme-color';

const AnimatedRoot = Animated.createAnimatedComponent(SwitchPrimitive.Root);
const AnimatedThumb = Animated.createAnimatedComponent(SwitchPrimitive.Thumb);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, checked, ...props }, ref) => {
  const primaryColor = useThemeColor('primary');
  const inputColor = useThemeColor('input');

  const progress = useSharedValue(checked ? 1 : 0);
  const pressed = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: 200 });
  }, [checked]);

  const animatedRootStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [inputColor, primaryColor]
      ),
      transform: [{ scale: withSpring(pressed.value ? 0.95 : 1) }],
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(progress.value * 20, { overshootClamping: true }) },
      ],
    };
  });

  return (
    <AnimatedRoot
      className={cn(
        'peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      checked={checked}
      {...props}
      ref={ref}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      style={[animatedRootStyle, props.style]}
    >
      <AnimatedThumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0'
        )}
        style={animatedThumbStyle}
      />
    </AnimatedRoot>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
