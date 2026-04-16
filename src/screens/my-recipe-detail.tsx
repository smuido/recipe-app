import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Recipe {
  id: string;
  title: string;
  image?: string;
  tags?: string[];
  prepTime?: number;
  cookTime?: number;
  ingredients?: string[];
  steps?: string[];
}

interface MyRecipeDetailScreenProps {
  recipe: Recipe;
  onBack: () => void;
}

export function MyRecipeDetailScreen({ recipe, onBack }: MyRecipeDetailScreenProps) {
  const tags = Array.isArray(recipe.tags) && recipe.tags.length > 0 ? recipe.tags : ['Saved'];
  const ingredients = Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
    ? recipe.ingredients
    : ['Ingredient details were not added yet.'];
  const steps = Array.isArray(recipe.steps) && recipe.steps.length > 0
    ? recipe.steps
    : ['Step details were not added yet.'];

  return (
    <SafeAreaView style={styles.screen}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.85}>
        <Ionicons name="arrow-back" size={22} color="#111111" />
        <Text style={styles.backLabel}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={{
            uri: recipe.image ?? 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80',
          }}
          style={styles.image}
        />

        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaPill}>Prep {recipe.prepTime ?? 20}m</Text>
          <Text style={styles.metaPill}>Cook {recipe.cookTime ?? 30}m</Text>
        </View>

        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <Text key={`${ingredient}-${index}`} style={styles.itemText}>• {ingredient}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Steps</Text>
          {steps.map((step, index) => (
            <Text key={`${step}-${index}`} style={styles.itemText}>{index + 1}. {step}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 22,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  backLabel: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 110,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 18,
    marginBottom: 14,
  },
  title: {
    color: '#111111',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  metaPill: {
    backgroundColor: '#e6f7ff',
    color: '#0077b6',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tagRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 14,
  },
  sectionTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  itemText: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
});
