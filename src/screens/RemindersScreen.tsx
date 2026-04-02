import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Button, StatusBadge } from '../components';
import { useData } from '../context/DataContext';
import { Reminder } from '../types';

interface RemindersScreenProps {
  navigation: any;
}

export function RemindersScreen({ navigation }: RemindersScreenProps) {
  const { reminders, completeReminder } = useData();
  const activeReminders = reminders.filter(r => r.status !== 'completed');

  const handleToggle = (reminder: Reminder) => {
    if (reminder.status !== 'completed') {
      completeReminder(reminder.id);
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
      <View style={styles.content}>
        <Button
          title="+ Erinnerung hinzufügen"
          onPress={() => navigation.navigate('AddReminder')}
          style={styles.addButton}
        />
        {reminders.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>Keine Erinnerungen</Text>
            <Text style={styles.emptySubtext}>Erstelle deine erste Erinnerung!</Text>
          </View>
        ) : (
          <FlatList
            data={reminders}
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
  list: { gap: spacing.md, paddingBottom: spacing.xl },
  empty: { alignItems: 'center', marginTop: spacing.xxl, gap: spacing.sm },
  emptyText: { ...typography.h3, color: colors.textLight },
  emptySubtext: { ...typography.bodySmall, color: colors.textLight },
  reminderCard: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.md, borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  reminderContent: { flex: 1, gap: 6 },
  reminderTitle: { ...typography.h3, color: colors.text },
  completedText: { textDecorationLine: 'line-through', color: colors.textLight },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reminderDate: { ...typography.bodySmall, color: colors.textSecondary },
  reminderDescription: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  checkbox: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 2,
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.success, borderColor: colors.success,
  },
});
