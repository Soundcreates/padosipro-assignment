import Svg, { Circle, G, Path } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type FlowerCornerProps = {
  size?: number;
};

export function FlowerCorner({ size = 280 }: FlowerCornerProps) {
  const theme = useTheme();

  return (
    <View pointerEvents="none" style={[styles.base, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 240 240">
        <G>
          <Path
            d="M235 5 C190 30 160 55 150 90 C140 128 155 150 130 180 C112 203 95 212 65 232"
            stroke={theme.brand}
            strokeOpacity={0.4}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M172 70 C190 72 205 64 214 48"
            stroke={theme.brand}
            strokeOpacity={0.3}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M205 20 C222 12 236 18 242 32 C226 38 210 34 205 20 Z"
            fill={theme.brand}
            fillOpacity={0.26}
          />
          <Path
            d="M168 48 C182 32 204 28 220 38 C206 54 182 56 168 48 Z"
            fill={theme.brand}
            fillOpacity={0.22}
          />
          <Path
            d="M145 105 C156 88 178 82 196 90 C184 108 160 116 145 105 Z"
            fill={theme.brand}
            fillOpacity={0.2}
          />
          <Path
            d="M152 155 C160 138 180 130 198 136 C188 154 166 164 152 155 Z"
            fill={theme.brand}
            fillOpacity={0.18}
          />
          <Path
            d="M108 190 C114 172 134 163 152 168 C144 186 122 197 108 190 Z"
            fill={theme.brand}
            fillOpacity={0.16}
          />
          <G transform="translate(214 30)">
            <Circle r="12" cx="0" cy="-19" fill={theme.brand} fillOpacity={0.45} />
            <Circle r="12" cx="16" cy="-9" fill={theme.brand} fillOpacity={0.45} />
            <Circle r="12" cx="16" cy="10" fill={theme.brand} fillOpacity={0.45} />
            <Circle r="12" cx="0" cy="20" fill={theme.brand} fillOpacity={0.45} />
            <Circle r="12" cx="-16" cy="10" fill={theme.brand} fillOpacity={0.45} />
            <Circle r="12" cx="-16" cy="-9" fill={theme.brand} fillOpacity={0.45} />
            <Circle r="8" cx="0" cy="0" fill={theme.brand} fillOpacity={0.7} />
          </G>
          <G transform="translate(163 108)">
            <Circle r="9" cx="0" cy="-14" fill={theme.brand} fillOpacity={0.4} />
            <Circle r="9" cx="12" cy="-6" fill={theme.brand} fillOpacity={0.4} />
            <Circle r="9" cx="12" cy="8" fill={theme.brand} fillOpacity={0.4} />
            <Circle r="9" cx="0" cy="16" fill={theme.brand} fillOpacity={0.4} />
            <Circle r="9" cx="-12" cy="8" fill={theme.brand} fillOpacity={0.4} />
            <Circle r="9" cx="-12" cy="-6" fill={theme.brand} fillOpacity={0.4} />
            <Circle r="6" cx="0" cy="0" fill={theme.brand} fillOpacity={0.65} />
          </G>
          <G transform="translate(118 178)">
            <Circle r="6" cx="0" cy="-10" fill={theme.brand} fillOpacity={0.35} />
            <Circle r="6" cx="9" cy="-4" fill={theme.brand} fillOpacity={0.35} />
            <Circle r="6" cx="9" cy="6" fill={theme.brand} fillOpacity={0.35} />
            <Circle r="6" cx="0" cy="11" fill={theme.brand} fillOpacity={0.35} />
            <Circle r="6" cx="-9" cy="6" fill={theme.brand} fillOpacity={0.35} />
            <Circle r="6" cx="-9" cy="-4" fill={theme.brand} fillOpacity={0.35} />
            <Circle r="4" cx="0" cy="0" fill={theme.brand} fillOpacity={0.6} />
          </G>
          <Circle cx="78" cy="214" r="5" fill={theme.brand} fillOpacity={0.4} />
          <Circle cx="92" cy="202" r="3.5" fill={theme.brand} fillOpacity={0.32} />
        </G>
      </Svg>
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
