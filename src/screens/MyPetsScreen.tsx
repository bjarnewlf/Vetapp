import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Button } from '../components';
import { useData } from '../context/DataContext';
import { Pet } from '../types';

interface MyPetsScreenProps {
  navigation: any;
}

function getAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  return `${years} years old`;
}

export function MyPetsScreen({ navigation }: MyPetsScreenProps) {
  const { pets } = useData();

  const renderPet = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.petRow}
      onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.petAvatar}>
        <Ionicons name="paw" size={28} color={colors.primary} />
      </View>
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petBreed}>{item.breed || item.type}</Text>
        {item.birthDate && <Text style={styles.petAge}>{getAge(item.birthDate)}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Pets</Text>
      <View style={styles.content}>
        <Button
          title="+ Add Pet"
          onPress={() => navigation.navigate('AddPet')}
          style={styles.addButton}
        />
        {pets.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="paw-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>Noch keine Haustiere</Text>
            <Text style={styles.emptySubtext}>Füge dein erstes Tier hinzu!</Text>
          </View>
        ) : (
          <FlatList
            data={pets}
            renderItem={renderPet}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    ...typography.h1, color: colors.primary,
    paddingHorizontal: spacing.md, paddingTop: 60, paddingBottom: spacing.md,
  },
  content: { flex: 1, paddingHorizontal: spacing.md },
  addButton: { marginBottom: spacing.md },
  list: { gap: spacing.md, paddingBottom: spacing.xl },
  empty: { alignItems: 'center', marginTop: spacing.xxl, gap: spacing.sm },
  emptyText: { ...typography.h3, color: colors.textLight },
  emptySubtext: { ...typography.bodySmall, color: colors.textLight },
  petRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, padding: spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  petAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  petInfo: { flex: 1 },
  petName: { ...typography.h3, color: colors.text },
  petBreed: { ...typography.bodySmall, color: colors.primary },
  petAge: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
