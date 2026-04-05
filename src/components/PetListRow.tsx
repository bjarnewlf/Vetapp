import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';
import { Pet, animalTypeDisplayLabels } from '../types';

interface PetListRowProps {
  pet: Pet;
  onPress: () => void;
}

function calculateAge(birthDate?: string): string | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (totalMonths < 0) return null;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years >= 1) {
    return `${years} Jahr${years !== 1 ? 'e' : ''}`;
  }
  if (months >= 1) {
    return `${months} Monat${months !== 1 ? 'e' : ''}`;
  }
  return null;
}

export function PetListRow({ pet, onPress }: PetListRowProps) {
  const age = calculateAge(pet.birthDate);
  const typeLabel = animalTypeDisplayLabels[pet.type];
  const subtitle = age ? `${typeLabel} · ${age}` : typeLabel;

  return (
    <AnimatedPressable style={styles.row} onPress={onPress}>
      {/* Avatar */}
      {pet.photo ? (
        <Image source={{ uri: pet.photo }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="paw" size={18} color={colors.primary} />
        </View>
      )}

      {/* Text */}
      <View style={styles.textGroup}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
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
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textGroup: {
    flex: 1,
  },
  name: {
    ...typography.label,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
