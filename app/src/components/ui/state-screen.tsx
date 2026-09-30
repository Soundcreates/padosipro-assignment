import { StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/screen-state';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Kind = 'loading' | 'empty' | 'error';

type StateScreenProps = {
  kind: Kind;
  backHref: string;
  title?: string;
  message?: string;
  showBack?: boolean;
  actionLabel?: string;
};

export function StateScreen({
  kind,
  backHref,
  title,
  message,
  showBack = true,
  actionLabel,
}: StateScreenProps) {
  const theme = useTheme();

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader showBack={showBack} />
        <Text style={[styles.eyebrow, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Network state preview
        </Text>
      </View>
      {kind === 'loading' ? (
        <LoadingState title={title} message={message} />
      ) : kind === 'empty' ? (
        <EmptyState
          title={title}
          message={message}
          actionHref={backHref}
          actionLabel={actionLabel ?? 'Go back'}
        />
      ) : (
        <ErrorState
          title={title}
          message={message}
          actionHref={backHref}
          actionLabel={actionLabel ?? 'Try again'}
        />
      )}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
