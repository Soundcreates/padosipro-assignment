import { Link } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StateProps = {
  title?: string;
  message?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function LoadingState({ title = 'Loading', message = 'Fetching the latest for you.' }: StateProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={theme.brand} />
      <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>{message}</Text>
    </View>
  );
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'When there is something to show, it will appear in this space.',
  actionHref = '/',
  actionLabel = 'Go home',
}: StateProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.glyph, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Text style={{ color: theme.brand, fontSize: 22 }}>∅</Text>
      </View>
      <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>{message}</Text>
      <Link href={actionHref as any} asChild>
        <AppButton label={actionLabel} variant="ghost" />
      </Link>
    </View>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this right now. Try again in a moment.',
  actionHref = '/',
  actionLabel = 'Try again',
}: StateProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.glyph, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Text style={{ color: '#B42318', fontSize: 22 }}>!</Text>
      </View>
      <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>{message}</Text>
      <Link href={actionHref as any} asChild>
        <AppButton label={actionLabel} />
      </Link>
      <Link href="/" asChild>
        <AppButton label="Back to start" variant="ghost" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    alignSelf: 'stretch',
  },
  glyph: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: Spacing.two,
  },
});
