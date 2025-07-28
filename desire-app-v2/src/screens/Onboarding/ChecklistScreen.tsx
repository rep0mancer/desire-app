import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@navigation/AppNavigator';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { Checkbox } from '@components/common/Checkbox';
import { Button } from '@components/common/Button';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';
import { addItemToPantry, updateUserProfile } from '@services/firestore';
import { usePantryStore } from '@store/pantryStore';
import type { PantryState } from '@store/pantryStore';
import { useUserStore } from '@store/userStore';
import type { UserState } from '@store/userStore';
import { useToast } from '@components/common/Toast';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Checklist'>;

/**
 * Screen allowing the user to review and customise the list of pantry items
 * suggested by their chosen archetype. All items are selected by default
 * and can be deselected. Upon confirmation the selected items are saved
 * into Firestore, the user profile is updated and onboarding is marked as
 * complete.
 */
const ChecklistScreen: React.FC<Props> = ({ route, navigation }) => {
  const { archetype, ingredients } = route.params;
  const [selected, setSelected] = useState<string[]>([...ingredients]);
  const { actions: pantryActions } = usePantryStore();
  const userActions = useUserStore((state: UserState) => state.actions);
  const userId = useUserStore((state: UserState) => state.userId);
  const showToast = useToast().showToast;

  const toggle = (item: string) => {
    setSelected((prev: string[]) =>
      prev.includes(item) ? prev.filter((i: string) => i !== item) : [...prev, item]
    );
  };

  const handleConfirm = async () => {
    try {
      if (!userId) {
        showToast('User ID missing');
        return;
      }
      // Save selected items to Firestore and local store
      await Promise.all(
        selected.map((item) => addItemToPantry(userId, item))
      );
      pantryActions.setPantry(selected.map((i) => i.toLowerCase()));
      const timestamp = Date.now();
      await updateUserProfile(userId, {
        onboardingArchetype: archetype,
        pantryLastUpdated: timestamp,
      });
      await userActions.setOnboardingArchetype(archetype);
      userActions.setPantryLastUpdated(timestamp);
      await userActions.setHasOnboarded(true);
      // Reset inactive opens counter
      userActions.resetInactiveOpens();
      navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] });
    } catch (error) {
      // Display a user-friendly error via toast; avoid console logging to keep
      // production builds clean.
      showToast('Failed to save pantry');
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Your pantry</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {ingredients.map((item: string) => (
          <Checkbox
            key={item}
            label={item}
            checked={selected.includes(item)}
            onToggle={() => toggle(item)}
          />
        ))}
      </ScrollView>
      <Button label="Confirm & Continue" onPress={handleConfirm} />
    </ScreenContainer>
  );
};

export default ChecklistScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: sizes.h2,
    color: colors.primaryText,
    marginBottom: 24,
  },
  list: {
    paddingBottom: 24,
  },
});