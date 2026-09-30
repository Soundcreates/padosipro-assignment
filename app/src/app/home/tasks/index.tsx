import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { TASK_CATEGORIES } from '@/constants/tasks';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  getPendingTaskIds,
  getSelectedTaskIds,
  setPendingTaskIds,
} from '@/storage/tasksStorage';

export default function TaskSelectScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const pending = await getPendingTaskIds();
      const saved = pending.length > 0 ? pending : await getSelectedTaskIds();
      if (!cancelled) {
        setSelectedIds(saved);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const query = search.trim().toLowerCase();

  const toggleTask = (taskId: string) => {
    setSelectedIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleReview = async () => {
    await setPendingTaskIds(selectedIds);
    router.push('/home/tasks/confirm');
  };

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Choose your tasks
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Search, pick from each category, then confirm. Tasks reset every midnight.
        </Text>
      </View>

      <View
        style={[
          styles.searchWrap,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}>
        <Text style={[styles.searchLabel, { color: theme.textSecondary }]}>Search</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Find a task…"
          placeholderTextColor={theme.textSecondary}
          style={[styles.searchInput, { color: theme.text, fontFamily: Fonts.sans }]}
        />
      </View>

      {TASK_CATEGORIES.map((category) => {
        const tasks = category.tasks.filter((task) =>
          query ? task.title.toLowerCase().includes(query) : true
        );
        if (tasks.length === 0) {
          return null;
        }

        return (
          <View key={category.id} style={styles.category}>
            <Text style={[styles.categoryName, { color: theme.text, fontFamily: Fonts.sans }]}>
              {category.name}
            </Text>
            <View style={styles.taskList}>
              {tasks.map((task) => {
                const selected = selectedSet.has(task.id);
                return (
                  <Pressable
                    key={task.id}
                    onPress={() => toggleTask(task.id)}
                    style={[
                      styles.taskRow,
                      {
                        backgroundColor: selected ? theme.backgroundElement : theme.surface,
                        borderColor: selected ? theme.brand : theme.border,
                      },
                    ]}>
                    <View
                      style={[
                        styles.check,
                        {
                          borderColor: selected ? theme.brand : theme.border,
                          backgroundColor: selected ? theme.brand : 'transparent',
                        },
                      ]}>
                      {selected ? <Text style={styles.checkMark}>✓</Text> : null}
                    </View>
                    <Text style={[styles.taskTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
                      {task.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}

      <AppButton
        label="Review selection"
        loading={loading}
        disabled={selectedIds.length === 0}
        onPress={handleReview}
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
  searchWrap: {
    borderWidth: 1.5,
    borderRadius: 10,
    borderBottomLeftRadius: 18,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: 4,
  },
  searchLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: Spacing.one,
  },
  category: {
    gap: Spacing.two,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  taskList: {
    gap: Spacing.two,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
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
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
});
