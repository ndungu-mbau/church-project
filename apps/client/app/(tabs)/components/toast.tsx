import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function ToastDemo() {
  const { toast } = useToast();

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="gap-8 pb-12">
        <View>
          <Text className="text-3xl font-bold text-foreground">Toast</Text>
          <Text className="text-muted-foreground mt-1">
            A succinct message that is displayed temporarily.
          </Text>
        </View>

        <View className="gap-4">
          <Button
            variant="outline"
            onPress={() => {
              toast({
                title: "Scheduled: Catch up",
                description: "Friday, February 10, 2023 at 5:57 PM",
              });
            }}
          >
            <Text>Show Simple Toast</Text>
          </Button>

          <Button
            variant="outline"
            onPress={() => {
              toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                variant: "destructive",
              });
            }}
          >
            <Text>Show Destructive Toast</Text>
          </Button>

          <Button
            variant="outline"
            onPress={() => {
              toast({
                title: "Successfully saved!",
                description: "Your changes have been saved to the cloud.",
                variant: "success",
              });
            }}
          >
            <Text>Show Success Toast</Text>
          </Button>

          <Button
            variant="outline"
            onPress={() => {
              toast({
                title: "Action Required",
                description: "Please confirm your email address.",
                action: (
                  <ToastAction onPress={() => console.log('Action pressed')}>
                    <Text className="text-sm font-medium">Verify</Text>
                  </ToastAction>
                ),
              });
            }}
          >
            <Text>Show Toast with Action</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
