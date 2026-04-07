import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius, TAB_BAR_HEIGHT } from '../theme';
import { Button, SkeletonPetCard } from '../components';
import { usePets } from '../context/PetContext';
import { Pet } from '../types';
import { getAge } from '../utils/petHelpers';
import type { CompositeTabStackNavProp } from '../types/navigation';

interface MyPetsScreenProps {
  navigation: CompositeTabStackNavProp<'My Pets'>;
}

export function MyPetsScreen({ navigation }: MyPetsScreenProps) {
  const { pets, loading } = usePets();
  const insets = useSafeAreaInsets();

  const renderPet = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.petRow}
      onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
      activeOpacity={0.7}
    >
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.petAvatar} />
      ) : (
        <View style={styles.petAvatarPlaceholder}>
          <Ionicons name="paw" size={28} color={colors.primary} />
        </View>
      )}
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
      <Text style={[styles.title, { paddingTop: insets.top + 12 }]}>Meine Tiere</Text>
      <View style={styles.content}>
        <Button
          title="+ Tier hinzufügen"
          onPress={() => navigation.navigate('AddPet')}
          style={styles.addButton}
        />
        {loading ? (
          <View style={styles.list}>
            <SkeletonPetCard />
            <SkeletonPetCard />
            <SkeletonPetCard />
            <SkeletonPetCard />
          </View>
        ) : pets.length === 0 ? (
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
            contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom }]}
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
    paddingHorizontal: spacing.md, paddingBottom: spacing.md,
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
    shadowColor: colors.cardShadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  petAvatar: {
    width: 56, height: 56, borderRadius: 28, marginRight: spacing.md,
  },
  petAvatarPlaceholder: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  petInfo: { flex: 1 },
  petName: { ...typography.h3, color: colors.text },
  petBreed: { ...typography.bodySmall, color: colors.primary },
  petAge: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
