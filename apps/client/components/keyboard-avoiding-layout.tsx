import React from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { ViewProps } from 'react-native';

interface KeyboardAvoidingLayoutProps extends ViewProps {
  children: React.ReactNode;
  bottomOffset?: number;
}

export function KeyboardAvoidingLayout({
  children,
  style,
  bottomOffset = 0,
  ...props
}: KeyboardAvoidingLayoutProps) {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      contentContainerStyle={[{ flexGrow: 1 }, style]}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
