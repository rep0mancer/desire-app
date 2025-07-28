import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@navigation/AppNavigator';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { usePantryStore } from '@store/pantryStore';
import type { PantryState } from '@store/pantryStore';
import { useUserStore } from '@store/userStore';
import type { UserState } from '@store/userStore';
import { addItemToPantry, removeItemFromPantry, updateUserProfile } from '@services/firestore';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';
import { useToast } from '@components/common/Toast';
import { Button } from '@components/common/Button';
import { ROUTES } from '@constants/navigation';

type Props = NativeStackScreenProps<MainStackParamList, typeof ROUTES.PANTRY_MANAGEMENT>;

/**
 * Screen that allows the user to view and modify their current pantry.
 * Users can add new items via a text input and remove existing items via
 * a dedicated button. Changes are synchronised with Firestore and the
 * user's profile is updated with a fresh timestamp.
 */
const PantryManagementScreen: React.FC<Props> = () => {
  const [input, setInput] = useState('');
  const { items, actions: pantryActions } = usePantryStore();
  const { userId, pantryLastUpdated, actions: userActions } = useUserStore();
  const showToast = useToast().showToast;

  const handleAdd = async () => {
    const item = input.trim().toLowerCase();
    if (!item) return;
    if (!userId) {
      showToast('User ID missing');
      return;
    }
    try {
      await addItemToPantry(userId, item);
      pantryActions.addItem(item);
      const timestamp = Date.now();
      await updateUserProfile(userId, { pantryLastUpdated: timestamp });
      userActions.setPantryLastUpdated(timestamp);
      setInput('');
    } catch (error) {
      // Show error via toast; avoid logging sensitive errors to console
      showToast('Failed to add item');
    }
  };

  const handleRemove = async (item: string) => {
    if (!userId) {
      showToast('User ID missing');
      return;
    }
    try {
      await removeItemFromPantry(userId, item);
      pantryActions.removeItem(item);
      const timestamp = Date.now();
      await updateUserProfile(userId, { pantryLastUpdated: timestamp });
      userActions.setPantryLastUpdated(timestamp);
    } catch (error) {
      // Show error via toast; avoid logging sensitive errors to console
      showToast('Failed to remove item');
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Your pantry</Text>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add new item"
          placeholderTextColor={colors.secondaryText}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
        />
        <Button label="Add" onPress={handleAdd} style={styles.addButton} />
      </View>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {Object.keys(items).map((item: string) => (
          <View key={item} style={styles.itemRow}>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity onPress={() => handleRemove(item)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        {Object.keys(items).length === 0 && (
          <Text style={styles.empty}>Your pantry is empty. Start adding items!</Text>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

export default PantryManagementScreen;

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
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    // Use thicker underline and no border radius per brutalist spec
    borderRadius: 0,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryText,
    paddingVertical: 8,
    fontFamily: fonts.body,
    fontSize: sizes.body,
    color: colors.primaryText,
  },
  addButton: {
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryText,
    paddingVertical: 8,
  },
  itemText: {
    fontFamily: fonts.body,
    fontSize: sizes.body,
    color: colors.primaryText,
  },
  removeText: {
    fontFamily: fonts.body,
    fontSize: sizes.small,
    color: colors.accent,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: sizes.body,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 32,
  },
});