import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react-native';

export default function DropdownMenuDemo() {
  const [position, setPosition] = React.useState('bottom');

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Dropdown Menu Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Displays a menu to the user - such as a set of actions or functions - triggered by a button.
        </Text>
      </View>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Text className='text-foreground'>Open Menu</Text>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User size={14} className="text-foreground" />
              <Text className='text-foreground'>Profile</Text>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard size={14} className="text-foreground" />
              <Text className='text-foreground'>Billing</Text>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings size={14} className="text-foreground" />
              <Text className='text-foreground'>Settings</Text>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Keyboard size={14} className="text-foreground" />
              <Text className='text-foreground'>Keyboard shortcuts</Text>
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Users size={14} className="text-foreground" />
              <Text className='text-foreground'>Team</Text>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus size={14} className="text-foreground" />
                <Text className='text-foreground'>Invite users</Text>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Mail size={14} className="text-foreground" />
                    <Text className='text-foreground'>Email</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare size={14} className="text-foreground" />
                    <Text className='text-foreground'>Message</Text>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle size={14} className="text-foreground" />
                    <Text className='text-foreground'>More...</Text>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Plus size={14} className="text-foreground" />
              <Text className='text-foreground'>New Team</Text>
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Github size={14} className="text-foreground" />
            <Text className='text-foreground'>GitHub</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy size={14} className="text-foreground" />
            <Text className='text-foreground'>Support</Text>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Cloud size={14} className="text-foreground" />
            <Text className='text-foreground'>API</Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut size={14} className="text-foreground" />
            <Text className='text-foreground'>Log out</Text>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
}
