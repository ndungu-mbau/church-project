import * as React from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from '@/components/ui/checkbox';

export default function CheckboxDemo() {
  const [checked, setChecked] = React.useState(false);
  const [checked2, setChecked2] = React.useState(true);

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Checkbox Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          A control that allows the user to toggle between checked and not checked.
        </Text>
      </View>

      <View className="gap-6 items-start">
        {/* Default Checkbox */}
        <View className="flex-row items-center gap-3">
            <Checkbox 
                checked={checked} 
                onCheckedChange={setChecked} 
            />
            <Text 
                onPress={() => setChecked(!checked)}
                className="text-foreground font-medium"
            >
                Accept terms and conditions
            </Text>
        </View>

        {/* Checked by default */}
        <View className="flex-row items-center gap-3">
            <Checkbox 
                checked={checked2} 
                onCheckedChange={setChecked2} 
            />
            <Text 
                onPress={() => setChecked2(!checked2)}
                className="text-foreground font-medium"
            >
                Subscribe to newsletter
            </Text>
        </View>

        {/* Disabled Checkbox */}
        <View className="flex-row items-center gap-3">
            <Checkbox disabled checked={true} onCheckedChange={() => {}} />
            <Text className="text-muted-foreground">
                Disabled option
            </Text>
        </View>
        <View className="flex-row items-center gap-3">
            <Checkbox disabled checked={false} onCheckedChange={() => {}} />
            <Text className="text-muted-foreground">
                Disabled unchecked
            </Text>
        </View>
      </View>
    </View>
  );
}
