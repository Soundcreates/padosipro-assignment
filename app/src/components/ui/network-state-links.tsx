import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NetworkStateLinksProps = {
  loadingHref: string;
  emptyHref: string;
  errorHref: string;
};

/** Jump links so loading / empty / error UIs are reachable with no dead ends */
export function NetworkStateLinks({ loadingHref, emptyHref, errorHref }: NetworkStateLinksProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>States</Text>
      <Link href={loadingHref as any}>
        <Text style={[styles.link, { color: theme.brand }]}>Loading</Text>
      </Link>
      <Text style={{ color: theme.border }}>·</Text>
      <Link href={emptyHref as any}>
        <Text style={[styles.link, { color: theme.brand }]}>Empty</Text>
      </Link>
      <Text style={{ color: theme.border }}>·</Text>
      <Link href={errorHref as any}>
        <Text style={[styles.link, { color: theme.brand }]}>Error</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontFamily: Fonts.sans,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
});
