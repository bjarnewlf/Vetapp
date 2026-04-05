import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

interface ErrorBannerProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onRetry} activeOpacity={0.8}>
      <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
      <Text style={styles.text}>
        {message ?? 'Fehler beim Laden der Daten. Tippe zum erneut Versuchen.'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  text: {
    ...typography.bodySmall,
    color: colors.error,
    flex: 1,
  },
});
