import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';

export default function DialogDemo() {
  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Dialog Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
        </Text>
      </View>

      <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Text className='text-foreground'>Edit Profile</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <View className="grid gap-4 py-4">
          <View className="flex items-center gap-4">
            <Text className="text-right text-foreground">
              Name
            </Text>
            <Text className="col-span-3 text-muted-foreground">
                Pedro Duarte
            </Text>
          </View>
          <View className="flex items-center gap-4">
            <Text className="text-right text-foreground">
              Username
            </Text>
            <Text className="col-span-3 text-muted-foreground">
                @peduarte
            </Text>
          </View>
        </View>
        <DialogFooter>
            <DialogClose asChild>
                <Button>
                    <Text className='text-primary-foreground'>Save changes</Text>
                </Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </View>
  );
}
