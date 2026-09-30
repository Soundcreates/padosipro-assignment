import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const LENGTH = 6;

/** Static OTP boxes — uncontrolled input overlay for typing UI only */
export function OtpBoxes() {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.row} pointerEvents="none">
        {Array.from({ length: LENGTH }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.box,
              {
                borderColor: theme.border,
                backgroundColor: theme.backgroundElement,
              },
            ]}>
            <Text style={[styles.digit, { color: theme.text, fontFamily: Fonts.mono }]} />
          </View>
        ))}
      </View>
      <TextInput
        defaultValue=""
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={LENGTH}
        style={styles.hiddenInput}
        caretHidden
      />
    </View>
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
    ...StyleSheet.absoluteFill,
    opacity: 0.02,
    color: 'transparent',
  },
});
