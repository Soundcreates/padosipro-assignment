export type TaskItem = {
  id: string;
  title: string;
};

export type TaskCategory = {
  id: string;
  name: string;
  tasks: TaskItem[];
};

export const TASK_CATEGORIES: TaskCategory[] = [
  {
    id: 'home',
    name: 'Home care',
    tasks: [
      { id: 't1', title: 'Daily cleaning' },
      { id: 't2', title: 'Grocery run' },
      { id: 't3', title: 'Laundry pickup' },
    ],
  },
  {
    id: 'errands',
    name: 'Errands',
    tasks: [
      { id: 't4', title: 'Bill payments' },
      { id: 't5', title: 'Courier drop-off' },
      { id: 't6', title: 'Pharmacy refill' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tasks: [
      { id: 't7', title: 'Vendor follow-ups' },
      { id: 't8', title: 'Inventory check' },
      { id: 't9', title: 'Staff scheduling' },
    ],
  },
];
