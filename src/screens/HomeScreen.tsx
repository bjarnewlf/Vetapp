import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, typography, spacing, borderRadius, TAB_BAR_HEIGHT } from '../theme';
import { ErrorBanner, EmptyState, AnimatedPressable, PetListRow, TimelineItem, SkeletonPetCard, SkeletonListItem } from '../components';
import { usePets } from '../context/PetContext';
import { useMedical } from '../context/MedicalContext';
import { useAuth } from '../context/AuthContext';
import { useFadeIn } from '../hooks/useFadeIn';
import type { CompositeTabStackNavProp } from '../types/navigation';

interface HomeScreenProps {
  navigation: CompositeTabStackNavProp<'Home'>;
}

const HEADER_EXPANDED_HEIGHT = 84;
const HEADER_COLLAPSED_HEIGHT = 64;
const SCROLL_THRESHOLD = 80;
const BENTO_CARD_HEIGHT = 140;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { pets, loading: petsLoading, error: petsError, refresh: refreshPets } = usePets();
  const { medicalEvents, reminders, loading: medicalLoading, error: medicalError, refresh: refreshMedical } = useMedical();
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

  // Naechster Termin: fruehester nicht-abgeschlossener Reminder oder MedicalEvent mit nextDate
  const nextAppointment = useMemo(() => {
    const today = new Date();
    const items: { date: string; title: string; isOverdue: boolean }[] = [];

    reminders
      .filter(r => r.status !== 'completed')
      .forEach(r => items.push({
        date: r.date,
        title: r.title,
        isOverdue: r.status === 'overdue',
      }));

    medicalEvents
      .filter(e => e.nextDate)
      .forEach(e => items.push({
        date: e.nextDate!,
        title: e.name,
        isOverdue: new Date(e.nextDate!) < today,
      }));

    if (items.length === 0) return null;

    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [reminders, medicalEvents]);

  // Letzte Aktivitaet: bis zu 3 Eintraege
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
      .filter(item => {
        if (!nextAppointment) return true;
        return !(item.title === nextAppointment.title && item.date === nextAppointment.date);
      })
      .slice(0, 3);
  }, [reminders, medicalEvents, nextAppointment]);

  const petNameMap = useMemo(() => {
    const map = new Map<string, string>();
    pets.forEach(p => map.set(p.id, p.name));
    return map;
  }, [pets]);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Animated Header — absolut positioniert */}
      <Animated.View
        style={[
          styles.headerWrapper,
          { height: headerHeight },
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryMid, colors.primaryGradientEnd]}
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

        {/* Expanded: Greeting */}
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
            {/* Platzhalter fuer Profil-Icon (wird absolut positioniert gerendert) */}
            <View style={styles.profileButton} />
          </View>
        </Animated.View>

        {/* Collapsed: "VetApp" zentriert */}
        <Animated.View
          style={[
            styles.headerCollapsedContent,
            { opacity: collapsedTitleOpacity },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.collapsedTitle}>VetApp</Text>
        </Animated.View>

        {/* Profil-Icon immer sichtbar oben rechts */}
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

      {/* ScrollView */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: HEADER_EXPANDED_HEIGHT + insets.top + spacing.md, paddingBottom: TAB_BAR_HEIGHT + insets.bottom }}
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

            {/* --- Meine Tiere --- */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Meine Tiere</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
                <Text style={styles.addLink}>+ Hinzufügen</Text>
              </TouchableOpacity>
            </View>

            {petsLoading ? (
              <View style={styles.petList}>
                <SkeletonPetCard />
                <SkeletonPetCard />
                <SkeletonPetCard />
              </View>
            ) : pets.length === 0 ? (
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

            {/* --- Bento Grid Row 1: Naechster Termin + Event hinzufuegen --- */}
            <View style={styles.bentoRow}>
              {/* Naechster Termin (flex: 2) */}
              <View style={[
                styles.bentoCardAppointment,
                { borderLeftColor: nextAppointment?.isOverdue ? colors.error : colors.primary },
              ]}>
                <Text style={styles.bentoSectionLabel}>
                  NAECHSTER TERMIN
                </Text>
                {medicalLoading ? (
                  <SkeletonListItem />
                ) : nextAppointment ? (
                  <>
                    <Text style={styles.bentoAppointmentTitle} numberOfLines={2}>
                      {nextAppointment.title}
                    </Text>
                    <Text style={[
                      styles.bentoAppointmentDate,
                      { color: nextAppointment.isOverdue ? colors.error : colors.textSecondary },
                    ]}>
                      {formatDate(nextAppointment.date)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.bentoEmpty}>Keine Termine</Text>
                )}
              </View>

              {/* Quick-Action: Event hinzufuegen (flex: 1) */}
              <TouchableOpacity
                style={styles.bentoCardQuickEvent}
                onPress={() => navigation.navigate('AddEvent')}
                activeOpacity={0.7}
              >
                <Ionicons name="add-circle-outline" size={44} color={colors.primary} />
                <Text style={styles.bentoQuickLabelPrimary}>Event</Text>
              </TouchableOpacity>
            </View>

            {/* --- Bento Grid Row 2: KI-Assistent (volle Breite) --- */}
            <AnimatedPressable
              style={styles.bentoCardAI}
              onPress={() => navigation.navigate('AI')}
            >
              {/* PRO-Badge oben rechts */}
              <View style={styles.aiProBadge}>
                <Text style={styles.aiProBadgeText}>PRO</Text>
              </View>

              <View style={styles.aiContent}>
                <View style={styles.aiIconCircle}>
                  <Ionicons name="sparkles" size={22} color={colors.textOnPrimary} />
                </View>
                <View style={styles.aiTextBlock}>
                  <Text style={styles.aiTitle}>KI-Assistent</Text>
                  <Text style={styles.aiSubtitle}>Frage stellen</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
              </View>
            </AnimatedPressable>

            {/* --- Aktivitaet (letzte 3) --- */}
            <View style={styles.activitySection}>
              <View style={styles.activityHeader}>
                <Text style={styles.sectionTitle}>Anstehend</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Reminders')}>
                  <Text style={styles.addLink}>Alle</Text>
                </TouchableOpacity>
              </View>

              {medicalLoading ? (
                <>
                  <SkeletonListItem />
                  <SkeletonListItem />
                  <SkeletonListItem />
                </>
              ) : timelineItems.length === 0 ? (
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

  // Bento Grid
  bentoRow: {
    flexDirection: 'row',
    gap: spacing.smd,
    marginBottom: spacing.smd,
  },

  // Naechster Termin Card (flex: 2)
  bentoCardAppointment: {
    flex: 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    height: BENTO_CARD_HEIGHT,
    padding: spacing.md,
    borderLeftWidth: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'flex-start',
  },
  bentoSectionLabel: {
    ...typography.sectionHeader,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bentoAppointmentTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
    flex: 1,
  },
  bentoAppointmentDate: {
    ...typography.bodySmall,
  },
  bentoEmpty: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Quick-Action: Event hinzufuegen (flex: 1)
  bentoCardQuickEvent: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    height: BENTO_CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  bentoQuickLabelPrimary: {
    ...typography.label,
    color: colors.primary,
  },

  // KI-Assistent Card (volle Breite)
  bentoCardAI: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    borderRadius: borderRadius.lg,
    height: BENTO_CARD_HEIGHT,
    padding: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.smd,
  },
  aiProBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  aiProBadgeText: {
    fontSize: 10,
    fontFamily: fonts.heading.bold,
    color: colors.textOnAccent,
    letterSpacing: 0.5,
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconCircle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.smd,
  },
  aiTextBlock: {
    flex: 1,
  },
  aiTitle: {
    ...typography.h3,
    color: colors.text,
  },
  aiSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Letzte Aktivitaet
  activitySection: {
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  activityHeader: {
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
});
