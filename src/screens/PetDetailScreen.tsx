import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Animated, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card } from '../components';
import { usePets } from '../context/PetContext';
import { useMedical } from '../context/MedicalContext';
import { useVetContact } from '../context/VetContactContext';
import { useSubscription } from '../context/SubscriptionContext';
import { animalTypeDisplayLabels } from '../types';
import { getAge } from '../utils/petHelpers';
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
  const [activeTab, setActiveTab] = useState<DetailTab>('vaccinations');
  const [uploading, setUploading] = useState(false);
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);
  const [tabBarWidth, setTabBarWidth] = useState(0);

  const fadeOpacity = useRef(new Animated.Value(0)).current;
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;

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

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
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
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#2A9E82', '#1B6B5A', '#145244']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={styles.heroContainer}
        >
          <Ionicons name="paw" size={72} color="rgba(255,255,255,0.22)" style={styles.heroBackdropIcon} />
          <View style={styles.heroNavRow}>
            <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.heroNavBtn} />
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroName}>Tier-Details</Text>
          </View>
        </LinearGradient>
        <Card style={styles.infoCard}>
          <Text style={styles.notFoundText}>Tier nicht gefunden.</Text>
          <Text style={styles.notFoundSub}>Das Tier wurde möglicherweise gelöscht.</Text>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <LinearGradient
        colors={['#2A9E82', '#1B6B5A', '#145244']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={styles.heroContainer}
      >
        {pet.photo ? (
          <Image source={{ uri: pet.photo }} style={styles.heroBackdropImage} />
        ) : (
          <Ionicons name="paw" size={72} color="rgba(255,255,255,0.22)" style={styles.heroBackdropIcon} />
        )}
        <View style={styles.heroNavRow}>
          <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroNavBtn} onPress={() => navigation.navigate('AddPet', { pet })}>
            <Ionicons name="create-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.heroTextBlock}>
          <Text style={styles.heroName}>{pet.name}</Text>
          <Text style={styles.heroMeta}>{pet.breed ? `${pet.breed} · ` : ''}{getAge(pet.birthDate)}</Text>
        </View>
      </LinearGradient>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Hero Banner
  heroContainer: {
    height: 200,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBackdropImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
    resizeMode: 'cover',
  },
  heroBackdropIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
  },
  heroNavRow: {
    position: 'absolute',
    top: 52,
    left: 16,
    right: 16,
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
  heroTextBlock: {},
  heroName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 4,
  },

  infoCard: { marginHorizontal: spacing.md, marginBottom: spacing.md },
  sectionLabel: { ...typography.sectionHeader, color: colors.textSecondary, marginBottom: spacing.md },
  infoRows: { gap: spacing.sm },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { ...typography.bodySmall, color: colors.primary },
  infoValue: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },

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
  tabLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '500' },
  tabLabelActive: { color: colors.primary, fontWeight: '600' },

  // Not Found
  notFoundText: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  notFoundSub: { ...typography.bodySmall, color: colors.textSecondary },
});
