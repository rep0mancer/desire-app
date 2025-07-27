import React from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent, ViewStyle } from 'react-native';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';

/**
 * Props for the Button component.
 */
interface ButtonProps {
  /** Text label displayed inside the button. */
  label: string;
  /** Callback invoked when the button is pressed. */
  onPress: (event: GestureResponderEvent) => void;
  /** Optional additional styling applied to the button container. */
  style?: ViewStyle;
}

/**
 * A simple rectangular button following the brutalist aesthetic. It uses
 * high–contrast colours and sharp edges. You can customise the container
 * style via the `style` prop.
 */
export const Button: React.FC<ButtonProps> = ({ label, onPress, style }) => {
  return (
    <Pressable style={({ pressed }) => [styles.button, style, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryText,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: colors.background,
    fontFamily: fonts.body,
    fontSize: sizes.body,
    textTransform: 'uppercase',
  },
});