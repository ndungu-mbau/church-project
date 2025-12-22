import * as React from 'react';
import { View, Text } from 'react-native';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function PopoverDemo() {
  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Popover Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Displays rich content in a portal, triggered by a button.
        </Text>
      </View>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Text className='text-foreground'>Open popover</Text>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 native:w-96">
          <View className="grid gap-4">
            <View className="space-y-2">
              <Text className="font-medium leading-none text-foreground">Dimensions</Text>
              <Text className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </Text>
            </View>
            <View className="grid gap-2">
              <View className="flex flex-row items-center gap-4">
                <Label nativeID='width' className="w-24">Width</Label>
                <Input nativeID='width' defaultValue="100%" className="flex-1 h-8" />
              </View>
              <View className="flex flex-row items-center gap-4">
                <Label nativeID='maxWidth' className="w-24">Max. width</Label>
                <Input nativeID='maxWidth' defaultValue="300px" className="flex-1 h-8" />
              </View>
              <View className="flex flex-row items-center gap-4">
                <Label nativeID='height' className="w-24">Height</Label>
                <Input nativeID='height' defaultValue="25px" className="flex-1 h-8" />
              </View>
              <View className="flex flex-row items-center gap-4">
                <Label nativeID='maxHeight' className="w-24">Max. height</Label>
                <Input nativeID='maxHeight' defaultValue="none" className="flex-1 h-8" />
              </View>
            </View>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  );
}
