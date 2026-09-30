import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/ui/auth-screen';
import { BrandMark } from '@/components/ui/brand-mark';
import { AppButton } from '@/components/ui/button';
import type { TaskItem } from '@/constants/tasks';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getSelectedTasks } from '@/storage/tasksStorage';

export default function HomeScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void getSelectedTasks().then((next) => {
        if (!cancelled) {
          setTasks(next);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

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
          Today&apos;s picks. They reset after midnight so each day starts fresh.
        </Text>
      </View>

      <View style={[styles.list, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {tasks.length === 0 ? (
          <View style={styles.row}>
            <Text style={[styles.taskTitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
              No tasks for today yet. Choose some to get started.
            </Text>
          </View>
        ) : (
          tasks.map((task, index) => (
            <View
              key={task.id}
              style={[
                styles.row,
                {
                  borderBottomColor: theme.border,
                  borderBottomWidth: index === tasks.length - 1 ? 0 : StyleSheet.hairlineWidth,
                },
              ]}>
              <View style={[styles.badge, { backgroundColor: theme.backgroundElement }]}>
                <Text style={{ color: theme.brand, fontWeight: '700' }}>{index + 1}</Text>
              </View>
              <Text style={[styles.taskTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
                {task.title}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.actions}>
        <Link href="/home/tasks" asChild>
          <AppButton label="Edit tasks" variant="ghost" />
        </Link>
        <AppButton label="Log out" variant="danger" onPress={() => router.replace('/')} />
      </View>
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
