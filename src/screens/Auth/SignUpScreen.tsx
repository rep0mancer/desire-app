import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/AppNavigator';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';
import { getAuthInstance } from '@config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@components/common/Toast';
import { ROUTES } from '@constants/navigation';

/**
 * Screen allowing a new user to create an account. Presents email and
 * password inputs along with a sign up button. Upon successful sign up
 * the authentication listener will redirect to the appropriate flow.
 */
export type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.SIGN_UP>;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast().showToast;

  const handleSignUp = async () => {
    if (!email || !password) {
      showToast('Please enter email and password');
      return;
    }
    setIsLoading(true);
    try {
      const auth = getAuthInstance();
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      // User is created; onAuthStateChanged will handle state hydration
    } catch (error) {
      showToast('Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <Button label={isLoading ? 'Signing Up...' : 'Sign Up'} onPress={handleSignUp} style={styles.button} />
      <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

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