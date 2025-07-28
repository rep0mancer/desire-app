import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/AppNavigator';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';
import { getAuthInstance } from '@config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@components/common/Toast';

/**
 * Screen allowing an existing user to sign into their account. Presents
 * simple email and password inputs along with a sign in button. If
 * authentication succeeds, Firebase will handle navigation via the
 * `useAuth` hook in the AppNavigator.
 */
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast().showToast;

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please enter email and password');
      return;
    }
    setIsLoading(true);
    try {
      const auth = getAuthInstance();
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Successful sign in; auth listener will handle navigation
    } catch (error) {
      showToast('Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Input
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button label={isLoading ? 'Signing In...' : 'Sign In'} onPress={handleLogin} style={styles.button} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: sizes.h2,
    color: colors.primaryText,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  linkText: {
    fontFamily: fonts.body,
    fontSize: sizes.small,
    color: colors.primaryText,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});