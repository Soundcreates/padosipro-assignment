import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthHeader } from '@/components/ui/auth-header';
import { AuthScreen } from '@/components/ui/auth-screen';
import { AppButton } from '@/components/ui/button';
import { NetworkStateLinks } from '@/components/ui/network-state-links';
import { TASK_CATEGORIES } from '@/constants/tasks';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TaskSelectScreen() {
  const theme = useTheme();

  return (
    <AuthScreen>
      <View style={styles.header}>
        <AuthHeader />
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts.serif ?? Fonts.sans }]}>
          Choose your tasks
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: Fonts.sans }]}>
          Search, pick from each category, then confirm. You can change these later.
        </Text>
      </View>

      <View
        style={[
          styles.searchWrap,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}>
        <Text style={[styles.searchLabel, { color: theme.textSecondary }]}>Search</Text>
        <TextInput
          defaultValue=""
          placeholder="Find a task…"
          placeholderTextColor={theme.textSecondary}
          style={[styles.searchInput, { color: theme.text, fontFamily: Fonts.sans }]}
        />
      </View>

      {TASK_CATEGORIES.map((category) => (
        <View key={category.id} style={styles.category}>
          <Text style={[styles.categoryName, { color: theme.text, fontFamily: Fonts.sans }]}>
            {category.name}
          </Text>
          <View style={styles.taskList}>
            {category.tasks.map((task) => (
              <Pressable
                key={task.id}
                style={[
                  styles.taskRow,
                  {
                    backgroundColor: task.selected ? theme.backgroundElement : theme.surface,
                    borderColor: task.selected ? theme.brand : theme.border,
                  },
                ]}>
                <View
                  style={[
                    styles.check,
                    {
                      borderColor: task.selected ? theme.brand : theme.border,
                      backgroundColor: task.selected ? theme.brand : 'transparent',
                    },
                  ]}>
                  {task.selected ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
                <Text style={[styles.taskTitle, { color: theme.text, fontFamily: Fonts.sans }]}>
                  {task.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <Link href="/home/tasks/confirm" asChild>
        <AppButton label="Review selection" />
      </Link>

      <NetworkStateLinks
        loadingHref="/home/tasks/loading"
        emptyHref="/home/tasks/empty"
        errorHref="/home/tasks/error"
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
