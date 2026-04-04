import React from 'react';
import { View, Text, StyleSheet, Linking, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card, Button } from '../components';
import { useVetContact } from '../context/VetContactContext';

interface VetContactScreenProps {
  navigation?: any;
}

export function VetContactScreen({ navigation }: VetContactScreenProps) {
  const { vetContact: vet } = useVetContact();

  if (!vet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tierarzt</Text>
        <Card style={{ alignItems: 'center' as const, marginTop: 32 }}>
          <Ionicons name="medkit-outline" size={48} color={colors.textLight} />
          <Text style={{ ...typography.body, color: colors.textLight, marginTop: 8 }}>
            Noch kein Tierarzt gespeichert
          </Text>
          <Button
            title="Tierarzt hinzufügen"
            onPress={() => navigation?.navigate('AddVetContact')}
            style={{ marginTop: 16 }}
          />
        </Card>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${vet.phone}`).catch(() =>
      Alert.alert('Error', 'Could not open phone app.')
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Tierarzt</Text>
        <TouchableOpacity onPress={() => navigation?.navigate('AddVetContact')}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Card style={styles.vetCard}>
        <Text style={styles.vetName}>{vet.name}</Text>
        <Text style={styles.vetClinic}>{vet.clinic}</Text>

        <View style={styles.infoRows}>
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Telefon</Text>
              <Text style={styles.infoValue}>{vet.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>E-Mail</Text>
              <Text style={styles.infoValue}>{vet.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Adresse</Text>
              <Text style={styles.infoValue}>{vet.address}</Text>
            </View>
          </View>
        </View>
      </Card>

      <Button title="Tierarzt anrufen" onPress={handleCall} style={styles.callButton} />

      <Card style={styles.emergencyCard}>
        <Text style={styles.emergencyTitle}>Notfall?</Text>
        <Text style={styles.emergencyText}>
          Für Notfälle außerhalb der Sprechzeiten, ruf bitte den tierärztlichen Notdienst an.
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
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
