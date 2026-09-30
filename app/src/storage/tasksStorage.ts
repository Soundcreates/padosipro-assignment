import * as SecureStore from 'expo-secure-store';

import { TASK_CATEGORIES, type TaskItem } from '@/constants/tasks';

const DAILY_TASKS_KEY = 'tasks_daily';
const PENDING_TASKS_KEY = 'tasks_pending';

type DailyTasksPayload = {
  date: string;
  taskIds: string[];
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
  const raw = await SecureStore.getItemAsync(DAILY_TASKS_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as DailyTasksPayload;
  } catch {
    await SecureStore.deleteItemAsync(DAILY_TASKS_KEY);
    return null;
  }
}

export async function clearDailyTasksIfNewDay(): Promise<boolean> {
  const payload = await readDailyPayload();
  if (!payload) {
    return false;
  }
  if (payload.date === getLocalDateKey()) {
    return false;
  }
  await SecureStore.deleteItemAsync(DAILY_TASKS_KEY);
  await SecureStore.deleteItemAsync(PENDING_TASKS_KEY);
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

export async function saveSelectedTaskIds(taskIds: string[]): Promise<void> {
  const payload: DailyTasksPayload = {
    date: getLocalDateKey(),
    taskIds: [...new Set(taskIds)],
  };
  await SecureStore.setItemAsync(DAILY_TASKS_KEY, JSON.stringify(payload));
  await SecureStore.deleteItemAsync(PENDING_TASKS_KEY);
}

export async function setPendingTaskIds(taskIds: string[]): Promise<void> {
  await SecureStore.setItemAsync(PENDING_TASKS_KEY, JSON.stringify([...new Set(taskIds)]));
}

export async function getPendingTaskIds(): Promise<string[]> {
  const raw = await SecureStore.getItemAsync(PENDING_TASKS_KEY);
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
