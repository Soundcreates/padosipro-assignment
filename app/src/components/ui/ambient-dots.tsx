import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

const DOTS = [
  { top: 90, left: 36, size: 7, opacity: 0.22 },
  { top: 170, left: 110, size: 4, opacity: 0.16 },
  { top: 260, right: 90, size: 5, opacity: 0.2 },
  { top: 340, left: 56, size: 3.5, opacity: 0.14 },
  { top: 430, right: 48, size: 6, opacity: 0.18 },
  { top: 520, left: 140, size: 4, opacity: 0.15 },
];

export function AmbientDots() {
  const theme = useTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {DOTS.map((dot, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: dot.size,
            height: dot.size,
            borderRadius: dot.size,
            backgroundColor: theme.brand,
            opacity: dot.opacity,
          }}
        />
      ))}
    </View>
  );
}
