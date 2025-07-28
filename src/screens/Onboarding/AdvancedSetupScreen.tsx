import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@navigation/AppNavigator';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';
import { addItemToPantry, updateUserProfile } from '@services/firestore';
import { usePantryStore } from '@store/pantryStore';
import type { PantryState } from '@store/pantryStore';
import { useUserStore } from '@store/userStore';
import type { UserState } from '@store/userStore';
import { useToast } from '@components/common/Toast';
import { ROUTES } from '@constants/navigation';

type Props = NativeStackScreenProps<OnboardingStackParamList, typeof ROUTES.ADVANCED_SETUP>;

/**
 * Static category definitions for the advanced setup screen. In a real app
 * these might be fetched from an API or defined centrally.
 */
const CATEGORY_ITEMS: Record<string, string[]> = {
  Vegetables: ['carrot', 'broccoli', 'spinach', 'tomato', 'onion'],
  Spices: ['salt', 'pepper', 'cumin', 'paprika', 'oregano'],
  Dairy: ['milk', 'cheese', 'butter', 'yogurt'],
  Grains: ['rice', 'pasta', 'quinoa', 'bread'],
};

/**
 * Screen providing a more granular interface for selecting pantry items. Users
 * can search for ingredients or explore by category. Selected items are saved
 * to Firestore when the user taps the save button.
 */
const AdvancedSetupScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const pantryActions = usePantryStore((state: PantryState) => state.actions);
  const userActions = useUserStore((state: UserState) => state.actions);
  const userId = useUserStore((state: UserState) => state.userId);
  const showToast = useToast().showToast;

  const handleToggle = (item: string) => {
    setSelected((prev: string[]) =>
      prev.includes(item) ? prev.filter((i: string) => i !== item) : [...prev, item]
    );
  };

  const filteredSuggestions: string[] = query
    ? Object.values(CATEGORY_ITEMS)
        .flat()
        .filter((item: string) => item.toLowerCase().includes(query.toLowerCase()))
    : [];

  const currentCategoryItems = activeCategory ? CATEGORY_ITEMS[activeCategory] : [];

  const handleSave = async () => {
    try {
      if (!userId) {
        showToast('User ID missing');
        return;
      }
      await Promise.all(selected.map((item) => addItemToPantry(userId, item)));
      const pantryObj: Record<string, boolean> = {};
      selected.forEach((i) => {
        pantryObj[i.toLowerCase()] = true;
      });
      pantryActions.setPantry(pantryObj);
      const timestamp = Date.now();
      await updateUserProfile(userId, {
        pantryLastUpdated: timestamp,
      });
      userActions.setPantryLastUpdated(timestamp);
      await userActions.setOnboardingStep('finished');
      userActions.resetInactiveOpens();
      navigation.reset({ index: 0, routes: [{ name: ROUTES.HOME as never }] });
    } catch (error) {
      // Notify the user of the failure; avoid console.log in production
      showToast('Failed to save pantry');
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Build your pantry</Text>
      <Input
        placeholder="Search ingredients"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      {query.length > 0 && (
        <FlatList
          data={filteredSuggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }: { item: string }) => (
            <TouchableOpacity onPress={() => handleToggle(item)} style={styles.suggestionRow}>
              <Text style={[styles.suggestionText, selected.includes(item) && styles.selectedText]}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}
      <View style={styles.categories}>
        {Object.keys(CATEGORY_ITEMS).map((category: string) => (
          <TouchableOpacity
            key={category}
            onPress={() => setActiveCategory((prev: string | null) => (prev === category ? null : category))}
            style={[styles.categoryButton, activeCategory === category && styles.categoryButtonActive]}
          >
            <Text style={styles.categoryButtonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeCategory && (
        <FlatList
          data={currentCategoryItems}
          keyExtractor={(item) => item}
          renderItem={({ item }: { item: string }) => (
            <TouchableOpacity onPress={() => handleToggle(item)} style={styles.categoryItemRow}>
              <Text style={[styles.categoryItemText, selected.includes(item) && styles.selectedText]}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.categoryList}
        />
      )}
      <Button label="Save Pantry" onPress={handleSave} style={{ marginTop: 24 }} />
    </ScreenContainer>
  );
};

export default AdvancedSetupScreen;

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
  input: {
    marginBottom: 16,
  },
  suggestionsList: {
    maxHeight: 120,
    marginBottom: 16,
  },
  suggestionRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryText,
  },
  suggestionText: {
    fontFamily: fonts.body,
    fontSize: sizes.body,
    color: colors.primaryText,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: colors.primaryText,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primaryText,
  },
  categoryButtonText: {
    fontFamily: fonts.body,
    fontSize: sizes.small,
    color: colors.primaryText,
  },
  categoryList: {
    maxHeight: 120,
    marginBottom: 16,
  },
  categoryItemRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryText,
  },
  categoryItemText: {
    fontFamily: fonts.body,
    fontSize: sizes.body,
    color: colors.primaryText,
  },
  selectedText: {
    fontWeight: 'bold',
    color: colors.primaryText,
  },
});