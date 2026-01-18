import * as React from 'react';
import { View, Text } from 'react-native';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function RadioGroupDemo() {
  const [value, setValue] = React.useState('default');

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Radio Group Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.
        </Text>
      </View>

      <RadioGroup value={value} onValueChange={setValue} className='gap-3'>
        <View className="flex-row items-center gap-2">
          <RadioGroupItem aria-labelledby='r1' value="default" />
          <Label nativeID="r1" onPress={() => setValue('default')}>Default</Label>
        </View>
        <View className="flex-row items-center gap-2">
          <RadioGroupItem aria-labelledby='r2' value="comfortable" />
          <Label nativeID="r2" onPress={() => setValue('comfortable')}>Comfortable</Label>
        </View>
        <View className="flex-row items-center gap-2">
          <RadioGroupItem aria-labelledby='r3' value="compact" />
          <Label nativeID="r3" onPress={() => setValue('compact')}>Compact</Label>
        </View>
      </RadioGroup>
    </View>
  );
}
