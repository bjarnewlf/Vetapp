import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { InputField, Button, SelectField } from '../components';
import type { SelectFieldOption } from '../components';
import { RecurrenceType, recurrenceDisplayLabels } from '../types';
import { usePets } from '../context/PetContext';
import { useMedical } from '../context/MedicalContext';
import { parseGermanDate } from '../utils/petHelpers';

const recurrenceOptions: RecurrenceType[] = ['Once', 'Weekly', 'Monthly', 'Yearly', 'Custom'];

interface AddReminderScreenProps {
  navigation: any;
}

export function AddReminderScreen({ navigation }: AddReminderScreenProps) {
  const { pets } = usePets();
  const { addReminder } = useMedical();
  const [petId, setPetId] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('Once');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    if (!title.trim()) {
      Alert.alert('Fehlende Angabe', 'Bitte gib einen Titel ein.');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Fehlende Angabe', 'Bitte gib ein Datum ein.');
      return;
    }

    // Parse date from tt.mm.jjjj to ISO
    const isoDate = parseGermanDate(date);
    if (!isoDate) {
      Alert.alert('Ungültiges Datum', 'Bitte gib ein gültiges Datum im Format tt.mm.jjjj ein.');
      return;
    }

    setSaving(true);
    const success = await addReminder({
      petId: petId || undefined,
      title: title.trim(),
      date: isoDate,
      description: description.trim() || undefined,
      recurrence,
    });
    setSaving(false);

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Fehler', 'Speichern fehlgeschlagen. Bitte versuche es erneut.');
    }
  };

  const petOptions: SelectFieldOption[] = [
    { value: '', label: 'Allgemeine Erinnerung' },
    ...pets.map(pet => ({ value: pet.id, label: pet.name })),
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Erinnerung hinzufügen</Text>
      </View>

      <View style={styles.form}>
        {/* Pet Picker */}
        <SelectField
          label="Tier (Optional)"
          placeholder="Allgemeine Erinnerung"
          value={petId}
          options={petOptions}
          onSelect={v => setPetId(v)}
        />

        <InputField
          label="Titel"
          placeholder="z.B. Tierarzttermin, Futter kaufen"
          value={title}
          onChangeText={setTitle}
        />

        <InputField
          label="Datum"
          placeholder="tt.mm.jjjj"
          value={date}
          onChangeText={setDate}
        />

        <InputField
          label="Beschreibung"
          placeholder="Weitere Details..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: 'top' }}
        />

        {/* Recurrence Picker */}
        <SelectField
          label="Wiederholung"
          value={recurrence}
          options={recurrenceOptions.map<SelectFieldOption>(opt => ({ value: opt, label: recurrenceDisplayLabels[opt] }))}
          onSelect={v => setRecurrence(v as RecurrenceType)}
        />

        <Button title={saving ? 'Wird gespeichert...' : 'Erinnerung speichern'} onPress={handleSave} style={styles.saveButton} disabled={saving} />
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
  saveButton: { marginTop: spacing.md },
});
