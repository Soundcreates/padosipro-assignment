import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextFieldProps = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({ label, hint, error, style, ...rest }: TextFieldProps) {
  const theme = useTheme();
  const hasError = Boolean(error);

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            borderColor: hasError ? '#B42318' : theme.border,
            color: theme.text,
            fontFamily: Fonts.sans,
          },
          style,
        ]}
        {...rest}
      />
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
  input: {
    minHeight: 52,
    borderWidth: 1.5,
    borderRadius: 10,
    borderBottomLeftRadius: 18,
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
