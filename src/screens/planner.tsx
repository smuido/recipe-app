import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UserRecipe {
  id: string;
  title: string;
  meta?: string;
  accent?: string;
  plannedBy?: string;
  createdBy?: string;
}

interface MealPlannerScreenProps {
  dayOrder: string[];
  householdName: string;
  householdMembers: string[];
  recipes: UserRecipe[];
  plannedMealsByDay: Record<string, UserRecipe[]>;
  onAddMealToDay: (day: string, recipeId: string, plannedBy: string) => void;
  onRemoveMealFromDay: (day: string, recipeId: string) => void;
}

export function MealPlannerScreen({
  dayOrder,
  householdName,
  householdMembers,
  recipes,
  plannedMealsByDay,
  onAddMealToDay,
  onRemoveMealFromDay,
}: MealPlannerScreenProps) {
  const [selectedDayForAdd, setSelectedDayForAdd] = useState<string | null>(null);
  const [selectedPlannerByDay, setSelectedPlannerByDay] = useState<Record<string, string>>({});

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Planner</Text>
      <Text style={styles.title}>Plan your meals</Text>
      <Text style={styles.body}>Add recipes to each day of the week for {householdName}, then check Pantry for your shopping list.</Text>

      {dayOrder.map((day) => {
        const plannedMeals = plannedMealsByDay[day] ?? [];

        return (
          <View key={day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>{day}</Text>
              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.85}
                onPress={() => setSelectedDayForAdd((current) => (current === day ? null : day))}
              >
                <Text style={styles.addButtonText}>{selectedDayForAdd === day ? 'Close' : 'Add meal'}</Text>
              </TouchableOpacity>
            </View>

            {plannedMeals.length === 0 ? (
              <Text style={styles.emptyText}>No meals planned yet.</Text>
            ) : (
              plannedMeals.map((meal) => (
                <View key={`${day}-${meal.id}`} style={styles.mealRow}>
                  <View style={styles.mealTextWrap}>
                    <Text style={styles.mealTitle}>{meal.title}</Text>
                    {meal.meta ? <Text style={styles.mealMeta}>{meal.meta}</Text> : null}
                    {meal.plannedBy ? <Text style={styles.mealPlannedBy}>Planned by {meal.plannedBy}</Text> : null}
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    activeOpacity={0.85}
                    onPress={() => onRemoveMealFromDay(day, meal.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            {selectedDayForAdd === day ? (
              <View style={styles.chooserWrap}>
                <Text style={styles.chooserLabel}>Who is planning this meal?</Text>
                <View style={styles.memberRow}>
                  {householdMembers.map((member) => {
                    const isSelected = (selectedPlannerByDay[day] ?? householdMembers[0]) === member;

                    return (
                      <TouchableOpacity
                        key={`${day}-${member}`}
                        style={[styles.memberButton, isSelected ? styles.memberButtonActive : null]}
                        activeOpacity={0.85}
                        onPress={() => setSelectedPlannerByDay((current) => ({ ...current, [day]: member }))}
                      >
                        <Text style={[styles.memberButtonText, isSelected ? styles.memberButtonTextActive : null]}>{member}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {recipes.length === 0 ? (
                  <Text style={styles.emptyText}>Save or create recipes first, then add them to your plan.</Text>
                ) : (
                  recipes.map((recipe) => {
                    const isAlreadyPlanned = plannedMeals.some((planned) => planned.id === recipe.id);

                    return (
                      <TouchableOpacity
                        key={`pick-${day}-${recipe.id}`}
                        style={[styles.pickRow, isAlreadyPlanned ? styles.pickRowDisabled : null]}
                        activeOpacity={0.85}
                        disabled={isAlreadyPlanned}
                        onPress={() => onAddMealToDay(day, recipe.id, selectedPlannerByDay[day] ?? householdMembers[0])}
                      >
                        <View style={styles.mealTextWrap}>
                          <Text style={styles.pickTitle}>{recipe.title}</Text>
                          <Text style={styles.pickMeta}>{recipe.meta ?? 'Ready to plan'}</Text>
                          {recipe.createdBy ? <Text style={styles.pickOwner}>Shared by {recipe.createdBy}</Text> : null}
                        </View>
                        <Text style={styles.pickAction}>{isAlreadyPlanned ? 'Added' : 'Add'}</Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            ) : null}
          </View>
        );
      })}
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
    paddingTop: 20,
    paddingBottom: 120,
    gap: 14,
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
  },
  dayCard: {
    marginTop: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 14,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  dayTitle: {
    color: '#111111',
    fontSize: 20,
    fontWeight: '800',
  },
  addButton: {
    borderRadius: 999,
    backgroundColor: '#111111',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyText: {
    marginTop: 10,
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  chooserLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  memberRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  memberButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  memberButtonActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  memberButtonText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
  },
  memberButtonTextActive: {
    color: '#ffffff',
  },
  mealRow: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  mealTextWrap: {
    flex: 1,
  },
  mealTitle: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '700',
  },
  mealMeta: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
  },
  mealPlannedBy: {
    color: '#0077b6',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  removeButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#111111',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  removeButtonText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  chooserWrap: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    gap: 8,
  },
  pickRow: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  pickRowDisabled: {
    opacity: 0.6,
  },
  pickTitle: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
  pickMeta: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 3,
  },
  pickOwner: {
    color: '#0077b6',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  pickAction: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
