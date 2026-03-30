import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={40} color={colors.surface} />
        </View>
        <Text style={styles.title}>VetApp</Text>
        <Text style={styles.subtitle}>
          Your pet's health companion. Warm, trustworthy, always there.
        </Text>
        <Text style={styles.description}>
          Manage health records, vaccinations, and appointments with care — all in one beautiful place.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Get Started" onPress={onGetStarted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    fontSize: 36,
    color: colors.textOnPrimary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textOnPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    opacity: 0.95,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textOnPrimary,
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: spacing.md,
  },
  buttonContainer: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
});
