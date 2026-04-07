import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, fonts } from '../theme';

type IconName = keyof typeof Ionicons.glyphMap;

const ICON_MAP: Record<string, { focused: IconName; unfocused: IconName; label: string }> = {
  Home: { focused: 'home', unfocused: 'home-outline', label: 'Start' },
  'My Pets': { focused: 'paw', unfocused: 'paw-outline', label: 'Tiere' },
  AI: { focused: 'chatbubble-ellipses', unfocused: 'chatbubble-ellipses-outline', label: 'KI' },
  Reminders: { focused: 'notifications', unfocused: 'notifications-outline', label: 'Erinnern' },
  'Vet Contact': { focused: 'medkit', unfocused: 'medkit-outline', label: 'Tierarzt' },
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const barContent = (
    <View style={styles.inner}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconConfig = ICON_MAP[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const label =
          (descriptors[route.key].options.tabBarLabel as string | undefined) ??
          iconConfig?.label ??
          route.name;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={label}
          >
            <Ionicons
              name={isFocused ? iconConfig?.focused ?? 'home' : iconConfig?.unfocused ?? 'home-outline'}
              size={22}
              color={isFocused ? colors.tabActive : colors.tabInactive}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? colors.tabActive : colors.tabInactive,
                  fontFamily: isFocused ? fonts.body.semiBold : fonts.body.regular,
                },
              ]}
            >
              {label}
            </Text>
            {isFocused && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const containerStyle = [
    styles.container,
    { bottom: insets.bottom > 0 ? insets.bottom : 12 },
  ];

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={80} tint="light" style={containerStyle}>
        {barContent}
      </BlurView>
    );
  }

  return (
    <View style={[containerStyle, styles.androidBackground]}>
      {barContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  androidBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.tabActive,
    marginTop: 3,
  },
});
