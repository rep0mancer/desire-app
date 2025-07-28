import { act } from '@testing-library/react-native';
import { useUserStore } from '../userStore';

describe('userStore', () => {
  it('updates onboarding step', async () => {
    await act(async () => {
      await useUserStore.getState().actions.setOnboardingStep('archetype_selected');
    });
    expect(useUserStore.getState().onboardingStep).toBe('archetype_selected');
  });
});
