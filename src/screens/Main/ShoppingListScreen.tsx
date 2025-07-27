import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@navigation/AppNavigator';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { usePantryComparison } from '@hooks/usePantry';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';

type Props = NativeStackScreenProps<MainStackParamList, 'ShoppingList'>;

/**
 * Screen that displays a consolidated shopping list for a chosen recipe. It
 * compares the required ingredients against the user's pantry and visually
 * distinguishes items already owned from those that still need to be bought.
 */
const ShoppingListScreen: React.FC<Props> = ({ route }) => {
  const { title, ingredients } = route.params;
  const { have, need } = usePantryComparison(ingredients);

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {have.map((item: string) => (
          <Text key={item} style={[styles.item, styles.haveItem]}>{item}</Text>
        ))}
        {need.map((item: string) => (
          <Text key={item} style={[styles.item, styles.needItem]}>{item}</Text>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

export default ShoppingListScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: sizes.h2,
    color: colors.primaryText,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 24,
  },
  item: {
    fontFamily: fonts.body,
    fontSize: sizes.body,
    marginVertical: 8,
  },
  haveItem: {
    color: colors.secondaryText,
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  needItem: {
    color: colors.primaryText,
  },
});