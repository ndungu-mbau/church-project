import { View, Text } from 'react-native';
import { Button, buttonTextVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from "react";

export function ButtonDemoScreen() {
  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Button Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Displays a button or a component that looks like a button.
        </Text>
      </View>

      <View className="gap-4 w-full items-center">
        {/* Default */}
        <Button>
          <Text className={buttonTextVariants()}>Default Button</Text>
        </Button>

        {/* Secondary */}
        <Button variant="secondary">
          <Text className={buttonTextVariants({ variant: 'secondary' })}>Secondary Button</Text>
        </Button>

        {/* Destructive */}
        <Button variant="destructive">
          <Text className={buttonTextVariants({ variant: 'destructive' })}>Destructive Button</Text>
        </Button>

        {/* Outline */}
        <Button variant="outline">
          <Text className={buttonTextVariants({ variant: 'outline' })}>Outline Button</Text>
        </Button>

        {/* Ghost */}
        <Button variant="ghost">
          <Text className={buttonTextVariants({ variant: 'ghost' })}>Ghost Button</Text>
        </Button>

        {/* Link */}
        <Button variant="link">
          <Text className={buttonTextVariants({ variant: 'link' })}>Link Button</Text>
        </Button>
      </View>

      <View className="flex-row gap-4 items-center mt-4">
        {/* Sizes */}
        <Button size="sm">
          <Text className={buttonTextVariants({ size: 'sm' })}>Small</Text>
        </Button>
        <Button size="default">
          <Text className={buttonTextVariants({ size: 'default' })}>Default</Text>
        </Button>
        <Button size="lg">
          <Text className={buttonTextVariants({ size: 'lg' })}>Large</Text>
        </Button>
      </View>
    </View>
  );
}
