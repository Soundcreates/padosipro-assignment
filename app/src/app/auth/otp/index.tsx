import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { NetworkStateLinks } from '@/components/ui/network-state-links';
import { OtpBoxes } from '@/components/ui/otp-boxes';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function OtpScreen() {
  const theme = useTheme();

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Enter the code
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          We sent a 6-digit code to your email. It expires in a few minutes.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          One-time password
        </Text>
        <OtpBoxes />
      </View>

      <View style={styles.actions}>
        <Link href="/profile/setup" asChild>
          <AppButton label="Verify code" />
        </Link>
        <Pressable style={styles.resend}>
          <Text style={[styles.resendText, { color: theme.brand, fontFamily: Fonts.sans }]}>
            Resend code
          </Text>
        </Pressable>
      </View>

      <NetworkStateLinks loadingHref="/auth/otp/loading" emptyHref="/auth/otp/empty" errorHref="/auth/otp/error" />
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
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  actions: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  resend: {
    paddingVertical: Spacing.one,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
