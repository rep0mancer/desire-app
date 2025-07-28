import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignIn } from '../screens/SignIn';
import { SignUp } from '../screens/SignUp';
import { AppNavigator } from './AppNavigator';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  App: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="SignIn" component={SignIn} />
        <AuthStack.Screen name="SignUp" component={SignUp} />
        <AuthStack.Screen name="App" component={AppNavigator} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}
