import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/ui/auth-screen';
import { BrandMark } from '@/components/ui/brand-mark';
import { AppButton } from '@/components/ui/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function LandingScreen() {
  const theme = useTheme();

  return (
    <AuthScreen>
      <View style={styles.hero}>
        <BrandMark size="lg" />
        <Text style={[styles.headline, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Your neighbourhood,{'\n'}quietly managed.
        </Text>
        <Text style={[styles.support, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          A calmer way to handle the everyday — built for homes and local businesses.
        </Text>
      </View>

      <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.accentBar, { backgroundColor: theme.brand }]} />
        <Text style={[styles.panelTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
          Start in minutes
        </Text>
        <Text style={[styles.panelBody, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Create an account or sign in. We will send a one-time code when you need to verify.
        </Text>
      </View>

      <View style={styles.actions}>
        <Link href="/auth/register" asChild>
          <AppButton label="Create account" />
        </Link>
        <Link href="/auth/login" asChild>
          <AppButton label="Sign in" variant="ghost" />
        </Link>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: Spacing.three,
    paddingBottom: Spacing.four,
    minHeight: 280,
  },
  headline: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '600',
    letterSpacing: -0.8,
  },
  support: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 340,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.four,
    gap: Spacing.two,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  panelBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
});
