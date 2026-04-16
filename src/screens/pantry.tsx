import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ShoppingItem {
  name: string;
  count: number;
}

interface PantryScreenProps {
  shoppingItems: ShoppingItem[];
}

export function PantryScreen({ shoppingItems }: PantryScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Pantry</Text>
      <Text style={styles.title}>Weekly shopping list</Text>
      <Text style={styles.body}>Generated from the ingredients in your planned meals for the week.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Need to buy</Text>
        {shoppingItems.length === 0 ? (
          <Text style={styles.emptyText}>Plan meals in the Planner tab to build your shopping list.</Text>
        ) : (
          shoppingItems.map((item) => (
            <View key={item.name} style={styles.itemRow}>
              <Text style={styles.itemName}>• {item.name}</Text>
              <Text style={styles.itemCount}>x{item.count}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 14,
  },
  cardTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  itemRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemName: {
    flex: 1,
    color: '#111111',
    fontSize: 14,
    fontWeight: '600',
  },
  itemCount: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
  },
});
