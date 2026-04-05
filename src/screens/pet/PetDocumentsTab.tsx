import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Card } from '../../components';
import type { Document } from '../../types';

interface PetDocumentsTabProps {
  petDocuments: Document[];
  uploading: boolean;
  openingDocId: string | null;
  onPickDocument: () => void;
  onOpenDocument: (docId: string, storagePath: string) => void;
  onDeleteDocument: (docId: string, docName: string) => void;
}

export function PetDocumentsTab({
  petDocuments,
  uploading,
  openingDocId,
  onPickDocument,
  onOpenDocument,
  onDeleteDocument,
}: PetDocumentsTabProps) {
  return (
    <View style={styles.tabContent}>
      <Card>
        <Text style={styles.sectionLabel}>DOKUMENTE</Text>
        {petDocuments.length === 0 ? (
          <Text style={styles.emptyText}>Noch keine Dokumente vorhanden.</Text>
        ) : (
          <View style={styles.documentList}>
            {petDocuments.map(doc => (
              <TouchableOpacity
                key={doc.id}
                style={styles.documentRow}
                onPress={() => {
                  if (!doc.storagePath) {
                    Alert.alert('Fehler', 'Dokument nicht verfügbar.');
                    return;
                  }
                  onOpenDocument(doc.id, doc.storagePath);
                }}
                disabled={openingDocId === doc.id}
              >
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
                <TouchableOpacity onPress={() => onDeleteDocument(doc.id, doc.name)}>
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.uploadButton} onPress={onPickDocument} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
          )}
          <Text style={styles.uploadText}>{uploading ? 'Wird hochgeladen...' : 'Dokument hochladen'}</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: { paddingHorizontal: spacing.md },
  sectionLabel: { ...typography.sectionHeader, color: colors.textSecondary, marginBottom: spacing.md },
  emptyText: { ...typography.bodySmall, color: colors.textLight },
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
});
