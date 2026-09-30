import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BrandMarkProps = {
  size?: 'sm' | 'md' | 'lg';
};

export function BrandMark({ size = 'md' }: BrandMarkProps) {
  const theme = useTheme();
  const fontSize = size === 'lg' ? 28 : size === 'sm' ? 14 : 18;

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: theme.brand }]} />
      <Text
        style={[
          styles.name,
          {
            color: theme.text,
            fontFamily: Fonts.serif ?? Fonts.sans,
            fontSize,
          },
        ]}>
        PadosiPro
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
    transform: [{ rotate: '12deg' }],
  },
  name: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
