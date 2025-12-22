import * as React from 'react';
import { View, Text } from 'react-native';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function NavigationMenuDemo() {
  const [value, setValue] = React.useState<string | undefined>(undefined);

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Navigation Menu Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          A collection of links for navigating websites.
        </Text>
      </View>

      <NavigationMenu value={value} onValueChange={setValue} className='max-w-md z-50'>
        <NavigationMenuList>
          <NavigationMenuItem value="getting-started">
            <NavigationMenuTrigger>
              <Text className='text-foreground font-medium'>Getting started</Text>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <View className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                <View className="flex flex-row gap-3">
                  <View className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'>
                    <Text className="mb-2 mt-4 text-lg font-medium text-foreground">
                      shadcn/ui
                    </Text>
                    <Text className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </Text>
                  </View>
                </View>
              </View>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="components">
            <NavigationMenuTrigger>
              <Text className='text-foreground font-medium'>Components</Text>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <View className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                <View className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                  <Text className="text-sm font-medium leading-none text-foreground">Alert Dialog</Text>
                  <Text className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    A modal dialog that interrupts the user with important content and expects a response.
                  </Text>
                </View>
                <View className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                  <Text className="text-sm font-medium leading-none text-foreground">Hover Card</Text>
                  <Text className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    For sighted users to preview content available behind a link.
                  </Text>
                </View>
                <View className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                  <Text className="text-sm font-medium leading-none text-foreground">Progress</Text>
                  <Text className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
                  </Text>
                </View>
              </View>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="documentation">
            <NavigationMenuLink asChild>
              <Button variant="ghost">
                <Text className='text-foreground font-medium'>Documentation</Text>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </View>
  );
}
