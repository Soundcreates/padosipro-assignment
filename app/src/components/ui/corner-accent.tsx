import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

const DOTS = [
  { bottom: 8, left: 8, size: 20, opacity: 0.14 },
  { bottom: 28, left: 32, size: 12, opacity: 0.18 },
  { bottom: 44, left: 16, size: 8, opacity: 0.14 },
  { bottom: 52, left: 48, size: 6, opacity: 0.12 },
];

export function CornerAccent() {
  const theme = useTheme();

  return (
    <View pointerEvents="none" style={styles.base}>
      {DOTS.map((dot, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            bottom: dot.bottom,
            left: dot.left,
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

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 90,
    height: 90,
  },
});
