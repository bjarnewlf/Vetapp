import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { InputField, Button, Card, SelectField } from '../components';
import type { SelectFieldOption } from '../components';
import { usePets } from '../context/PetContext';
import { useMedical } from '../context/MedicalContext';
import { parseGermanDate } from '../utils/petHelpers';
import { useSubscription } from '../context/SubscriptionContext';
import { RecurrenceType, MedicalEventType, recurrenceDisplayLabels } from '../types';

interface AddEventScreenProps {
  navigation: any;
  route: any;
}

type Step = 'select-pet' | 'select-type' | 'config';

const eventTypes = [
  { id: 'vaccination', label: 'Impfung', icon: 'bandage-outline' as const, free: true },
  { id: 'deworming', label: 'Entwurmung', icon: 'medical-outline' as const, free: false },
  { id: 'checkup', label: 'Vorsorge', icon: 'fitness-outline' as const, free: false },
  { id: 'custom', label: 'Eigener Typ', icon: 'add-circle-outline' as const, free: false },
];

const recurrenceOptions: RecurrenceType[] = ['Once', 'Weekly', 'Monthly', 'Yearly', 'Custom'];

export function AddEventScreen({ navigation, route }: AddEventScreenProps) {
  const { isPro } = useSubscription();
  const { pets } = usePets();
  const { addMedicalEvent, addReminder, updateReminder, updateMedicalEvent } = useMedical();
  const preselectedPetId = route.params?.petId;
  const preselectedEventType = route.params?.eventType;
  const editEvent = route.params?.editEvent;
  const editMedicalEvent = route.params?.editMedicalEvent;
  const isEditMode = !!editEvent || !!editMedicalEvent;

  const initialStep = (): Step => {
    if (isEditMode || preselectedEventType) return 'config';
    if (preselectedPetId) return 'select-type';
    return 'select-pet';
  };


  const [step, setStep] = useState<Step>(initialStep);
  const [selectedPetId, setSelectedPetId] = useState(preselectedPetId || '');
  const [selectedType, setSelectedType] = useState(editMedicalEvent?.type || editEvent?.type || preselectedEventType || '');
  const [title, setTitle] = useState(() => {
    if (editMedicalEvent?.name) return editMedicalEvent.name;
    if (editEvent?.title) return editEvent.title;
    if (preselectedEventType) {
      const type = eventTypes.find(t => t.id === preselectedEventType);
      return type?.label || '';
    }
    return '';
  });
  const [date, setDate] = useState(() => {
    const dateStr = editMedicalEvent?.date || editEvent?.date;
    if (dateStr) {
      const d = new Date(dateStr);
      return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
    }
    return '';
  });
  const [notes, setNotes] = useState(editMedicalEvent?.notes || editEvent?.description || '');
  const [recurrence, setRecurrence] = useState<RecurrenceType>(editMedicalEvent?.recurrenceInterval || editEvent?.recurrence || 'Once');
  const [saving, setSaving] = useState(false);

  const selectedPet = pets.find(p => p.id === selectedPetId);

  const handleSelectPet = (petId: string) => {
    setSelectedPetId(petId);
    setStep('select-type');
  };

  const handleSelectType = (typeId: string) => {
    const type = eventTypes.find(t => t.id === typeId);
    if (type && !type.free && !isPro) {
      navigation.navigate('Paywall', { feature: typeId });
      return;
    }
    setSelectedType(typeId);
    const typeLabel = type?.label || typeId;
    setTitle(typeLabel);
    setStep('config');
  };

  const handleSave = async () => {
    if (saving) return;
    if (!selectedPetId) {
      Alert.alert('Kein Tier ausgewählt', 'Bitte wähle zuerst ein Tier aus.');
      return;
    }
    if (!title.trim() || !date.trim()) {
      Alert.alert('Fehlende Angaben', 'Bitte fülle Titel und Datum aus.');
      return;
    }
    if (recurrence !== 'Once' && !isPro) {
      navigation.navigate('Paywall', { feature: 'recurrence' });
      return;
    }
    // Parse date
    const isoDate = parseGermanDate(date);
    if (!isoDate) {
      Alert.alert('Ungültiges Datum', 'Bitte gib ein gültiges Datum im Format tt.mm.jjjj ein.');
      return;
    }

    // Calculate next date for recurrence
    let nextDate: string | undefined;
    if (recurrence !== 'Once' && recurrence !== 'Custom') {
      const d = new Date(isoDate);
      switch (recurrence) {
        case 'Weekly': d.setDate(d.getDate() + 7); break;
        case 'Monthly': d.setMonth(d.getMonth() + 1); break;
        case 'Yearly': d.setFullYear(d.getFullYear() + 1); break;
      }
      nextDate = d.toISOString().split('T')[0];
    }

    setSaving(true);

    // MedicalEvent bearbeiten (aus PetDetailScreen via editMedicalEvent-Param)
    if (editMedicalEvent?.id) {
      const success = await updateMedicalEvent(editMedicalEvent.id, {
        name: title.trim(),
        date: isoDate,
        notes: notes.trim() || undefined,
        recurrenceInterval: recurrence !== 'Once' ? recurrence : undefined,
      });
      setSaving(false);
      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Fehler', 'Speichern fehlgeschlagen. Bitte versuche es erneut.');
      }
      return;
    }

    // Reminder bearbeiten (aus EventDetailScreen via editEvent-Param)
    if (editEvent?.id) {
      const success = await updateReminder(editEvent.id, {
        title: title.trim(),
        date: isoDate,
        description: notes.trim() || undefined,
        recurrence,
      });
      setSaving(false);
      if (success) {
        navigation.goBack();
      } else {
        Alert.alert('Fehler', 'Speichern fehlgeschlagen. Bitte versuche es erneut.');
      }
      return;
    }

    if (selectedType === 'custom') {
      // Custom: als MedicalEvent speichern
      const success = await addMedicalEvent({
        petId: selectedPetId,
        type: 'custom',
        name: title.trim(),
        date: isoDate,
        nextDate,
        notes: notes.trim() || undefined,
        recurrenceInterval: recurrence !== 'Once' ? recurrence : undefined,
      });
      if (!success) {
        setSaving(false);
        Alert.alert('Fehler', 'Speichern fehlgeschlagen. Bitte versuche es erneut.');
        return;
      }
      // Zusätzlich Erinnerung wenn nächstes Datum berechnet wurde
      if (nextDate) {
        await addReminder({
          petId: selectedPetId,
          title: `${title.trim()} fällig`,
          date: nextDate,
          description: notes.trim() || `Nächste ${title.trim()} für dein Tier`,
          recurrence,
        });
      }
    } else {
      // Alle anderen Typen als MedicalEvent speichern
      const eventType: MedicalEventType =
        selectedType === 'vaccination' ? 'vaccination'
        : selectedType === 'deworming' ? 'deworming'
        : 'checkup';

      const success = await addMedicalEvent({
        petId: selectedPetId,
        type: eventType,
        name: title.trim(),
        date: isoDate,
        nextDate,
        notes: notes.trim() || undefined,
        recurrenceInterval: recurrence !== 'Once' ? recurrence : undefined,
      });
      if (!success) {
        setSaving(false);
        Alert.alert('Fehler', 'Speichern fehlgeschlagen. Bitte versuche es erneut.');
        return;
      }

      // Auto-Erinnerung für nächstes Datum erstellen
      if (nextDate) {
        await addReminder({
          petId: selectedPetId,
          title: `${title.trim()} fällig`,
          date: nextDate,
          description: notes.trim() || `Nächste ${title.trim()} für dein Tier`,
          recurrence,
        });
      }
    }

    setSaving(false);
    navigation.goBack();
  };

  const getStepTitle = () => {
    if (editMedicalEvent) return 'Eintrag bearbeiten';
    switch (step) {
      case 'select-pet': return 'Tier wählen';
      case 'select-type': return 'Eventtyp wählen';
      case 'config': return 'Event konfigurieren';
    }
  };

  const handleBack = () => {
    if (step === 'config' && !preselectedEventType) setStep('select-type');
    else if (step === 'select-type' && !preselectedPetId) setStep('select-pet');
    else navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getStepTitle()}</Text>
      </View>

      {/* Progress indicator */}
      <View style={styles.progress}>
        {['select-pet', 'select-type', 'config'].map((s, i) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              (step === s || ['select-pet', 'select-type', 'config'].indexOf(step) > i)
                && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      {/* Step 1: Select Pet */}
      {step === 'select-pet' && (
        <View style={styles.content}>
          {pets.map((pet: any) => (
            <TouchableOpacity
              key={pet.id}
              style={styles.selectCard}
              onPress={() => handleSelectPet(pet.id)}
              activeOpacity={0.7}
            >
              <View style={styles.selectIcon}>
                <Ionicons name="paw" size={24} color={colors.primary} />
              </View>
              <View style={styles.selectInfo}>
                <Text style={styles.selectName}>{pet.name}</Text>
                <Text style={styles.selectSub}>{pet.breed}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Step 2: Select Event Type */}
      {step === 'select-type' && (
        <View style={styles.content}>
          {selectedPet && (
            <Text style={styles.forPetLabel}>Für: {selectedPet.name}</Text>
          )}
          {eventTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              style={styles.selectCard}
              onPress={() => handleSelectType(type.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.selectIcon, !type.free && !isPro && styles.lockedIcon]}>
                <Ionicons name={type.icon} size={24} color={!type.free && !isPro ? colors.textLight : colors.primary} />
              </View>
              <View style={styles.selectInfo}>
                <Text style={styles.selectName}>{type.label}</Text>
                {!type.free && !isPro && (
                  <View style={styles.proTag}>
                    <Ionicons name="lock-closed" size={10} color={colors.accent} />
                    <Text style={styles.proTagText}>Pro</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Step 3: Configure Event */}
      {step === 'config' && (
        <View style={styles.content}>
          {selectedPet && (
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{selectedPet.name} · {eventTypes.find(t => t.id === selectedType)?.label}</Text>
            </Card>
          )}

          <InputField
            label="Titel"
            placeholder="z.B. Tollwut-Impfung"
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
            label="Notizen"
            placeholder="Optionale Details..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top' }}
          />

          {/* Recurrence */}
          <SelectField
            label="Wiederholung"
            value={recurrence}
            options={recurrenceOptions.map<SelectFieldOption>(opt => ({ value: opt, label: recurrenceDisplayLabels[opt] }))}
            onSelect={v => setRecurrence(v as RecurrenceType)}
            rightElement={recurrence !== 'Once' && !isPro ? (
              <View style={styles.proTag}>
                <Ionicons name="lock-closed" size={10} color={colors.accent} />
                <Text style={styles.proTagText}>Pro</Text>
              </View>
            ) : undefined}
          />

          <Button title={saving ? 'Wird gespeichert...' : (isEditMode ? 'Aktualisieren' : 'Event speichern')} onPress={handleSave} style={styles.saveButton} disabled={saving} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  forPetLabel: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  selectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  lockedIcon: {
    backgroundColor: colors.borderLight,
  },
  selectInfo: {
    flex: 1,
  },
  selectName: {
    ...typography.h3,
    color: colors.text,
  },
  selectSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  proTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  proTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent,
  },
  summaryCard: {
    backgroundColor: colors.primaryLight,
  },
  summaryLabel: {
    ...typography.label,
    color: colors.primary,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
