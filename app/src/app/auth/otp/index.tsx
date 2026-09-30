import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resendOtp, verifyOtp } from '@/api/auth';
import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { OtpBoxes } from '@/components/ui/otp-boxes';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function OtpScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{
    email?: string;
    fullName?: string;
    mobileNumber?: string;
    address?: string;
    businessName?: string;
  }>();
  const email = typeof params.email === 'string' ? params.email : '';
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState('');

  const handleResend = async () => {
    if (!email) {
      setError('Missing email. Go back and register again.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);
    const result = await resendOtp(email);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage(result.message);
  };

  const handleVerify = async () => {
    if (!email) {
      setError('Missing email. Go back and try again.');
      return;
    }
    if (otp.length < 6) {
      setError('Enter the 6-digit code');
      return;
    }

    setError('');
    setMessage('');
    setVerifying(true);
    const result = await verifyOtp(email, otp);
    setVerifying(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const hasProfileParams = Boolean(params.fullName || params.mobileNumber || params.address);
    if (hasProfileParams) {
      router.push({
        pathname: '/profile/setup',
        params: {
          email,
          fullName: typeof params.fullName === 'string' ? params.fullName : '',
          mobileNumber: typeof params.mobileNumber === 'string' ? params.mobileNumber : '',
          address: typeof params.address === 'string' ? params.address : '',
          businessName: typeof params.businessName === 'string' ? params.businessName : '',
        },
      });
      return;
    }

    router.replace('/home');
  };

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Enter the code
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          We sent a 6-digit code to {email || 'your email'}. It expires in a few minutes.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          One-time password
        </Text>
        <OtpBoxes value={otp} onChangeText={setOtp} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={[styles.message, { color: theme.brand }]}>{message}</Text> : null}
      </View>

      <View style={styles.actions}>
        <AppButton label="Verify code" loading={verifying} onPress={handleVerify} />
        <Pressable style={styles.resend} onPress={handleResend} disabled={loading}>
          <Text style={[styles.resendText, { color: theme.brand, fontFamily: Fonts.sans }]}>
            {loading ? 'Sending…' : 'Resend code'}
          </Text>
        </Pressable>
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
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  error: {
    color: '#B42318',
    fontSize: 14,
    fontFamily: Fonts.sans,
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    fontWeight: '500',
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
