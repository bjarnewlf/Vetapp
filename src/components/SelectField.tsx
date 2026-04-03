import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

export interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: SelectFieldOption[];
  onSelect: (value: string) => void;
  rightElement?: React.ReactNode;
}

export function SelectField({
  label,
  placeholder = 'Auswählen...',
  value,
  options,
  onSelect,
  rightElement,
}: SelectFieldProps) {
  const [showOptions, setShowOptions] = useState(false);

  const selectedLabel = options.find(o => o.value === value)?.label;

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Text style={selectedLabel ? styles.pickerText : styles.pickerPlaceholder}>
          {selectedLabel ?? placeholder}
        </Text>
        <View style={styles.pickerRight}>
          {rightElement}
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.pickerOptions}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.pickerOption}
              onPress={() => {
                onSelect(option.value);
                setShowOptions(false);
              }}
            >
              <Text style={[
                styles.pickerOptionText,
                value === option.value && styles.pickerOptionSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: 6,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  pickerText: {
    ...typography.body,
    color: colors.text,
  },
  pickerPlaceholder: {
    ...typography.body,
    color: colors.textLight,
  },
  pickerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pickerOptions: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: -12,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pickerOptionText: {
    ...typography.body,
    color: colors.text,
  },
  pickerOptionSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
