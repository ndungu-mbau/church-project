import * as React from 'react';
import { View, Text } from 'react-native';
import { ChevronsUpDown } from 'lucide-react-native';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

export default function CollapsibleDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Collapsible Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          An interactive component which expands/collapses a panel.
        </Text>
      </View>

      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full max-w-[350px] space-y-2 border border-border p-4 rounded-xl"
      >
        <View className="flex flex-row items-center justify-between space-x-4 px-4">
          <Text className="text-sm font-semibold text-foreground">
            @peduarte starred 3 repositories
          </Text>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
             <ChevronsUpDown size={16} className="text-foreground" />
             <Text className="sr-only">Toggle</Text>
            </Button>
          </CollapsibleTrigger>
        </View>
        
        <View className="rounded-md border border-muted px-4 py-3 mx-4">
            <Text className="text-sm text-foreground">@radix-ui/primitives</Text>
        </View>
        
        <CollapsibleContent className="space-y-2 mx-4">
          <View className="rounded-md border border-muted px-4 py-3 mt-2">
            <Text className="text-sm text-foreground">@radix-ui/colors</Text>
          </View>
          <View className="rounded-md border border-muted px-4 py-3 mt-2">
             <Text className="text-sm text-foreground">@stitches/react</Text>
          </View>
        </CollapsibleContent>
      </Collapsible>
    </View>
  );
}
