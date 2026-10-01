import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'ghost' | 'danger';

export type AppButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const AppButton = forwardRef<React.ElementRef<typeof Pressable>, AppButtonProps>(
  function AppButton(
    { label, variant = 'primary', loading = false, disabled, style, onPressIn, onPressOut, ...rest },
    ref,
  ) {
    const theme = useTheme();
    const isDisabled = disabled || loading;
    const scale = useSharedValue(1);

    const backgroundColor =
      variant === 'primary' ? theme.brand : variant === 'danger' ? '#B42318' : 'transparent';
    const textColor = variant === 'ghost' ? theme.text : '#FFFFFF';
    const borderColor = variant === 'ghost' ? theme.border : 'transparent';

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        disabled={isDisabled}
        onPressIn={(e) => {
          scale.value = withSpring(0.96, { damping: 16, stiffness: 260 });
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withSpring(1, { damping: 12, stiffness: 220 });
          onPressOut?.(e);
        }}
        style={({ pressed }: { pressed: boolean }) => [
          { opacity: isDisabled ? 0.45 : pressed ? 0.92 : 1 },
          style,
        ]}
        {...rest}>
        <Animated.View
          style={[
            styles.base,
            animatedStyle,
            { backgroundColor, borderColor },
            variant === 'primary' && styles.primaryAccent,
          ]}>
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <Text style={[styles.label, { color: textColor, fontFamily: Fonts.sans }]}>{label}</Text>
          )}
        </Animated.View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: Spacing.five,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  primaryAccent: {
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(255,255,255,0.28)',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
