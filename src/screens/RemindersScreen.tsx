import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius, TAB_BAR_HEIGHT } from '../theme';
import { Button, StatusBadge, ErrorBanner, EmptyState, SkeletonListItem } from '../components';
import { useMedical } from '../context/MedicalContext';
import { Reminder } from '../types';
import { useOverdueSettings } from '../hooks/useOverdueSettings';
import { scheduleOverdueNotifications } from '../services/notifications';
import type { CompositeTabStackNavProp } from '../types/navigation';

interface RemindersScreenProps {
  navigation: CompositeTabStackNavProp<'Reminders'>;
}

const REMINDER_HORIZON_DAYS = 30;

export function RemindersScreen({ navigation }: RemindersScreenProps) {
  const { reminders, completeReminder, loading: remindersLoading, error: medicalError, refresh: refreshMedical } = useMedical();
  const { rule: overdueRule, loaded: settingsLoaded } = useOverdueSettings();
  const insets = useSafeAreaInsets();
  const pendingIds = useRef<Set<string>>(new Set());
  // Permanente Blacklist: verhindert dass abgehakte Items nach Context-Refresh
  // kurz wieder auftauchen. Wird bewusst nie geleert (Screen-Lebensdauer).
  const completedIds = useRef<Set<string>>(new Set());

  // Animations-State pro Karte: opacity + translateX für slide-out
  const animValues = useRef<Map<string, { opacity: Animated.Value; translateX: Animated.Value }>>(new Map());

  const getAnimValues = (id: string) => {
    if (!animValues.current.has(id)) {
      animValues.current.set(id, {
        opacity: new Animated.Value(1),
        translateX: new Animated.Value(0),
      });
    }
    return animValues.current.get(id)!;
  };

  // Überfällige Notifications planen sobald Reminders und Settings geladen sind
  useEffect(() => {
    if (!settingsLoaded) return;
    scheduleOverdueNotifications(reminders, overdueRule);
  }, [reminders, overdueRule, settingsLoaded]);

  const activeReminders = reminders
    .filter(r => {
      if (r.status === 'completed' || completedIds.current.has(r.id)) return false;
      // Überfällige immer anzeigen
      if (r.status === 'overdue') return true;
      // Zukünftige nur wenn innerhalb des Horizonts
      const reminderDate = new Date(r.date);
      const horizon = new Date();
      horizon.setDate(horizon.getDate() + REMINDER_HORIZON_DAYS);
      return reminderDate <= horizon;
    })
    .sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (a.status !== 'overdue' && b.status === 'overdue') return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  // Bei Regel 'never' werden überfällige Erinnerungen nicht speziell hervorgehoben
  const overdueCount = overdueRule !== 'never'
    ? activeReminders.filter(r => r.status === 'overdue').length
    : 0;

  const handleToggle = (reminder: Reminder) => {
    if (reminder.status === 'completed') return;
    if (pendingIds.current.has(reminder.id)) return;
    pendingIds.current.add(reminder.id);

    const { opacity, translateX } = getAnimValues(reminder.id);

    // QA-026: Animation ZUERST starten, completeReminder im Callback aufrufen
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 120,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(async ({ finished }) => {
      if (finished) {
        try {
          const success = await completeReminder(reminder.id);
          if (success) {
            completedIds.current.add(reminder.id);
            pendingIds.current.delete(reminder.id);
          } else {
            // QA-029: Animation zurücksetzen wenn Speichern fehlschlägt
            translateX.setValue(0);
            opacity.setValue(1);
            pendingIds.current.delete(reminder.id);
            Alert.alert('Fehler', 'Speichern fehlgeschlagen. Bitte versuche es erneut.');
          }
        } catch {
          // QA-029: Animation zurücksetzen bei Netzwerkfehler
          translateX.setValue(0);
          opacity.setValue(1);
          pendingIds.current.delete(reminder.id);
          Alert.alert('Fehler', 'Speichern fehlgeschlagen. Bitte versuche es erneut.');
        }
      }
    });
  };

  const renderReminder = ({ item }: { item: Reminder }) => {
    const borderColor = item.status === 'overdue' ? colors.error : colors.accent;
    const isCompleted = item.status === 'completed';
    const { opacity, translateX } = getAnimValues(item.id);

    return (
      <Animated.View style={{ opacity, transform: [{ translateX }] }}>
        <View style={[styles.reminderCard, { borderLeftColor: borderColor }]}>
          <Pressable
            style={styles.reminderContent}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
            android_ripple={{ color: colors.border }}
          >
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
          </Pressable>
          <Pressable
            style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
            onPress={() => handleToggle(item)}
            accessibilityLabel="Erinnerung als erledigt markieren"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isCompleted }}
          >
            {isCompleted && <Ionicons name="checkmark" size={16} color={colors.surface} />}
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { paddingTop: insets.top + 12 }]}>Erinnerungen</Text>
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
        {remindersLoading ? (
          <View style={styles.list}>
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
          </View>
        ) : activeReminders.length === 0 ? (
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
            contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom }]}
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
    paddingHorizontal: spacing.md, paddingBottom: spacing.md,
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
