import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import type { TaskItem } from '@/constants/tasks';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getPendingTasks, saveSelectedTaskIds } from '@/storage/tasksStorage';

export default function TasksConfirmScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void getPendingTasks().then((next) => {
        if (!cancelled) {
          setTasks(next);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    await saveSelectedTaskIds(tasks.map((task) => task.id));
    setSaving(false);
    router.replace('/home');
  };

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Confirm tasks
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          These will appear on your home screen for today. They clear after midnight.
        </Text>
      </View>

      <View style={[styles.list, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        {tasks.length === 0 ? (
          <View style={styles.row}>
            <Text style={[styles.taskTitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
              No tasks selected yet.
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <View key={task.id} style={[styles.row, { borderBottomColor: theme.border }]}>
              <View style={[styles.dot, { backgroundColor: theme.brand }]} />
              <Text style={[styles.taskTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
                {task.title}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.actions}>
        <AppButton
          label="Save tasks"
          loading={saving}
          disabled={tasks.length === 0}
          onPress={handleSave}
        />
        <AppButton label="Edit selection" variant="ghost" onPress={() => router.back()} />
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
