import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fetchMe, logout } from '@/api/auth';
import { peekCachedUser, type CachedUser } from '@/cache/authCache';
import { AuthScreen } from '@/components/ui/auth-screen';
import { BrandMark } from '@/components/ui/brand-mark';
import { AppButton } from '@/components/ui/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function displayValue(value?: string | null) {
  if (!value || value.trim() === '') {
    return '—';
  }
  return value;
}

export default function ProfileScreen() {
  const theme = useTheme();
  const [user, setUser] = useState<CachedUser | null>(() => peekCachedUser()?.value ?? null);

  useEffect(() => {
    const peeked = peekCachedUser();
    if (peeked) {
      setUser(peeked.value);
      if (!peeked.isExpired) {
        return;
      }
    }

    let cancelled = false;
    void fetchMe().then((result) => {
      if (cancelled || !result.ok) {
        return;
      }
      setUser(result.user);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

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
        <ProfileRow label="Name" value={displayValue(user?.name)} />
        <ProfileRow
          label="Mobile number"
          value={user?.mobile ? `${user.country_code ?? '+91'} ${user.mobile}` : '—'}
        />
        <ProfileRow label="Email" value={displayValue(user?.email)} />
        <ProfileRow label="Address" value={displayValue(user?.address)} />
        <ProfileRow label="Business name" value={displayValue(user?.business_name)} last />
      </View>

      <View style={styles.actions}>
        <Link href="/profile/setup" asChild>
          <AppButton label="Edit profile" variant="ghost" />
        </Link>
        <AppButton label="Log out" variant="danger" onPress={handleLogout} />
      </View>
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
