import * as React from 'react';
import { View, Text } from 'react-native';
import { Separator } from '@/components/ui/separator';

export default function SeparatorDemo() {
  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Separator Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Visually or semantically separates content.
        </Text>
      </View>

      <View className='w-full max-w-sm'>
        <View className="space-y-1">
          <Text className="text-sm font-medium leading-none text-foreground">Radix Primitives</Text>
          <Text className="text-sm text-muted-foreground">
            An open-source UI component library.
          </Text>
        </View>
        <Separator className="my-4" />
        <View className="flex h-5 items-center flex-row space-x-4 text-sm text-foreground">
          <Text className="text-gray-700 dark:text-gray-300">Blog</Text>
          <Separator orientation="vertical" className="mx-2" />
          <Text className="text-gray-700 dark:text-gray-300">Docs</Text>
          <Separator orientation="vertical" className="mx-2" />
          <Text className="text-gray-700 dark:text-gray-300">Source</Text>
        </View>
      </View>
    </View>
  );
}
