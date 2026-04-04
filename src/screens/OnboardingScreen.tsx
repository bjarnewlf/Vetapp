import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, borderRadius } from '../theme';
import { InputField, Button, SelectField } from '../components';
import type { SelectFieldOption } from '../components';
import { AnimalType } from '../types';
import { usePets } from '../context/PetContext';
import { useAuth } from '../context/AuthContext';
import { parseGermanDate } from '../utils/petHelpers';

const animalTypes: AnimalType[] = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Reptile', 'Other'];

const animalTypeLabels: Record<AnimalType, string> = {
  Dog: 'Hund',
  Cat: 'Katze',
  Bird: 'Vogel',
  Rabbit: 'Kaninchen',
  Fish: 'Fisch',
  Reptile: 'Reptil',
  Other: 'Andere',
};

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { user } = useAuth();
  const { addPet } = usePets();
  const [step, setStep] = useState<'welcome' | 'addPet'>('welcome');
  const [name, setName] = useState('');
  const [animalType, setAnimalType] = useState<AnimalType | ''>('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const userName = user?.user_metadata?.name || 'Tierbesitzer';

  const handleSavePet = async () => {
    if (!name.trim()) {
      Alert.alert('Fehlende Angabe', 'Bitte gib einen Namen für dein Tier ein.');
      return;
    }
    if (!animalType) {
      Alert.alert('Fehlende Angabe', 'Bitte wähle eine Tierart.');
      return;
    }

    let isoDate: string | null = null;
    if (birthDate.trim()) {
      isoDate = parseGermanDate(birthDate);
      if (!isoDate) {
        Alert.alert('Ungültiges Datum', 'Bitte gib ein gültiges Datum im Format tt.mm.jjjj ein.');
        return;
      }
    }

    setSaving(true);
    await addPet({
      name: name.trim(),
      type: animalType,
      breed: breed.trim(),
      birthDate: isoDate ?? new Date().toISOString().split('T')[0],
      microchipCode: undefined,
      photo: photoUri || undefined,
    });
    setSaving(false);
    onComplete();
  };

  if (step === 'welcome') {
    return (
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart" size={48} color={colors.surface} />
          </View>
          <Text style={styles.welcomeTitle}>Willkommen, {userName}!</Text>
          <Text style={styles.welcomeSubtitle}>
            Schön, dass du VetApp nutzt. Lass uns dein erstes Tier hinzufügen, damit du direkt loslegen kannst.
          </Text>
          <TouchableOpacity
            style={styles.welcomeButton}
            onPress={() => setStep('addPet')}
            activeOpacity={0.8}
          >
            <Text style={styles.welcomeButtonText}>Los geht's!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dein erstes Tier</Text>
        <Text style={styles.headerSubtitle}>
          Erzähl uns etwas über deinen Liebling
        </Text>
      </View>

      <View style={styles.form}>
        <TouchableOpacity style={styles.photoUpload} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={32} color={colors.textLight} />
              <Text style={styles.photoText}>Foto hinzufügen (optional)</Text>
            </>
          )}
        </TouchableOpacity>

        <InputField
          label="Name deines Tieres"
          placeholder="z.B. Max, Luna, Bello..."
          value={name}
          onChangeText={setName}
        />

        <SelectField
          label="Tierart"
          placeholder="Tierart wählen"
          value={animalType}
          options={animalTypes.map<SelectFieldOption>(t => ({ value: t, label: animalTypeLabels[t] }))}
          onSelect={v => setAnimalType(v as AnimalType)}
        />

        <InputField
          label="Rasse (optional)"
          placeholder="z.B. Golden Retriever"
          value={breed}
          onChangeText={setBreed}
        />

        <InputField
          label="Geburtsdatum (optional)"
          placeholder="tt.mm.jjjj"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <Button
          title={saving ? 'Wird gespeichert...' : 'Tier hinzufügen'}
          onPress={handleSavePet}
          disabled={saving}
          style={styles.saveButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  welcomeContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    ...typography.h1,
    color: colors.textOnPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.textOnPrimary,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  welcomeButton: {
    width: '100%',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  welcomeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 80,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textOnPrimary,
    opacity: 0.85,
  },
  form: {
    padding: spacing.lg,
  },
  photoUpload: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    borderStyle: 'dashed',
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  photoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.md,
  },
  saveButton: { marginTop: spacing.md },
});
