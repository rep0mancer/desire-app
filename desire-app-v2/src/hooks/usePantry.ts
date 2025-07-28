import { useMemo } from 'react';
import { usePantryStore } from '@store/pantryStore';

/**
 * Compare a list of recipe ingredients with the items currently stored in
 * the pantry. The result is split into two arrays: those the user already
 * possesses (have) and those they still need to purchase (need).
 *
 * @param ingredients - A list of ingredient names from a recipe.
 * @returns An object containing `have` and `need` arrays.
 */
export function usePantryComparison(ingredients: string[]) {
  const pantry = usePantryStore((state) => state.items);
  return useMemo(() => {
    const have: string[] = [];
    const need: string[] = [];
    ingredients.forEach((item) => {
      const lower = item.toLowerCase();
      if (pantry.includes(lower)) {
        have.push(item);
      } else {
        need.push(item);
      }
    });
    return { have, need };
  }, [ingredients, pantry]);
}