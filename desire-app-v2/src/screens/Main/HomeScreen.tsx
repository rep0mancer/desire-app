import React from 'react';
import { View, StyleSheet, Text, TextInput, Image, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@navigation/AppNavigator';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';
import { useHomeScreenData } from '@hooks/useHomeScreenData';
import { ROUTES } from '@constants/navigation';

type Props = NativeStackScreenProps<MainStackParamList, typeof ROUTES.HOME>;

/**
 * The primary entry point of the main application. Presents a typographic
 * prompt inviting the user to state what they wish to cook. When tapped
 * the prompt becomes an input. A pantry icon in the top right reveals
 * the pantry management screen. If the user has opened the app without
 * searching multiple times, an Easter egg message appears instead of the
 * usual prompt.
 */
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    isEditing,
    setIsEditing,
    query,
    setQuery,
    promptText,
    needsUpdate,
    submit,
  } = useHomeScreenData();

  const handleSubmit = () => submit((q) => navigation.navigate(ROUTES.RESULTS, { query: q }));

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
      <Pressable style={styles.pantryIconContainer} onPress={() => navigation.navigate(ROUTES.PANTRY_MANAGEMENT)}>
        <Image source={require('../../../assets/app-icon.png')} style={styles.pantryIcon} />
        {needsUpdate && <View style={styles.redDot} />}
      </Pressable>
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
    lineHeight: sizes.h1 + 8,
    color: colors.primaryText,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryText,
    fontFamily: fonts.heading,
    fontSize: sizes.h1,
    lineHeight: sizes.h1 + 8,
    color: colors.primaryText,
    textAlign: 'center',
    borderRadius: 0,
  },
  pantryIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  pantryIcon: {
    width: 32,
    height: 32,
  },
  redDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
});