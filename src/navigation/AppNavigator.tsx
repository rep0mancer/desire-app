import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
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

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

/**
 * The root navigator decides whether to present the onboarding or main flow
 * based on the `hasOnboarded` flag from the user store. It also ensures
 * that asynchronous state (e.g. from AsyncStorage) is loaded before
 * rendering any screens.
 */
export const AppNavigator: React.FC = () => {
  const hasOnboarded = useUserStore((state) => state.hasOnboarded);
  const loadFromStorage = useUserStore((state) => state.actions.loadFromStorage);

  useEffect(() => {
    // Load persisted onboarding state on mount
    void loadFromStorage();
  }, [loadFromStorage]);

  return (
    <NavigationContainer>
      {hasOnboarded ? (
        <MainStack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <MainStack.Screen name="Home" component={HomeScreen} />
          <MainStack.Screen name="Results" component={ResultsScreen} />
          <MainStack.Screen name="ShoppingList" component={ShoppingListScreen} />
          <MainStack.Screen name="PantryManagement" component={PantryManagementScreen} />
        </MainStack.Navigator>
      ) : (
        <OnboardingStack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
          <OnboardingStack.Screen name="Archetype" component={ArchetypeScreen} />
          <OnboardingStack.Screen name="Checklist" component={ChecklistScreen} />
          <OnboardingStack.Screen name="AdvancedSetup" component={AdvancedSetupScreen} />
        </OnboardingStack.Navigator>
      )}
    </NavigationContainer>
  );
};