import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { login } from '@/api/auth';
import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (key: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (!result.ok) {
      if (result.needsVerification) {
        router.push({
          pathname: '/auth/otp',
          params: { email: formData.email.trim().toLowerCase() },
        });
        return;
      }
      setError(result.error);
      return;
    }

    router.replace('/home');
  };

  return (
    <AuthScreen decorated="subtle">
      <Animated.View entering={FadeInDown.duration(450).springify().damping(16)} style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Welcome back
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Sign in with the email you used to register.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(450).delay(100).springify().damping(16)}
        style={styles.form}>
        <TextField
          label="Email"
          value={formData.email}
          onChangeText={updateField('email')}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextField
          label="Password"
          value={formData.password}
          onChangeText={updateField('password')}
          placeholder="••••••••"
          secureTextEntry
          autoComplete="password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(450).delay(180).springify().damping(16)}
        style={styles.actions}>
        <AppButton label="Sign in" loading={loading} onPress={handleLogin} />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(450).delay(240).springify().damping(16)}
        style={styles.footerRow}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>New here?</Text>
        <Link href="/auth/register" asChild>
          <Pressable>
            <Text style={[styles.footerLink, { color: theme.brand }]}>Create an account</Text>
          </Pressable>
        </Link>
      </Animated.View>
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
  error: {
    color: '#B42318',
    fontSize: 14,
    fontFamily: Fonts.sans,
    fontWeight: '500',
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
