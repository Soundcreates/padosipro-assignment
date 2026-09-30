import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/ui/auth-screen';
import { BrandMark } from '@/components/ui/brand-mark';
import { AppButton } from '@/components/ui/button';
import { NetworkStateLinks } from '@/components/ui/network-state-links';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <AuthScreen>
      <View style={styles.topBar}>
        <BrandMark size="sm" />
        <Link href="/home" asChild>
          <AppButton label="Home" variant="ghost" style={styles.homeBtn} />
        </Link>
      </View>

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Profile
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Your details on file. Editing can be wired later.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <ProfileRow label="Name" value="Asha Verma" />
        <ProfileRow label="Mobile number" value="+91 98765 43210" />
        <ProfileRow label="Address" value="14 Lake View Road, Pune" />
        <ProfileRow label="Business name" value="Lakeview Grocers" last />
      </View>

      <View style={styles.actions}>
        <Link href="/profile/setup" asChild>
          <AppButton label="Edit profile" variant="ghost" />
        </Link>
        <Link href="/" asChild>
          <AppButton label="Log out" variant="danger" />
        </Link>
      </View>

      <NetworkStateLinks
        loadingHref="/profile/loading"
        emptyHref="/profile/empty"
        errorHref="/profile/error"
      />
    </AuthScreen>
  );
}

function ProfileRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: theme.border,
          borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
        },
      ]}>
      <Text style={[styles.rowLabel, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
        {label}
      </Text>
      <Text style={[styles.rowValue, { color: theme.text, fontFamily: Fonts.sans }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.two,
  },
  homeBtn: {
    alignSelf: 'auto',
    minHeight: 40,
    paddingHorizontal: Spacing.four,
  },
  header: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '600',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: 4,
  },
  rowLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    gap: Spacing.two,
  },
});
