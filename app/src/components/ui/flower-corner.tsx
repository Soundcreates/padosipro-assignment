import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type FlowerCornerProps = {
  size?: number;
};

function Bloom({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style?: object;
}) {
  const petal = size * 0.38;
  const center = size * 0.28;
  const offsets = [
    { top: 0, left: size / 2 - petal / 2 },
    { top: size * 0.18, left: size * 0.62 },
    { top: size * 0.52, left: size * 0.62 },
    { top: size * 0.7, left: size / 2 - petal / 2 },
    { top: size * 0.52, left: size * 0.02 },
    { top: size * 0.18, left: size * 0.02 },
  ];

  return (
    <View style={[{ width: size, height: size }, style]}>
      {offsets.map((pos, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: petal,
            height: petal,
            borderRadius: petal,
            backgroundColor: color,
            opacity: 0.42,
          }}
        />
      ))}
      <View
        style={{
          position: 'absolute',
          top: size / 2 - center / 2,
          left: size / 2 - center / 2,
          width: center,
          height: center,
          borderRadius: center,
          backgroundColor: color,
          opacity: 0.7,
        }}
      />
    </View>
  );
}

function Leaf({
  width,
  height,
  color,
  style,
}: {
  width: number;
  height: number;
  color: string;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: height,
          backgroundColor: color,
          opacity: 0.22,
          transform: [{ rotate: '-28deg' }],
        },
        style,
      ]}
    />
  );
}

export function FlowerCorner({ size = 280 }: FlowerCornerProps) {
  const theme = useTheme();
  const scale = size / 280;

  return (
    <View pointerEvents="none" style={[styles.base, { width: size, height: size }]}>
      <View
        style={[
          styles.vine,
          {
            backgroundColor: theme.brand,
            height: size * 0.82,
            right: size * 0.28,
            top: size * 0.04,
          },
        ]}
      />
      <Leaf
        width={48 * scale}
        height={18 * scale}
        color={theme.brand}
        style={{ position: 'absolute', top: 28 * scale, right: 70 * scale }}
      />
      <Leaf
        width={42 * scale}
        height={16 * scale}
        color={theme.brand}
        style={{ position: 'absolute', top: 90 * scale, right: 95 * scale }}
      />
      <Leaf
        width={38 * scale}
        height={14 * scale}
        color={theme.brand}
        style={{ position: 'absolute', top: 150 * scale, right: 120 * scale }}
      />
      <Bloom
        size={54 * scale}
        color={theme.brand}
        style={{ position: 'absolute', top: 8 * scale, right: 8 * scale }}
      />
      <Bloom
        size={40 * scale}
        color={theme.brand}
        style={{ position: 'absolute', top: 88 * scale, right: 58 * scale }}
      />
      <Bloom
        size={28 * scale}
        color={theme.brand}
        style={{ position: 'absolute', top: 160 * scale, right: 110 * scale }}
      />
      <View
        style={{
          position: 'absolute',
          top: 210 * scale,
          right: 150 * scale,
          width: 10 * scale,
          height: 10 * scale,
          borderRadius: 10 * scale,
          backgroundColor: theme.brand,
          opacity: 0.4,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 198 * scale,
          right: 132 * scale,
          width: 7 * scale,
          height: 7 * scale,
          borderRadius: 7 * scale,
          backgroundColor: theme.brand,
          opacity: 0.3,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    top: -14,
    right: -28,
  },
  vine: {
    position: 'absolute',
    width: 3,
    borderRadius: 3,
    opacity: 0.35,
    transform: [{ rotate: '18deg' }],
  },
});
