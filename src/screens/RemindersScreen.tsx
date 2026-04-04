import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Button, StatusBadge, ErrorBanner, EmptyState } from '../components';
import { useMedical } from '../context/MedicalContext';
import { Reminder } from '../types';
import { useOverdueSettings } from '../hooks/useOverdueSettings';
import { scheduleOverdueNotifications } from '../services/notifications';

interface RemindersScreenProps {
  navigation: any;
}

export function RemindersScreen({ navigation }: RemindersScreenProps) {
  const { reminders, completeReminder, error: medicalError, refresh: refreshMedical } = useMedical();
  const { rule: overdueRule, loaded: settingsLoaded } = useOverdueSettings();
  const pendingIds = useRef<Set<string>>(new Set());

  // Überfällige Notifications planen sobald Reminders und Settings geladen sind
  useEffect(() => {
    if (!settingsLoaded) return;
    scheduleOverdueNotifications(reminders, overdueRule);
  }, [reminders, overdueRule, settingsLoaded]);

  const activeReminders = reminders
    .filter(r => r.status !== 'completed')
    .sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (a.status !== 'overdue' && b.status === 'overdue') return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  // Bei Regel 'never' werden überfällige Erinnerungen nicht speziell hervorgehoben
  const overdueCount = overdueRule !== 'never'
    ? activeReminders.filter(r => r.status === 'overdue').length
    : 0;

  const handleToggle = async (reminder: Reminder) => {
    if (reminder.status === 'completed') return;
    if (pendingIds.current.has(reminder.id)) return;
    pendingIds.current.add(reminder.id);
    try {
      const success = await completeReminder(reminder.id);
      if (!success) Alert.alert('Fehler', 'Speichern fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      pendingIds.current.delete(reminder.id);
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => {
    const borderColor = item.status === 'overdue' ? colors.error : colors.accent;
    const isCompleted = item.status === 'completed';

    return (
      <TouchableOpacity
        style={[styles.reminderCard, { borderLeftColor: borderColor }]}
        onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.reminderContent}>
          <Text style={[styles.reminderTitle, isCompleted && styles.completedText]}>
            {item.title}
          </Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.reminderDate}>
              {new Date(item.date).toLocaleDateString('de-DE', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </Text>
          </View>
          <StatusBadge status={item.status} />
          {item.description && (
            <Text style={styles.reminderDescription}>{item.description}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          onPress={() => handleToggle(item)}
        >
          {isCompleted && <Ionicons name="checkmark" size={16} color={colors.surface} />}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Erinnerungen</Text>
      {medicalError && <ErrorBanner onRetry={refreshMedical} />}
      <View style={styles.content}>
        <Button
          title="+ Erinnerung hinzufügen"
          onPress={() => navigation.navigate('AddReminder')}
          style={styles.addButton}
        />
        {overdueCount > 0 && (
          <View style={styles.overdueBanner}>
            <Ionicons name="alert-circle" size={16} color={colors.error} />
            <Text style={styles.overdueBannerText}>{overdueCount} überfällig</Text>
          </View>
        )}
        {activeReminders.length === 0 ? (
          <EmptyState
            emoji="🔔"
            title="Keine Erinnerungen"
            subtitle="Richte Erinnerungen für Impfungen oder Tierarzttermine ein."
            actionLabel="Erinnerung erstellen"
            onAction={() => navigation.navigate('AddReminder')}
          />
        ) : (
          <FlatList
            data={activeReminders}
            renderItem={renderReminder}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    ...typography.h1, color: colors.text,
    paddingHorizontal: spacing.md, paddingTop: 60, paddingBottom: spacing.md,
  },
  content: { flex: 1, paddingHorizontal: spacing.md },
  addButton: { marginBottom: spacing.md },
  overdueBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.errorLight, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  overdueBannerText: { ...typography.label, color: colors.error },
  list: { gap: spacing.md, paddingBottom: spacing.xl },
  empty: { alignItems: 'center', marginTop: spacing.xxl, gap: spacing.sm },
  emptyText: { ...typography.h3, color: colors.textLight },
  emptySubtext: { ...typography.bodySmall, color: colors.textLight },
  reminderCard: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.md, borderLeftWidth: 4,
    shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  reminderContent: { flex: 1, gap: 6 },
  reminderTitle: { ...typography.h3, color: colors.text },
  completedText: { textDecorationLine: 'line-through', color: colors.textLight },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reminderDate: { ...typography.bodySmall, color: colors.textSecondary },
  reminderDescription: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  checkbox: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 2,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.success, borderColor: colors.success,
  },
});
