import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { FlowerCorner } from '@/components/ui/flower-corner';
import { CornerAccent } from '@/components/ui/corner-accent';
import { AmbientDots } from '@/components/ui/ambient-dots';

export type AuthScreenProps = ViewProps & {
  children: ReactNode;
  footer?: ReactNode;
  /**
   * `true` — full welcome treatment (vine + ambient dots + corner accent).
   * `"subtle"` — just ambient dots + corner accent, for form-heavy screens
   * where a big vine would compete with inputs.
   * `false` — no decoration.
   */
  decorated?: boolean | 'subtle';
};

export function AuthScreen({ children, footer, style, decorated = false, ...rest }: AuthScreenProps) {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }, style]} {...rest}>
      {decorated ? (
        <>
          <AmbientDots />
          {decorated === true ? <FlowerCorner /> : null}
          <CornerAccent />
        </>
      ) : null}
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>{children}</View>
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.five,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: Math.min(MaxContentWidth, 440),
    flexGrow: 1,
    gap: Spacing.four,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    alignItems: 'center',
  },
});
