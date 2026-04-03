import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { InputField, Button, Card, SelectField } from '../components';
import type { SelectFieldOption } from '../components';
import { useData } from '../context/DataContext';
import { parseGermanDate } from '../utils/petHelpers';
import { useSubscription, FREE_LIMITS } from '../context/SubscriptionContext';
import { RecurrenceType, recurrenceDisplayLabels } from '../types';

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
  const { pets, addReminder, addVaccination, addTreatment, updateReminder } = useData();
  const preselectedPetId = route.params?.petId;
  const preselectedEventType = route.params?.eventType;
  const editEvent = route.params?.editEvent;
  const isEditMode = !!editEvent;

  const initialStep = (): Step => {
    if (isEditMode || preselectedEventType) return 'config';
    if (preselectedPetId) return 'select-type';
    return 'select-pet';
  };

  const [step, setStep] = useState<Step>(initialStep);
  const [selectedPetId, setSelectedPetId] = useState(preselectedPetId || '');
  const [selectedType, setSelectedType] = useState(editEvent?.type || preselectedEventType || '');
  const [title, setTitle] = useState(() => {
    if (editEvent?.title) return editEvent.title;
    if (preselectedEventType) {
      const type = eventTypes.find(t => t.id === preselectedEventType);
      return type?.label || '';
    }
    return '';
  });
  const [date, setDate] = useState(() => {
    if (editEvent?.date) {
      const d = new Date(editEvent.date);
      return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
    }
    return '';
  });
  const [notes, setNotes] = useState(editEvent?.description || '');
  const [recurrence, setRecurrence] = useState<RecurrenceType>(editEvent?.recurrence || 'Once');
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
    try {
      // Edit mode: update existing reminder
      if (isEditMode && editEvent?.id) {
        await updateReminder(editEvent.id, {
          title: title.trim(),
          date: isoDate,
          description: notes.trim() || undefined,
          recurrence,
        });
        navigation.goBack();
        return;
      }

      if (selectedType === 'vaccination') {
        // Save as vaccination record + create reminder for next date
        await addVaccination({
          petId: selectedPetId,
          name: title.trim(),
          givenDate: isoDate,
          nextDate,
          recurrenceInterval: recurrence !== 'Once' ? recurrence : undefined,
        });
        // Auto-create reminder for next vaccination date
        if (nextDate) {
          await addReminder({
            petId: selectedPetId,
            title: `${title.trim()} fällig`,
            date: nextDate,
            description: `Nächste ${title.trim()} für dein Tier`,
            recurrence,
          });
        }
      } else if (selectedType === 'deworming' || selectedType === 'checkup') {
        // Save as treatment record
        await addTreatment({
          petId: selectedPetId,
          name: title.trim(),
          date: isoDate,
          notes: notes.trim() || undefined,
        });
        // Create reminder for next occurrence if recurring
        if (nextDate) {
          await addReminder({
            petId: selectedPetId,
            title: `${title.trim()} fällig`,
            date: nextDate,
            description: notes.trim() || undefined,
            recurrence,
          });
        }
      } else {
        // Custom: save as reminder
        await addReminder({
          petId: selectedPetId || undefined,
          title: title.trim(),
          date: isoDate,
          description: notes.trim() || undefined,
          recurrence,
        });
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Fehler', e.message || 'Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  const getStepTitle = () => {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
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
