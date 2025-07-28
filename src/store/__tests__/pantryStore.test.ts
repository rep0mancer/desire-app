import { usePantryStore } from '../pantryStore';

describe('pantryStore', () => {
  it('adds and removes items', () => {
    const { addItem, removeItem, resetPantry } = usePantryStore.getState().actions;
    resetPantry();
    addItem('sugar');
    expect(usePantryStore.getState().items).toHaveProperty('sugar');
    removeItem('sugar');
    expect(usePantryStore.getState().items).not.toHaveProperty('sugar');
  });
});
