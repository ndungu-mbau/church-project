import { View, Text } from "react-native";
import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { KeyboardAvoidingLayout } from "@/components/keyboard-avoiding-layout";
import { Button } from "@/components/ui/button";
import { Link } from "expo-router";
import React from "react";

export function LoginScreen() {
  return (
    <Container className="p-6">
      <KeyboardAvoidingLayout>
        <View className="py-8 mb-4">
          <Text className="text-4xl font-bold text-foreground">
            IMANI MANAGER
          </Text>
          <Text className="text-muted-foreground mt-2">
            Welcome back! Please sign in to continue.
          </Text>
        </View>

        <SignIn />

        <View className="flex-row items-center justify-center mt-6 gap-2">
          <Text className="text-muted-foreground">Don't have an account?</Text>
          <Link href="/register" asChild>
            <Button variant="link" className="p-0 h-auto">
              <Text className="text-primary font-bold">Sign Up</Text>
            </Button>
          </Link>
        </View>
      </KeyboardAvoidingLayout>
    </Container>
  );
}
