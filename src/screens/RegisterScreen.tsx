import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { InputField, Button } from '../components';
import { useAuth } from '../context/AuthContext';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

export function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Fehlende Angaben', 'Bitte alle Felder ausfüllen.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Passwort zu kurz', 'Bitte mindestens 6 Zeichen verwenden.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (error) {
      Alert.alert('Registrierung fehlgeschlagen', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={36} color={colors.surface} />
        </View>
        <Text style={styles.title}>VetApp</Text>
        <Text style={styles.subtitle}>Neues Konto erstellen</Text>
      </View>

      <View style={styles.form}>
        <InputField
          label="Name"
          placeholder="Dein Name"
          value={name}
          onChangeText={setName}
        />
        <InputField
          label="E-Mail"
          placeholder="deine@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Passwort"
          placeholder="Mindestens 6 Zeichen"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          title={loading ? 'Wird erstellt...' : 'Registrieren'}
          onPress={handleRegister}
          style={styles.button}
        />
        <TouchableOpacity onPress={onSwitchToLogin} style={styles.switchRow}>
          <Text style={styles.switchText}>Schon ein Konto? </Text>
          <Text style={styles.switchLink}>Anmelden</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    color: colors.textOnPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textOnPrimary,
    opacity: 0.85,
    marginTop: 4,
  },
  form: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  button: {
    marginTop: spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  switchText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  switchLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
