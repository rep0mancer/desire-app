import { signIn } from '../src/services/authService';

test('signIn is a function', () => {
  expect(typeof signIn).toBe('function');
});
