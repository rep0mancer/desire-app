import React from 'react';
import { TextInput, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  value: string;
  onChangeText(text: string): void;
  placeholder?: string;
  style?: ViewStyle;
}

export function Input({ value, onChangeText, placeholder, style }: Props) {
  return (
    <TextInput
      style={[styles.input, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 8,
    marginVertical: 4,
  },
});
