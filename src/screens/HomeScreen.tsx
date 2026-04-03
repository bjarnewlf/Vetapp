import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card } from '../components';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { animalTypeDisplayLabels } from '../types';

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { pets, reminders, vaccinations, treatments } = useData();
  const { user } = useAuth();
  const userName = user?.user_metadata?.name;
  const overdueReminders = reminders.filter(r => r.status === 'overdue');
  const nextReminder = reminders.find(r => r.status === 'upcoming');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
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
      </View>

      <View style={styles.body}>
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
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Noch keine Haustiere</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
              <Text style={styles.emptyLink}>Erstes Tier hinzufügen</Text>
            </TouchableOpacity>
          </Card>
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
              <Text style={[styles.statNumber, { color: colors.primary }]}>{vaccinations.length}</Text>
              <Text style={styles.statLabel}>Impfungen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{treatments.length}</Text>
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

        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => navigation.navigate('AI')}
          activeOpacity={0.8}
        >
          <View style={styles.aiCardRow}>
            <View style={styles.aiCardIcon}>
              <Ionicons name="sparkles" size={22} color={colors.primary} />
            </View>
            <View style={styles.aiCardContent}>
              <Text style={styles.aiCardTitle}>KI-Gesundheitsassistent</Text>
              <Text style={styles.aiCardSub}>Fragen zur Tiergesundheit? Frag die KI.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary, paddingHorizontal: spacing.lg,
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
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#F5C6C6',
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
  emptyCard: { alignItems: 'center', marginBottom: spacing.lg },
  emptyText: { ...typography.body, color: colors.textLight, marginBottom: 4 },
  emptyLink: { ...typography.label, color: colors.primary },
  petsGrid: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap' },
  petCard: {
    flex: 1, minWidth: 140, backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
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
  aiCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md,
    marginBottom: spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  aiCardRow: { flexDirection: 'row', alignItems: 'center' },
  aiCardIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  aiCardContent: { flex: 1 },
  aiCardTitle: { ...typography.h3, color: colors.text },
  aiCardSub: { ...typography.bodySmall, color: colors.textSecondary },
});
