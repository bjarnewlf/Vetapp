import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Card, ErrorBanner, EmptyState } from '../../components';
import { recurrenceDisplayLabels } from '../../types';
import type { MedicalEvent, Reminder } from '../../types';
import type { RootStackNavProp } from '../../types/navigation';

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('de-DE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

interface PetHealthTabProps {
  navigation: RootStackNavProp<'PetDetail'>;
  petId: string;
  vaccinations: MedicalEvent[];
  treatments: MedicalEvent[];
  reminders: Reminder[];
  medicalLoading: boolean;
  medicalError: string | null;
  onRefreshMedical: () => void;
  onDeleteVaccination: (id: string, name: string) => void;
  onDeleteTreatment: (id: string, name: string) => void;
}

export function PetHealthTab({
  navigation,
  petId,
  vaccinations,
  treatments,
  reminders,
  medicalLoading,
  medicalError,
  onRefreshMedical,
  onDeleteVaccination,
  onDeleteTreatment,
}: PetHealthTabProps) {
  return (
    <View style={styles.tabContent}>
      {medicalError && <ErrorBanner onRetry={onRefreshMedical} />}
      {medicalLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Lade Gesundheitsdaten...</Text>
        </View>
      ) : (
        <>
          {/* Recent Treatments */}
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionTitle}>Weitere Gesundheitseinträge</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { petId, eventType: 'checkup' })}>
              <Ionicons name="add" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          {treatments.length === 0 && (
            <Text style={styles.emptyText}>Noch keine Behandlungen erfasst</Text>
          )}
          {treatments.map(treatment => (
            <View key={treatment.id} style={[styles.vaccinationCard, styles.vaccinationCardRow]}>
              <View style={styles.vaccinationCardContent}>
                <Text style={styles.vaccinationName}>{treatment.name}</Text>
                <View style={styles.vaccinationRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.vaccinationDate}>{formatDate(treatment.date)}</Text>
                </View>
                {treatment.notes && (
                  <Text style={styles.vaccinationDate}>{treatment.notes}</Text>
                )}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { petId, editMedicalEvent: treatment })}>
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteTreatment(treatment.id, treatment.name)}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Vaccinations */}
          <View style={styles.sectionDivider} />
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionTitle}>Impfungen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { petId })}>
              <Ionicons name="add" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          {vaccinations.map(vax => (
            <View key={vax.id} style={[styles.vaccinationCard, styles.vaccinationCardRow]}>
              <View style={styles.vaccinationCardContent}>
                <Text style={styles.vaccinationName}>{vax.name}</Text>
                <View style={styles.vaccinationRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.vaccinationDate}>Verabreicht: {formatDate(vax.date)}</Text>
                </View>
                {vax.nextDate && (
                  <View style={styles.vaccinationRow}>
                    <Ionicons name="calendar" size={14} color={colors.primary} />
                    <Text style={[styles.vaccinationDate, { color: colors.primary }]}>
                      Nächste: {formatDate(vax.nextDate)}
                    </Text>
                  </View>
                )}
                {vax.recurrenceInterval && (
                  <View style={styles.vaccinationRow}>
                    <Ionicons name="repeat" size={14} color={colors.textSecondary} />
                    <Text style={styles.vaccinationDate}>
                      {recurrenceDisplayLabels[vax.recurrenceInterval] || vax.recurrenceInterval}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { petId, editMedicalEvent: vax })}>
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteVaccination(vax.id, vax.name)}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {vaccinations.length === 0 && (
            <EmptyState
              emoji="💉"
              title="Noch keine Impfungen"
              subtitle="Trage die erste Impfung ein."
              actionLabel="Impfung eintragen"
              onAction={() => navigation.navigate('AddEvent', { petId, eventType: 'vaccination' })}
            />
          )}

          {/* Reminders */}
          <Card style={styles.remindersSection}>
            <View style={styles.subSectionHeader}>
              <Text style={styles.sectionLabel}>ERINNERUNGEN</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AddReminder', { petId })}>
                <Ionicons name="add" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            {reminders.length === 0 ? (
              <View style={styles.emptyReminders}>
                <Text style={styles.emptyText}>Keine anstehenden Erinnerungen</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddReminder', { petId })}>
                  <Text style={styles.addReminderLink}>Erinnerung hinzufügen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              reminders.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.reminderItem}
                  onPress={() => navigation.navigate('EventDetail', { eventId: r.id })}
                >
                  <Text style={styles.reminderTitle}>{r.title}</Text>
                  <Text style={styles.reminderDate}>{formatDate(r.date)}</Text>
                </TouchableOpacity>
              ))
            )}
          </Card>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: { paddingHorizontal: spacing.md },
  subSectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.sm, marginTop: spacing.md,
  },
  subSectionTitle: { ...typography.h3, color: colors.text },
  sectionLabel: { ...typography.sectionHeader, color: colors.textSecondary, marginBottom: spacing.md },
  emptyText: { ...typography.bodySmall, color: colors.textLight },
  vaccinationCard: {
    backgroundColor: colors.primaryLight, borderRadius: borderRadius.md,
    padding: spacing.md, marginTop: spacing.sm, gap: 6,
  },
  vaccinationCardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 0 },
  cardActions: { flexDirection: 'column', gap: spacing.sm, alignItems: 'center', paddingLeft: spacing.sm },
  vaccinationCardContent: { flex: 1, gap: 6 },
  vaccinationName: { ...typography.h3, color: colors.text },
  vaccinationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vaccinationDate: { ...typography.bodySmall, color: colors.textSecondary },
  sectionDivider: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  remindersSection: { marginTop: spacing.md },
  emptyReminders: { alignItems: 'center', gap: 4 },
  addReminderLink: { ...typography.bodySmall, color: colors.primary, textDecorationLine: 'underline' },
  reminderItem: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  reminderTitle: { ...typography.label, color: colors.text },
  reminderDate: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  loadingText: { ...typography.bodySmall, color: colors.textSecondary },
});
