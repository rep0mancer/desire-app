import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { RecipeSummary } from '@api/spoonacular';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';

/**
 * Props for the RecipeCard component.
 */
interface RecipeCardProps {
  /** Data describing the recipe (id, title and image). */
  recipe: RecipeSummary;
  /** Callback invoked when the card is pressed. */
  onPress: () => void;
  /** Optional styling overrides for the outer card container. */
  style?: ViewStyle;
}

/**
 * A full–bleed card displaying a recipe image with its title overlaid.
 * Clicking the card triggers the provided callback. The brutalist style is
 * achieved with bold typography and stark overlays.
 */
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress, style }) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <ImageBackground source={{ uri: recipe.image }} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.overlay}>
          <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 4,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 12,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  title: {
    color: colors.background,
    fontFamily: fonts.heading,
    fontSize: sizes.h3,
  },
});