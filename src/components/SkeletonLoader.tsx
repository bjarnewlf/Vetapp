import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

interface SkeletonBoxProps {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({ width, height, borderRadius: br, style }: SkeletonBoxProps): React.ReactElement {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 700,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animValue]);

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.borderLight],
  });

  return (
    <View style={[{ width, height, borderRadius: br ?? borderRadius.sm, overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor }]} />
    </View>
  );
}

export function SkeletonCard(): React.ReactElement {
  return (
    <View style={styles.cardContainer}>
      <SkeletonBox width={40} height={40} borderRadius={20} />
      <View style={styles.cardLines}>
        <SkeletonBox width="80%" height={14} />
        <SkeletonBox width="60%" height={12} style={styles.secondLine} />
      </View>
    </View>
  );
}

export function SkeletonListItem(): React.ReactElement {
  return (
    <View style={styles.listItemContainer}>
      <SkeletonBox width={32} height={32} borderRadius={16} />
      <View style={styles.cardLines}>
        <SkeletonBox width="80%" height={12} />
        <SkeletonBox width="60%" height={10} style={styles.secondLine} />
      </View>
    </View>
  );
}

export function SkeletonPetCard(): React.ReactElement {
  return (
    <View style={skeletonPetCardStyles.container}>
      <SkeletonBox width={48} height={48} borderRadius={24} />
      <View style={skeletonPetCardStyles.lines}>
        <SkeletonBox width="70%" height={14} />
        <SkeletonBox width="40%" height={12} style={{ marginTop: spacing.xs }} />
      </View>
    </View>
  );
}

const skeletonPetCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  lines: {
    flex: 1,
    marginLeft: spacing.md,
    gap: spacing.xs,
  },
});

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cardLines: {
    flex: 1,
    marginLeft: spacing.md,
    gap: spacing.xs,
  },
  secondLine: {
    marginTop: spacing.xs,
  },
});
