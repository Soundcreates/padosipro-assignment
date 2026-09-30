import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const LENGTH = 6;

type OtpBoxesProps = {
  value?: string;
  onChangeText?: (value: string) => void;
};

export function OtpBoxes({ value, onChangeText }: OtpBoxesProps) {
  const theme = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [internalValue, setInternalValue] = useState('');
  const code = value ?? internalValue;

  const handleChange = (next: string) => {
    const digits = next.replace(/\D/g, '').slice(0, LENGTH);
    if (value === undefined) {
      setInternalValue(digits);
    }
    onChangeText?.(digits);
  };

  return (
    <Pressable style={styles.wrap} onPress={() => inputRef.current?.focus()}>
      <View style={styles.row} pointerEvents="none">
        {Array.from({ length: LENGTH }).map((_, index) => {
          const digit = code[index] ?? '';
          const isActive = index === code.length || (code.length === LENGTH && index === LENGTH - 1);

          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  borderColor: isActive ? theme.brand : theme.border,
                  backgroundColor: theme.backgroundElement,
                },
              ]}>
              <Text style={[styles.digit, { color: theme.text, fontFamily: Fonts.mono }]}>
                {digit}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={LENGTH}
        autoFocus
        caretHidden
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  box: {
    flex: 1,
    aspectRatio: 0.85,
    maxWidth: 56,
    borderWidth: 1.5,
    borderRadius: 10,
    borderBottomLeftRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: 22,
    fontWeight: '600',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01,
    color: 'transparent',
  },
});
