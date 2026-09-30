import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { NetworkStateLinks } from '@/components/ui/network-state-links';
import { SELECTED_TASKS } from '@/constants/tasks';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TasksConfirmScreen() {
  const theme = useTheme();

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Confirm tasks
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          These will appear on your home screen after you save.
        </Text>
      </View>

      <View style={[styles.list, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {SELECTED_TASKS.map((task) => (
          <View
            key={task.id}
            style={[styles.row, { borderBottomColor: theme.border }]}>
            <View style={[styles.dot, { backgroundColor: theme.brand }]} />
            <Text style={[styles.taskTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
              {task.title}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Link href="/home" asChild>
          <AppButton label="Save tasks" />
        </Link>
        <Link href="/home/tasks" asChild>
          <AppButton label="Edit selection" variant="ghost" />
        </Link>
      </View>

      <NetworkStateLinks
        loadingHref="/home/tasks/confirm-loading"
        emptyHref="/home/tasks/confirm-empty"
        errorHref="/home/tasks/confirm-error"
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  actions: {
    gap: Spacing.two,
  },
});
