import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@components/common/Button';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { OnboardingStackParamList } from '@navigation/AppNavigator';
import { ROUTES } from '@constants/navigation';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';

type Navigation = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

/**
 * The entry point of the onboarding flow. Presents the user with a choice
 * between a quick, archetype–based pantry setup or a more detailed,
 * customised setup. This screen is intentionally minimalistic to focus
 * the user's attention on the two primary actions.
 */
const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose your path</Text>
        <View style={styles.buttonContainer}>
          <Button
            label="Lazy Setup"
            onPress={() => navigation.navigate(ROUTES.ARCHETYPE)}
            style={styles.button}
          />
          <Button
            label="Advanced Setup"
            onPress={() => navigation.navigate(ROUTES.ADVANCED_SETUP)}
            style={styles.button}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: sizes.h2,
    color: colors.primaryText,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 16,
  },
});