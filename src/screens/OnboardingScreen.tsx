import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Dimensions,
  ViewToken,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, typography, spacing, borderRadius } from '../theme';
import { InputField, Button, SelectField } from '../components';
import type { SelectFieldOption } from '../components';
import { AnimalType } from '../types';
import { usePets } from '../context/PetContext';
import { parseGermanDate } from '../utils/petHelpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

// ── Progress Dots ──────────────────────────────────────────────────────────────
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={dots.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            dots.dot,
            i === current ? dots.dotActive : dots.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

const dots = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.border,
  },
});

// ── Page 1: Welcome ────────────────────────────────────────────────────────────
function PageWelcome({
  onNext,
  onSkip,
  insetTop,
}: {
  onNext: () => void;
  onSkip: () => void;
  insetTop: number;
}) {
  return (
    <View style={[p1.container, { paddingTop: insetTop + spacing.lg }]}>
      <View style={p1.hero}>
        <View style={p1.circle}>
          <Ionicons name="heart" size={56} color={colors.primary} />
        </View>
        <Text style={[typography.h1, p1.title]}>Willkommen!</Text>
        <Text style={[typography.body, p1.subtitle]}>
          Gemeinsam fuer die Gesundheit deines Tieres.
        </Text>
      </View>

      <View style={p1.bottom}>
        <ProgressDots current={0} total={4} />
        <Button title="Weiter" variant="primary" size="large" onPress={onNext} style={p1.btn} />
        <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
          <Text style={p1.skipText}>Ueberspringen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const p1 = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  bottom: {
    width: '100%',
    gap: spacing.sm,
    alignItems: 'center',
  },
  btn: {
    width: '100%',
  },
  skipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

// ── Page 2: Features ───────────────────────────────────────────────────────────
function PageFeatures({
  onNext,
  insetTop,
}: {
  onNext: () => void;
  insetTop: number;
}) {
  return (
    <View style={[p2.container, { paddingTop: insetTop + spacing.lg }]}>
      <Text style={[typography.h2, p2.title]}>Was VetApp kann</Text>

      <View style={p2.cards}>
        {/* Card 1 */}
        <View style={p2.card}>
          <View style={p2.iconCircle}>
            <Ionicons name="heart-circle-outline" size={24} color={colors.primary} />
          </View>
          <View style={p2.cardText}>
            <Text style={[typography.label, p2.cardTitle]}>Gesundheit im Blick</Text>
            <Text style={[typography.caption, p2.cardDesc]}>
              Impfungen, Behandlungen, alles an einem Ort.
            </Text>
          </View>
        </View>

        {/* Card 2 */}
        <View style={p2.card}>
          <View style={p2.iconCircle}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </View>
          <View style={p2.cardText}>
            <Text style={[typography.label, p2.cardTitle]}>Nie wieder vergessen</Text>
            <Text style={[typography.caption, p2.cardDesc]}>
              Automatische Erinnerungen fuer alle Termine.
            </Text>
          </View>
        </View>

        {/* Card 3 — KI mit PRO-Pill */}
        <View style={p2.card}>
          <View style={[p2.iconCircle, p2.iconCircleAccent]}>
            <Ionicons name="sparkles" size={24} color={colors.accent} />
          </View>
          <View style={p2.cardText}>
            <View style={p2.cardHeader}>
              <Text style={[typography.label, p2.cardTitle]}>KI-Assistent</Text>
              <View style={p2.proPill}>
                <Text style={p2.proPillText}>PRO</Text>
              </View>
            </View>
            <Text style={[typography.caption, p2.cardDesc]}>
              Fragen zur Tiergesundheit sofort beantwortet.
            </Text>
          </View>
        </View>
      </View>

      <View style={p2.bottom}>
        <ProgressDots current={1} total={4} />
        <Button title="Weiter" variant="primary" size="large" onPress={onNext} style={p1.btn} />
      </View>
    </View>
  );
}

const p2 = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  cards: {
    flex: 1,
    gap: spacing.smd,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.smd,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconCircleAccent: {
    backgroundColor: colors.surfaceLight,
  },
  cardText: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  cardTitle: {
    color: colors.text,
  },
  cardDesc: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  proPill: {
    backgroundColor: colors.accent,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proPillText: {
    fontSize: 10,
    fontFamily: fonts.heading.bold,
    color: colors.textOnAccent,
  },
  bottom: {
    gap: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
});

// ── Page 3: Tier hinzufuegen ───────────────────────────────────────────────────
function PageAddPet({
  onSaved,
  onBack,
  insetTop,
}: {
  onSaved: (petName: string) => void;
  onBack: () => void;
  insetTop: number;
}) {
  const { addPet } = usePets();
  const [name, setName] = useState('');
  const [animalType, setAnimalType] = useState<AnimalType | ''>('');
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

  const handleSavePet = async () => {
    if (!name.trim()) {
      Alert.alert('Fehlende Angabe', 'Bitte gib einen Namen fuer dein Tier ein.');
      return;
    }
    if (!animalType) {
      Alert.alert('Fehlende Angabe', 'Bitte waehle eine Tierart.');
      return;
    }

    let isoDate: string | null = null;
    if (birthDate.trim()) {
      isoDate = parseGermanDate(birthDate);
      if (!isoDate) {
        Alert.alert('Ungültiges Datum', 'Bitte gib ein gueltiges Datum im Format tt.mm.jjjj ein.');
        return;
      }
    }

    setSaving(true);
    const success = await addPet({
      name: name.trim(),
      type: animalType,
      breed: '',
      birthDate: isoDate ?? new Date().toISOString().split('T')[0],
      microchipCode: undefined,
    }, photoUri ?? undefined);
    setSaving(false);

    if (success) {
      onSaved(name.trim());
    } else {
      Alert.alert('Fehler', 'Tier konnte nicht gespeichert werden. Bitte versuche es erneut.');
    }
  };

  return (
    <ScrollView
      style={{ width: SCREEN_WIDTH }}
      contentContainerStyle={[p3.container, { paddingTop: insetTop + spacing.lg }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity style={p3.backButton} onPress={onBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
      <Text style={[typography.h2, p3.title]}>Wer begleitet dich?</Text>
      <Text style={[typography.bodySmall, p3.subtitle]}>Fuege dein erstes Tier hinzu</Text>

      {/* Foto-Upload */}
      <TouchableOpacity style={p3.photoArea} onPress={pickImage} activeOpacity={0.8}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={p3.photoPreview} />
        ) : (
          <View style={p3.photoCircle}>
            <Ionicons name="camera-outline" size={28} color={colors.primary} />
          </View>
        )}
        {!photoUri && (
          <Text style={[typography.caption, p3.photoHint]}>Foto hinzufuegen</Text>
        )}
      </TouchableOpacity>

      {/* Formularfelder */}
      <View style={p3.form}>
        <InputField
          label="Name deines Tieres"
          placeholder="z.B. Max, Luna, Bello..."
          value={name}
          onChangeText={setName}
        />

        <SelectField
          label="Tierart"
          placeholder="Tierart waehlen"
          value={animalType}
          options={animalTypes.map<SelectFieldOption>(t => ({ value: t, label: animalTypeLabels[t] }))}
          onSelect={v => setAnimalType(v as AnimalType)}
        />

        <InputField
          label="Geburtsdatum (optional)"
          placeholder="tt.mm.jjjj"
          value={birthDate}
          onChangeText={setBirthDate}
        />
      </View>

      <View style={p3.bottom}>
        <ProgressDots current={2} total={4} />
        <Button
          title={saving ? 'Wird gespeichert...' : 'Tier speichern'}
          variant="primary"
          size="large"
          onPress={handleSavePet}
          disabled={saving}
        />
      </View>
    </ScrollView>
  );
}

const p3 = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    padding: spacing.xs,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  photoArea: {
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primaryBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoHint: {
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bottom: {
    gap: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});

// ── Page 4: Fertig ─────────────────────────────────────────────────────────────
function PageDone({
  petName,
  onComplete,
  insetTop,
}: {
  petName: string;
  onComplete: () => void;
  insetTop: number;
}) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={[p4.container, { paddingTop: insetTop + spacing.lg }]}
    >
      <View style={p4.hero}>
        <View style={p4.checkCircle}>
          <Ionicons name="checkmark" size={40} color={colors.surface} />
        </View>
        <Text style={[typography.h1, p4.title]}>Perfekt!</Text>
        <Text style={[typography.body, p4.subtitle]}>
          {petName} ist jetzt dabei.
        </Text>
      </View>

      <TouchableOpacity style={p4.btn} onPress={onComplete} activeOpacity={0.85}>
        <Text style={p4.btnText}>Los geht's!</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const p4 = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.surface,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...typography.button,
    fontFamily: fonts.body.semiBold,
    color: colors.primary,
  },
});

// ── Main Component ─────────────────────────────────────────────────────────────
export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [savedPetName, setSavedPetName] = useState('');

  const goToPage = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const goNext = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const handleSkip = useCallback(() => {
    // Direkt zu Page 3 (index 2) — Tier MUSS angelegt werden
    goToPage(2);
  }, [goToPage]);

  const handlePetSaved = useCallback((petName: string) => {
    setSavedPetName(petName);
    goToPage(3);
  }, [goToPage]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentPage(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const pages = [
    <PageWelcome
      key="welcome"
      onNext={goNext}
      onSkip={handleSkip}
      insetTop={insets.top}
    />,
    <PageFeatures
      key="features"
      onNext={goNext}
      insetTop={insets.top}
    />,
    <PageAddPet
      key="addpet"
      onSaved={handlePetSaved}
      onBack={() => flatListRef.current?.scrollToIndex({ index: 1, animated: true })}
      insetTop={insets.top}
    />,
    <PageDone
      key="done"
      petName={savedPetName}
      onComplete={onComplete}
      insetTop={insets.top}
    />,
  ];

  return (
    <FlatList
      ref={flatListRef}
      data={pages}
      horizontal
      pagingEnabled
      snapToInterval={SCREEN_WIDTH}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      keyExtractor={(_, i) => String(i)}
      renderItem={({ item }) => item}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig.current}
      getItemLayout={(_, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
      })}
    />
  );
}
