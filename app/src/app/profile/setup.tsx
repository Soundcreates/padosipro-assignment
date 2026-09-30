import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { patchCachedUser } from '@/cache/authCache';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function paramValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}

export default function ProfileSetupScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{
    fullName?: string;
    mobileNumber?: string;
    address?: string;
    businessName?: string;
    email?: string;
  }>();

  const [formData, setFormData] = useState({
    fullName: paramValue(params.fullName),
    mobileNumber: paramValue(params.mobileNumber),
    address: paramValue(params.address),
    businessName: paramValue(params.businessName),
  });

  const updateField = (key: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    patchCachedUser({
      email: paramValue(params.email) || undefined,
      name: formData.fullName.trim() || null,
      mobile: formData.mobileNumber.trim() || null,
      address: formData.address.trim() || null,
      business_name: formData.businessName.trim() || null,
    });
    router.push('/home/tasks');
  };

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Confirm your details
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          These came from signup. Edit anything that looks wrong, then continue.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Name"
          value={formData.fullName}
          onChangeText={updateField('fullName')}
          placeholder="Your full name"
          autoComplete="name"
        />
        <TextField
          label="Mobile number"
          value={formData.mobileNumber}
          onChangeText={updateField('mobileNumber')}
          placeholder="98765 43210"
          keyboardType="phone-pad"
          autoComplete="tel"
          hint="Indian 10-digit number (+91)"
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
          hint="Leave blank for a personal account"
        />
      </View>

      <AppButton label="Save and continue" onPress={handleSave} />
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
