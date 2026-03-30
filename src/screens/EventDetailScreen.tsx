import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card, Button, StatusBadge } from '../components';
import { useData } from '../context/DataContext';

interface EventDetailScreenProps {
  navigation: any;
  route: any;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function EventDetailScreen({ navigation, route }: EventDetailScreenProps) {
  const { eventId } = route.params;
  const { reminders, pets, completeReminder } = useData();
  const event = reminders.find(r => r.id === eventId);

  if (!event) return null;

  const pet = pets.find(p => p.id === event.petId);

  const handleComplete = () => {
    completeReminder(event.id);
    navigation.goBack();
  };

  const handleReschedule = () => {
    Alert.alert('Verschieben', 'Diese Funktion wird bald verfügbar sein.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <StatusBadge status={event.status} />

        <View style={styles.detailRows}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.detailText}>{formatDate(event.date)}</Text>
          </View>

          {pet && (
            <View style={styles.detailRow}>
              <Ionicons name="paw-outline" size={20} color={colors.primary} />
              <Text style={styles.detailText}>{pet.name} ({pet.type})</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="repeat-outline" size={20} color={colors.primary} />
            <Text style={styles.detailText}>{event.recurrence}</Text>
          </View>
        </View>

        {event.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionLabel}>Beschreibung</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>
        )}
      </Card>

      <View style={styles.actions}>
        <Button
          title="Als erledigt markieren"
          onPress={handleComplete}
          style={styles.completeButton}
        />
        <Button
          title="Verschieben"
          onPress={handleReschedule}
          variant="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  card: {
    marginBottom: spacing.lg,
  },
  eventTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  detailRows: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detailText: {
    ...typography.body,
    color: colors.text,
  },
  descriptionSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  descriptionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  descriptionText: {
    ...typography.body,
    color: colors.text,
  },
  actions: {
    gap: spacing.md,
  },
  completeButton: {
    // uses default primary style
  },
});
