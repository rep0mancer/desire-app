import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useUserStore } from '@store/userStore';
import { ROUTES } from '@constants/navigation';

// Screen imports
import WelcomeScreen from '@screens/Onboarding/WelcomeScreen';
import ArchetypeScreen from '@screens/Onboarding/ArchetypeScreen';
import ChecklistScreen from '@screens/Onboarding/ChecklistScreen';
import AdvancedSetupScreen from '@screens/Onboarding/AdvancedSetupScreen';
import HomeScreen from '@screens/Main/HomeScreen';
import ResultsScreen from '@screens/Main/ResultsScreen';
import ShoppingListScreen from '@screens/Main/ShoppingListScreen';
import PantryManagementScreen from '@screens/Pantry/PantryManagementScreen';
import LoginScreen from '@screens/Auth/LoginScreen';
import SignUpScreen from '@screens/Auth/SignUpScreen';

// Navigation parameter lists
export type OnboardingStackParamList = {
  [ROUTES.WELCOME]: undefined;
  [ROUTES.ARCHETYPE]: undefined;
  [ROUTES.CHECKLIST]: { archetype: string; ingredients: string[] };
  [ROUTES.ADVANCED_SETUP]: undefined;
};

export type MainStackParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.RESULTS]: { query: string };
  [ROUTES.SHOPPING_LIST]: { title: string; ingredients: string[] };
  [ROUTES.PANTRY_MANAGEMENT]: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

/**
 * The root navigator decides whether to present the onboarding or main flow
 * based on the `onboardingStep` value from the user store. It also ensures
 * that asynchronous state (e.g. from AsyncStorage) is loaded before
 * rendering any screens.
 */
/**
 * Navigator that conditionally renders authentication, onboarding or main
 * application flows based on the current user and onboarding status.
 * It listens to Firebase authentication state via the `useAuth` hook and
 * displays a loading indicator while the auth state is being resolved.
 */
export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const onboardingStep = useUserStore((state) => state.onboardingStep);
  const archetype = useUserStore((state) => state.onboardingArchetype);

  const getInitialOnboardingRoute = () => {
    switch (onboardingStep) {
      case 'archetype_selected':
        return ROUTES.CHECKLIST;
      case 'pantry_complete':
        return ROUTES.ADVANCED_SETUP;
      default:
        return ROUTES.WELCOME;
    }
  };

  if (loading) {
    // Display a centred loading indicator while checking auth state
    return (
      <NavigationContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        // User is not authenticated; present auth screens
        <AuthStack.Navigator
          initialRouteName={ROUTES.LOGIN}
          screenOptions={{ headerShown: false }}
        >
          <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
          <AuthStack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
        </AuthStack.Navigator>
      ) : onboardingStep !== 'finished' ? (
        // Authenticated but mid-onboarding
        <OnboardingStack.Navigator
          initialRouteName={getInitialOnboardingRoute()}
          screenOptions={{ headerShown: false }}
        >
          <OnboardingStack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
          <OnboardingStack.Screen name={ROUTES.ARCHETYPE} component={ArchetypeScreen} />
          <OnboardingStack.Screen name={ROUTES.CHECKLIST} component={ChecklistScreen} />
          <OnboardingStack.Screen name={ROUTES.ADVANCED_SETUP} component={AdvancedSetupScreen} />
        </OnboardingStack.Navigator>
      ) : (
        // Authenticated and onboarded
        <MainStack.Navigator
          initialRouteName={ROUTES.HOME}
          screenOptions={{ headerShown: false }}
        >
          <MainStack.Screen name={ROUTES.HOME} component={HomeScreen} />
          <MainStack.Screen name={ROUTES.RESULTS} component={ResultsScreen} />
          <MainStack.Screen name={ROUTES.SHOPPING_LIST} component={ShoppingListScreen} />
          <MainStack.Screen name={ROUTES.PANTRY_MANAGEMENT} component={PantryManagementScreen} />
        </MainStack.Navigator>
      )}
    </NavigationContainer>
  );
};

/**
 * Parameter list for the authentication stack. Defines the routes for
 * login and sign up screens.
 */
export type AuthStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.SIGN_UP]: undefined;
};

/**
 * Simple styles for the loading view.
 */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});