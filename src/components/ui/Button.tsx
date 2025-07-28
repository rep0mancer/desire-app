import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  title: string;
  onPress(): void;
  style?: ViewStyle;
}

export function Button({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 12, borderRadius: 8, backgroundColor: '#3366FF', alignItems: 'center' },
  text: { color: '#FFF', fontWeight: '600' },
});
