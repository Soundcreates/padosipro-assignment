import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/ui/auth-screen';
import { BrandMark } from '@/components/ui/brand-mark';
import { AppButton } from '@/components/ui/button';
import { NetworkStateLinks } from '@/components/ui/network-state-links';
import { SELECTED_TASKS } from '@/constants/tasks';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Post-auth home — lists selected tasks; no back button */
export default function HomeScreen() {
  const theme = useTheme();

  return (
    <AuthScreen>
      <View style={styles.topBar}>
        <BrandMark size="sm" />
        <Link href="/profile" asChild>
          <Pressable>
            <Text style={[styles.profileLink, { color: theme.brand, fontFamily: Fonts.sans }]}>
              Profile
            </Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Your tasks
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Everything you picked after onboarding, ready for the day.
        </Text>
      </View>

      <View style={[styles.list, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {SELECTED_TASKS.map((task, index) => (
          <View
            key={task.id}
            style={[
              styles.row,
              {
                borderBottomColor: theme.border,
                borderBottomWidth: index === SELECTED_TASKS.length - 1 ? 0 : StyleSheet.hairlineWidth,
              },
            ]}>
            <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
              <Text style={{ color: theme.brand, fontWeight: '700' }}>{index + 1}</Text>
            </View>
            <Text style={[styles.taskTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
              {task.title}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Link href="/home/tasks" asChild>
          <AppButton label="Edit tasks" variant="ghost" />
        </Link>
        <Link href="/" asChild>
          <AppButton label="Log out" variant="danger" />
        </Link>
      </View>

      <NetworkStateLinks
        loadingHref="/home/loading"
        emptyHref="/home/empty"
        errorHref="/home/error"
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.two,
  },
  profileLink: {
    fontSize: 15,
    fontWeight: '700',
  },
  header: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '600',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    gap: Spacing.two,
  },
});
