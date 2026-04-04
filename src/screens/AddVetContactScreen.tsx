import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { InputField, Button } from '../components';
import { useVetContact } from '../context/VetContactContext';

interface AddVetContactScreenProps {
  navigation: any;
  route?: any;
}

export function AddVetContactScreen({ navigation, route }: AddVetContactScreenProps) {
  const { vetContact, saveVetContact } = useVetContact();
  const isEditing = !!vetContact && !route?.params?.forceNew;
  const existing = isEditing ? vetContact : null;

  const [name, setName] = useState(existing?.name || '');
  const [clinic, setClinic] = useState(existing?.clinic || '');
  const [phone, setPhone] = useState(existing?.phone || '');
  const [email, setEmail] = useState(existing?.email || '');
  const [address, setAddress] = useState(existing?.address || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    if (!name.trim()) {
      Alert.alert('Fehlende Angabe', 'Bitte gib den Namen des Tierarztes ein.');
      return;
    }

    setSaving(true);
    const success = await saveVetContact({
      name: name.trim(),
      clinic: clinic.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
    });
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
        <Text style={styles.title}>
          {isEditing ? 'Tierarzt bearbeiten' : 'Tierarzt hinzufügen'}
        </Text>
      </View>

      <View style={styles.form}>
        <InputField
          label="Name"
          placeholder="z.B. Dr. Müller"
          value={name}
          onChangeText={setName}
        />

        <InputField
          label="Praxis / Klinik"
          placeholder="z.B. Tierklinik am Park"
          value={clinic}
          onChangeText={setClinic}
        />

        <InputField
          label="Telefon"
          placeholder="z.B. +49 123 456789"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <InputField
          label="E-Mail"
          placeholder="z.B. praxis@tierarzt.de"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="Adresse"
          placeholder="z.B. Musterstraße 1, 10115 Berlin"
          value={address}
          onChangeText={setAddress}
        />

        <Button
          title={saving ? 'Wird gespeichert...' : (isEditing ? 'Speichern' : 'Tierarzt hinzufügen')}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: { marginRight: spacing.md },
  title: { ...typography.h2, color: colors.text },
  form: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  saveButton: { marginTop: spacing.md },
});
