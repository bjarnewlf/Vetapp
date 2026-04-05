import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { pets, error: petsError, refresh: refreshPets } = usePets();
  const { medicalEvents, reminders, error: medicalError, refresh: refreshMedical } = useMedical();
  const { user } = useAuth();
  const userName = user?.user_metadata?.name;

  const fadeIn = useFadeIn(300);

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1B6B5A', '#2D8A73', '#3AA08A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
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
      </LinearGradient>

      <Animated.View style={{ opacity: fadeIn, flex: 1 }}>
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
                <Ionicons name="arrow-forward-outline" size={18} color="#1B6B5A" />
              </View>
            </View>
          </AnimatedPressable>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60, paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl, borderBottomRightRadius: borderRadius.xl,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextGroup: {
    flex: 1,
  },
  profileButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  greeting: { ...typography.h1, color: colors.textOnPrimary },
  welcomeText: { ...typography.bodySmall, color: colors.textOnPrimary, opacity: 0.85, marginTop: 4 },
  body: { padding: spacing.md },
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
    backgroundColor: '#E8F5F1',
    borderWidth: 1.5,
    borderColor: '#B8DDD4',
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
    backgroundColor: '#1B6B5A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.smd,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#145244',
  },
  aiSubtitle: {
    fontSize: 13,
    color: '#1B6B5A',
    marginTop: 2,
  },
  aiCtaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiProBadge: {
    backgroundColor: '#1B6B5A',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  aiProBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  aiCtaAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiCtaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#145244',
    marginRight: 4,
  },
});
