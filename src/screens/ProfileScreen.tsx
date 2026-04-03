import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card, Button } from '../components';
import { useAuth } from '../context/AuthContext';
export function ProfileScreen({ navigation }: { navigation: any }) {
  const { user: authUser, signOut } = useAuth();
  const user = {
    name: authUser?.user_metadata?.name || 'User',
    email: authUser?.email || '',
    phone: '',
  };

  const premiumFeatures = [
    { icon: 'globe-outline' as const, label: 'KI-Gesundheitsassistent' },
    { icon: 'camera-outline' as const, label: 'Symptom-Fotoanalyse' },
    { icon: 'trending-up-outline' as const, label: 'Gesundheitstrends & Berichte' },
    { icon: 'notifications-outline' as const, label: 'Intelligente Erinnerungen' },
  ];

  const settingsItems = [
    { label: 'Benachrichtigungen', onPress: () => navigation.navigate('ReminderSettings') },
    { label: 'Datenschutz & Sicherheit', onPress: () => {} },
    { label: 'Hilfe & Support', onPress: () => {} },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Profil & Einstellungen</Text>

      {/* User Info */}
      <Card style={styles.userCard}>
        <View style={styles.userRow}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={32} color={colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Profil bearbeiten', 'Diese Funktion ist noch in Entwicklung.')}>
            <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Premium Features */}
      <View style={styles.premiumCard}>
        <View style={styles.premiumHeader}>
          <Ionicons name="sparkles" size={20} color={colors.textOnPrimary} />
          <Text style={styles.premiumTitle}>Premium-Funktionen</Text>
        </View>
        <Text style={styles.premiumSubtitle}>
          KI-gestützte Einblicke und erweiterte Funktionen freischalten
        </Text>
        <View style={styles.premiumFeatures}>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.premiumFeatureRow}>
              <Ionicons name={feature.icon} size={20} color={colors.textOnPrimary} />
              <Text style={styles.premiumFeatureLabel}>{feature.label}</Text>
            </View>
          ))}
        </View>
        <Button
          title="Auf Premium upgraden →"
          onPress={() => navigation.navigate('Paywall', { feature: 'premium' })}
          style={styles.upgradeButton}
        />
      </View>

      {/* AI Assistant Teaser */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AIAssistant')}
      >
        <Card style={styles.aiCard}>
          <View style={styles.aiRow}>
            <View style={styles.aiIcon}>
              <Ionicons name="sparkles" size={22} color={colors.primary} />
            </View>
            <View style={styles.aiContent}>
              <Text style={styles.aiTitle}>KI-Gesundheitsassistent →</Text>
            </View>
          </View>
          <Text style={styles.aiDescription}>
            Kommt bald: Personalisierte Gesundheitsempfehlungen, Frühwarnzeichen und Expertenrat — powered by KI.
          </Text>
        </Card>
      </TouchableOpacity>

      {/* Settings Items */}
      <Card style={styles.settingsCard}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.settingsItem,
              index < settingsItems.length - 1 && styles.settingsItemBorder,
            ]}
            onPress={item.onPress}
          >
            <Text style={styles.settingsItemText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.settingsItem} onPress={signOut}>
          <Text style={styles.signOutText}>Abmelden</Text>
        </TouchableOpacity>
      </Card>

      <View style={{ height: 40 }} />
    </ScrollView>
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
    color: colors.text,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  userCard: {
    marginBottom: spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.h3,
    color: colors.text,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  userPhone: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  premiumCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 4,
  },
  premiumTitle: {
    ...typography.h3,
    color: colors.textOnPrimary,
  },
  premiumSubtitle: {
    ...typography.bodySmall,
    color: colors.textOnPrimary,
    opacity: 0.85,
    marginBottom: spacing.md,
  },
  premiumFeatures: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  premiumFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  premiumFeatureLabel: {
    ...typography.body,
    color: colors.textOnPrimary,
  },
  upgradeButton: {
    backgroundColor: colors.accent,
  },
  aiCard: {
    marginBottom: spacing.md,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    ...typography.h3,
    color: colors.text,
  },
  aiDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  previewLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  settingsCard: {
    marginBottom: spacing.md,
    padding: 0,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingsItemText: {
    ...typography.body,
    color: colors.text,
  },
  signOutText: {
    ...typography.body,
    color: colors.error,
  },
});
