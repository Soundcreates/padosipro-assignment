import { StateScreen } from '@/components/ui/state-screen';

export default function TasksEmpty() {
  return (
    <StateScreen
      kind="empty"
      backHref="/home/tasks"
      title="No tasks yet"
      message="There are no tasks in the catalogue right now."
    />
  );
}
