import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Animated, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, typography, spacing, borderRadius } from '../theme';
import { Card } from '../components';
import { usePets } from '../context/PetContext';
import { useMedical } from '../context/MedicalContext';
import { useVetContact } from '../context/VetContactContext';
import { useSubscription } from '../context/SubscriptionContext';
import { animalTypeDisplayLabels } from '../types';
import { getAge } from '../utils/petHelpers';
import { MAX_DOCUMENT_SIZE, ALLOWED_MIME_TYPES } from '../utils/fileUpload';
import { supabase } from '../lib/supabase';
import type { RootStackNavProp, RootStackRouteProp } from '../types/navigation';
import { PetHealthTab } from './pet/PetHealthTab';
import { PetDocumentsTab } from './pet/PetDocumentsTab';
import { PetVetTab } from './pet/PetVetTab';

interface PetDetailScreenProps {
  navigation: RootStackNavProp<'PetDetail'>;
  route: RootStackRouteProp<'PetDetail'>;
}

type DetailTab = 'vaccinations' | 'documents' | 'vet';

const HERO_EXPANDED_HEIGHT = 240;
const HERO_COLLAPSED_HEIGHT = 80;
const SCROLL_THRESHOLD = 160;
const NAME_FADE_START = 100;

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('de-DE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function PetDetailScreen({ navigation, route }: PetDetailScreenProps) {
  const { petId } = route.params;
  const { isPro } = useSubscription();
  const { pets, documents: allDocuments, addDocument, deleteDocument } = usePets();
  const { medicalEvents: allMedicalEvents, reminders: allReminders, deleteMedicalEvent, loading: medicalLoading, error: medicalError, refresh: refreshMedical } = useMedical();
  const { vetContact } = useVetContact();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<DetailTab>('vaccinations');
  const [uploading, setUploading] = useState(false);
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);
  const [tabBarWidth, setTabBarWidth] = useState(0);

  const fadeOpacity = useRef(new Animated.Value(0)).current;
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const tabCount = 3;

  useEffect(() => {
    Animated.timing(fadeOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const tabs: { id: DetailTab; label: string; icon: keyof typeof Ionicons.glyphMap; pro?: boolean }[] = [
    { id: 'vaccinations', label: 'Gesundheit', icon: 'bandage-outline' },
    { id: 'documents', label: 'Dokumente', icon: 'document-outline', pro: true },
    { id: 'vet', label: 'Tierarzt', icon: 'medkit-outline' },
  ];

  useEffect(() => {
    const tabIndex = tabs.findIndex(t => t.id === activeTab);
    Animated.spring(tabIndicatorPosition, {
      toValue: tabIndex,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [activeTab]);

  const pet = pets.find(p => p.id === petId);
  const vaccinations = allMedicalEvents.filter(e => e.petId === petId && e.type === 'vaccination');
  const treatments = allMedicalEvents.filter(e => e.petId === petId && e.type !== 'vaccination');
  const reminders = allReminders.filter(r => r.petId === petId);
  const petDocuments = allDocuments.filter(d => d.petId === petId);

  // Animated values für Hero
  const heroHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [HERO_EXPANDED_HEIGHT + insets.top, HERO_COLLAPSED_HEIGHT + insets.top],
    extrapolate: 'clamp',
  });

  // Overscroll: Foto stretcht nach oben
  const photoHeight = scrollY.interpolate({
    inputRange: [-200, 0, SCROLL_THRESHOLD],
    outputRange: [HERO_EXPANDED_HEIGHT + 200, HERO_EXPANDED_HEIGHT, HERO_EXPANDED_HEIGHT],
    extrapolate: 'clamp',
  });

  // Parallax: Foto bewegt sich langsamer (0.5x) + Overscroll-Parallax
  const photoTranslateY = scrollY.interpolate({
    inputRange: [-200, 0, SCROLL_THRESHOLD],
    outputRange: [-100, 0, SCROLL_THRESHOLD * 0.5],
    extrapolate: 'clamp',
  });

  const heroTextOpacity = scrollY.interpolate({
    inputRange: [NAME_FADE_START, SCROLL_THRESHOLD],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const collapsedNavOpacity = scrollY.interpolate({
    inputRange: [SCROLL_THRESHOLD * 0.75, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const photoOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD * 0.7, SCROLL_THRESHOLD],
    outputRange: [0.5, 0.2, 0],
    extrapolate: 'clamp',
  });

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
      if (file.size && file.size > MAX_DOCUMENT_SIZE) {
        Alert.alert('Datei zu groß', `Maximal ${MAX_DOCUMENT_SIZE / 1024 / 1024} MB erlaubt.`);
        return;
      }
      if (file.mimeType && !ALLOWED_MIME_TYPES.includes(file.mimeType as any)) {
        Alert.alert('Dateityp nicht erlaubt', 'Erlaubt sind: PDF, JPEG, PNG und HEIC.');
        return;
      }
      setUploading(true);
      const success = await addDocument({
        petId,
        name: file.name,
        fileUrl: file.uri,
        fileType: file.mimeType,
        fileSize: file.size,
      });
      setUploading(false);
      if (!success) {
        Alert.alert('Fehler', 'Upload fehlgeschlagen. Bitte versuche es erneut.');
      }
    }
  };

  const getSignedUrl = async (storagePath: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from('pet-documents')
      .createSignedUrl(storagePath, 3600);
    if (error || !data?.signedUrl) {
      throw new Error('Signierte URL konnte nicht erstellt werden.');
    }
    return data.signedUrl;
  };

  const handleOpenDocument = async (docId: string, storagePath: string) => {
    setOpeningDocId(docId);
    try {
      const signedUrl = await getSignedUrl(storagePath);
      await Linking.openURL(signedUrl);
    } catch {
      Alert.alert('Fehler', 'Dokument konnte nicht geöffnet werden.');
    } finally {
      setOpeningDocId(null);
    }
  };

  const handleDeleteDocument = (docId: string, docName: string) => {
    Alert.alert('Dokument löschen', `"${docName}" wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen', style: 'destructive', onPress: async () => {
          const success = await deleteDocument(docId);
          if (!success) Alert.alert('Fehler', 'Löschen fehlgeschlagen. Bitte versuche es erneut.');
        },
      },
    ]);
  };

  const handleDeleteVaccination = (id: string, name: string) => {
    Alert.alert('Impfung löschen', `"${name}" wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen', style: 'destructive', onPress: async () => {
          const success = await deleteMedicalEvent(id);
          if (!success) Alert.alert('Fehler', 'Löschen fehlgeschlagen. Bitte versuche es erneut.');
        },
      },
    ]);
  };

  const handleDeleteTreatment = (id: string, name: string) => {
    Alert.alert('Behandlung löschen', `"${name}" wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen', style: 'destructive', onPress: async () => {
          const success = await deleteMedicalEvent(id);
          if (!success) Alert.alert('Fehler', 'Löschen fehlgeschlagen. Bitte versuche es erneut.');
        },
      },
    ]);
  };

  const handleTabPress = (tab: DetailTab, proFlag: boolean, isProFeature?: boolean) => {
    if (isProFeature && !proFlag) {
      navigation.navigate('Paywall', { feature: 'documents' });
      return;
    }
    setActiveTab(tab);
  };

  if (!pet) {
    return (
      <View style={styles.container}>
        {/* Fallback Hero */}
        <View style={[styles.heroWrapper, { height: HERO_EXPANDED_HEIGHT + insets.top }]}>
          <LinearGradient
            colors={['#2A9E82', '#1B6B5A', '#145244']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons name="paw" size={72} color="rgba(255,255,255,0.22)" style={styles.heroBackdropIcon} />
          <View style={[styles.heroNavRowStatic, { top: insets.top + 8 }]}>
            <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.heroNavBtn} />
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroName}>Tier-Details</Text>
          </View>
        </View>
        <Card style={styles.infoCard}>
          <Text style={styles.notFoundText}>Tier nicht gefunden.</Text>
          <Text style={styles.notFoundSub}>Das Tier wurde möglicherweise gelöscht.</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Hero — absolut positioniert, außerhalb der ScrollView */}
      <Animated.View
        style={[styles.heroWrapper, { height: heroHeight }]}
        shouldRasterizeIOS
        renderToHardwareTextureAndroid
      >
        {/* Foto mit Parallax */}
        {pet.photo ? (
          <Animated.Image
            source={{ uri: pet.photo }}
            style={[
              styles.heroBackdropImage,
              {
                height: photoHeight,
                opacity: photoOpacity,
                transform: [{ translateY: photoTranslateY }],
              },
            ]}
          />
        ) : (
          <Ionicons name="paw" size={72} color="rgba(255,255,255,0.22)" style={styles.heroBackdropIcon} />
        )}

        {/* Gradient Overlay: transparent oben → primary unten (untere 40%) */}
        <LinearGradient
          colors={['transparent', 'transparent', colors.primary]}
          locations={[0, 0.6, 1]}
          style={styles.heroGradientOverlay}
          pointerEvents="none"
        />

        {/* Expanded: Tiername + Meta unten links */}
        <Animated.View
          style={[
            styles.heroTextBlock,
            { opacity: heroTextOpacity },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.heroName}>{pet.name}</Text>
          <Text style={styles.heroMeta}>{pet.breed ? `${pet.breed} · ` : ''}{getAge(pet.birthDate)}</Text>
        </Animated.View>

        {/* Collapsed: Tiername zentriert — Buttons kommen von heroNavRowStatic */}
        <Animated.View
          style={[
            styles.heroCollapsedNav,
            {
              top: insets.top,
              opacity: collapsedNavOpacity,
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.collapsedPetName}>{pet.name}</Text>
        </Animated.View>

        {/* Zurück-Button — immer sichtbar oben links */}
        <View style={[styles.heroNavRowStatic, { top: insets.top + 8 }]}>
          <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.navigate('AddPet', { pet })}>
            <Ionicons name="create-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ScrollView mit paddingTop als Ersatz für den Hero */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: HERO_EXPANDED_HEIGHT + insets.top }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces
        overScrollMode="always"
        removeClippedSubviews
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <Animated.View style={{ opacity: fadeOpacity }}>
          {/* Pet Information */}
          <Card style={styles.infoCard}>
            <Text style={styles.sectionLabel}>TIER-INFORMATIONEN</Text>
            <View style={styles.infoRows}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tierart</Text>
                <Text style={styles.infoValue}>{animalTypeDisplayLabels[pet.type]}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Alter</Text>
                <Text style={styles.infoValue}>{getAge(pet.birthDate)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Geburtsdatum</Text>
                <Text style={styles.infoValue}>{formatDate(pet.birthDate)}</Text>
              </View>
              {pet.microchipCode && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Chip-Nr.</Text>
                  <Text style={styles.infoValue}>{pet.microchipCode}</Text>
                </View>
              )}
            </View>
          </Card>

          {/* Tab Navigation */}
          <View
            style={styles.tabBar}
            onLayout={e => setTabBarWidth(e.nativeEvent.layout.width - 8)}
          >
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  width: tabBarWidth / tabCount,
                  transform: [{
                    translateX: tabIndicatorPosition.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, tabBarWidth / tabCount, (tabBarWidth / tabCount) * 2],
                    }),
                  }],
                },
              ]}
            />
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={styles.tab}
                onPress={() => handleTabPress(tab.id, isPro, tab.pro)}
              >
                <Ionicons
                  name={tab.icon}
                  size={18}
                  color={activeTab === tab.id ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                {tab.pro && !isPro && (
                  <Ionicons name="lock-closed" size={10} color={colors.accent} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'vaccinations' && (
            <PetHealthTab
              navigation={navigation}
              petId={petId}
              vaccinations={vaccinations}
              treatments={treatments}
              reminders={reminders}
              medicalLoading={medicalLoading}
              medicalError={medicalError}
              onRefreshMedical={refreshMedical}
              onDeleteVaccination={handleDeleteVaccination}
              onDeleteTreatment={handleDeleteTreatment}
            />
          )}

          {activeTab === 'documents' && isPro && (
            <PetDocumentsTab
              petDocuments={petDocuments}
              uploading={uploading}
              openingDocId={openingDocId}
              onPickDocument={handlePickDocument}
              onOpenDocument={handleOpenDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeTab === 'vet' && (
            <PetVetTab vet={vetContact} />
          )}

          <View style={{ height: 40 }} />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  scrollView: { flex: 1 },

  // Hero
  heroWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    justifyContent: 'flex-end',
  },
  heroBackdropImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    resizeMode: 'cover',
    width: '100%',
  },
  heroBackdropIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
  },
  heroGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HERO_EXPANDED_HEIGHT,
  },
  heroTextBlock: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  heroName: {
    fontSize: 28,
    fontFamily: fonts.heading.bold,
    color: colors.textOnPrimary,
    letterSpacing: -0.5,
  },
  heroMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },

  // Nav rows
  heroNavRowStatic: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroNavBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Collapsed nav (zentrierter Name — Buttons kommen von heroNavRowStatic)
  heroCollapsedNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsedPetName: {
    ...typography.h3,
    color: colors.textOnPrimary,
    textAlign: 'center',
    flex: 1,
  },

  infoCard: { marginHorizontal: spacing.md, marginBottom: spacing.md, marginTop: spacing.md },
  sectionLabel: { ...typography.sectionHeader, color: colors.textSecondary, marginBottom: spacing.md },
  infoRows: { gap: spacing.sm },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { ...typography.bodySmall, color: colors.primary },
  infoValue: { ...typography.bodySmall, color: colors.text, fontFamily: fonts.body.medium },

  // Tab Bar
  tabBar: {
    flexDirection: 'row', marginHorizontal: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: 4, marginBottom: spacing.md,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 10, borderRadius: borderRadius.sm,
    zIndex: 1,
  },
  tabLabel: { ...typography.caption, color: colors.textSecondary, fontFamily: fonts.body.medium },
  tabLabelActive: { color: colors.primary, fontFamily: fonts.body.semiBold },

  // Not Found
  notFoundText: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  notFoundSub: { ...typography.bodySmall, color: colors.textSecondary },
});
