import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Pressable, TouchableOpacity } from 'react-native';
import PantryIcon from '../../components/icons/PantryIcon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@navigation/AppNavigator';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';
import { useUserStore } from '@store/userStore';
import type { UserState } from '@store/userStore';

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

/**
 * The primary entry point of the main application. Presents a typographic
 * prompt inviting the user to state what they wish to cook. When tapped
 * the prompt becomes an input. A pantry icon in the top right reveals
 * the pantry management screen. If the user has opened the app without
 * searching multiple times, an Easter egg message appears instead of the
 * usual prompt.
 */
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState('');
  const pantryLastUpdated = useUserStore((state: UserState) => state.pantryLastUpdated);
  const consecutiveInactiveOpens = useUserStore((state: UserState) => state.consecutiveInactiveOpens);
  const { resetInactiveOpens } = useUserStore((state: UserState) => state.actions);

  const handleSubmit = () => {
    if (!query.trim()) {
      return;
    }
    // Reset inactive counter because the user engaged
    resetInactiveOpens();
    navigation.navigate('Results', { query: query.trim() });
    setQuery('');
    setIsEditing(false);
  };

  // Determine whether to show the Easter egg message
  const showEasterEgg = consecutiveInactiveOpens >= 3;
  const promptText = showEasterEgg
    ? 'The potential in your kitchen remains untapped. We trust you enjoyed your pre-packaged satisfaction.'
    : 'What do you desire?';

  // Calculate whether the pantry is stale (older than 7 days)
  const showPantryNotification = pantryLastUpdated
    ? Date.now() - pantryLastUpdated > 7 * 24 * 60 * 60 * 1000
    : false;

  const handlePantryPress = () => {
    navigation.navigate('PantryManagement');
  };

  return (
    <ScreenContainer style={styles.container}>
      <Pressable
        onPress={() => setIsEditing(true)}
        style={styles.content}
      >
        {isEditing ? (
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            style={styles.input}
            placeholder={promptText}
            placeholderTextColor={colors.secondaryText}
          />
        ) : (
          <Text style={styles.promptText}>{promptText}</Text>
        )}
      </Pressable>
      <TouchableOpacity onPress={handlePantryPress} style={styles.pantryIconContainer}>
        <PantryIcon />
        {showPantryNotification && <View style={styles.notificationDot} />}
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  promptText: {
    fontFamily: fonts.heading,
    fontSize: sizes.h1,
    color: colors.primaryText,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryText,
    fontFamily: fonts.heading,
    fontSize: sizes.h1,
    color: colors.primaryText,
    textAlign: 'center',
  },
  pantryIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
});