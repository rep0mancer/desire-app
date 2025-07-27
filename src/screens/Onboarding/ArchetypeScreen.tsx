import React from 'react';
import { View, StyleSheet, Text, ImageBackground, Dimensions, FlatList, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingStackParamList } from '@navigation/AppNavigator';
import { ScreenContainer } from '@components/layout/ScreenContainer';
import { colors } from '@constants/colors';
import { fonts, sizes } from '@constants/typography';

type Navigation = NativeStackNavigationProp<OnboardingStackParamList, 'Archetype'>;

/**
 * Definition of an archetype used for the lazy setup path. Each archetype has
 * a title, description, associated image and a list of suggested pantry
 * ingredients.
 */
interface Archetype {
  key: string;
  title: string;
  description: string;
  image: any;
  ingredients: string[];
}

const archetypes: Archetype[] = [
  {
    key: 'ascetic',
    title: 'The Ascetic',
    description: 'Keeps it simple with a handful of staples.',
    image: require('../../../assets/images/ascetic.png'),
    ingredients: ['rice', 'beans', 'salt', 'pepper', 'olive oil', 'flour'],
  },
  {
    key: 'foundation',
    title: 'The Foundation',
    description: 'Has the essentials covered.',
    image: require('../../../assets/images/foundation.png'),
    ingredients: ['flour', 'sugar', 'salt', 'olive oil', 'garlic', 'eggs'],
  },
  {
    key: 'baker',
    title: 'The Baker',
    description: 'Loves baking sweet and savoury treats.',
    image: require('../../../assets/images/baker.png'),
    ingredients: ['flour', 'sugar', 'yeast', 'butter', 'milk', 'eggs'],
  },
  {
    key: 'health',
    title: 'The Health-Conscious',
    description: 'Enjoys wholesome and nutritious meals.',
    image: require('../../../assets/images/health_conscious.png'),
    ingredients: ['quinoa', 'spinach', 'broccoli', 'chicken breast', 'olive oil', 'lentils'],
  },
];

/**
 * Screen that allows the user to select one of four archetypes. The selected
 * archetype determines the default set of pantry items for the lazy setup
 * path. Cards are presented horizontally and are fully tappable.
 */
const ArchetypeScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { width } = Dimensions.get('window');
  const cardWidth = width * 0.8;

  const renderItem = ({ item }: { item: Archetype }) => (
    <Pressable
      onPress={() => navigation.navigate('Checklist', { archetype: item.title, ingredients: item.ingredients })}
      style={[styles.card, { width: cardWidth }]}
    >
      <ImageBackground source={item.image} style={styles.image} imageStyle={{ borderRadius: 8 }}>
        <View style={styles.overlay}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.heading}>Select your archetype</Text>
      <FlatList
        data={archetypes}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 16}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (width - cardWidth) / 2 }}
      />
    </ScreenContainer>
  );
};

export default ArchetypeScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: sizes.h2,
    color: colors.primaryText,
    marginLeft: 24,
    marginBottom: 24,
  },
  card: {
    marginRight: 16,
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
  },
  cardTitle: {
    fontFamily: fonts.heading,
    fontSize: sizes.h3,
    color: colors.primaryText,
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: fonts.body,
    fontSize: sizes.body,
    color: colors.secondaryText,
  },
});