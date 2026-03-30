import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { InputField, Button } from '../components';
import { RecurrenceType } from '../types';
import { useData } from '../context/DataContext';

const recurrenceOptions: RecurrenceType[] = ['Once', 'Weekly', 'Monthly', 'Yearly', 'Custom'];

interface AddReminderScreenProps {
  navigation: any;
}

export function AddReminderScreen({ navigation }: AddReminderScreenProps) {
  const { addReminder, pets } = useData();
  const [petId, setPetId] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('Once');
  const [showPetPicker, setShowPetPicker] = useState(false);
  const [showRecurrencePicker, setShowRecurrencePicker] = useState(false);

  const selectedPet = pets.find(p => p.id === petId);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Fehlende Angabe', 'Bitte gib einen Titel ein.');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Fehlende Angabe', 'Bitte gib ein Datum ein.');
      return;
    }

    // Parse date from tt.mm.jjjj to ISO
    let isoDate = '';
    const parts = date.split('.');
    if (parts.length === 3) {
      isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    } else {
      isoDate = date; // fallback: try raw input
    }

    addReminder({
      petId: petId || undefined,
      title: title.trim(),
      date: isoDate,
      description: description.trim() || undefined,
      recurrence,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Reminder</Text>
      </View>

      <View style={styles.form}>
        {/* Pet Picker */}
        <Text style={styles.label}>Pet (Optional)</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setShowPetPicker(!showPetPicker)}
        >
          <Text style={selectedPet ? styles.pickerText : styles.pickerPlaceholder}>
            {selectedPet ? selectedPet.name : 'General reminder'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        {showPetPicker && (
          <View style={styles.pickerOptions}>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => { setPetId(''); setShowPetPicker(false); }}
            >
              <Text style={styles.pickerOptionText}>General reminder</Text>
            </TouchableOpacity>
            {pets.map(pet => (
              <TouchableOpacity
                key={pet.id}
                style={styles.pickerOption}
                onPress={() => { setPetId(pet.id); setShowPetPicker(false); }}
              >
                <Text style={[
                  styles.pickerOptionText,
                  petId === pet.id && styles.pickerOptionSelected,
                ]}>{pet.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <InputField
          label="Reminder Title"
          placeholder="e.g., Vet appointment, Buy food"
          value={title}
          onChangeText={setTitle}
        />

        <InputField
          label="Date"
          placeholder="tt.mm.jjjj"
          value={date}
          onChangeText={setDate}
        />

        <InputField
          label="Description"
          placeholder="Add any details..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        {/* Recurrence Picker */}
        <Text style={styles.label}>Recurrence</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setShowRecurrencePicker(!showRecurrencePicker)}
        >
          <Text style={styles.pickerText}>{recurrence}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        {showRecurrencePicker && (
          <View style={styles.pickerOptions}>
            {recurrenceOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                style={styles.pickerOption}
                onPress={() => { setRecurrence(opt); setShowRecurrencePicker(false); }}
              >
                <Text style={[
                  styles.pickerOptionText,
                  recurrence === opt && styles.pickerOptionSelected,
                ]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Button title="Save Reminder" onPress={handleSave} style={styles.saveButton} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: spacing.md, paddingBottom: spacing.md,
  },
  backButton: { marginRight: spacing.md },
  headerTitle: { ...typography.h2, color: colors.text },
  form: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  label: { ...typography.label, color: colors.text, marginBottom: 6 },
  picker: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.sm,
    borderWidth: 1, borderColor: colors.borderLight,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: spacing.md,
  },
  pickerText: { ...typography.body, color: colors.text },
  pickerPlaceholder: { ...typography.body, color: colors.textLight },
  pickerOptions: {
    backgroundColor: colors.surface, borderRadius: borderRadius.sm,
    borderWidth: 1, borderColor: colors.border,
    marginTop: -12, marginBottom: spacing.md, overflow: 'hidden',
  },
  pickerOption: { paddingHorizontal: 14, paddingVertical: 10 },
  pickerOptionText: { ...typography.body, color: colors.text },
  pickerOptionSelected: { color: colors.primary, fontWeight: '600' },
  saveButton: { marginTop: spacing.md },
});
