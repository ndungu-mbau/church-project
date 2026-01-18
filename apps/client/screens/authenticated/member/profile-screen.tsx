import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { trpc, queryClient } from "@/utils/trpc";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, LogOut, ChevronRight, Settings, Info } from "lucide-react-native";
import React from "react";

export function ProfileScreen() {
  const { data: session } = authClient.useSession();
  const profile = useQuery(trpc.member.profile.getMe.queryOptions());
  const primaryColor = useThemeColor("primary");

  const handleSignOut = async () => {
    await authClient.signOut();
    queryClient.invalidateQueries();
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <Container className="p-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <Avatar className="w-24 h-24 mb-4 border-2 border-primary/20" alt="">
            <AvatarImage source={{ uri: session?.user?.image || undefined }} />
            <AvatarFallback>
              <Text className="text-2xl font-bold text-primary">
                {session?.user?.name?.[0] || "U"}
              </Text>
            </AvatarFallback>
          </Avatar>
          <Text className="text-2xl font-bold text-foreground">{session?.user?.name}</Text>
          <Text className="text-muted-foreground">{session?.user?.email}</Text>
        </View>

        {/* Info Card */}
        <Card variant="surface-2" className="mb-6 p-4 gap-4">
          <View className="flex-row items-center gap-3">
            <Phone size={18} color="gray" />
            <Text className="text-foreground">{profile.data?.profile?.phone || "No phone added"}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <MapPin size={18} color="gray" />
            <Text className="text-foreground">{profile.data?.profile?.address || "No address added"}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Mail size={18} color="gray" />
            <Text className="text-foreground">{session?.user?.email}</Text>
          </View>
        </Card>

        {/* Action List */}
        <View className="gap-2 mb-8">
          <TouchableOpacity className="flex-row items-center justify-between p-4 bg-surface-1 rounded-xl">
            <View className="flex-row items-center gap-3">
              <Settings size={20} color="gray" />
              <Text className="text-foreground font-medium">Edit Profile</Text>
            </View>
            <ChevronRight size={18} color="lightgray" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4 bg-surface-1 rounded-xl">
            <View className="flex-row items-center gap-3">
              <Info size={20} color="gray" />
              <Text className="text-foreground font-medium">Church Info</Text>
            </View>
            <ChevronRight size={18} color="lightgray" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <Button variant="destructive" className="flex-row gap-2" onPress={handleSignOut}>
          <LogOut size={18} color="white" />
          <Text className="text-primary-foreground font-bold">Sign Out</Text>
        </Button>
      </Container>
    </ScrollView>
  );
}
