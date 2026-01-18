import * as React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react-native';

export default function HoverCardDemo() {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Hover Card Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          For sighted users to preview content available behind a link.
        </Text>
      </View>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link" size="lg">
            <Text className='text-foreground'>@nextjs</Text>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 native:w-96">
          <View className="flex flex-row justify-between gap-4">
            <Avatar alt="Vercel avatar">
              <AvatarImage
                source={{
                  uri: 'https://github.com/vercel.png',
                }}
              />
              <AvatarFallback>
                <Text>VC</Text>
              </AvatarFallback>
            </Avatar>
            <View className="flex flex-1 gap-1">
              <Text className="text-sm font-semibold text-foreground">
                @nextjs
              </Text>
              <Text className="text-sm text-foreground">
                The React Framework – created and maintained by @vercel.
              </Text>
              <View className="flex flex-row items-center pt-2">
                <CalendarDays size={14} className="mr-2 opacity-70 text-foreground" />
                <Text className="text-xs text-muted-foreground">
                  Joined December 2021
                </Text>
              </View>
            </View>
          </View>
        </HoverCardContent>
      </HoverCard>
    </View>
  );
}
