import * as React from 'react';
import { View, Text } from 'react-native';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';

export default function MenubarDemo() {
  const [checked, setChecked] = React.useState(true);
  const [radio, setRadio] = React.useState("benoit");
  const [value, setValue] = React.useState<string | undefined>(undefined);

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Menubar Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
        </Text>
      </View>

      <Menubar className='w-full max-w-sm' value={value} onValueChange={setValue}>
        <MenubarMenu value="file">
          <MenubarTrigger>
            <Text className='text-foreground font-medium'>File</Text>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Text className='text-foreground'>New Tab</Text>
              <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Text className='text-foreground'>New Window</Text>
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              <Text className='text-foreground'>New Incognito Window</Text>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>
                <Text className='text-foreground'>Share</Text>
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>
                  <Text className='text-foreground'>Email link</Text>
                </MenubarItem>
                <MenubarItem>
                  <Text className='text-foreground'>Messages</Text>
                </MenubarItem>
                <MenubarItem>
                  <Text className='text-foreground'>Notes</Text>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              <Text className='text-foreground'>Print...</Text>
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="edit">
          <MenubarTrigger>
            <Text className='text-foreground font-medium'>Edit</Text>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Text className='text-foreground'>Undo</Text>
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <Text className='text-foreground'>Redo</Text>
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>
                <Text className='text-foreground'>Find</Text>
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>
                  <Text className='text-foreground'>Search the web</Text>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  <Text className='text-foreground'>Find...</Text>
                </MenubarItem>
                <MenubarItem>
                  <Text className='text-foreground'>Find Next</Text>
                </MenubarItem>
                <MenubarItem>
                  <Text className='text-foreground'>Find Previous</Text>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              <Text className='text-foreground'>Cut</Text>
            </MenubarItem>
            <MenubarItem>
              <Text className='text-foreground'>Copy</Text>
            </MenubarItem>
            <MenubarItem>
              <Text className='text-foreground'>Paste</Text>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="view">
          <MenubarTrigger>
            <Text className='text-foreground font-medium'>View</Text>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={checked} onCheckedChange={setChecked}>
              <Text className='text-foreground'>Always Show Bookmarks Bar</Text>
              <MenubarShortcut>⌘⇧B</MenubarShortcut>
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={checked} onCheckedChange={setChecked}>
              <Text className='text-foreground'>Always Show Full URLs</Text>
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              <Text className='text-foreground'>Reload</Text>
              <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              <Text className='text-foreground'>Force Reload</Text>
              <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>
              <Text className='text-foreground'>Toggle Fullscreen</Text>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>
              <Text className='text-foreground'>Hide Sidebar</Text>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="profiles">
          <MenubarTrigger>
            <Text className='text-foreground font-medium'>Profiles</Text>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={radio} onValueChange={setRadio}>
              <MenubarRadioItem value="andy">
                <Text className='text-foreground'>Andy</Text>
              </MenubarRadioItem>
              <MenubarRadioItem value="benoit">
                <Text className='text-foreground'>Benoit</Text>
              </MenubarRadioItem>
              <MenubarRadioItem value="Luis">
                <Text className='text-foreground'>Luis</Text>
              </MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>
              <Text className='text-foreground'>Edit...</Text>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>
              <Text className='text-foreground'>Add Profile...</Text>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </View>
  );
}
