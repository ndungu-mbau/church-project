import * as React from 'react';
import { View, Text } from 'react-native';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SelectDemo() {
  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Select Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Displays a list of options for the user to pick from—triggered by a button.
        </Text>
      </View>

      <Select defaultValue={{ value: 'apple', label: 'Apple' }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem label={'Apple'} value="apple">Apple</SelectItem>
            <SelectItem label={'Banana'} value="banana">Banana</SelectItem>
            <SelectItem label={'Blueberry'} value="blueberry">Blueberry</SelectItem>
            <SelectItem label={'Grapes'} value="grapes">Grapes</SelectItem>
            <SelectItem label={'Pineapple'} value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
}
