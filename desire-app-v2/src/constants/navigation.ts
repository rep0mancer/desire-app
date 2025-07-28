export const ROUTES = {
  WELCOME: 'Welcome',
  ARCHETYPE: 'Archetype',
  CHECKLIST: 'Checklist',
  ADVANCED_SETUP: 'AdvancedSetup',
  HOME: 'Home',
  RESULTS: 'Results',
  SHOPPING_LIST: 'ShoppingList',
  PANTRY_MANAGEMENT: 'PantryManagement',
  LOGIN: 'Login',
  SIGN_UP: 'SignUp',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
