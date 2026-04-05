import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card } from '../components';
import { OverdueRule, OVERDUE_RULE_KEY, DEFAULT_OVERDUE_RULE } from '../hooks/useOverdueSettings';
import type { RootStackNavProp } from '../types/navigation';

interface ReminderSettingsScreenProps {
  navigation: RootStackNavProp<'ReminderSettings'>;
}

const overdueOptions: { id: OverdueRule; label: string; description: string }[] = [
  { id: 'never', label: 'Nie', description: 'Keine Erinnerung bei überfälligen Events' },
  { id: 'daily', label: 'Täglich', description: 'Tägliche Push-Erinnerung bis erledigt' },
  { id: 'weekly', label: 'Wöchentlich', description: 'Wöchentliche Push-Erinnerung bis erledigt' },
  { id: 'custom', label: 'Alle X Tage', description: 'Tägliche Erinnerung (benutzerdefiniertes Intervall folgt)' },
];

export function ReminderSettingsScreen({ navigation }: ReminderSettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedRule, setSelectedRule] = useState<OverdueRule>(DEFAULT_OVERDUE_RULE);

  useEffect(() => {
    AsyncStorage.getItem(OVERDUE_RULE_KEY).then(val => {
      if (val && ['never', 'daily', 'weekly', 'custom'].includes(val)) {
        setSelectedRule(val as OverdueRule);
      }
    });
  }, []);

  const handleSelectRule = (rule: OverdueRule) => {
    setSelectedRule(rule);
    AsyncStorage.setItem(OVERDUE_RULE_KEY, rule);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Erinnerungsregeln</Text>
      </View>

      <Text style={styles.sectionTitle}>Überfällig-Erinnerungen</Text>
      <Text style={styles.sectionDescription}>
        Wie oft möchtest du an überfällige Events erinnert werden?
      </Text>

      <View style={styles.options}>
        {overdueOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedRule === option.id && styles.optionCardSelected,
            ]}
            onPress={() => handleSelectRule(option.id)}
            activeOpacity={0.7}
          >
            <View style={styles.optionRow}>
              <View style={[
                styles.radio,
                selectedRule === option.id && styles.radioSelected,
              ]}>
                {selectedRule === option.id && <View style={styles.radioInner} />}
              </View>
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionLabel,
                  selectedRule === option.id && styles.optionLabelSelected,
                ]}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Push-Benachrichtigungen müssen in den Geräteeinstellungen aktiviert sein.
          </Text>
        </View>
      </Card>
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
    paddingBottom: spacing.md,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  sectionDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  options: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...typography.label,
    color: colors.text,
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  optionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.primaryLight,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.primary,
    flex: 1,
  },
});
