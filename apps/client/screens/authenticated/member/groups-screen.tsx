import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { Container } from "@/components/container";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, User, ChevronRight } from "lucide-react-native";
import React from "react";

export function GroupsScreen() {
  const groups = useQuery(trpc.member.groups.list.queryOptions());
  const primaryColor = useThemeColor("primary");

  const renderGroup = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.7} className="mb-4">
      <Card className="p-4 border-none shadow-sm flex-row items-center gap-4">
        <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
          <Users size={24} color={primaryColor} />
        </View>

        <View className="flex-1">
          <Text className="text-foreground font-bold text-lg">{item.name}</Text>
          <Text className="text-muted-foreground text-sm" numberOfLines={1}>
            {item.description || "No description provided."}
          </Text>
        </View>

        <ChevronRight size={20} color="lightgray" />
      </Card>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={groups.data}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground">Fellowship Groups</Text>
            <Text className="text-muted-foreground">Find your place in our family</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="py-20 items-center">
            <Text className="text-muted italic">No groups found.</Text>
          </View>
        )}
        onRefresh={() => groups.refetch()}
        refreshing={groups.isRefetching}
      />
    </View>
  );
}
