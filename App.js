import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import { QUICK_FILTERS } from './src/data/mockRecipes';
import { loadRecipeSections } from './src/services/recipes';

const firstName = 'Sam';

function RecipeSection({ title, subtitle, recipes }) {
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
          <View key={recipe.title} style={styles.card}>
            <View style={[styles.cardGlow, { backgroundColor: recipe.tone }]} />
            <Text style={styles.cardMeta}>{recipe.meta}</Text>
            <Text style={styles.cardTitle}>{recipe.title}</Text>
            <Text style={styles.cardAccent}>{recipe.accent}</Text>
            <View style={styles.cardPill}>
              <Text style={styles.cardPillText}>Save for later</Text>
            </View>
          </View>
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

  return (
    <View style={styles.appShell}>
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
            <ActivityIndicator size="large" color="#7f5035" />
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
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: '#f6efe6',
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
    backgroundColor: '#f3c9a7',
    opacity: 0.45,
  },
  backgroundOrbTwo: {
    position: 'absolute',
    top: 240,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: '#d9e2c5',
    opacity: 0.4,
  },
  heroCard: {
    marginHorizontal: 20,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderRadius: 28,
    backgroundColor: '#fffaf4',
    shadowColor: '#72452b',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 4,
  },
  heroEyebrow: {
    marginBottom: 10,
    color: '#a05a36',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#2f241d',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  heroCopy: {
    marginTop: 14,
    color: '#655146',
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
    backgroundColor: '#f2dfce',
    borderWidth: 1,
    borderColor: '#e8c7ae',
  },
  filterChipText: {
    color: '#7f5035',
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
    color: '#886a59',
    fontSize: 13,
    fontWeight: '600',
  },
  sourceBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sourceBadgeMock: {
    backgroundColor: '#f2dfce',
  },
  sourceBadgeLive: {
    backgroundColor: '#d8e7cb',
  },
  sourceBadgeText: {
    color: '#6a4733',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sourceReasonText: {
    marginTop: 10,
    color: '#8a6653',
    fontSize: 13,
    lineHeight: 18,
  },
  refreshButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#2f241d',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refreshButtonText: {
    color: '#fff8f1',
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
    color: '#2f241d',
    fontSize: 24,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#6d5b50',
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
    backgroundColor: '#fffaf4',
    borderWidth: 1,
    borderColor: '#f1dcc8',
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
    color: '#8d644d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: '#2f241d',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
  },
  cardAccent: {
    marginTop: 10,
    color: '#675247',
    fontSize: 15,
    lineHeight: 22,
  },
  cardPill: {
    marginTop: 'auto',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#2f241d',
  },
  cardPillText: {
    color: '#fff8f1',
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
    color: '#7f5c49',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyWrap: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#fff5ea',
    borderWidth: 1,
    borderColor: '#f0ddca',
    gap: 6,
  },
  emptyTitle: {
    color: '#2f241d',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyBody: {
    color: '#6d5b50',
    fontSize: 14,
    lineHeight: 21,
  },
});
