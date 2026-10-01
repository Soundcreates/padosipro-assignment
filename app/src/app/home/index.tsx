import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/ui/auth-screen';
import { BrandMark } from '@/components/ui/brand-mark';
import { AppButton } from '@/components/ui/button';
import type { TaskItem } from '@/constants/tasks';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  getCompletedTaskIds,
  getSelectedTasks,
  toggleTaskCompleted,
} from '@/storage/tasksStorage';

export default function HomeScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void Promise.all([getSelectedTasks(), getCompletedTaskIds()]).then(([next, completed]) => {
        if (!cancelled) {
          setTasks(next);
          setCompletedIds(completed);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const handleToggleComplete = async (taskId: string) => {
    const next = await toggleTaskCompleted(taskId);
    setCompletedIds(next);
  };

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
          Today&apos;s picks. Tap a task to mark it complete. They reset after midnight.
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
          tasks.map((task, index) => {
            const completed = completedIds.includes(task.id);
            return (
              <Pressable
                key={task.id}
                onPress={() => handleToggleComplete(task.id)}
                style={[
                  styles.row,
                  {
                    borderBottomColor: theme.border,
                    borderBottomWidth: index === tasks.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  },
                ]}>
                <View
                  style={[
                    styles.check,
                    {
                      borderColor: completed ? theme.brand : theme.border,
                      backgroundColor: completed ? theme.brand : 'transparent',
                    },
                  ]}>
                  {completed ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
                <View style={styles.taskCopy}>
                  <Text
                    style={[
                      styles.taskTitle,
                      {
                        color: completed ? theme.textSecondary : theme.text,
                        fontFamily: Fonts.sans,
                        textDecorationLine: completed ? 'line-through' : 'none',
                      },
                    ]}>
                    {task.title}
                  </Text>
                  <Text style={[styles.markLabel, { color: theme.brand, fontFamily: Fonts.sans }]}>
                    {completed ? 'Completed' : 'Mark complete'}
                  </Text>
                </View>
              </Pressable>
            );
          })
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
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  taskCopy: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  markLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    gap: Spacing.two,
  },
});
