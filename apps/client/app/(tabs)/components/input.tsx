import { View, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InputDemo() {
  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Input Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Displays a form input field or a component that looks like an input field.
        </Text>
      </View>

      <View className="flex flex-col gap-4 w-full max-w-sm">
        <View className="grid w-full max-w-sm items-center gap-1.5">
          <Label nativeID="email">Email</Label>
          <Input nativeID="email" placeholder="Email" />
        </View>
        <View className="grid w-full max-w-sm items-center gap-1.5">
          <Label nativeID="file">File</Label>
          <Input nativeID="file" variant="file" placeholder="File" />
        </View>
        <View className="grid w-full max-w-sm items-center gap-1.5">
          <Label nativeID="disabled">Disabled</Label>
          <Input nativeID="disabled" placeholder="Disabled" />
        </View>
      </View>
    </View>
  );
}
