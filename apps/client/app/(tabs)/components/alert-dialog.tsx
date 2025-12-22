import * as React from 'react';
import { View, Text } from 'react-native';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


export default function AlertDialogDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View className="flex-1 justify-center items-center p-8 bg-background gap-8">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Alert Dialog Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          A modal dialog that interrupts the user with important content and expects a response.
        </Text>
      </View>

      {/* Default Variant */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <View className='bg-primary px-4 py-2 rounded-md'>
            <Text className='text-primary-foreground font-medium'>Show Default Alert</Text>
          </View>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel />
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Surface Variant*/}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <View className='bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700'>
            <Text className='text-foreground font-medium'>Show Surface Alert</Text>
          </View>
        </AlertDialogTrigger>
        <AlertDialogContent variant="surface">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="surface" />
            <AlertDialogAction variant="surface" className="bg-red-500 hover:bg-red-600 text-white">Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
