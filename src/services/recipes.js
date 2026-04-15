import { MOCK_RECIPE_SECTIONS } from '../data/mockRecipes';
import { hasSupabaseEnv, supabase } from '../lib/supabase';

function normalizeRecipe(recipe = {}) {
  return {
    title: recipe.title ?? 'Untitled recipe',
    meta: recipe.meta ?? 'No duration',
    accent: recipe.accent ?? 'No description yet',
    tone: recipe.tone ?? '#c4873c',
  };
}

function normalizeSection(section = {}) {
  const recipes = Array.isArray(section.recipes) ? section.recipes : [];

  return {
    title: section.title ?? 'Recipes',
    subtitle: section.subtitle ?? '',
    recipes: recipes.map(normalizeRecipe),
  };
}

function normalizeSections(sections) {
  return sections.map(normalizeSection).filter((section) => section.recipes.length > 0);
}

export async function loadRecipeSections() {
  if (!hasSupabaseEnv || !supabase) {
    return {
      sections: MOCK_RECIPE_SECTIONS,
      source: 'mock',
      reason: 'Supabase environment variables are not configured.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('recipe_sections')
      .select('title, subtitle, sort_order, recipes (title, meta, accent, tone, sort_order)')
      .order('sort_order', { ascending: true })
      .order('sort_order', { referencedTable: 'recipes', ascending: true });

    if (error) {
      throw error;
    }

    const sections = normalizeSections(Array.isArray(data) ? data : []);

    if (sections.length === 0) {
      return {
        sections: MOCK_RECIPE_SECTIONS,
        source: 'mock',
        reason: 'Supabase returned no recipe rows.',
      };
    }

    return {
      sections,
      source: 'supabase',
      reason: null,
    };
  } catch (error) {
    return {
      sections: MOCK_RECIPE_SECTIONS,
      source: 'mock',
      reason: error?.message ?? 'Supabase query failed.',
    };
  }
}
