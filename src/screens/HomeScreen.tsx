import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import { ErrorBanner, EmptyState, AnimatedPressable, PetListRow, TimelineItem } from '../components';
import { usePets } from '../context/PetContext';
import { useMedical } from '../context/MedicalContext';
import { useAuth } from '../context/AuthContext';
import { useFadeIn } from '../hooks/useFadeIn';
import type { CompositeTabStackNavProp } from '../types/navigation';

interface HomeScreenProps {
  navigation: CompositeTabStackNavProp<'Home'>;
}

const HEADER_EXPANDED_HEIGHT = 120;
const HEADER_COLLAPSED_HEIGHT = 64;
const SCROLL_THRESHOLD = 80;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { pets, error: petsError, refresh: refreshPets } = usePets();
  const { medicalEvents, reminders, error: medicalError, refresh: refreshMedical } = useMedical();
  const { user } = useAuth();
  const userName = user?.user_metadata?.name;
  const insets = useSafeAreaInsets();

  const fadeIn = useFadeIn(300);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [HEADER_EXPANDED_HEIGHT + insets.top, HEADER_COLLAPSED_HEIGHT + insets.top],
    extrapolate: 'clamp',
  });

  const headerBorderRadius = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [borderRadius.xl, 0],
    extrapolate: 'clamp',
  });

  const greetingOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const greetingTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [0, -16],
    extrapolate: 'clamp',
  });

  const collapsedTitleOpacity = scrollY.interpolate({
    inputRange: [SCROLL_THRESHOLD * 0.6, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const timelineItems = useMemo(() => {
    const items: {
      id: string;
      date: string;
      title: string;
      petId?: string;
      type: 'reminder' | 'vaccination' | 'deworming' | 'checkup' | 'custom';
      isOverdue: boolean;
    }[] = [];

    reminders
      .filter(r => r.status !== 'completed')
      .forEach(r => items.push({
        id: r.id,
        date: r.date,
        title: r.title,
        petId: r.petId,
        type: 'reminder' as const,
        isOverdue: r.status === 'overdue',
      }));

    medicalEvents
      .filter(e => e.nextDate)
      .forEach(e => items.push({
        id: e.id,
        date: e.nextDate!,
        title: e.name,
        petId: e.petId,
        type: e.type,
        isOverdue: false,
      }));

    return items
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [reminders, medicalEvents]);

  const petNameMap = useMemo(() => {
    const map = new Map<string, string>();
    pets.forEach(p => map.set(p.id, p.name));
    return map;
  }, [pets]);

  return (
    <View style={styles.container}>
      {/* Animated Header — außerhalb der ScrollView, absolut positioniert */}
      <Animated.View
        style={[
          styles.headerWrapper,
          { height: headerHeight },
        ]}
      >
        <LinearGradient
          colors={['#1B6B5A', '#2D8A73', '#3AA08A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          style={[
            styles.headerBorderRadiusOverlay,
            { borderBottomLeftRadius: headerBorderRadius, borderBottomRightRadius: headerBorderRadius },
          ]}
        />

        {/* Expanded: Greeting + Welcome */}
        <Animated.View
          style={[
            styles.headerExpandedContent,
            {
              paddingTop: insets.top + 12,
              opacity: greetingOpacity,
              transform: [{ translateY: greetingTranslateY }],
            },
          ]}
        >
          <View style={styles.headerTopRow}>
            <View style={styles.headerTextGroup}>
              <Text style={styles.greeting}>Hallo{userName ? `, ${userName}` : ''}! 👋</Text>
              <Text style={styles.welcomeText}>Willkommen zurück bei VetApp</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={30} color={colors.textOnPrimary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Collapsed: "VetApp" zentriert + Profil-Icon rechts */}
        <Animated.View
          style={[
            styles.headerCollapsedContent,
            { opacity: collapsedTitleOpacity },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.collapsedTitle}>VetApp</Text>
        </Animated.View>

        {/* Profil-Icon bleibt immer sichtbar oben rechts */}
        <Animated.View
          style={[
            styles.profileButtonAbsolute,
            { top: insets.top + 10 },
          ]}
        >
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle-outline" size={30} color={colors.textOnPrimary} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* ScrollView mit paddingTop als Ersatz für den Header */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: HEADER_EXPANDED_HEIGHT + insets.top + spacing.md }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <Animated.View style={{ opacity: fadeIn }}>
          <View style={styles.body}>
            {petsError && <ErrorBanner onRetry={refreshPets} />}
            {medicalError && <ErrorBanner onRetry={refreshMedical} />}

            {/* Pet-Sektion */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meine Tiere</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
                <Text style={styles.addLink}>+ Tier hinzufügen</Text>
              </TouchableOpacity>
            </View>

            {pets.length === 0 ? (
              <EmptyState
                emoji="🐾"
                title="Noch keine Haustiere"
                subtitle="Füge dein erstes Tier hinzu und behalte die Gesundheit im Blick."
                actionLabel="Tier hinzufügen"
                onAction={() => navigation.navigate('AddPet')}
              />
            ) : (
              <View style={styles.petList}>
                {pets.map(pet => (
                  <PetListRow
                    key={pet.id}
                    pet={pet}
                    onPress={() => navigation.navigate('PetDetail', { petId: pet.id })}
                  />
                ))}
              </View>
            )}

            {/* Timeline-Sektion */}
            <View style={styles.timelineSection}>
              <View style={styles.timelineHeader}>
                <Text style={styles.sectionTitle}>Nächste Termine</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Reminders')}>
                  <Text style={styles.addLink}>Alle</Text>
                </TouchableOpacity>
              </View>

              {timelineItems.length === 0 ? (
                <Text style={styles.timelineEmpty}>Keine anstehenden Termine</Text>
              ) : (
                timelineItems.map(item => (
                  <TimelineItem
                    key={item.id}
                    date={item.date}
                    title={item.title}
                    petName={item.petId ? petNameMap.get(item.petId) : undefined}
                    type={item.type}
                    isOverdue={item.isOverdue}
                    onPress={() => navigation.navigate('Reminders')}
                  />
                ))
              )}
            </View>

            {/* KI-Card */}
            <AnimatedPressable onPress={() => navigation.navigate('AI')} style={styles.aiCardNew}>
              <View style={styles.aiTopRow}>
                <View style={styles.aiIconContainer}>
                  <Ionicons name="sparkles" size={22} color="#FFFFFF" />
                </View>
                <View style={styles.aiTextContainer}>
                  <Text style={styles.aiTitle}>KI-Gesundheitsassistent</Text>
                  <Text style={styles.aiSubtitle}>Deine Tiere kennt die KI bereits.</Text>
                </View>
              </View>
              <View style={styles.aiCtaRow}>
                <View style={styles.aiProBadge}>
                  <Text style={styles.aiProBadgeText}>PRO</Text>
                </View>
                <View style={styles.aiCtaAction}>
                  <Text style={styles.aiCtaText}>Frage stellen</Text>
                  <Ionicons name="arrow-forward-outline" size={18} color={colors.primary} />
                </View>
              </View>
            </AnimatedPressable>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Header
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerBorderRadiusOverlay: {
    ...StyleSheet.absoluteFillObject,
    // Wird nur für borderRadius via Animated.View genutzt — Inhalt transparent
  },
  headerExpandedContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextGroup: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  headerCollapsedContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HEADER_COLLAPSED_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsedTitle: {
    ...typography.h3,
    color: colors.textOnPrimary,
    textAlign: 'center',
  },
  profileButtonAbsolute: {
    position: 'absolute',
    right: spacing.md,
  },

  greeting: { ...typography.h1, color: colors.textOnPrimary },
  welcomeText: { ...typography.bodySmall, color: colors.textOnPrimary, opacity: 0.85, marginTop: 4 },
  profileButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollView: { flex: 1 },
  body: { paddingHorizontal: spacing.md },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: { ...typography.h2, color: colors.text },
  addLink: { ...typography.label, color: colors.primary },
  petList: {
    marginBottom: spacing.lg,
  },
  timelineSection: {
    marginBottom: spacing.lg,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timelineEmpty: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  aiCardNew: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  aiTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.smd,
  },
  aiIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.smd,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    ...typography.label,
    fontSize: 16,
    color: colors.primaryDark,
  },
  aiSubtitle: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: 2,
  },
  aiCtaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiProBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  aiProBadgeText: {
    fontSize: 9, // TODO: Theme-Token (kein passender Token für 9px vorhanden)
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.textOnPrimary,
  },
  aiCtaAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiCtaText: {
    ...typography.label,
    color: colors.primaryDark,
    marginRight: 4,
  },
});
