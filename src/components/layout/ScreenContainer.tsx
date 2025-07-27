import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';
import { colors } from '@constants/colors';

/**
 * ScreenContainer wraps every screen in a consistent background and padding.
 * It uses SafeAreaView to avoid notches and overlays on iOS and Android.
 */
export const ScreenContainer: React.FC<ViewProps & { children: React.ReactNode }> = ({ children, style, ...rest }) => {
  return (
    <SafeAreaView style={styles.safe} {...rest}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});