import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

/**
 * Initialise and export the Firestore instance used across the app.
 *
 * Firebase configuration is read from the Expo config (extra values in
 * `app.json`). If you have not provided these values, Firebase will fail
 * initialisation. See the project README for instructions on adding your
 * Firebase credentials via expo-constants.
 */
export function initialiseFirestore() {
  if (!getApps().length) {
    const firebaseConfig = {
      apiKey: Constants?.expoConfig?.extra?.firebaseApiKey,
      authDomain: Constants?.expoConfig?.extra?.firebaseAuthDomain,
      projectId: Constants?.expoConfig?.extra?.firebaseProjectId,
      storageBucket: Constants?.expoConfig?.extra?.firebaseStorageBucket,
      messagingSenderId: Constants?.expoConfig?.extra?.firebaseMessagingSenderId,
      appId: Constants?.expoConfig?.extra?.firebaseAppId,
    } as const;
    initializeApp(firebaseConfig);
  }
}

/**
 * Get the Firestore instance. `initialiseFirestore` **must** be called before
 * invoking this function to ensure Firebase has been initialised.
 */
export function getDatabase() {
  return getFirestore();
}