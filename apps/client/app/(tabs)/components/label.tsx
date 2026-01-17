import { View, Text } from 'react-native';
import { Label } from '@/components/ui/label';

export default function LabelDemo() {
  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Label Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Renders an accessible label associated with controls.
        </Text>
      </View>

      <View className="flex flex-col gap-4">
        <Label nativeID='label'>This is a label</Label>
        <Label nativeID='label-2' className="text-xl">This is a larger label</Label>
        <Label nativeID='label-3' className="text-muted-foreground">This is a muted label</Label>
      </View>
    </View>
  );
}
