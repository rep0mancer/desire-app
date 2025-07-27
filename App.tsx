import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { AppNavigator } from '@navigation/AppNavigator';
import { ToastProvider } from '@components/common/Toast';
import { initialiseFirestore } from '@config/firebase';
import { generateId } from '@utils/helpers';
import { useUserStore } from '@store/userStore';

/**
 * The root component of the Desire application. It loads custom fonts,
 * initialises Firebase, generates a user ID if necessary and mounts the
 * navigation and toast providers. The status bar is set to dark content
 * to match the minimalist white background.
 */
const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Bold': require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  });
  const userId = useUserStore((state) => state.userId);
  const setUserId = useUserStore((state) => state.actions.setUserId);

  useEffect(() => {
    // Initialise Firebase
    initialiseFirestore();
    // Generate and persist a pseudo ID for anonymous users
    if (!userId) {
      const id = generateId();
      setUserId(id);
    }
  }, [userId, setUserId]);

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