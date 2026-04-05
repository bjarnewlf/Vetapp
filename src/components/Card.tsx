import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

type CardVariant = 'default' | 'tinted' | 'warning' | 'error';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, { backgroundColor: string; borderColor: string }> = {
  default: {
    backgroundColor: colors.surface,
    borderColor: 'transparent',
  },
  tinted: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },
  warning: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warningBorder,
  },
  error: {
    backgroundColor: colors.errorLight,
    borderColor: colors.errorBorder,
  },
};

export function Card({ children, style, variant = 'default' }: CardProps) {
  const vStyle = variantStyles[variant];
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: vStyle.backgroundColor, borderColor: vStyle.borderColor },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
});
