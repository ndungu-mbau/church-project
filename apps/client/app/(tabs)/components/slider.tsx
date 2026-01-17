import * as React from 'react';
import { View, Text } from 'react-native';
import { Slider } from '@/components/ui/slider';

export default function SliderDemo() {
  const [value, setValue] = React.useState(50);

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Slider Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          An input where the user selects a value from within a given range.
        </Text>
      </View>

      <View className="w-full max-w-sm space-y-4 items-center">
        <Slider
          value={value}
          onValueChange={(val) => {
            if (typeof val === 'number') {
              setValue(val);
            } else if (Array.isArray(val) && val.length > 0) {
              setValue(val[0]);
            }
          }}
          max={100}
          step={1}
          className="w-[60%]"
        />
        <Text className="text-foreground text-center">Value: {value}</Text>
      </View>
    </View>
  );
}
