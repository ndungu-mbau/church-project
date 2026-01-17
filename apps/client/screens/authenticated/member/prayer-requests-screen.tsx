import { Text, View, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { Container } from "@/components/container";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc, queryClient } from "@/utils/trpc";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, History, CheckCircle2, Clock } from "lucide-react-native";
import { useState } from "react";
import React from "react";
import { format } from "date-fns";
import { KeyboardAvoidingLayout } from "@/components/keyboard-avoiding-layout";

export function PrayerRequestsScreen() {
  const [request, setRequest] = useState("");
  const myRequests = useQuery(trpc.member.prayerRequests.listMine.queryOptions());
  const primaryColor = useThemeColor("primary");

  const submitMutation = useMutation(trpc.member.prayerRequests.create.mutationOptions({
    onSuccess: () => {
      setRequest("");
      myRequests.refetch();
    }
  }));

  const handleSend = () => {
    if (!request.trim()) return;
    submitMutation.mutate({ content: request });
  };

  const renderRequest = ({ item }: { item: any }) => (
    <Card variant="surface-2" className="mb-4 p-4 border-none">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center gap-2">
          {item.status === 'answered' ? (
            <CheckCircle2 size={14} color="#22c55e" />
          ) : (
            <Clock size={14} color="#eab308" />
          )}
          <Text className={`text-[10px] font-bold uppercase tracking-wider ${item.status === 'answered' ? 'text-success' : 'text-warning'}`}>
            {item.status}
          </Text>
        </View>
        <Text className="text-muted text-[10px]">
          {item.submittedAt ? format(new Date(item.submittedAt), "MMM d, h:mm a") : ""}
        </Text>
      </View>
      <Text className="text-foreground text-sm">{item.request}</Text>
    </Card>
  );

  return (
    <KeyboardAvoidingLayout className="flex-1 bg-background">
      <FlatList
        data={myRequests.data}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        scrollEnabled={false} // Disable FlatList scroll because KeyboardAvoidingLayout (ScrollView) will handle it
        ListHeaderComponent={() => (
          <View>
            <View className="mb-6">
              <Text className="text-3xl font-bold text-foreground">Prayer Requests</Text>
              <Text className="text-muted-foreground">How can we pray for you?</Text>
            </View>

            <Card className="mb-10 p-4 shadow-md bg-primary/5 border-primary/10">
              <Label className="mb-2 text-foreground font-semibold">New Request</Label>
              <Input
                placeholder="Share your prayer need..."
                multiline
                numberOfLines={4}
                value={request}
                onChangeText={setRequest}
                className="mb-4 bg-background"
              />
              <Button
                onPress={handleSend}
                disabled={!request.trim() || submitMutation.isPending}
                className="flex-row gap-2"
              >
                <Send size={16} color="white" />
                <Text className="text-primary-foreground font-bold">
                  {submitMutation.isPending ? "Sending..." : "Submit Prayer Request"}
                </Text>
              </Button>
            </Card>

            <View className="flex-row items-center gap-2 mb-4">
              <History size={18} color="gray" />
              <Text className="text-lg font-bold text-foreground">My Requests</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="py-10 items-center">
            <Text className="text-muted italic text-sm">You haven't submitted any requests yet.</Text>
          </View>
        )}
      />
    </KeyboardAvoidingLayout>
  );
}

