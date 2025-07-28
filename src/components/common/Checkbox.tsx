import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';

/**
 * Props for the Checkbox component.
 */
interface CheckboxProps {
  /** Current checked state. */
  checked?: boolean;
  /** Alternative prop name for checked state. */
  isChecked?: boolean;
  /** Callback invoked when the user toggles the checkbox. */
  onToggle?: () => void;
  /** Alternate press handler prop name. */
  onPress?: () => void;
  /** Label displayed next to the checkbox. */
  label: string;
  /** Optional additional styles applied to the outer container. */
  style?: ViewStyle;
  /** When true, the label is rendered at reduced opacity with a strikethrough. */
  muted?: boolean;
}

/**
 * A simple checkbox with a label. It maintains no internal state; use the
 * provided `checked` prop to control its appearance.
 */
export const Checkbox: React.FC<CheckboxProps> = ({ checked, isChecked, onToggle, onPress, label, style, muted }) => {
  const actualChecked = typeof isChecked === 'boolean' ? isChecked : !!checked;
  const handlePress = onToggle || onPress || (() => {});
  return (
    <Pressable style={[styles.container, style]} onPress={handlePress}>
      <Pressable style={[styles.box, actualChecked && styles.boxChecked]}>
        {actualChecked && <Text style={styles.check}>✓</Text>}
      </Pressable>
      <Text style={[styles.label, muted && styles.mutedLabel]}>{label}</Text>
    </Pressable>
  );
};

const BOX_SIZE = 24;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 2,
    borderColor: colors.primaryText,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primaryText,
  },
  check: {
    color: colors.background,
    fontSize: sizes.body,
    lineHeight: BOX_SIZE,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: sizes.body,
    color: colors.primaryText,
  },
  mutedLabel: {
    color: colors.secondaryText,
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
});