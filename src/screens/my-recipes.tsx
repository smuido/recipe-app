import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UserRecipe {
  id: string;
  title: string;
  meta: string;
  accent: string;
  prepTime?: number;
  cookTime?: number;
  ingredients?: string[];
  steps?: string[];
  tags?: string[];
  image?: string;
}

interface MyRecipesScreenProps {
  recipes: UserRecipe[];
  favoriteRecipeId: string | null;
  onRecipePress: (recipe: UserRecipe) => void;
}

export function MyRecipesScreen({ recipes, favoriteRecipeId, onRecipePress }: MyRecipesScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>My Recipes</Text>
      <Text style={styles.title}>Your recipe collection</Text>
      <Text style={styles.body}>Recipes you create show up here and can be set as your profile favorite.</Text>

      {recipes.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No recipes yet</Text>
          <Text style={styles.emptyBody}>Open Create and add your first recipe to get started.</Text>
        </View>
      ) : (
        recipes.map((recipe) => {
          const isFavorite = recipe.id === favoriteRecipeId;

          return (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              activeOpacity={0.9}
              onPress={() => onRecipePress(recipe)}
            >
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                {isFavorite ? <Text style={styles.favoriteBadge}>Favorite</Text> : null}
              </View>
              <Text style={styles.recipeMeta}>{recipe.meta}</Text>
              <Text style={styles.recipeAccent}>{recipe.accent}</Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 120,
  },
  eyebrow: {
    color: '#0077b6',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  title: {
    color: '#111111',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
  },
  body: {
    color: '#4b5563',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  emptyTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyBody: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
  recipeCard: {
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 14,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  recipeTitle: {
    flex: 1,
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
  },
  favoriteBadge: {
    color: '#ffffff',
    backgroundColor: '#00a3e6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  recipeMeta: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recipeAccent: {
    marginTop: 8,
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
});
