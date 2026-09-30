import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { NetworkStateLinks } from '@/components/ui/network-state-links';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileSetupScreen() {
  const theme = useTheme();

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Finish your profile
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Shown once after your first login. We will use this to personalise your space.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField label="Name" defaultValue="" placeholder="Your full name" autoComplete="name" />
        <TextField
          label="Mobile number"
          defaultValue=""
          placeholder="98765 43210"
          keyboardType="phone-pad"
          autoComplete="tel"
          hint="Indian 10-digit number (+91)"
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
          hint="Leave blank for a personal account"
        />
      </View>

      <Link href="/home/tasks" asChild>
        <AppButton label="Save and continue" />
      </Link>

      <NetworkStateLinks
        loadingHref="/profile/setup-loading"
        emptyHref="/profile/setup-empty"
        errorHref="/profile/setup-error"
      />
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
});
