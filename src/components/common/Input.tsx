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
      // Override placeholder colour to a darker grey as specified
      placeholderTextColor="#666666"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    // Sharp edges and thick underline for brutalist aesthetic
    borderRadius: 0,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryText,
    paddingVertical: 8,
    color: colors.primaryText,
    fontFamily: fonts.body,
    fontSize: sizes.body,
  },
});