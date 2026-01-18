import { View, Text } from "react-native";
import { Container } from "@/components/container";
import { SignUp } from "@/components/sign-up";
import { KeyboardAvoidingLayout } from "@/components/keyboard-avoiding-layout";
import { Button } from "@/components/ui/button";
import { Link } from "expo-router";
import React from "react";

export function RegisterScreen() {
  return (
    <Container className="p-6">
      <KeyboardAvoidingLayout>
        <View className="py-8 mb-4">
          <Text className="text-4xl font-bold text-foreground">
            IMANI MANAGER
          </Text>
          <Text className="text-muted-foreground mt-2">
            Create an account to join our church community.
          </Text>
        </View>

        <SignUp />

        <View className="flex-row items-center justify-center mt-6 gap-2">
          <Text className="text-muted-foreground">Already have an account?</Text>
          <Link href="/login" asChild>
            <Button variant="link" className="p-0 h-auto">
              <Text className="text-primary font-bold">Sign In</Text>
            </Button>
          </Link>
        </View>
      </KeyboardAvoidingLayout>
    </Container>
  );
}
