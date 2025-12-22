import * as React from 'react';
import { View, Text } from 'react-native';
import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
  } from '@/components/ui/context-menu';

export default function ContextMenuDemo() {
    const [checkboxBookmarks, setCheckboxBookmarks] = React.useState(true);
    const [checkboxFullUrls, setCheckboxFullUrls] = React.useState(false);
    const [radioValue, setRadioValue] = React.useState("pedro");

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Context Menu Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Displays a menu to the user - such as a set of actions or functions - triggered by a button.
        </Text>
      </View>

      <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed border-input">
        <Text className="text-sm text-foreground">Right click here</Text>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 native:w-72">
        <ContextMenuItem inset>
          <Text className='text-foreground'>Back</Text>
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          <Text className='text-foreground'>Forward</Text>
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          <Text className='text-foreground'>Reload</Text>
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>
              <Text className='text-foreground'>More Tools</Text>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48 native:w-56">
            <ContextMenuItem>
              <Text className='text-foreground'>Save Page As...</Text>
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <Text className='text-foreground'>Create Shortcut...</Text>
            </ContextMenuItem>
            <ContextMenuItem>
              <Text className='text-foreground'>Name Window...</Text>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
                <Text className='text-foreground'>Developer Tools</Text>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={checkboxBookmarks}
          onCheckedChange={setCheckboxBookmarks}
        >
          <Text className='text-foreground'>Show Bookmarks Bar</Text>
          <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={checkboxFullUrls}
          onCheckedChange={setCheckboxFullUrls}
        >
            <Text className='text-foreground'>Show Full URLs</Text>
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={radioValue} onValueChange={setRadioValue}>
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioItem value="pedro">
            <Text className='text-foreground'>Pedro Duarte</Text>
          </ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">
            <Text className='text-foreground'>Colm Tuite</Text>
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
    </View>
  );
}
