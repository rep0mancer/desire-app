import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';
import { showToast } from '@utils/toastService';

/**
 * Summary information about a recipe returned from the Spoonacular search API.
 */
export interface RecipeSummary {
  id: number;
  title: string;
  image: string;
}

/**
 * Full recipe details returned from Spoonacular. Only fields relevant to
 * Desire are included.
 */
export interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  /** List of ingredients required for the recipe. */
  extendedIngredients: Array<{ id: number; name: string; amount: number; unit: string }>;
}

// Create a configured Axios instance. The API key is provided via expo config.
const api: AxiosInstance = axios.create({
  baseURL: 'https://api.spoonacular.com/',
  // Note: The API key is sent as a query parameter rather than a header because
  // the Spoonacular API does not honour custom headers for authentication.
  params: {
    apiKey: Constants?.expoConfig?.extra?.spoonacularApiKey,
  },
});

/**
 * Search Spoonacular for recipes matching a free–form query.
 *
 * @param query - The text the user has input describing their desire.
 * @returns A list of recipe summaries matching the query.
 */
export async function searchRecipes(query: string): Promise<RecipeSummary[]> {
  try {
    const response = await api.get('recipes/complexSearch', {
      params: {
        query,
        number: 10,
      },
    });
    return response.data.results as RecipeSummary[];
  } catch (error) {
    showToast('Failed to search for recipes');
    throw new Error('Failed to search for recipes');
  }
}

/**
 * Retrieve full details for a specific recipe.
 *
 * @param id - The unique identifier for the recipe.
 * @returns A `RecipeDetails` object including ingredient information.
 */
export async function getRecipeDetails(id: number): Promise<RecipeDetails> {
  try {
    const response = await api.get(`recipes/${id}/information`, {
      params: {
        includeNutrition: false,
      },
    });
    return response.data as RecipeDetails;
  } catch (error) {
    showToast('Failed to fetch recipe details');
    throw new Error('Failed to fetch recipe details');
  }
}