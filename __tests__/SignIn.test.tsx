import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SignIn } from '../src/screens/SignIn';

test('renders sign in button', () => {
  const { getByText } = render(<SignIn />);
  const button = getByText('Sign In');
  expect(button).toBeTruthy();
  fireEvent.press(button);
});
