export type TaskItem = {
  id: string;
  title: string;
  selected?: boolean;
};

export type TaskCategory = {
  id: string;
  name: string;
  tasks: TaskItem[];
};

/** Static catalogue for UI mockups only */
export const TASK_CATEGORIES: TaskCategory[] = [
  {
    id: 'home',
    name: 'Home care',
    tasks: [
      { id: 't1', title: 'Daily cleaning', selected: true },
      { id: 't2', title: 'Grocery run', selected: true },
      { id: 't3', title: 'Laundry pickup' },
    ],
  },
  {
    id: 'errands',
    name: 'Errands',
    tasks: [
      { id: 't4', title: 'Bill payments', selected: true },
      { id: 't5', title: 'Courier drop-off' },
      { id: 't6', title: 'Pharmacy refill' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tasks: [
      { id: 't7', title: 'Vendor follow-ups' },
      { id: 't8', title: 'Inventory check', selected: true },
      { id: 't9', title: 'Staff scheduling' },
    ],
  },
];

export const SELECTED_TASKS = TASK_CATEGORIES.flatMap((c) => c.tasks.filter((t) => t.selected));
