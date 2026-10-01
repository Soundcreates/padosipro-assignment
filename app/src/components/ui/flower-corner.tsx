import { useEffect } from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/use-theme';

type FlowerCornerProps = {
  size?: number;
};

/**
 * Decorative vine-and-flower sprig, cascading down from the top-right
 * corner, with a slow continuous sway + breathe so the screen feels alive
 * rather than static.
 */
export function FlowerCorner({ size = 280 }: FlowerCornerProps) {
  const theme = useTheme();
  const sway = useSharedValue(0);
  const breathe = useSharedValue(0);

  useEffect(() => {
    sway.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
        withTiming(-1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${sway.value * 2.5}deg` },
      { scale: 1 + breathe.value * 0.035 },
    ],
  }));

  return (
    <View pointerEvents="none" style={[styles.base, { width: size, height: size }]}>
      <Animated.View style={animatedStyle}>
        <Svg width={size} height={size} viewBox="0 0 240 240">
          <G>
            {/* main vine */}
            <Path
              d="M235 5 C190 30 160 55 150 90 C140 128 155 150 130 180 C112 203 95 212 65 232"
              stroke={theme.brand}
              strokeOpacity={0.4}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
            {/* side tendril */}
            <Path
              d="M172 70 C190 72 205 64 214 48"
              stroke={theme.brand}
              strokeOpacity={0.3}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />

            {/* leaves along the vine */}
            <Path d="M205 20 C222 12 236 18 242 32 C226 38 210 34 205 20 Z" fill={theme.brand} fillOpacity={0.26} />
            <Path d="M168 48 C182 32 204 28 220 38 C206 54 182 56 168 48 Z" fill={theme.brand} fillOpacity={0.22} />
            <Path d="M145 105 C156 88 178 82 196 90 C184 108 160 116 145 105 Z" fill={theme.brand} fillOpacity={0.2} />
            <Path d="M152 155 C160 138 180 130 198 136 C188 154 166 164 152 155 Z" fill={theme.brand} fillOpacity={0.18} />
            <Path d="M108 190 C114 172 134 163 152 168 C144 186 122 197 108 190 Z" fill={theme.brand} fillOpacity={0.16} />

            {/* large bloom near the top */}
            <G transform="translate(214 30)">
              <Circle r="12" cx="0" cy="-19" fill={theme.brand} fillOpacity={0.45} />
              <Circle r="12" cx="16" cy="-9" fill={theme.brand} fillOpacity={0.45} />
              <Circle r="12" cx="16" cy="10" fill={theme.brand} fillOpacity={0.45} />
              <Circle r="12" cx="0" cy="20" fill={theme.brand} fillOpacity={0.45} />
              <Circle r="12" cx="-16" cy="10" fill={theme.brand} fillOpacity={0.45} />
              <Circle r="12" cx="-16" cy="-9" fill={theme.brand} fillOpacity={0.45} />
              <Circle r="8" cx="0" cy="0" fill={theme.brand} fillOpacity={0.7} />
            </G>

            {/* mid bloom */}
            <G transform="translate(163 108)">
              <Circle r="9" cx="0" cy="-14" fill={theme.brand} fillOpacity={0.4} />
              <Circle r="9" cx="12" cy="-6" fill={theme.brand} fillOpacity={0.4} />
              <Circle r="9" cx="12" cy="8" fill={theme.brand} fillOpacity={0.4} />
              <Circle r="9" cx="0" cy="16" fill={theme.brand} fillOpacity={0.4} />
              <Circle r="9" cx="-12" cy="8" fill={theme.brand} fillOpacity={0.4} />
              <Circle r="9" cx="-12" cy="-6" fill={theme.brand} fillOpacity={0.4} />
              <Circle r="6" cx="0" cy="0" fill={theme.brand} fillOpacity={0.65} />
            </G>

            {/* small bloom lower on the vine */}
            <G transform="translate(118 178)">
              <Circle r="6" cx="0" cy="-10" fill={theme.brand} fillOpacity={0.35} />
              <Circle r="6" cx="9" cy="-4" fill={theme.brand} fillOpacity={0.35} />
              <Circle r="6" cx="9" cy="6" fill={theme.brand} fillOpacity={0.35} />
              <Circle r="6" cx="0" cy="11" fill={theme.brand} fillOpacity={0.35} />
              <Circle r="6" cx="-9" cy="6" fill={theme.brand} fillOpacity={0.35} />
              <Circle r="6" cx="-9" cy="-4" fill={theme.brand} fillOpacity={0.35} />
              <Circle r="4" cx="0" cy="0" fill={theme.brand} fillOpacity={0.6} />
            </G>

            {/* scattered buds trailing off the vine tip */}
            <Circle cx="78" cy="214" r="5" fill={theme.brand} fillOpacity={0.4} />
            <Circle cx="92" cy="202" r="3.5" fill={theme.brand} fillOpacity={0.32} />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    top: -14,
    right: -28,
  },
});
