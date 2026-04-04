import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, ViewStyle } from 'react-native';

interface AnimatedPressableProps {
  onPress: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
  scaleDown?: number;
  disabled?: boolean;
}

export function AnimatedPressable({
  onPress,
  style,
  children,
  scaleDown = 0.97,
  disabled,
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: scaleDown,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
