import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';

/**
 * A minimalist text input component with no borders and subtle underline.
 * Accepts all native TextInput props.
 */
export const Input: React.FC<TextInputProps> = (props) => {
  return (
    <TextInput
      style={[styles.input, props.style]}
      placeholderTextColor={colors.secondaryText}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryText,
    paddingVertical: 8,
    color: colors.primaryText,
    fontFamily: fonts.body,
    fontSize: sizes.body,
  },
});