import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@navigation/AppNavigator';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { Checkbox } from '../../components/common/Checkbox';
import { usePantryComparison } from '@hooks/usePantry';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';

type Props = NativeStackScreenProps<MainStackParamList, 'ShoppingList'>;

interface ShoppingListItem {
  name: string;
  inPantry: boolean;
}

/**
 * Screen that displays a consolidated shopping list for a chosen recipe. It
 * compares the required ingredients against the user's pantry and visually
 * distinguishes items already owned from those that still need to be bought.
 */
const ShoppingListScreen: React.FC<Props> = ({ route }) => {
  const { title, ingredients } = route.params;
  const { have, need } = usePantryComparison(ingredients);

  const data: ShoppingListItem[] = [
    ...have.map((name: string) => ({ name, inPantry: true })),
    ...need.map((name: string) => ({ name, inPantry: false })),
  ];

  const renderItem = ({ item }: { item: ShoppingListItem }) => (
    <View style={{ marginVertical: 4 }}>
      <Checkbox
        label={item.name}
        isChecked={item.inPantry}
        onPress={() => {}}
      />
    </View>
  );

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
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
});