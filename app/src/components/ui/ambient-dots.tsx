import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

type Dot = {
  top: number;
  left?: number;
  right?: number;
  size: number;
  delay: number;
  float: number;
  duration: number;
};

// Scattered across the otherwise-empty upper/mid region of the welcome
// screen — small, slow, and low-opacity so they read as texture, not noise.
const DOTS: Dot[] = [
  { top: 90, left: 36, size: 7, delay: 0, float: 14, duration: 3400 },
  { top: 170, left: 110, size: 4, delay: 400, float: 10, duration: 2800 },
  { top: 260, right: 90, size: 5, delay: 800, float: 12, duration: 3100 },
  { top: 340, left: 56, size: 3.5, delay: 250, float: 9, duration: 2600 },
  { top: 430, right: 48, size: 6, delay: 650, float: 13, duration: 3600 },
  { top: 520, left: 140, size: 4, delay: 1000, float: 8, duration: 2900 },
];

function FloatingDot({ dot, color }: { dot: Dot; color: string }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      dot.delay,
      withRepeat(
        withSequence(
          withTiming(-dot.float, { duration: dot.duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: dot.duration, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      dot.delay,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: dot.duration }),
          withTiming(0.18, { duration: dot.duration }),
        ),
        -1,
        true,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: dot.top,
          left: dot.left,
          right: dot.right,
          width: dot.size,
          height: dot.size,
          borderRadius: dot.size,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function AmbientDots() {
  const theme = useTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {DOTS.map((dot, i) => (
        <FloatingDot key={i} dot={dot} color={theme.brand} />
      ))}
    </View>
  );
}
