import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card, ErrorBanner, EmptyState } from '../components';
import { usePets } from '../context/PetContext';
import { useMedical } from '../context/MedicalContext';
import { useVetContact } from '../context/VetContactContext';
import { useSubscription } from '../context/SubscriptionContext';
import { animalTypeDisplayLabels, recurrenceDisplayLabels } from '../types';
import { getAge } from '../utils/petHelpers';
import { supabase } from '../lib/supabase';

interface PetDetailScreenProps {
  navigation: any;
  route: any;
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

  const pet = pets.find(p => p.id === petId);
  const vaccinations = allMedicalEvents.filter(e => e.petId === petId && e.type === 'vaccination');
  const treatments = allMedicalEvents.filter(e => e.petId === petId && e.type !== 'vaccination');
  const reminders = allReminders.filter(r => r.petId === petId);
  const petDocuments = allDocuments.filter(d => d.petId === petId);
  const vet = vetContact;

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

  const tabs: { id: DetailTab; label: string; icon: keyof typeof Ionicons.glyphMap; pro?: boolean }[] = [
    { id: 'vaccinations', label: 'Gesundheit', icon: 'bandage-outline' },
    { id: 'documents', label: 'Dokumente', icon: 'document-outline', pro: true },
    { id: 'vet', label: 'Tierarzt', icon: 'medkit-outline' },
  ];

  const handleTabPress = (tab: DetailTab, isPro: boolean, isProFeature?: boolean) => {
    if (isProFeature && !isPro) {
      navigation.navigate('Paywall', { feature: 'documents' });
      return;
    }
    setActiveTab(tab);
  };

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
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
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

      {/* Tab Content: Impfungen */}
      {activeTab === 'vaccinations' && (
        <View style={styles.tabContent}>
          {medicalError && <ErrorBanner onRetry={refreshMedical} />}
          {medicalLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Lade Gesundheitsdaten...</Text>
            </View>
          ) : (
          <>
          {/* Recent Treatments */}
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionTitle}>Weitere Gesundheitseinträge</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { petId: pet.id, eventType: 'checkup' })}>
              <Ionicons name="add" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          {treatments.length === 0 && (
            <Text style={styles.emptyText}>Noch keine Behandlungen erfasst</Text>
          )}
          {treatments.map(treatment => (
            <View key={treatment.id} style={[styles.vaccinationCard, styles.vaccinationCardRow]}>
              <View style={styles.vaccinationCardContent}>
                <Text style={styles.vaccinationName}>{treatment.name}</Text>
                <View style={styles.vaccinationRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.vaccinationDate}>{formatDate(treatment.date)}</Text>
                </View>
                {treatment.notes && (
                  <Text style={styles.vaccinationDate}>{treatment.notes}</Text>
                )}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { petId: pet.id, editMedicalEvent: treatment })}>
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTreatment(treatment.id, treatment.name)}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Vaccinations */}
          <View style={styles.sectionDivider} />
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionTitle}>Impfungen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { petId: pet.id })}>
              <Ionicons name="add" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          {vaccinations.map(vax => (
            <View key={vax.id} style={[styles.vaccinationCard, styles.vaccinationCardRow]}>
              <View style={styles.vaccinationCardContent}>
                <Text style={styles.vaccinationName}>{vax.name}</Text>
                <View style={styles.vaccinationRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.vaccinationDate}>Verabreicht: {formatDate(vax.date)}</Text>
                </View>
                {vax.nextDate && (
                  <View style={styles.vaccinationRow}>
                    <Ionicons name="calendar" size={14} color={colors.primary} />
                    <Text style={[styles.vaccinationDate, { color: colors.primary }]}>
                      Nächste: {formatDate(vax.nextDate)}
                    </Text>
                  </View>
                )}
                {vax.recurrenceInterval && (
                  <View style={styles.vaccinationRow}>
                    <Ionicons name="repeat" size={14} color={colors.textSecondary} />
                    <Text style={styles.vaccinationDate}>
                      {recurrenceDisplayLabels[vax.recurrenceInterval] || vax.recurrenceInterval}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { petId: pet.id, editMedicalEvent: vax })}>
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteVaccination(vax.id, vax.name)}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {vaccinations.length === 0 && (
            <EmptyState
              emoji="💉"
              title="Noch keine Impfungen"
              subtitle="Trage die erste Impfung ein."
              actionLabel="Impfung eintragen"
              onAction={() => navigation.navigate('AddEvent', { petId: pet.id, defaultType: 'vaccination' })}
            />
          )}

          {/* Reminders */}
          <Card style={styles.remindersSection}>
            <View style={styles.subSectionHeader}>
              <Text style={styles.sectionLabel}>ERINNERUNGEN</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AddReminder', { petId })}>
                <Ionicons name="add" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            {reminders.length === 0 ? (
              <View style={styles.emptyReminders}>
                <Text style={styles.emptyText}>Keine anstehenden Erinnerungen</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddReminder', { petId })}>
                  <Text style={styles.addReminderLink}>Erinnerung hinzufügen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              reminders.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.reminderItem}
                  onPress={() => navigation.navigate('EventDetail', { eventId: r.id })}
                >
                  <Text style={styles.reminderTitle}>{r.title}</Text>
                  <Text style={styles.reminderDate}>{formatDate(r.date)}</Text>
                </TouchableOpacity>
              ))
            )}
          </Card>
          </>
          )}
        </View>
      )}

      {/* Tab Content: Dokumente (Pro) */}
      {activeTab === 'documents' && isPro && (
        <View style={styles.tabContent}>
          <Card>
            <Text style={styles.sectionLabel}>DOKUMENTE</Text>
            {petDocuments.length === 0 ? (
              <Text style={styles.emptyText}>Noch keine Dokumente vorhanden.</Text>
            ) : (
              <View style={styles.documentList}>
                {petDocuments.map(doc => (
                  <TouchableOpacity key={doc.id} style={styles.documentRow} onPress={() => handleOpenDocument(doc.id, doc.storagePath ?? '')} disabled={openingDocId === doc.id}>
                    {openingDocId === doc.id ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Ionicons
                        name={doc.fileType?.includes('pdf') ? 'document-text-outline' : 'image-outline'}
                        size={24}
                        color={colors.primary}
                      />
                    )}
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName} numberOfLines={1}>{doc.name}</Text>
                      <Text style={styles.documentMeta}>
                        {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(0)} KB` : ''}
                        {doc.fileType ? ` · ${doc.fileType.split('/')[1]?.toUpperCase()}` : ''}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteDocument(doc.id, doc.name)}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickDocument} disabled={uploading}>
              {uploading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              )}
              <Text style={styles.uploadText}>{uploading ? 'Wird hochgeladen...' : 'Dokument hochladen'}</Text>
            </TouchableOpacity>
          </Card>
        </View>
      )}

      {/* Tab Content: Tierarzt */}
      {activeTab === 'vet' && (
        <View style={styles.tabContent}>
          <Card>
            <Text style={styles.sectionLabel}>ZUGEWIESENER TIERARZT</Text>
            {!vet ? (
              <Text style={styles.emptyText}>Noch kein Tierarzt gespeichert</Text>
            ) : (
              <>
            <Text style={styles.vetName}>{vet.name}</Text>
            <Text style={styles.vetClinic}>{vet.clinic}</Text>
            <View style={styles.vetInfoRow}>
              <Ionicons name="call-outline" size={16} color={colors.primary} />
              <Text style={styles.vetInfoText}>{vet.phone}</Text>
            </View>
            <View style={styles.vetInfoRow}>
              <Ionicons name="mail-outline" size={16} color={colors.primary} />
              <Text style={styles.vetInfoText}>{vet.email}</Text>
            </View>
            <View style={styles.vetInfoRow}>
              <Ionicons name="location-outline" size={16} color={colors.primary} />
              <Text style={styles.vetInfoText}>{vet.address}</Text>
            </View>
              </>
            )}
          </Card>
        </View>
      )}

      <View style={{ height: 40 }} />
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
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 10, borderRadius: borderRadius.sm,
  },
  tabActive: { backgroundColor: colors.primaryLight },
  tabLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '500' },
  tabLabelActive: { color: colors.primary, fontWeight: '600' },

  // Tab Content
  tabContent: { paddingHorizontal: spacing.md },
  subSectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.sm, marginTop: spacing.md,
  },
  subSectionTitle: { ...typography.h3, color: colors.text },
  emptyText: { ...typography.bodySmall, color: colors.textLight },
  vaccinationCard: {
    backgroundColor: colors.primaryLight, borderRadius: borderRadius.md,
    padding: spacing.md, marginTop: spacing.sm, gap: 6,
  },
  vaccinationCardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 0 },
  cardActions: { flexDirection: 'column', gap: spacing.sm, alignItems: 'center', paddingLeft: spacing.sm },
  vaccinationCardContent: { flex: 1, gap: 6 },
  vaccinationName: { ...typography.h3, color: colors.text },
  vaccinationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vaccinationDate: { ...typography.bodySmall, color: colors.textSecondary },
  sectionDivider: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  remindersSection: { marginTop: spacing.md },
  emptyReminders: { alignItems: 'center', gap: 4 },
  addReminderLink: { ...typography.bodySmall, color: colors.primary, textDecorationLine: 'underline' },
  reminderItem: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  reminderTitle: { ...typography.label, color: colors.text },
  reminderDate: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },

  // Documents Tab
  documentList: { gap: spacing.sm, marginBottom: spacing.sm },
  documentRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  documentInfo: { flex: 1 },
  documentName: { ...typography.body, color: colors.text },
  documentMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  uploadButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, marginTop: spacing.md, paddingVertical: spacing.md,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  uploadText: { ...typography.label, color: colors.primary },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  loadingText: { ...typography.bodySmall, color: colors.textSecondary },

  // Not Found
  notFoundText: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  notFoundSub: { ...typography.bodySmall, color: colors.textSecondary },

  // Vet Tab
  vetName: { ...typography.h3, color: colors.text },
  vetClinic: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  vetInfoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  vetInfoText: { ...typography.bodySmall, color: colors.text },
});
