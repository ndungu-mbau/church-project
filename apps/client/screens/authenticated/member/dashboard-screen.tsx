import { Text, View, ScrollView } from "react-native";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@/components/ui/chip";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { queryClient, trpc } from "@/utils/trpc";
import { AlertCircle, CheckCircle2, PlayCircle, BookOpen, Clock } from "lucide-react-native";
import React from "react";
import { format } from "date-fns";

export function DashboardScreen() {
  const { data: session } = authClient.useSession();

  const latestSermon = useQuery(trpc.member.sermons.latest.queryOptions());
  const todayDevotion = useQuery(trpc.member.devotions.today.queryOptions());
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  const isConnected = healthCheck?.data === "OK";
  const isLoadingHealth = healthCheck?.isLoading;

  const successColor = useThemeColor("success");
  const primaryColor = useThemeColor("primary");

  return (
    <ScrollView className="flex-1 bg-background">
      <Container className="p-6 pb-12">
        <View className="py-4 mb-6">
          <Text className="text-4xl font-bold text-foreground mb-2">
            IMANI MANAGER
          </Text>
          <Text className="text-muted-foreground">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Member'}
          </Text>
        </View>

        {/* Today's Devotion */}
        <Card variant="surface-2" className="mb-6 p-1 overflow-hidden">
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <BookOpen size={20} color={primaryColor} />
            <CardTitle className="text-lg">Today's Devotion</CardTitle>
          </CardHeader>
          <CardContent>
            {todayDevotion.isLoading ? (
              <Text className="text-muted text-sm">Loading devotion...</Text>
            ) : todayDevotion.data ? (
              <View>
                <Text className="text-foreground font-semibold text-base mb-1">
                  {todayDevotion.data.title}
                </Text>
                <Text className="text-muted-foreground text-sm numberOfLines={3}">
                  {todayDevotion.data.content}
                </Text>
                <Button variant="link" className="px-0 mt-2 self-start h-auto">
                  <Text className="text-primary font-medium">Read More</Text>
                </Button>
              </View>
            ) : (
              <Text className="text-muted text-sm italic">No devotion for today.</Text>
            )}
          </CardContent>
        </Card>

        {/* Latest Sermon */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <PlayCircle size={20} color={primaryColor} />
            <CardTitle className="text-lg">Latest Sermon</CardTitle>
          </CardHeader>
          <CardContent>
            {latestSermon.isLoading ? (
              <Text className="text-muted text-sm">Loading latest sermon...</Text>
            ) : latestSermon.data ? (
              <View>
                <Text className="text-foreground font-semibold text-base mb-1">
                  {latestSermon.data.title}
                </Text>
                <View className="flex-row items-center gap-2 mb-3">
                  <Clock size={14} color="gray" />
                  <Text className="text-muted text-xs">
                    {latestSermon.data.date ? format(new Date(latestSermon.data.date), 'MMMM do, yyyy') : 'Recently'}
                  </Text>
                </View>
                <Button size="sm" className="flex-row gap-2">
                  <PlayCircle size={16} color="white" />
                  <Text className="text-primary-foreground font-medium">Watch Now</Text>
                </Button>
              </View>
            ) : (
              <Text className="text-muted text-sm italic">No sermons available yet.</Text>
            )}
          </CardContent>
        </Card>

        {/* System Status (Subtle) */}
        <View className="flex-row items-center justify-between border-t border-border/50 pt-6 mt-4 opacity-70">
          <Text className="text-muted-foreground text-xs uppercase font-bold tracking-widest">
            Status
          </Text>
          <View className="flex-row items-center gap-2">
            <View className={`w-2 h-2 rounded-full ${isConnected ? "bg-success" : "bg-danger"}`} />
            <Text className="text-muted-foreground text-xs">
              {isConnected ? "Cloud Connected" : "Connection Error"}
            </Text>
          </View>
        </View>
      </Container>
    </ScrollView>
  );
}

