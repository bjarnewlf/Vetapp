import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card, Button } from '../components';
import { mockUser } from '../data/mockData';

export function ProfileScreen() {
  const user = mockUser;

  const premiumFeatures = [
    { icon: 'globe-outline' as const, label: 'AI Health Assistant' },
    { icon: 'camera-outline' as const, label: 'Symptom Photo Analysis' },
    { icon: 'trending-up-outline' as const, label: 'Health Trends & Reports' },
    { icon: 'notifications-outline' as const, label: 'Smart Reminder System' },
  ];

  const settingsItems = [
    'Notifications',
    'Privacy & Security',
    'Help & Support',
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Profile & Settings</Text>

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
          <TouchableOpacity>
            <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Premium Features */}
      <View style={styles.premiumCard}>
        <View style={styles.premiumHeader}>
          <Ionicons name="sparkles" size={20} color={colors.textOnPrimary} />
          <Text style={styles.premiumTitle}>Premium Features</Text>
        </View>
        <Text style={styles.premiumSubtitle}>
          Unlock AI-powered insights and advanced features
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
          title="Upgrade to Premium →"
          onPress={() => {}}
          style={styles.upgradeButton}
        />
      </View>

      {/* AI Assistant Teaser */}
      <Card style={styles.aiCard}>
        <View style={styles.aiRow}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={22} color={colors.primary} />
          </View>
          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>AI Pet Health Assistant →</Text>
          </View>
        </View>
        <Text style={styles.aiDescription}>
          Coming soon: Get personalized health recommendations, early warning signs, and expert advice powered by AI.
        </Text>
        <TouchableOpacity>
          <Text style={styles.previewLink}>✨ Preview Premium Features →</Text>
        </TouchableOpacity>
      </Card>

      {/* Settings Items */}
      <Card style={styles.settingsCard}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.settingsItem,
              index < settingsItems.length - 1 && styles.settingsItemBorder,
            ]}
          >
            <Text style={styles.settingsItemText}>{item}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.signOutText}>Sign Out</Text>
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
