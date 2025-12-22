import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react-native';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ToggleDemo() {
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(false);
  const [underline, setUnderline] = React.useState(false);
  const [alignment, setAlignment] = React.useState<string | undefined>('left');
  const [formats, setFormats] = React.useState<string[]>([]);

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="gap-8 pb-12">
        <View>
          <Text className="text-3xl font-bold text-foreground">Toggle</Text>
          <Text className="text-muted-foreground mt-1">
            A two-state button that can be either on or off.
          </Text>
        </View>

        {/* Individual Toggles */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Default Variant</Text>
          <View className="flex-row items-center gap-2">
            <Toggle pressed={bold} onPressedChange={setBold}>
              <Bold size={16} className={bold ? 'text-accent-foreground' : 'text-foreground'} />
            </Toggle>
            <Toggle pressed={italic} onPressedChange={setItalic}>
              <Italic size={16} className={italic ? 'text-accent-foreground' : 'text-foreground'} />
            </Toggle>
            <Toggle pressed={underline} onPressedChange={setUnderline} disabled>
              <Underline size={16} className="text-muted-foreground" />
            </Toggle>
          </View>
        </View>

        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Outline Variant</Text>
          <View className="flex-row items-center gap-2">
            <Toggle variant="outline" pressed={bold} onPressedChange={setBold}>
              <Bold size={16} className={bold ? 'text-accent-foreground' : 'text-foreground'} />
            </Toggle>
            <Toggle variant="outline" pressed={italic} onPressedChange={setItalic}>
              <Italic size={16} className={italic ? 'text-accent-foreground' : 'text-foreground'} />
            </Toggle>
          </View>
        </View>

        {/* Toggle Group - Single */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Toggle Group (Single)</Text>
          <Text className="text-sm text-muted-foreground">Only one item can be selected at a time.</Text>
          <ToggleGroup
            type="single"
            value={alignment}
            onValueChange={setAlignment}
            variant="outline"
          >
            <ToggleGroupItem value="left">
              <AlignLeft size={16} className="text-foreground" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter size={16} className="text-foreground" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight size={16} className="text-foreground" />
            </ToggleGroupItem>
            <ToggleGroupItem value="justify">
              <AlignJustify size={16} className="text-foreground" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Text className="text-sm text-muted-foreground">
            Selected: {alignment || 'None'}
          </Text>
        </View>

        {/* Toggle Group - Multiple */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Toggle Group (Multiple)</Text>
          <Text className="text-sm text-muted-foreground">Multiple items can be selected.</Text>
          <ToggleGroup
            type="multiple"
            value={formats}
            onValueChange={setFormats}
          >
            <ToggleGroupItem value="bold">
              <Bold size={16} className="text-foreground" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <Italic size={16} className="text-foreground" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <Underline size={16} className="text-foreground" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Text className="text-sm text-muted-foreground">
            Selected: {formats.length > 0 ? formats.join(', ') : 'None'}
          </Text>
        </View>

        {/* Sizes */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">Sizes</Text>
          <View className="flex-row items-center gap-2">
            <Toggle size="sm" pressed={false} onPressedChange={() => { }}>
              <Bold size={14} className="text-foreground" />
            </Toggle>
            <Toggle size="default" pressed={false} onPressedChange={() => { }}>
              <Bold size={16} className="text-foreground" />
            </Toggle>
            <Toggle size="lg" pressed={false} onPressedChange={() => { }}>
              <Bold size={20} className="text-foreground" />
            </Toggle>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
