import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { register } from '@/api/auth';
import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function RegisterScreen() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    address: '',
    businessName: '',
    mobileNumber: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (key: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    const result = await register(formData.email, formData.password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push({
      pathname: '/auth/otp',
      params: {
        email: result.email,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        businessName: formData.businessName,
      },
    });
  };

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
        <TextField
          label="Full name"
          value={formData.fullName}
          onChangeText={updateField('fullName')}
          placeholder="Your name"
          autoComplete="name"
        />
        <TextField
          label="Mobile"
          value={formData.mobileNumber}
          onChangeText={updateField('mobileNumber')}
          placeholder="98765 43210"
          keyboardType="phone-pad"
          autoComplete="tel"
          hint="Indian 10-digit number (+91)"
        />
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
          placeholder="At least 6 characters"
          secureTextEntry
          autoComplete="new-password"
        />
        <TextField
          label="Address"
          value={formData.address}
          onChangeText={updateField('address')}
          placeholder="Street, area, city"
          autoComplete="street-address"
        />
        <TextField
          label="Business name"
          value={formData.businessName}
          onChangeText={updateField('businessName')}
          placeholder="Optional"
          hint="Skip if this is a personal account"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.actions}>
        <AppButton label="Continue" loading={loading} onPress={handleRegister} />
      </View>

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
  error: {
    color: '#B42318',
    fontSize: 14,
    fontFamily: Fonts.sans,
    fontWeight: '500',
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
