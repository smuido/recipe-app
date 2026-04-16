import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { BottomBar } from './src/componenets/bottom-bar';
import { QUICK_FILTERS } from './src/data/mockRecipes';
import { CreateRecipeScreen } from './src/screens/create-recipe';
import { RecipePage } from './src/screens/recipe-page';
import { MyRecipesScreen } from './src/screens/my-recipes';
import { MyRecipeDetailScreen } from './src/screens/my-recipe-detail';
import { PantryScreen } from './src/screens/pantry';
import { ProfileScreen } from './src/screens/profile';
import { MealPlannerScreen } from './src/screens/planner';
import { loadRecipeSections } from './src/services/recipes';

const firstName = 'Sam';

const FAVORITE_TONE_PALETTE = ['#00b3ff', '#7c83ff', '#ff7a59', '#34d399', '#b8ff3b'];
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEASURE_WORDS = new Set([
  'cup', 'cups', 'tbsp', 'tbsps', 'tablespoon', 'tablespoons', 'tsp', 'tsps', 'teaspoon', 'teaspoons',
  'oz', 'ounce', 'ounces', 'lb', 'lbs', 'pound', 'pounds', 'g', 'kg', 'ml', 'l', 'clove', 'cloves',
  'slice', 'slices', 'can', 'cans', 'pack', 'packs', 'pinch', 'dash', 'small', 'medium', 'large',
]);

function generateInviteCode() {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part = () => Array.from({ length: 4 }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
  return `${part()}-${part()}`;
}

function buildRecipeDetails(recipe) {
  const prepTimeFromMeta = Number.parseInt(String(recipe.meta ?? '').replace(/[^0-9]/g, ''), 10);
  const prepTime = Number.isFinite(prepTimeFromMeta) ? prepTimeFromMeta : 15;

  return {
    id: recipe.id ?? recipe.title,
    title: recipe.title,
    image: recipe.image ?? 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80',
    tags: Array.isArray(recipe.tags) && recipe.tags.length > 0 ? recipe.tags : ['Comfort', 'Dinner'],
    prepTime,
    cookTime: recipe.cookTime ?? Math.max(10, prepTime + 10),
    ingredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
      ? recipe.ingredients
      : ['2 tbsp olive oil', '2 cloves garlic', 'Salt and pepper to taste'],
    steps: Array.isArray(recipe.steps) && recipe.steps.length > 0
      ? recipe.steps
      : ['Prep your ingredients.', 'Cook until aromatic and tender.', 'Taste, adjust seasoning, and serve warm.'],
  };
}

function buildCreatedRecipe(input, index, ownerName) {
  const tone = FAVORITE_TONE_PALETTE[index % FAVORITE_TONE_PALETTE.length];
  const safeDescription = input.description || 'A fresh recipe from your own kitchen.';

  return {
    id: `user-${Date.now()}-${index}`,
    title: input.title,
    meta: `${input.prepMinutes} min`,
    accent: safeDescription,
    tone,
    prepTime: input.prepMinutes,
    cookTime: Math.max(10, input.prepMinutes + 8),
    tags: ['Homemade', 'Shared'],
    ingredients: ['Ingredient list coming soon'],
    steps: ['Step details coming soon'],
    createdBy: ownerName,
  };
}

function normalizeSavedRecipe(recipe, index, ownerName) {
  const parsedMinutes = Number.parseInt(String(recipe.meta ?? '').replace(/[^0-9]/g, ''), 10);
  const prepMinutes = Number.isFinite(parsedMinutes) ? parsedMinutes : 20;

  return {
    id: recipe.id ?? `saved-${String(recipe.title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: recipe.title ?? 'Untitled recipe',
    meta: recipe.meta ?? `${prepMinutes} min`,
    accent: recipe.accent ?? 'Saved from Discover',
    tone: recipe.tone ?? FAVORITE_TONE_PALETTE[index % FAVORITE_TONE_PALETTE.length],
    prepTime: recipe.prepTime ?? prepMinutes,
    cookTime: recipe.cookTime ?? Math.max(10, prepMinutes + 8),
    tags: Array.isArray(recipe.tags) && recipe.tags.length > 0 ? recipe.tags : ['Saved'],
    ingredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
      ? recipe.ingredients
      : ['Ingredient list coming soon'],
    steps: Array.isArray(recipe.steps) && recipe.steps.length > 0
      ? recipe.steps
      : ['Step details coming soon'],
    createdBy: recipe.createdBy ?? ownerName,
  };
}

function normalizeIngredientName(rawIngredient) {
  if (!rawIngredient) {
    return '';
  }

  const beforeComma = String(rawIngredient).toLowerCase().split(',')[0];
  const cleaned = beforeComma
    .replace(/\([^)]*\)/g, '')
    .replace(/^[\d\s./-]+/, '')
    .replace(/\b(of|to|taste)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ').filter(Boolean);
  while (words.length > 0 && MEASURE_WORDS.has(words[0])) {
    words.shift();
  }

  return words.join(' ').trim();
}

function buildWeeklyPlan() {
  return DAY_ORDER.reduce((result, day) => {
    result[day] = [];
    return result;
  }, {});
}

function RecipeSection({ title, subtitle, recipes, onRecipePress, onSaveForLater }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
      >
        {recipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id ?? recipe.title}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => onRecipePress(recipe)}
          >
            <View style={[styles.cardGlow, { backgroundColor: recipe.tone }]} />
            <Text style={styles.cardMeta}>{recipe.meta}</Text>
            <Text style={styles.cardTitle}>{recipe.title}</Text>
            <Text style={styles.cardAccent}>{recipe.accent}</Text>
            <TouchableOpacity
              style={styles.cardPill}
              activeOpacity={0.9}
              onPress={(event) => {
                event.stopPropagation();
                onSaveForLater(recipe);
              }}
            >
              <Text style={styles.cardPillText}>Save for later</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function App() {
  const [sections, setSections] = useState([]);
  const [dataSource, setDataSource] = useState('mock');
  const [sourceReason, setSourceReason] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedMyRecipe, setSelectedMyRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [plannedMealsByDay, setPlannedMealsByDay] = useState(() => buildWeeklyPlan());
  const [householdMembers, setHouseholdMembers] = useState(['Sam']);
  const [householdInviteCode, setHouseholdInviteCode] = useState(() => generateInviteCode());
  const [profile, setProfile] = useState({
    name: 'Sam',
    bio: '',
    photoUrl: '',
    favoriteRecipeId: null,
    householdName: 'Maple Street',
    isHouseholdOwner: true,
  });

  const fetchSections = useCallback(async () => {
    setIsLoading(true);

    const result = await loadRecipeSections();

    setSections(result.sections);
    setDataSource(result.source);
    setSourceReason(result.reason);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleAddRecipe = useCallback((input) => {
    setCreatedRecipes((currentRecipes) => {
      const nextRecipe = buildCreatedRecipe(input, currentRecipes.length, profile.name || 'Household member');
      return [nextRecipe, ...currentRecipes];
    });
    setActiveTab('myRecipes');
  }, [profile.name]);

  const handleSaveRecipeForLater = useCallback((recipe) => {
    setCreatedRecipes((currentRecipes) => {
      const normalized = normalizeSavedRecipe(recipe, currentRecipes.length, profile.name || 'Household member');
      const alreadySaved = currentRecipes.some((item) => item.id === normalized.id || item.title === normalized.title);

      if (alreadySaved) {
        return currentRecipes;
      }

      return [normalized, ...currentRecipes];
    });
  }, [profile.name]);

  const handleProfileChange = useCallback((nextValues) => {
    setProfile((current) => ({
      ...current,
      name: nextValues.name,
      bio: nextValues.bio,
      photoUrl: nextValues.photoUrl,
      householdName: current.isHouseholdOwner ? nextValues.householdName : current.householdName,
    }));

    setHouseholdMembers((currentMembers) => {
      if (currentMembers.length === 0) {
        return [nextValues.name];
      }

      return [nextValues.name, ...currentMembers.slice(1)];
    });
  }, []);

  const handleAcceptHouseholdInvite = useCallback((inviteCode, inviteeName) => {
    const cleanCode = String(inviteCode).trim().toUpperCase();
    const cleanName = String(inviteeName).trim();

    if (!cleanName) {
      return { ok: false, message: 'Add a name before accepting the invite.' };
    }

    if (cleanCode !== householdInviteCode) {
      return { ok: false, message: 'That invite code is not valid for this household.' };
    }

    let added = false;
    setHouseholdMembers((currentMembers) => {
      if (currentMembers.some((member) => member.toLowerCase() === cleanName.toLowerCase())) {
        return currentMembers;
      }

      added = true;
      return [...currentMembers, cleanName];
    });

    if (!added) {
      return { ok: false, message: `${cleanName} is already in this household.` };
    }

    return { ok: true, message: `${cleanName} joined ${profile.householdName}.` };
  }, [householdInviteCode, profile.householdName]);

  const handleRegenerateInviteCode = useCallback(() => {
    setHouseholdInviteCode(generateInviteCode());
  }, []);

  const handleFavoriteRecipeChange = useCallback((recipeId) => {
    setProfile((current) => ({
      ...current,
      favoriteRecipeId: recipeId,
    }));
  }, []);

  const handleAddMealToDay = useCallback((day, recipeId, plannedBy) => {
    setPlannedMealsByDay((currentPlan) => {
      const currentDayMeals = currentPlan[day] ?? [];
      if (currentDayMeals.some((entry) => entry.recipeId === recipeId)) {
        return currentPlan;
      }

      return {
        ...currentPlan,
        [day]: [...currentDayMeals, { recipeId, plannedBy }],
      };
    });
  }, []);

  const handleRemoveMealFromDay = useCallback((day, recipeId) => {
    setPlannedMealsByDay((currentPlan) => ({
      ...currentPlan,
      [day]: (currentPlan[day] ?? []).filter((entry) => entry.recipeId !== recipeId),
    }));
  }, []);

  useEffect(() => {
    if (!profile.favoriteRecipeId) {
      return;
    }

    const stillExists = createdRecipes.some((recipe) => recipe.id === profile.favoriteRecipeId);

    if (!stillExists) {
      setProfile((current) => ({ ...current, favoriteRecipeId: null }));
    }
  }, [createdRecipes, profile.favoriteRecipeId]);

  useEffect(() => {
    const validRecipeIds = new Set(createdRecipes.map((recipe) => recipe.id));

    setPlannedMealsByDay((currentPlan) => {
      let changed = false;
      const nextPlan = {};

      DAY_ORDER.forEach((day) => {
        const filteredEntries = (currentPlan[day] ?? []).filter((entry) => validRecipeIds.has(entry.recipeId));
        if (filteredEntries.length !== (currentPlan[day] ?? []).length) {
          changed = true;
        }
        nextPlan[day] = filteredEntries;
      });

      return changed ? nextPlan : currentPlan;
    });
  }, [createdRecipes]);

  const plannedRecipesByDay = useMemo(() => {
    const recipesById = new Map(createdRecipes.map((recipe) => [recipe.id, recipe]));

    return DAY_ORDER.reduce((result, day) => {
      result[day] = (plannedMealsByDay[day] ?? [])
        .map((entry) => {
          const recipe = recipesById.get(entry.recipeId);
          if (!recipe) {
            return null;
          }

          return {
            ...recipe,
            plannedBy: entry.plannedBy,
          };
        })
        .filter(Boolean);
      return result;
    }, {});
  }, [createdRecipes, plannedMealsByDay]);

  const shoppingItems = useMemo(() => {
    const ingredientCounts = new Map();

    DAY_ORDER.forEach((day) => {
      (plannedRecipesByDay[day] ?? []).forEach((recipe) => {
        const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
        ingredients.forEach((ingredient) => {
          const normalized = normalizeIngredientName(ingredient);
          if (!normalized) {
            return;
          }
          ingredientCounts.set(normalized, (ingredientCounts.get(normalized) ?? 0) + 1);
        });
      });
    });

    return Array.from(ingredientCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [plannedRecipesByDay]);

  const renderHomeScreen = () => (
    <>
      <StatusBar style="dark" />
      <View style={styles.backgroundOrbOne} />
      <View style={styles.backgroundOrbTwo} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Tonight&apos;s menu</Text>
          <Text style={styles.heroTitle}>what are we cooking today, {firstName}?</Text>
          <Text style={styles.heroCopy}>
            Start with something rich, bright, or quick. This home screen now includes a
            Supabase-ready data layer with local fallback while your backend grows.
          </Text>

          <View style={styles.badgeRow}>
            <Text style={styles.sourceBadgeLabel}>Data source</Text>
            <View style={[styles.sourceBadge, dataSource === 'supabase' ? styles.sourceBadgeLive : styles.sourceBadgeMock]}>
              <Text style={styles.sourceBadgeText}>{dataSource === 'supabase' ? 'Supabase' : 'Mock fallback'}</Text>
            </View>
          </View>

          {sourceReason ? <Text style={styles.sourceReasonText}>{sourceReason}</Text> : null}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {QUICK_FILTERS.map((filter) => (
              <View key={filter} style={styles.filterChip}>
                <Text style={styles.filterChipText}>{filter}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.refreshButton} onPress={fetchSections} activeOpacity={0.85}>
            <Text style={styles.refreshButtonText}>Refresh recipes</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#111111" />
            <Text style={styles.loadingText}>Loading recipe feed...</Text>
          </View>
        ) : null}

        {!isLoading && sections.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No recipes yet</Text>
            <Text style={styles.emptyBody}>Add rows in Supabase or keep using local mock recipes while building.</Text>
          </View>
        ) : null}

        {!isLoading && sections.map((section) => (
          <RecipeSection
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            recipes={section.recipes}
            onRecipePress={(recipe) => setSelectedRecipe(buildRecipeDetails(recipe))}
            onSaveForLater={handleSaveRecipeForLater}
          />
        ))}
      </ScrollView>
    </>
  );

  let content = null;

  if (activeTab === 'social') {
    content = (
      <MealPlannerScreen
        dayOrder={DAY_ORDER}
        householdName={profile.householdName}
        householdMembers={householdMembers}
        recipes={createdRecipes}
        plannedMealsByDay={plannedRecipesByDay}
        onAddMealToDay={handleAddMealToDay}
        onRemoveMealFromDay={handleRemoveMealFromDay}
      />
    );
  } else if (activeTab === 'myRecipes') {
    content = selectedMyRecipe ? (
      <MyRecipeDetailScreen
        recipe={selectedMyRecipe}
        onBack={() => setSelectedMyRecipe(null)}
      />
    ) : (
      <MyRecipesScreen
        recipes={createdRecipes}
        favoriteRecipeId={profile.favoriteRecipeId}
        onRecipePress={(recipe) => setSelectedMyRecipe(recipe)}
      />
    );
  } else if (activeTab === 'createRecipe') {
    content = <CreateRecipeScreen onAddRecipe={handleAddRecipe} />;
  } else if (activeTab === 'pantry') {
    content = <PantryScreen shoppingItems={shoppingItems} />;
  } else if (activeTab === 'profile') {
    content = (
      <ProfileScreen
        profile={profile}
        householdMembers={householdMembers}
        householdInviteCode={householdInviteCode}
        recipes={createdRecipes}
        onProfileChange={handleProfileChange}
        onAcceptHouseholdInvite={handleAcceptHouseholdInvite}
        onRegenerateInviteCode={handleRegenerateInviteCode}
        onFavoriteRecipeChange={handleFavoriteRecipeChange}
      />
    );
  } else {
    content = renderHomeScreen();
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.appShell} edges={['top', 'left', 'right']}>
        <View style={styles.mainArea}>{content}</View>

      <BottomBar
        activeTab={activeTab}
        onTabPress={(tab) => {
          setSelectedMyRecipe(null);
          setActiveTab(tab);
        }}
        onCenterActionPress={(tab) => {
          setSelectedMyRecipe(null);
          setActiveTab(tab);
        }}
      />

        <Modal
          visible={Boolean(selectedRecipe)}
          animationType="fade"
          transparent
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={() => setSelectedRecipe(null)}
        >
          {selectedRecipe ? (
            <RecipePage
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
              onSaveForLater={() => handleSaveRecipeForLater(selectedRecipe)}
            />
          ) : null}
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainArea: {
    flex: 1,
    paddingBottom: 94,
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingTop: 72,
    paddingBottom: 48,
    gap: 28,
  },
  backgroundOrbOne: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 210,
    height: 210,
    borderRadius: 999,
    backgroundColor: '#d8f2ff',
    opacity: 0.9,
  },
  backgroundOrbTwo: {
    position: 'absolute',
    top: 240,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: '#e8ecff',
    opacity: 0.85,
  },
  heroCard: {
    marginHorizontal: 20,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  heroEyebrow: {
    marginBottom: 10,
    color: '#0077b6',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#111111',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  heroCopy: {
    marginTop: 14,
    color: '#5f6368',
    fontSize: 16,
    lineHeight: 24,
  },
  filterRow: {
    paddingTop: 18,
    paddingRight: 8,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#f6f7f9',
    borderWidth: 1,
    borderColor: '#e6e7eb',
  },
  filterChipText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
  badgeRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceBadgeLabel: {
    color: '#5f6368',
    fontSize: 13,
    fontWeight: '600',
  },
  sourceBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sourceBadgeMock: {
    backgroundColor: '#f3f4f6',
  },
  sourceBadgeLive: {
    backgroundColor: '#e6f7ff',
  },
  sourceBadgeText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sourceReasonText: {
    marginTop: 10,
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
  },
  refreshButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#111111',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    gap: 6,
  },
  sectionTitle: {
    color: '#111111',
    fontSize: 24,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
  },
  cardsRow: {
    paddingLeft: 20,
    paddingRight: 6,
    gap: 14,
  },
  card: {
    width: 220,
    minHeight: 220,
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e7eb',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -28,
    right: -24,
    width: 110,
    height: 110,
    borderRadius: 999,
    opacity: 0.24,
  },
  cardMeta: {
    marginBottom: 28,
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: '#111111',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  cardAccent: {
    marginTop: 10,
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 22,
  },
  cardPill: {
    marginTop: 'auto',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#111111',
  },
  cardPillText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingWrap: {
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 30,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyWrap: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e6e7eb',
    gap: 6,
  },
  emptyTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyBody: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 21,
  },
});
