import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', style, disabled }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style, disabled && styles.disabled]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.primaryDark,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  text: {
    ...typography.button,
    color: colors.textOnAccent,
  },
  outlineText: {
    color: colors.accent,
  },
  disabled: {
    opacity: 0.5,
  },
});
