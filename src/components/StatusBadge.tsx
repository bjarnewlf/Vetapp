import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '../theme';

interface StatusBadgeProps {
  status: 'overdue' | 'upcoming' | 'completed';
}

const statusConfig = {
  overdue: { bg: colors.errorLight, text: colors.error, label: 'Überfällig' },
  upcoming: { bg: colors.warningLight, text: colors.warning, label: 'Anstehend' },
  completed: { bg: colors.successLight, text: colors.success, label: 'Erledigt' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});
