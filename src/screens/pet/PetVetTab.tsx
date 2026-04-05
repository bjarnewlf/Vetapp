import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { Card } from '../../components';
import type { VetContact } from '../../types';

interface PetVetTabProps {
  vet: VetContact | null;
}

export function PetVetTab({ vet }: PetVetTabProps) {
  return (
    <View style={styles.tabContent}>
      <Card>
        <Text style={styles.sectionLabel}>ZUGEWIESENER TIERARZT</Text>
        {!vet ? (
          <Text style={styles.emptyText}>Noch kein Tierarzt gespeichert</Text>
        ) : (
          <>
            <Text style={styles.vetName}>{vet.name}</Text>
            <Text style={styles.vetClinic}>{vet.clinic}</Text>
            <View style={styles.vetInfoRow}>
              <Ionicons name="call-outline" size={16} color={colors.primary} />
              <Text style={styles.vetInfoText}>{vet.phone}</Text>
            </View>
            <View style={styles.vetInfoRow}>
              <Ionicons name="mail-outline" size={16} color={colors.primary} />
              <Text style={styles.vetInfoText}>{vet.email}</Text>
            </View>
            <View style={styles.vetInfoRow}>
              <Ionicons name="location-outline" size={16} color={colors.primary} />
              <Text style={styles.vetInfoText}>{vet.address}</Text>
            </View>
          </>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: { paddingHorizontal: spacing.md },
  sectionLabel: { ...typography.sectionHeader, color: colors.textSecondary, marginBottom: spacing.md },
  emptyText: { ...typography.bodySmall, color: colors.textLight },
  vetName: { ...typography.h3, color: colors.text },
  vetClinic: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  vetInfoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  vetInfoText: { ...typography.bodySmall, color: colors.text },
});
