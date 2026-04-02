import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Card } from '../components';
import { useData } from '../context/DataContext';
import { useSubscription } from '../context/SubscriptionContext';

interface PetDetailScreenProps {
  navigation: any;
  route: any;
}

type DetailTab = 'vaccinations' | 'documents' | 'vet';

function getAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  return `${now.getFullYear() - birth.getFullYear()} Jahre`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function PetDetailScreen({ navigation, route }: PetDetailScreenProps) {
  const { petId } = route.params;
  const { isPro } = useSubscription();
  const { pets, vaccinations: allVaccinations, treatments: allTreatments, reminders: allReminders, documents: allDocuments, vetContact, addDocument, deleteDocument } = useData();
  const [activeTab, setActiveTab] = useState<DetailTab>('vaccinations');

  const pet = pets.find(p => p.id === petId);
  const vaccinations = allVaccinations.filter(v => v.petId === petId);
  const treatments = allTreatments.filter(t => t.petId === petId);
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
      await addDocument({
        petId,
        name: file.name,
        fileUrl: file.uri,
        fileType: file.mimeType,
        fileSize: file.size,
      });
    }
  };

  const handleDeleteDocument = (docId: string, docName: string) => {
    Alert.alert('Dokument löschen', `"${docName}" wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: () => deleteDocument(docId) },
    ]);
  };

  if (!pet) return null;

  const tabs: { id: DetailTab; label: string; icon: keyof typeof Ionicons.glyphMap; pro?: boolean }[] = [
    { id: 'vaccinations', label: 'Impfungen', icon: 'bandage-outline' },
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pet.name}</Text>
      </View>

      {/* Pet Information */}
      <Card style={styles.infoCard}>
        <Text style={styles.sectionLabel}>TIER-INFORMATIONEN</Text>
        <View style={styles.petHeader}>
          {pet.photo ? (
            <Image source={{ uri: pet.photo }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Ionicons name="paw" size={32} color={colors.primary} />
            </View>
          )}
          <View>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
          </View>
        </View>
        <View style={styles.infoRows}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tierart</Text>
            <Text style={styles.infoValue}>{pet.type}</Text>
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
          {/* Health Buttons */}
          <View style={styles.healthButtons}>
            <TouchableOpacity style={styles.healthButton}>
              <Ionicons name="medical-outline" size={24} color={colors.accent} />
              <Text style={styles.healthButtonLabel}>Behandlungen</Text>
              <Text style={styles.healthButtonCount}>{treatments.length} erfasst</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.healthButton, styles.healthButtonActive]}
              onPress={() => navigation.navigate('AddEvent', { petId: pet.id })}
            >
              <Ionicons name="bandage-outline" size={24} color={colors.primary} />
              <Text style={styles.healthButtonLabel}>Impfung hinzufügen</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Treatments */}
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionTitle}>Letzte Behandlungen</Text>
            <TouchableOpacity><Text style={styles.viewAll}>Alle anzeigen</Text></TouchableOpacity>
          </View>
          {treatments.length === 0 && (
            <Text style={styles.emptyText}>Noch keine Behandlungen erfasst</Text>
          )}

          {/* Vaccinations */}
          <View style={styles.subSectionHeader}>
            <Text style={styles.subSectionTitle}>Impfungen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddEvent', { petId: pet.id })}>
              <Ionicons name="add" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          {vaccinations.map(vax => (
            <View key={vax.id} style={styles.vaccinationCard}>
              <Text style={styles.vaccinationName}>{vax.name}</Text>
              <View style={styles.vaccinationRow}>
                <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.vaccinationDate}>Verabreicht: {formatDate(vax.givenDate)}</Text>
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
                  <Text style={styles.vaccinationDate}>{vax.recurrenceInterval}</Text>
                </View>
              )}
            </View>
          ))}
          {vaccinations.length === 0 && (
            <Text style={styles.emptyText}>Noch keine Impfungen erfasst</Text>
          )}

          {/* Reminders */}
          <Card style={styles.remindersSection}>
            <View style={styles.subSectionHeader}>
              <Text style={styles.sectionLabel}>REMINDERS</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AddReminder')}>
                <Ionicons name="add" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            {reminders.length === 0 ? (
              <View style={styles.emptyReminders}>
                <Text style={styles.emptyText}>Keine anstehenden Erinnerungen</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddReminder')}>
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
                  <View key={doc.id} style={styles.documentRow}>
                    <Ionicons
                      name={doc.fileType?.includes('pdf') ? 'document-text-outline' : 'image-outline'}
                      size={24}
                      color={colors.primary}
                    />
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
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity style={styles.uploadButton} onPress={handlePickDocument}>
              <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              <Text style={styles.uploadText}>Dokument hochladen</Text>
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
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: spacing.md, paddingBottom: spacing.md,
  },
  backButton: { marginRight: spacing.md },
  headerTitle: { ...typography.h2, color: colors.text },
  infoCard: { marginHorizontal: spacing.md, marginBottom: spacing.md },
  sectionLabel: { ...typography.sectionHeader, color: colors.textSecondary, marginBottom: spacing.md },
  petHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  avatarImage: {
    width: 64, height: 64, borderRadius: 32, marginRight: spacing.md,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  petName: { ...typography.h2, color: colors.text },
  petBreed: { ...typography.bodySmall, color: colors.primary },
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
  healthButtons: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  healthButton: {
    flex: 1, padding: spacing.md, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.borderLight, alignItems: 'center', gap: 4,
  },
  healthButtonActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  healthButtonLabel: { ...typography.caption, color: colors.text, fontWeight: '600' },
  healthButtonCount: { ...typography.caption, color: colors.textSecondary },
  subSectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.sm, marginTop: spacing.md,
  },
  subSectionTitle: { ...typography.h3, color: colors.text },
  viewAll: { ...typography.bodySmall, color: colors.textSecondary },
  emptyText: { ...typography.bodySmall, color: colors.textLight },
  vaccinationCard: {
    backgroundColor: colors.primaryLight, borderRadius: borderRadius.md,
    padding: spacing.md, marginTop: spacing.sm, gap: 6,
  },
  vaccinationName: { ...typography.h3, color: colors.text },
  vaccinationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  vaccinationDate: { ...typography.bodySmall, color: colors.textSecondary },
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

  // Vet Tab
  vetName: { ...typography.h3, color: colors.text },
  vetClinic: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  vetInfoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  vetInfoText: { ...typography.bodySmall, color: colors.text },
});
