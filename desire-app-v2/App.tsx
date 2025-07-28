import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { AppNavigator } from '@navigation/AppNavigator';
import { ToastProvider } from '@components/common/Toast';
import { initialiseFirestore } from '@config/firebase';
import { AppState, AppStateStatus } from 'react-native';
import { useUserStore } from '@store/userStore';
import { wasSearchPerformed, resetSearchFlag } from '@utils/sessionService';

/**
 * The root component of the Desire application. It loads custom fonts,
 * initialises Firebase, sets up an AppState listener to manage the
 * consecutive inactive opens logic and mounts the navigation and toast
 * providers. The status bar is set to dark content to match the
 * minimalist white background.
 */
const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Bold': require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  });
  const incrementInactiveOpens = useUserStore((state) => state.actions.incrementInactiveOpens);

  // Initialise Firebase once on mount
  useEffect(() => {
    initialiseFirestore();
  }, []);

  // Track app state transitions to increment inactive opens when appropriate
  const appState = useRef<AppStateStatus>(AppState.currentState);
  useEffect(() => {
    const handleChange = (nextState: AppStateStatus) => {
      // When returning from background to active, evaluate search flag
      if (appState.current.match(/background|inactive/) && nextState === 'active') {
        // If no search was performed in the previous session, increment inactive opens
        if (!wasSearchPerformed()) {
          incrementInactiveOpens();
        }
        // Reset the flag for the new session
        resetSearchFlag();
      }
      appState.current = nextState;
    };
    const subscription = AppState.addEventListener('change', handleChange);
    return () => {
      subscription.remove();
    };
  }, [incrementInactiveOpens]);

  if (!fontsLoaded) {
    // Optionally render a fallback; return null yields a blank screen until fonts are ready.
    return null;
  }

  return (
    <ToastProvider>
      {/* Set the status bar text to dark to contrast against the white background */}
      <StatusBar style="dark" />
      <AppNavigator />
    </ToastProvider>
  );
};

export default App;