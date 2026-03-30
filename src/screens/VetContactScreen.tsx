import React from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card, Button } from '../components';
import { useData } from '../context/DataContext';

export function VetContactScreen() {
  const { vetContact: vet } = useData();

  const handleCall = () => {
    Linking.openURL(`tel:${vet.phone}`).catch(() =>
      Alert.alert('Error', 'Could not open phone app.')
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vet Contact</Text>

      <Card style={styles.vetCard}>
        <Text style={styles.vetName}>{vet.name}</Text>
        <Text style={styles.vetClinic}>{vet.clinic}</Text>

        <View style={styles.infoRows}>
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{vet.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{vet.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{vet.address}</Text>
            </View>
          </View>
        </View>
      </Card>

      <Button title="Call Vet" onPress={handleCall} style={styles.callButton} />

      <Card style={styles.emergencyCard}>
        <Text style={styles.emergencyTitle}>Emergency?</Text>
        <Text style={styles.emergencyText}>
          For after-hours emergencies, please call the emergency hotline at +1 555-EMERGENCY
        </Text>
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
  title: {
    ...typography.h1,
    color: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  vetCard: {
    marginBottom: spacing.md,
  },
  vetName: {
    ...typography.h2,
    color: colors.text,
  },
  vetClinic: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  infoRows: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
  },
  callButton: {
    marginBottom: spacing.md,
  },
  emergencyCard: {
    backgroundColor: colors.warningLight,
  },
  emergencyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  emergencyText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
