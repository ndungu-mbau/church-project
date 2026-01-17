import { Container } from "@/components/container";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";

export function ModalScreen() {
  const accentForegroundColor = useThemeColor("accent-foreground");

  function handleClose() {
    router.back();
  }

  return (
    <Container>
      <View className="flex-1 justify-center items-center p-6">
        <Card variant="surface-1" className="p-6 w-full max-w-sm">
          <CardContent className="gap-4 items-center p-0">
            <View className="w-16 h-16 bg-accent rounded-full items-center justify-center mb-2">
              <Ionicons
                name="checkmark"
                size={32}
                color={accentForegroundColor}
              />
            </View>
            <CardTitle className="text-center text-xl">
              Modal Screen
            </CardTitle>
            <CardDescription className="text-center">
              This is an example modal screen. You can use this pattern for
              dialogs, confirmations, or any overlay content.
            </CardDescription>
          </CardContent>
          <CardFooter className="mt-4 p-0">
            <Pressable
              onPress={handleClose}
              className="bg-accent p-4 rounded-lg w-full active:opacity-70"
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-accent-foreground font-semibold text-base mr-2">
                  Close Modal
                </Text>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={accentForegroundColor}
                />
              </View>
            </Pressable>
          </CardFooter>
        </Card>
      </View>
    </Container>
  );
}
