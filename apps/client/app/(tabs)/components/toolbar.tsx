import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Redo, Undo, Link as LinkIcon } from 'lucide-react-native';
import {
  Toolbar,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  ToolbarButton,
  ToolbarLink,
} from '@/components/ui/toolbar';

export default function ToolbarDemo() {
  const [formats, setFormats] = React.useState<string[]>(['bold']);
  const [alignment, setAlignment] = React.useState<string | undefined>('left');

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="gap-8 pb-12">
        <View>
          <Text className="text-3xl font-bold text-foreground">Toolbar</Text>
          <Text className="text-muted-foreground mt-1">
            A container for grouping a set of controls.
          </Text>
        </View>

        {/* Basic Toolbar */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Text Formatting</Text>
          <Toolbar>
            <ToolbarToggleGroup
              type="multiple"
              value={formats}
              onValueChange={setFormats}
            >
              <ToolbarToggleItem value="bold">
                <Bold size={16} className="text-foreground" />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="italic">
                <Italic size={16} className="text-foreground" />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="underline">
                <Underline size={16} className="text-foreground" />
              </ToolbarToggleItem>
            </ToolbarToggleGroup>
            <ToolbarSeparator />
            <ToolbarToggleGroup
              type="single"
              value={alignment}
              onValueChange={setAlignment}
            >
              <ToolbarToggleItem value="left">
                <AlignLeft size={16} className="text-foreground" />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="center">
                <AlignCenter size={16} className="text-foreground" />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="right">
                <AlignRight size={16} className="text-foreground" />
              </ToolbarToggleItem>
            </ToolbarToggleGroup>
          </Toolbar>
          <Text className="text-sm text-muted-foreground">
            Formats: {formats.length > 0 ? formats.join(', ') : 'None'} | Alignment: {alignment || 'None'}
          </Text>
        </View>

        {/* Toolbar with Buttons and Link */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">With Buttons & Link</Text>
          <Toolbar>
            <ToolbarButton onPress={() => console.log('Undo')}>
              <Undo size={16} className="text-foreground" />
            </ToolbarButton>
            <ToolbarButton onPress={() => console.log('Redo')}>
              <Redo size={16} className="text-foreground" />
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarLink onPress={() => console.log('Link pressed')}>
              <View className="flex-row items-center gap-1">
                <LinkIcon size={14} className="text-primary" />
                <Text className="text-primary text-sm underline">Insert Link</Text>
              </View>
            </ToolbarLink>
          </Toolbar>
        </View>

        {/* Outline Variant */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Outline Variant</Text>
          <Toolbar className="border-0 bg-transparent p-0">
            <ToolbarToggleGroup
              type="single"
              value={alignment}
              onValueChange={setAlignment}
              variant="outline"
            >
              <ToolbarToggleItem value="left">
                <AlignLeft size={16} className="text-foreground" />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="center">
                <AlignCenter size={16} className="text-foreground" />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="right">
                <AlignRight size={16} className="text-foreground" />
              </ToolbarToggleItem>
            </ToolbarToggleGroup>
          </Toolbar>
        </View>
      </View>
    </ScrollView>
  );
}
