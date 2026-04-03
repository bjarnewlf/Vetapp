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
import { useData } from '../context/DataContext';
import { useSubscription, FREE_LIMITS } from '../context/SubscriptionContext';
import { parseGermanDate } from '../utils/petHelpers';

const animalTypes: AnimalType[] = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Reptile', 'Other'];

interface AddPetScreenProps {
  navigation: any;
}

export function AddPetScreen({ navigation }: AddPetScreenProps) {
  const { addPet, pets } = useData();
  const { isPro } = useSubscription();
  const [name, setName] = useState('');
  const [animalType, setAnimalType] = useState<AnimalType | ''>('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
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

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Fehlende Angabe', 'Bitte gib einen Namen ein.');
      return;
    }
    if (!animalType) {
      Alert.alert('Fehlende Angabe', 'Bitte wähle eine Tierart.');
      return;
    }

    // Free tier: max 1 pet
    if (!isPro && pets.length >= FREE_LIMITS.maxPets) {
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

    addPet({
      name: name.trim(),
      type: animalType,
      breed: breed.trim(),
      birthDate: isoDate ?? new Date().toISOString().split('T')[0],
      microchipCode: microchip.trim() || undefined,
      photo: photoUri || undefined,
    });

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Tier hinzufügen</Text>
      </View>

      <View style={styles.form}>
        {/* Photo Upload */}
        <Text style={styles.label}>Foto</Text>
        <TouchableOpacity style={styles.photoUpload} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
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

        <Button title="Tier speichern" onPress={handleSave} style={styles.saveButton} />
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
