import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { NetworkStateLinks } from '@/components/ui/network-state-links';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const theme = useTheme();

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Welcome back
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Sign in with the email you used to register.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Email"
          defaultValue=""
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextField
          label="Password"
          defaultValue=""
          placeholder="••••••••"
          secureTextEntry
          autoComplete="password"
        />
      </View>

      <View style={styles.actions}>
        <Link href="/auth/otp" asChild>
          <AppButton label="Sign in" />
        </Link>
        <Link href="/auth/otp" asChild>
          <AppButton label="Continue with OTP" variant="ghost" />
        </Link>
      </View>

      <NetworkStateLinks
        loadingHref="/auth/login/loading"
        emptyHref="/auth/login/empty"
        errorHref="/auth/login/error"
      />

      <View style={styles.footerRow}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>New here?</Text>
        <Link href="/auth/register" asChild>
          <Pressable>
            <Text style={[styles.footerLink, { color: theme.brand }]}>Create an account</Text>
          </Pressable>
        </Link>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '600',
    letterSpacing: -0.6,
    marginTop: Spacing.three,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.two,
  },
  footerText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Fonts.sans,
  },
});
