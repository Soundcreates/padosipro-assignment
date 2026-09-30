import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '@/components/ui/brand-mark';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AuthHeaderProps = {
  showBack?: boolean;
};

export function AuthHeader({ showBack = true }: AuthHeaderProps) {
  const theme = useTheme();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={goBack}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}>
          <Text style={[styles.chevron, { color: theme.text }]}>‹</Text>
          <Text style={[styles.backLabel, { color: theme.text, fontFamily: Fonts.sans }]}>Back</Text>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      <BrandMark size="sm" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    minHeight: 36,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.one,
    paddingRight: Spacing.two,
  },
  chevron: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
    marginTop: -2,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  spacer: {
    width: 64,
  },
});
