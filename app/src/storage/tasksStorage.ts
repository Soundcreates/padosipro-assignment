import AsyncStorage from '@react-native-async-storage/async-storage';

import { TASK_CATEGORIES, type TaskItem } from '@/constants/tasks';

const DAILY_TASKS_KEY = 'tasks_daily';
const PENDING_TASKS_KEY = 'tasks_pending';

type DailyTasksPayload = {
  date: string;
  taskIds: string[];
  completedIds: string[];
};

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function tasksById(): Map<string, TaskItem> {
  return new Map(TASK_CATEGORIES.flatMap((category) => category.tasks.map((task) => [task.id, task])));
}

export function resolveTasksByIds(taskIds: string[]): TaskItem[] {
  const lookup = tasksById();
  return taskIds
    .map((id) => lookup.get(id))
    .filter((task): task is TaskItem => Boolean(task));
}

async function readDailyPayload(): Promise<DailyTasksPayload | null> {
  const raw = await AsyncStorage.getItem(DAILY_TASKS_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<DailyTasksPayload>;
    if (!parsed.date || !Array.isArray(parsed.taskIds)) {
      await AsyncStorage.removeItem(DAILY_TASKS_KEY);
      return null;
    }
    return {
      date: parsed.date,
      taskIds: parsed.taskIds,
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
    };
  } catch {
    await AsyncStorage.removeItem(DAILY_TASKS_KEY);
    return null;
  }
}

async function writeDailyPayload(payload: DailyTasksPayload): Promise<void> {
  await AsyncStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(payload));
}

export async function clearDailyTasksIfNewDay(): Promise<boolean> {
  const payload = await readDailyPayload();
  if (!payload) {
    return false;
  }
  if (payload.date === getLocalDateKey()) {
    return false;
  }
  await AsyncStorage.multiRemove([DAILY_TASKS_KEY, PENDING_TASKS_KEY]);
  return true;
}

export async function getSelectedTaskIds(): Promise<string[]> {
  await clearDailyTasksIfNewDay();
  const payload = await readDailyPayload();
  return payload?.taskIds ?? [];
}

export async function getSelectedTasks(): Promise<TaskItem[]> {
  const ids = await getSelectedTaskIds();
  return resolveTasksByIds(ids);
}

export async function getCompletedTaskIds(): Promise<string[]> {
  await clearDailyTasksIfNewDay();
  const payload = await readDailyPayload();
  if (!payload) {
    return [];
  }
  const selected = new Set(payload.taskIds);
  return payload.completedIds.filter((id) => selected.has(id));
}

export async function toggleTaskCompleted(taskId: string): Promise<string[]> {
  await clearDailyTasksIfNewDay();
  const payload = await readDailyPayload();
  if (!payload || !payload.taskIds.includes(taskId)) {
    return [];
  }

  const completedIds = payload.completedIds.includes(taskId)
    ? payload.completedIds.filter((id) => id !== taskId)
    : [...payload.completedIds, taskId];

  await writeDailyPayload({ ...payload, completedIds });
  return completedIds;
}

export async function saveSelectedTaskIds(taskIds: string[]): Promise<void> {
  const uniqueIds = [...new Set(taskIds)];
  const existing = await readDailyPayload();
  const selected = new Set(uniqueIds);
  const completedIds = (existing?.completedIds ?? []).filter((id) => selected.has(id));

  await writeDailyPayload({
    date: getLocalDateKey(),
    taskIds: uniqueIds,
    completedIds,
  });
  await AsyncStorage.removeItem(PENDING_TASKS_KEY);
}

export async function setPendingTaskIds(taskIds: string[]): Promise<void> {
  await AsyncStorage.setItem(PENDING_TASKS_KEY, JSON.stringify([...new Set(taskIds)]));
}

export async function getPendingTaskIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(PENDING_TASKS_KEY);
  if (!raw) {
    return getSelectedTaskIds();
  }
  try {
    const ids = JSON.parse(raw) as string[];
    return Array.isArray(ids) ? ids : getSelectedTaskIds();
  } catch {
    return getSelectedTaskIds();
  }
}

export async function getPendingTasks(): Promise<TaskItem[]> {
  const ids = await getPendingTaskIds();
  return resolveTasksByIds(ids);
}
