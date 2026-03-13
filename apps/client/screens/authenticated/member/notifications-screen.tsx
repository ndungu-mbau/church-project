import { Text, View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Container } from "@/components/container";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { Bell, ChevronRight, Trash2 } from "lucide-react-native";
import { format } from "date-fns";
import React, { useState } from "react";

export function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const primaryColor = useThemeColor("primary");
  
  const notificationsQuery = useQuery(
    trpc.member.notifications.getMyNotifications.queryOptions({ limit: 50 })
  );

  const deleteMutation = trpc.member.notifications.deleteNotification.useMutation({
    onSuccess: () => {
      notificationsQuery.refetch();
    },
  });

  const markAsReadMutation = trpc.member.notifications.markAsRead.useMutation({
    onSuccess: () => {
      notificationsQuery.refetch();
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await notificationsQuery.refetch();
    setRefreshing(false);
  };

  const notifications = notificationsQuery.data ?? [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100';
      case 'IMPORTANT':
        return 'bg-orange-100';
      default:
        return 'bg-blue-50';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-700';
      case 'IMPORTANT':
        return 'text-orange-700';
      default:
        return 'text-blue-700';
    }
  };

  const renderNotification = ({ item }: { item: any }) => {
    const isRead = item.recipients?.[0]?.readAt;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className="mb-3"
        onPress={() => {
          if (!isRead) {
            markAsReadMutation.mutate({ id: item.id });
          }
        }}
      >
        <Card className={`overflow-hidden border-none shadow-sm ${!isRead ? 'border-l-4 border-primary' : ''}`}>
          <View className={`${getPriorityColor(item.priority)} p-4 space-y-3`}>
            {/* Header */}
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-foreground font-bold text-base mb-1">
                  {item.title}
                </Text>
                {item.priority !== 'DEFAULT' && (
                  <Text className={`text-xs font-semibold ${getPriorityBadgeColor(item.priority)}`}>
                    {item.priority}
                  </Text>
                )}
              </View>
              <View className="flex-row items-center gap-2">
                {!isRead && (
                  <View className="w-2 h-2 rounded-full bg-primary" />
                )}
              </View>
            </View>

            {/* Content Preview */}
            <Text
              className="text-muted-foreground text-sm"
              numberOfLines={2}
            >
              {item.content}
            </Text>

            {/* Metadata */}
            <View className="flex-row items-center justify-between pt-2">
              <View>
                <Text className="text-xs text-muted-foreground">
                  {format(new Date(item.createdAt), "MMM d, yyyy")}
                </Text>
                {item.group && (
                  <Text className="text-xs text-muted-foreground mt-0.5">
                    {item.group.name}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => deleteMutation.mutate({ id: item.id })}
                className="p-2"
              >
                <Trash2 size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (notificationsQuery.isLoading) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">Loading notifications...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View className="flex-1">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Bell size={24} color={primaryColor} />
            <Text className="text-2xl font-bold text-foreground">
              Notifications
            </Text>
          </View>
          <Text className="text-muted-foreground text-sm">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={primaryColor}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Bell size={48} color="#999" className="mb-4" />
            <Text className="text-muted-foreground text-center text-base">
              No notifications yet
            </Text>
            <Text className="text-muted-foreground text-center text-sm mt-2">
              Check back later for updates from your church
            </Text>
          </View>
        )}
      </View>
    </Container>
  );
}
