import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { Container } from "@/components/container";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
// import { Chip } from "@/components/ui/chip";
import { Calendar, MapPin, ChevronRight } from "lucide-react-native";
import { format } from "date-fns";
import React from "react";

export function EventsScreen() {
  const events = useQuery(trpc.member.events.list.queryOptions({ limit: 50 }));
  const primaryColor = useThemeColor("primary");

  const renderEvent = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.7} className="mb-4">
      <Card className="overflow-hidden border-none shadow-sm">
        <View className="flex-row h-32">
          {/* Date Thumbnail */}
          <View className="w-24 bg-primary/10 items-center justify-center border-r border-primary/5">
            <Text className="text-primary font-bold text-xl">
              {item.startTime ? format(new Date(item.startTime), "dd") : "???"}
            </Text>
            <Text className="text-primary/70 text-xs uppercase font-semibold">
              {item.startTime ? format(new Date(item.startTime), "MMM") : "???"}
            </Text>
          </View>

          {/* Info */}
          <View className="flex-1 p-4 justify-between">
            <View>
              <Text className="text-foreground font-bold text-lg mb-1" numberOfLines={1}>
                {item.name}
              </Text>
              <View className="flex-row items-center gap-1 mb-1">
                <MapPin size={12} color="gray" />
                <Text className="text-muted-foreground text-xs" numberOfLines={1}>
                  {item.location || "Online"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1">
                <Calendar size={12} color="gray" />
                <Text className="text-muted text-xs">
                  {item.startTime ? format(new Date(item.startTime), "p") : ""}
                </Text>
              </View>
              <ChevronRight size={16} color="lightgray" />
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={events.data}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground">Events</Text>
            <Text className="text-muted-foreground">Stay connected with our community</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="py-20 items-center">
            <Text className="text-muted italic">No upcoming events found.</Text>
          </View>
        )}
        onRefresh={() => events.refetch()}
        refreshing={events.isRefetching}
      />
    </View>
  );
}
