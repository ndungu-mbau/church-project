import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Info, HelpCircle, Settings, Plus } from 'lucide-react-native';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipText,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export default function TooltipDemo() {
  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="gap-8 pb-12">
        <View>
          <Text className="text-3xl font-bold text-foreground">Tooltip</Text>
          <Text className="text-muted-foreground mt-1">
            A popup that displays information related to an element when focused or hovered.
          </Text>
        </View>

        {/* Basic Tooltip */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Basic Usage</Text>
          <View className="flex-row items-center gap-4">
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <View className="p-2 rounded-md bg-secondary">
                  <Info size={20} className="text-foreground" />
                </View>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipText>This is helpful information</TooltipText>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <View className="p-2 rounded-md bg-secondary">
                  <HelpCircle size={20} className="text-foreground" />
                </View>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipText>Need help? Tap here!</TooltipText>
              </TooltipContent>
            </Tooltip>
          </View>
        </View>

        {/* With Button */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">With Button</Text>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus size={16} className="text-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <TooltipText>Add new item</TooltipText>
            </TooltipContent>
          </Tooltip>
        </View>

        {/* Different Sides */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Positioning</Text>
          <View className="flex-row flex-wrap gap-4">
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <View className="px-3 py-2 rounded-md bg-secondary">
                  <Text className="text-foreground text-sm">Top</Text>
                </View>
              </TooltipTrigger>
              <TooltipContent side="top">
                <TooltipText>Tooltip on top</TooltipText>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <View className="px-3 py-2 rounded-md bg-secondary">
                  <Text className="text-foreground text-sm">Bottom</Text>
                </View>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <TooltipText>Tooltip on bottom</TooltipText>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <View className="px-3 py-2 rounded-md bg-secondary">
                  <Text className="text-foreground text-sm">Left</Text>
                </View>
              </TooltipTrigger>
              <TooltipContent side="left">
                <TooltipText>Tooltip on left</TooltipText>
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <View className="px-3 py-2 rounded-md bg-secondary">
                  <Text className="text-foreground text-sm">Right</Text>
                </View>
              </TooltipTrigger>
              <TooltipContent side="right">
                <TooltipText>Tooltip on right</TooltipText>
              </TooltipContent>
            </Tooltip>
          </View>
        </View>

        {/* Settings Example */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Practical Example</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-foreground">Notifications</Text>
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <Settings size={16} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <TooltipText>Configure notification settings</TooltipText>
              </TooltipContent>
            </Tooltip>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
