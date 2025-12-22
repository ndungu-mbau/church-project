import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CardDemo() {
  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="gap-8 pb-12">
        <Text className="text-3xl font-bold text-foreground">Card Demo</Text>

        {/* Background Variants */}
        <View className="gap-4">
          <Text className="text-xl font-semibold text-foreground">Background Variants</Text>
          <View className="gap-4">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Variant</CardTitle>
                <CardDescription>Uses the standard bg-card color.</CardDescription>
              </CardHeader>
            </Card>

            <Card variant="surface-1">
              <CardHeader>
                <CardTitle>Surface 1</CardTitle>
                <CardDescription>Uses the custom surface-1 background.</CardDescription>
              </CardHeader>
            </Card>

            <Card variant="surface-2">
              <CardHeader>
                <CardTitle>Surface 2</CardTitle>
                <CardDescription>Uses the custom surface-2 background.</CardDescription>
              </CardHeader>
            </Card>
          </View>
        </View>

        {/* Real World Examples */}
        <View className="gap-4">
          <Text className="text-xl font-semibold text-foreground">Usage Examples</Text>

          <Card variant="surface-1">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Manage your current ongoing projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Status</Text>
                  <Text className="text-foreground font-medium">In Progress</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Last Updated</Text>
                  <Text className="text-foreground font-medium">2 hours ago</Text>
                </View>
              </View>
            </CardContent>
            <CardFooter className="flex-row justify-end gap-2">
              <Button variant="ghost">
                <Text>Cancel</Text>
              </Button>
              <Button>
                <Text>Save Changes</Text>
              </Button>
            </CardFooter>
          </Card>

          <View className="flex-row gap-4">
            <Card variant="surface-2" className="flex-1 border border-success/20">
              <CardHeader className="p-4">
                <CardTitle className="text-lg text-success">Success</CardTitle>
                <CardDescription className="text-xs text-success/70">Operation completed</CardDescription>
              </CardHeader>
            </Card>
            <Card variant="surface-2" className="flex-1 border border-danger/20">
              <CardHeader className="p-4">
                <CardTitle className="text-lg text-danger">Error</CardTitle>
                <CardDescription className="text-xs text-danger/70">Operation failed</CardDescription>
              </CardHeader>
            </Card>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
