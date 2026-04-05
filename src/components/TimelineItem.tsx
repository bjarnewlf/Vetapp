import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';

type TimelineItemType = 'reminder' | 'vaccination' | 'deworming' | 'checkup' | 'custom';

interface TimelineItemProps {
  date: string;
  title: string;
  petName?: string;
  type: TimelineItemType;
  isOverdue?: boolean;
  onPress: () => void;
}

const TYPE_LABELS: Record<TimelineItemType, string> = {
  reminder: 'Erinnerung',
  vaccination: 'Impfung',
  deworming: 'Entwurmung',
  checkup: 'Vorsorge',
  custom: 'Termin',
};

const TYPE_BADGE_COLORS: Record<TimelineItemType, { bg: string; text: string }> = {
  reminder: { bg: colors.warningLight, text: colors.warning },
  vaccination: { bg: colors.primaryLight, text: colors.primary },
  deworming: { bg: colors.accentLight, text: colors.accent },
  checkup: { bg: colors.successLight, text: colors.success },
  custom: { bg: colors.borderLight, text: colors.textSecondary },
};

export function TimelineItem({ date, title, petName, type, isOverdue, onPress }: TimelineItemProps) {
  const parsed = new Date(date);
  const day = isNaN(parsed.getTime())
    ? '--'
    : parsed.toLocaleDateString('de-DE', { day: 'numeric' });
  const month = isNaN(parsed.getTime())
    ? '--'
    : parsed.toLocaleDateString('de-DE', { month: 'short' });

  const badgeColors = TYPE_BADGE_COLORS[type];

  return (
    <AnimatedPressable style={styles.row} onPress={onPress}>
      {/* Datum-Block */}
      <View style={[styles.dateBlock, isOverdue && styles.dateBlockOverdue]}>
        <Text style={[styles.dateDay, isOverdue && styles.dateDayOverdue]}>{day}</Text>
        <Text style={[styles.dateMonth, isOverdue && styles.dateMonthOverdue]}>{month}</Text>
      </View>

      {/* Texte */}
      <View style={styles.textGroup}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {petName ? (
          <Text style={styles.petName} numberOfLines={1}>{petName}</Text>
        ) : null}
      </View>

      {/* Typ-Badge */}
      <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
        <Text style={[styles.badgeText, { color: badgeColors.text }]}>
          {TYPE_LABELS[type]}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  dateBlock: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.md,
  },
  dateBlockOverdue: {
    backgroundColor: colors.errorLight,
  },
  dateDay: {
    ...typography.h3,
    color: colors.primary,
  },
  dateDayOverdue: {
    color: colors.error,
  },
  dateMonth: {
    ...typography.caption,
    color: colors.primary,
  },
  dateMonthOverdue: {
    color: colors.error,
  },
  textGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.label,
    color: colors.text,
  },
  petName: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    borderRadius: borderRadius.full,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
