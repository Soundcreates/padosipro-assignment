import { Link } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AuthScreen } from '@/components/ui/auth-screen';
import { BrandMark } from '@/components/ui/brand-mark';
import { AppButton } from '@/components/ui/button';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function PulsingAccentBar({ color }: { color: string }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.6 + pulse.value * 0.4,
  }));

  return <Animated.View style={[styles.accentBar, { backgroundColor: color }, animatedStyle]} />;
}

export default function LandingScreen() {
  const theme = useTheme();

  return (
    <AuthScreen decorated>
      <View style={styles.hero}>
        <Animated.View entering={FadeInDown.duration(500).springify().damping(16)}>
          <BrandMark size="lg" />
        </Animated.View>
        <Animated.Text
          entering={FadeInDown.duration(550).delay(80).springify().damping(16)}
          style={[styles.headline, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Your neighbourhood,{'\n'}quietly managed.
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.duration(550).delay(160).springify().damping(16)}
          style={[styles.support, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          A calmer way to handle the everyday — built for homes and local businesses.
        </Animated.Text>
      </View>

      <Animated.View
        entering={FadeInUp.duration(550).delay(220).springify().damping(16)}
        style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <PulsingAccentBar color={theme.brand} />
        <Text style={[styles.panelTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
          Start in minutes
        </Text>
        <Text style={[styles.panelBody, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Create an account or sign in. We will send a one-time code when you need to verify.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.duration(550).delay(300).springify().damping(16)}
        style={styles.actions}>
        <Link href="/auth/register" asChild>
          <AppButton label="Create account" />
        </Link>
        <Link href="/auth/login" asChild>
          <AppButton label="Sign in" variant="ghost" />
        </Link>
      </Animated.View>
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
