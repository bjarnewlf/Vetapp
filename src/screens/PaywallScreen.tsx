import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Button } from '../components';
import { useSubscription } from '../context/SubscriptionContext';
import type { RootStackNavProp, RootStackRouteProp } from '../types/navigation';

interface PaywallScreenProps {
  navigation: RootStackNavProp<'Paywall'>;
  route: RootStackRouteProp<'Paywall'>;
}

const proFeatures = [
  { icon: 'paw' as const, label: 'Unbegrenzte Haustiere', description: 'Verwalte alle deine Tiere' },
  { icon: 'calendar' as const, label: 'Eigene Ereignistypen', description: 'Erstelle individuelle Events' },
  { icon: 'repeat' as const, label: 'Wiederholungen', description: 'Automatische Fälligkeiten' },
  { icon: 'document' as const, label: 'Dokumente', description: 'Fotos & PDFs speichern' },
  { icon: 'download' as const, label: 'PDF-Export', description: 'Gesundheitsdaten exportieren' },
];

export function PaywallScreen({ navigation, route }: PaywallScreenProps) {
  const { togglePro } = useSubscription();
  const feature = route.params?.feature || '';

  const handleUpgrade = () => {
    // In production: trigger in-app purchase
    togglePro();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Ionicons name="close" size={28} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={32} color={colors.textOnPrimary} />
        </View>
        <Text style={styles.title}>VetApp Pro</Text>
        <Text style={styles.subtitle}>
          Schalte alle Funktionen frei und verwalte die Gesundheit deiner Tiere ohne Einschränkungen.
        </Text>
      </View>

      <View style={styles.features}>
        {proFeatures.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDescription}>{f.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.pricing}>
        <Text style={styles.price}>4,99 € / Monat</Text>
        <Text style={styles.priceNote}>oder 39,99 € / Jahr (spare 33%)</Text>
      </View>

      <Button title="Jetzt upgraden" onPress={handleUpgrade} style={styles.upgradeButton} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.laterText}>Vielleicht später</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.sm,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  features: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureLabel: {
    ...typography.label,
    color: colors.text,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  pricing: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  price: {
    ...typography.h2,
    color: colors.text,
  },
  priceNote: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  upgradeButton: {
    marginBottom: spacing.md,
  },
  laterText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
