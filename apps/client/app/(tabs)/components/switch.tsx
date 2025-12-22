import * as React from 'react';
import { View, Text } from 'react-native';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SwitchDemo() {
  const [checked, setChecked] = React.useState(false);

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Switch Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          A control that allows the user to toggle between checked and not checked.
        </Text>
      </View>

      <View className="flex-row items-center space-x-2">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <Label
          nativeID="airplane-mode"
          onPress={() => {
            setChecked((prev) => !prev);
          }}
        >
          Airplane Mode
        </Label>
      </View>
    </View>
  );
}
