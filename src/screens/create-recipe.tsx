import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface NewRecipeInput {
  title: string;
  description: string;
  prepMinutes: number;
}

interface CreateRecipeScreenProps {
  onAddRecipe: (recipe: NewRecipeInput) => void;
}

export function CreateRecipeScreen({ onAddRecipe }: CreateRecipeScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepMinutesText, setPrepMinutesText] = useState('20');

  const handleCreateRecipe = () => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      Alert.alert('Recipe title needed', 'Add a title before creating your recipe.');
      return;
    }

    const parsedMinutes = Number.parseInt(prepMinutesText.replace(/[^0-9]/g, ''), 10);
    const prepMinutes = Number.isFinite(parsedMinutes) && parsedMinutes > 0 ? parsedMinutes : 20;

    onAddRecipe({
      title: cleanTitle,
      description: description.trim(),
      prepMinutes,
    });

    setTitle('');
    setDescription('');
    setPrepMinutesText('20');
    Alert.alert('Recipe created', 'Your recipe was added to My Recipes.');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>Create</Text>
      <Text style={styles.title}>Add a recipe</Text>
      <Text style={styles.body}>Once saved, this recipe can be shared and selected as your favorite in your profile.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Recipe title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Spicy Lemon Pasta"
          placeholderTextColor="#ad9586"
          style={styles.input}
        />

        <Text style={styles.label}>Short description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What makes it special?"
          placeholderTextColor="#ad9586"
          style={[styles.input, styles.textArea]}
          multiline
        />

        <Text style={styles.label}>Prep time (minutes)</Text>
        <TextInput
          value={prepMinutesText}
          onChangeText={setPrepMinutesText}
          keyboardType="numeric"
          placeholder="20"
          placeholderTextColor="#ad9586"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={handleCreateRecipe}>
          <Text style={styles.buttonText}>Save recipe</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#fff',
    color: '#111111',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: '#111111',
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
