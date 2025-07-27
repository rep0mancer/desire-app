import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@navigation/AppNavigator';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { searchRecipes, RecipeSummary, getRecipeDetails } from '@api/spoonacular';
import { RecipeCard } from '@components/common/RecipeCard';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';
import { useToast } from '@components/common/Toast';

type Props = NativeStackScreenProps<MainStackParamList, 'Results'>;

/**
 * Screen that presents search results fetched from the Spoonacular API. It
 * displays the user's query as a headline and a vertical list of recipe
 * cards. Selecting a card fetches full details and transitions to the
 * shopping list.
 */
const ResultsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { query } = route.params;
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast().showToast;

  useEffect(() => {
    const fetch = async () => {
      try {
        const results = await searchRecipes(query);
        setRecipes(results);
      } catch (error) {
        showToast('Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [query, showToast]);

  const handleSelect = async (recipe: RecipeSummary) => {
    try {
      const details = await getRecipeDetails(recipe.id);
      const ingredientNames = details.extendedIngredients.map((ing) => ing.name);
      navigation.navigate('ShoppingList', { title: recipe.title, ingredients: ingredientNames });
    } catch (error) {
      showToast('Failed to fetch recipe details');
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>{query}</Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primaryText} style={styles.loading} />
      ) : (
        <ScrollView contentContainerStyle={styles.resultsList}>
          {recipes.map((recipe: RecipeSummary) => (
            <RecipeCard
              key={recipe.id.toString()}
              recipe={recipe}
              onPress={() => handleSelect(recipe)}
            />
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

export default ResultsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: sizes.h2,
    color: colors.primaryText,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  loading: {
    marginTop: 32,
  },
  resultsList: {
    paddingBottom: 24,
  },
});