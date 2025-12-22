import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TabsDemo() {
  const [value, setValue] = React.useState('account');
  const [value2, setValue2] = React.useState('tab1');

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="gap-8 pb-12">
        <Text className="text-3xl font-bold text-foreground">Tabs Demo</Text>

        <Tabs value={value} onValueChange={setValue} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="account" className="flex-1">
              Account
            </TabsTrigger>
            <TabsTrigger value="password" className="flex-1">
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card variant="surface-1">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="gap-2">
                  <Label nativeID="name">Name</Label>
                  <Input placeholder="John Doe" aria-labelledby="name" />
                </View>
                <View className="gap-2">
                  <Label nativeID="username">Username</Label>
                  <Input placeholder="@johndoe" aria-labelledby="username" />
                </View>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Text>Save changes</Text>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card variant="surface-1">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="gap-2">
                  <Label nativeID="current">Current Password</Label>
                  <Input secureTextEntry aria-labelledby="current" />
                </View>
                <View className="gap-2">
                  <Label nativeID="new">New Password</Label>
                  <Input secureTextEntry aria-labelledby="new" />
                </View>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Text>Save password</Text>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Example with more tabs */}
        <View className="gap-4">
          <Text className="text-xl font-semibold text-foreground">Multi-Tab Navigation</Text>
          <Tabs value={value2} onValueChange={setValue2}>
            <TabsList className="w-full">
              <TabsTrigger value="tab1" className="flex-1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2" className="flex-1">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3" className="flex-1">Tab 3</TabsTrigger>
              <TabsTrigger value="tab4" className="flex-1">Tab 4</TabsTrigger>
            </TabsList>
            <View className="mt-4 p-4 rounded-lg bg-surface-2 border border-border">
              <TabsContent value="tab1">
                <Text className="text-foreground">Content for Tab 1</Text>
              </TabsContent>
              <TabsContent value="tab2">
                <Text className="text-foreground">Content for Tab 2</Text>
              </TabsContent>
              <TabsContent value="tab3">
                <Text className="text-foreground">Content for Tab 3</Text>
              </TabsContent>
              <TabsContent value="tab4">
                <Text className="text-foreground">Content for Tab 4</Text>
              </TabsContent>
            </View>
          </Tabs>
        </View>
      </View>
    </ScrollView>
  );
}
