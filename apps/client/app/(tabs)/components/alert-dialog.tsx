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
import { Button } from '@/components/ui/button';


export default function AlertDialogDemo() {
  const [isDefaultOpen, setIsDefaultOpen] = React.useState(false);
  const [isSurfaceOpen, setIsSurfaceOpen] = React.useState(false);

  return (
    <View className="flex-1 justify-center items-center p-8 bg-background gap-8">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Alert Dialog Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          A modal dialog that interrupts the user with important content and expects a response.
        </Text>
      </View>

      {/* Default Variant */}
      <AlertDialog open={isDefaultOpen} onOpenChange={setIsDefaultOpen}>
        <AlertDialogTrigger asChild>
          <Button>
            <Text className='text-primary-foreground font-medium'>Show Default Alert</Text>
          </Button>
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
      <AlertDialog open={isSurfaceOpen} onOpenChange={setIsSurfaceOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <Text className='text-foreground font-medium'>Show Surface Alert</Text>
          </Button>
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
