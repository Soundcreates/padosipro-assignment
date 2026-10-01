import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextFieldProps = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({ label, hint, error, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const theme = useTheme();
  const hasError = Boolean(error);
  const focus = useSharedValue(0);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: hasError
      ? '#B42318'
      : focus.value > 0.5
        ? theme.brand
        : theme.border,
    transform: [{ scale: 1 + focus.value * 0.01 }],
  }));

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
        {label}
      </Text>
      <Animated.View style={[styles.inputWrap, { backgroundColor: theme.surface }, animatedBorderStyle]}>
        <TextInput
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, fontFamily: Fonts.sans }, style]}
          onFocus={(e) => {
            focus.value = withTiming(1, { duration: 160 });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focus.value = withTiming(0, { duration: 160 });
            onBlur?.(e);
          }}
          {...rest}
        />
      </Animated.View>
      {error ? (
        <Text style={[styles.meta, styles.error]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.meta, { color: theme.textSecondary }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  inputWrap: {
    borderWidth: 1.5,
    borderRadius: 10,
    borderBottomLeftRadius: 18,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    color: '#B42318',
    fontWeight: '500',
  },
});
