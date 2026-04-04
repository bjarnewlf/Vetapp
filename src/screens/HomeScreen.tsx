import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card, ErrorBanner, EmptyState } from '../components';
import { usePets } from '../context/PetContext';
import { useMedical } from '../context/MedicalContext';
import { useAuth } from '../context/AuthContext';
import { animalTypeDisplayLabels } from '../types';

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { pets, error: petsError, refresh: refreshPets } = usePets();
  const { medicalEvents, reminders, error: medicalError, refresh: refreshMedical } = useMedical();
  const { user } = useAuth();
  const userName = user?.user_metadata?.name;
  const overdueReminders = reminders.filter(r => r.status === 'overdue');
  const nextReminder = reminders.find(r => r.status === 'upcoming');

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

      <View style={styles.body}>
        {petsError && <ErrorBanner onRetry={refreshPets} />}
        {medicalError && <ErrorBanner onRetry={refreshMedical} />}
        {overdueReminders.length > 0 && (
          <Card style={styles.overdueCard}>
            <View style={styles.overdueHeader}>
              <Ionicons name="alert-circle" size={22} color={colors.error} />
              <Text style={styles.overdueTitle}>
                {overdueReminders.length} überfällige Erinnerung{overdueReminders.length !== 1 ? 'en' : ''}
              </Text>
            </View>
            {overdueReminders.slice(0, 3).map(r => (
              <TouchableOpacity
                key={r.id}
                style={styles.overdueItem}
                onPress={() => navigation.navigate('EventDetail', { eventId: r.id })}
                activeOpacity={0.7}
              >
                <Text style={styles.overdueItemTitle}>{r.title}</Text>
                <Text style={styles.overdueItemDate}>
                  {new Date(r.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
                </Text>
              </TouchableOpacity>
            ))}
            {overdueReminders.length > 3 && (
              <Text style={styles.overdueMore}>+{overdueReminders.length - 3} weitere</Text>
            )}
          </Card>
        )}

        {nextReminder && (
          <Card style={styles.reminderCard}>
            <View style={styles.reminderRow}>
              <View style={styles.reminderIcon}>
                <Ionicons name="notifications-outline" size={22} color={colors.warning} />
              </View>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderLabel}>Nächste Erinnerung</Text>
                <Text style={styles.reminderTitle}>{nextReminder.title}</Text>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.reminderDate}>
                    {new Date(nextReminder.date).toLocaleDateString('de-DE', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}

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
          <View style={styles.petsGrid}>
            {pets.map(pet => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petCard}
                onPress={() => navigation.navigate('PetDetail', { petId: pet.id })}
                activeOpacity={0.8}
              >
                {pet.photo ? (
                  <Image source={{ uri: pet.photo }} style={styles.petImage} />
                ) : (
                  <View style={styles.petImagePlaceholder}>
                    <Ionicons
                      name={pet.type === 'Dog' ? 'paw' : 'paw-outline'}
                      size={40}
                      color={colors.primary}
                    />
                  </View>
                )}
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petType}>{animalTypeDisplayLabels[pet.type]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Übersicht</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{pets.length}</Text>
              <Text style={styles.statLabel}>Tiere</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{medicalEvents.filter(e => e.type === 'vaccination').length}</Text>
              <Text style={styles.statLabel}>Impfungen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{medicalEvents.filter(e => e.type !== 'vaccination').length}</Text>
              <Text style={styles.statLabel}>Behandlungen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {reminders.filter(r => r.status !== 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Erinnerungen</Text>
            </View>
          </View>
        </Card>

        <TouchableOpacity onPress={() => navigation.navigate('AI')} activeOpacity={0.8}>
          <View style={styles.aiCardNew}>
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
          </View>
        </TouchableOpacity>
      </View>
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
  overdueCard: { marginBottom: spacing.md, backgroundColor: colors.errorLight },
  overdueHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  overdueTitle: { ...typography.label, color: colors.error, flex: 1 },
  overdueItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: colors.errorLight,
  },
  overdueItemTitle: { ...typography.bodySmall, color: colors.text, flex: 1 },
  overdueItemDate: { ...typography.caption, color: colors.error },
  overdueMore: { ...typography.caption, color: colors.error, marginTop: spacing.sm },
  reminderCard: { marginBottom: spacing.md },
  reminderRow: { flexDirection: 'row', alignItems: 'center' },
  reminderIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.warningLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  reminderContent: { flex: 1 },
  reminderLabel: { ...typography.caption, color: colors.textSecondary },
  reminderTitle: { ...typography.label, color: colors.text, marginTop: 2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  reminderDate: { ...typography.caption, color: colors.textSecondary },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md, marginTop: spacing.sm,
  },
  sectionTitle: { ...typography.h2, color: colors.text },
  addLink: { ...typography.label, color: colors.primary },
  petsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap' },
  petCard: {
    flex: 1, minWidth: 140, backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.md, shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  petImage: {
    width: '100%', aspectRatio: 1.3, borderRadius: borderRadius.md, marginBottom: spacing.sm,
  },
  petImagePlaceholder: {
    width: '100%', aspectRatio: 1.3, backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  petName: { ...typography.h3, color: colors.text },
  petType: { ...typography.bodySmall, color: colors.textSecondary },
  statsCard: { marginBottom: spacing.lg },
  statsTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { ...typography.stat },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
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
