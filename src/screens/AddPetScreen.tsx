import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, borderRadius } from '../theme';
import { InputField, Button, SelectField } from '../components';
import type { SelectFieldOption } from '../components';
import { AnimalType, animalTypeDisplayLabels } from '../types';
import { usePets } from '../context/PetContext';
import { useSubscription, FREE_LIMITS } from '../context/SubscriptionContext';
import { parseGermanDate } from '../utils/petHelpers';
import type { Pet } from '../types';
import type { RootStackNavProp, RootStackRouteProp } from '../types/navigation';

const animalTypes: AnimalType[] = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Reptile', 'Other'];

function toGermanDate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return '';
  return `${day}.${month}.${year}`;
}

interface AddPetScreenProps {
  navigation: RootStackNavProp<'AddPet'>;
  route: RootStackRouteProp<'AddPet'>;
}

export function AddPetScreen({ navigation, route }: AddPetScreenProps) {
  const editPet: Pet | undefined = route?.params?.pet;
  const isEditMode = !!editPet;

  const { addPet, updatePet, pets } = usePets();
  const { isPro } = useSubscription();
  const [name, setName] = useState(editPet?.name ?? '');
  const [animalType, setAnimalType] = useState<AnimalType | ''>(editPet?.type ?? '');
  const [breed, setBreed] = useState(editPet?.breed ?? '');
  const [birthDate, setBirthDate] = useState(editPet ? toGermanDate(editPet.birthDate) : '');
  const [microchip, setMicrochip] = useState(editPet?.microchipCode ?? '');
  // Vorschau-URI: signed URL (bestehendes Foto) oder lokale URI (neu ausgewählt)
  const [photoPreviewUri, setPhotoPreviewUri] = useState<string | null>(editPet?.photo ?? null);
  // Neu ausgewählte lokale URI — wird beim Speichern hochgeladen
  const [newPhotoUri, setNewPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoPreviewUri(result.assets[0].uri);
      setNewPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    if (!name.trim()) {
      Alert.alert('Fehlende Angabe', 'Bitte gib einen Namen ein.');
      return;
    }
    if (!animalType) {
      Alert.alert('Fehlende Angabe', 'Bitte wähle eine Tierart.');
      return;
    }

    // Free tier: max 1 pet — nur beim Hinzufügen prüfen
    if (!isEditMode && !isPro && pets.length >= FREE_LIMITS.maxPets) {
      navigation.navigate('Paywall', { feature: 'pets' });
      return;
    }

    // Parse date from tt.mm.jjjj to ISO
    let isoDate: string | null = null;
    if (birthDate.trim()) {
      isoDate = parseGermanDate(birthDate);
      if (!isoDate) {
        Alert.alert('Ungültiges Datum', 'Bitte gib ein gültiges Datum im Format tt.mm.jjjj ein.');
        return;
      }
    }

    setSaving(true);
    let success: boolean;

    // newPhotoUri wird an addPet/updatePet übergeben — der Context übernimmt den Upload
    if (isEditMode && editPet) {
      success = await updatePet(
        editPet.id,
        {
          name: name.trim(),
          type: animalType,
          breed: breed.trim(),
          birthDate: isoDate ?? editPet.birthDate,
          microchipCode: microchip.trim() || undefined,
        },
        newPhotoUri ?? undefined,
      );
    } else {
      success = await addPet(
        {
          name: name.trim(),
          type: animalType,
          breed: breed.trim(),
          birthDate: isoDate ?? new Date().toISOString().split('T')[0],
          microchipCode: microchip.trim() || undefined,
        },
        newPhotoUri ?? undefined,
      );
    }
    setSaving(false);

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Fehler', 'Speichern fehlgeschlagen. Bitte versuche es erneut.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{isEditMode ? 'Tier bearbeiten' : 'Tier hinzufügen'}</Text>
      </View>

      <View style={styles.form}>
        {/* Photo Upload */}
        <Text style={styles.label}>Foto</Text>
        <TouchableOpacity style={styles.photoUpload} onPress={pickImage}>
          {photoPreviewUri ? (
            <Image source={{ uri: photoPreviewUri }} style={styles.photoPreview} resizeMode="cover" />
          ) : (
            <>
              <Ionicons name="camera-outline" size={32} color={colors.textLight} />
              <Text style={styles.photoText}>Tippe um ein Foto auszuwählen</Text>
            </>
          )}
        </TouchableOpacity>

        <InputField
          label="Name"
          placeholder="z.B. Max, Luna, Bello..."
          value={name}
          onChangeText={setName}
        />

        {/* Animal Type Picker */}
        <SelectField
          label="Tierart"
          placeholder="Tierart wählen"
          value={animalType}
          options={animalTypes.map<SelectFieldOption>(t => ({ value: t, label: animalTypeDisplayLabels[t] }))}
          onSelect={v => setAnimalType(v as AnimalType)}
        />

        <InputField
          label="Rasse"
          placeholder="z.B. Golden Retriever"
          value={breed}
          onChangeText={setBreed}
        />

        <InputField
          label="Geburtsdatum"
          placeholder="tt.mm.jjjj"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <InputField
          label="Chip-Nummer"
          placeholder="z.B. 982000123456789"
          value={microchip}
          onChangeText={setMicrochip}
          keyboardType="numeric"
        />

        <Button
          title={saving ? 'Wird gespeichert...' : (isEditMode ? 'Änderungen speichern' : 'Tier speichern')}
          onPress={handleSave}
          style={styles.saveButton}
          disabled={saving}
        />
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
  title: { ...typography.h2, color: colors.text },
  form: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  label: { ...typography.label, color: colors.text, marginBottom: 6 },
  photoUpload: {
    borderWidth: 1, borderColor: colors.borderLight, borderRadius: borderRadius.md,
    borderStyle: 'dashed', padding: spacing.lg, alignItems: 'center',
    marginBottom: spacing.md, backgroundColor: colors.surface,
  },
  photoText: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  photoPreview: { width: 120, height: 120, borderRadius: borderRadius.md },
  saveButton: { marginTop: spacing.md },
});
