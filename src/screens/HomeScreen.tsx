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
  const nextReminder = reminders.find(r => r.status === 'upcoming');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hallo{userName ? `, ${userName}` : ''}! 👋</Text>
        <Text style={styles.welcomeText}>Willkommen zurück bei VetApp</Text>
      </View>

      <View style={styles.body}>
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
  greeting: { ...typography.h1, color: colors.textOnPrimary },
  welcomeText: { ...typography.bodySmall, color: colors.textOnPrimary, opacity: 0.85, marginTop: 4 },
  body: { padding: spacing.md },
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
});
