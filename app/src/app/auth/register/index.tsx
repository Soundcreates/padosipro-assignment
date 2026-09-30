import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { NetworkStateLinks } from '@/components/ui/network-state-links';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function RegisterScreen() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    address: "",
    businessName: "",
    mobileNumber: "",
    fullName: "",
  })

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Create your space
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Tell us a little about you. You can verify with a one-time code next.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField label="Full name" defaultValue="" placeholder="Your name" autoComplete="name" />
        <TextField
          label="Mobile"
          defaultValue=""
          placeholder="98765 43210"
          keyboardType="phone-pad"
          autoComplete="tel"
          hint="Indian 10-digit number (+91)"
        />
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
          placeholder="At least 6 characters"
          secureTextEntry
          autoComplete="new-password"
        />
        <TextField
          label="Address"
          defaultValue=""
          placeholder="Street, area, city"
          autoComplete="street-address"
        />
        <TextField
          label="Business name"
          defaultValue=""
          placeholder="Optional"
          hint="Skip if this is a personal account"
        />
      </View>

      <View style={styles.actions}>
        <Link href="/auth/otp" asChild>
          <AppButton label="Continue" />
        </Link>
      </View>

      <NetworkStateLinks
        loadingHref="/auth/register/loading"
        emptyHref="/auth/register/empty"
        errorHref="/auth/register/error"
      />

      <View style={styles.footerRow}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>Already registered?</Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={[styles.footerLink, { color: theme.brand }]}>Sign in</Text>
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
    paddingTop: Spacing.one,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.four,
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
