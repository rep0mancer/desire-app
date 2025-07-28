import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useUserStore } from '@store/userStore';

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
  Welcome: undefined;
  Archetype: undefined;
  Checklist: { archetype: string; ingredients: string[] };
  AdvancedSetup: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Results: { query: string };
  ShoppingList: { title: string; ingredients: string[] };
  PantryManagement: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

/**
 * The root navigator decides whether to present the onboarding or main flow
 * based on the `hasOnboarded` flag from the user store. It also ensures
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
  const hasOnboarded = useUserStore((state) => state.hasOnboarded);

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
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="SignUp" component={SignUpScreen} />
        </AuthStack.Navigator>
      ) : !hasOnboarded ? (
        // Authenticated but not onboarded
        <OnboardingStack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
          <OnboardingStack.Screen name="Archetype" component={ArchetypeScreen} />
          <OnboardingStack.Screen name="Checklist" component={ChecklistScreen} />
          <OnboardingStack.Screen name="AdvancedSetup" component={AdvancedSetupScreen} />
        </OnboardingStack.Navigator>
      ) : (
        // Authenticated and onboarded
        <MainStack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <MainStack.Screen name="Home" component={HomeScreen} />
          <MainStack.Screen name="Results" component={ResultsScreen} />
          <MainStack.Screen name="ShoppingList" component={ShoppingListScreen} />
          <MainStack.Screen name="PantryManagement" component={PantryManagementScreen} />
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
  Login: undefined;
  SignUp: undefined;
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