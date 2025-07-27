import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';

/**
 * Context exposing a method to trigger toast messages. Consumers can call
 * `showToast` with a message to display a transient notification at the
 * bottom of the screen.
 */
interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Hook to access the toast context from within functional components.
 * @throws If used outside of a `ToastProvider`.
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/**
 * Provider component that renders a toast container and supplies the
 * `showToast` function to descendants. Include this at the root of your
 * application tree.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  useEffect(() => {
    if (message) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      // Fade out after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setMessage(null));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, opacity]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <Animated.View style={[styles.toastContainer, { opacity }]}> 
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    padding: 16,
    backgroundColor: colors.primaryText,
    borderRadius: 4,
    alignItems: 'center',
  },
  toastText: {
    color: colors.background,
    fontFamily: fonts.body,
    fontSize: sizes.body,
    textAlign: 'center',
  },
});