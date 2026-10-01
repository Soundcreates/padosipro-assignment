import { Circle, G, Svg } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/**
 * Tiny speckle of soft dots tucked in the bottom-left corner — just enough
 * texture to balance the heavier top-right vine, without competing with the
 * primary actions that live in that area.
 */
export function CornerAccent() {
  const theme = useTheme();

  return (
    <View pointerEvents="none" style={styles.base}>
      <Svg width={90} height={90} viewBox="0 0 90 90">
        <G>
          <Circle cx="10" cy="80" r="10" fill={theme.brand} fillOpacity={0.14} />
          <Circle cx="34" cy="62" r="6" fill={theme.brand} fillOpacity={0.18} />
          <Circle cx="18" cy="48" r="4" fill={theme.brand} fillOpacity={0.14} />
          <Circle cx="50" cy="40" r="3" fill={theme.brand} fillOpacity={0.12} />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    bottom: -10,
    left: -10,
  },
});
