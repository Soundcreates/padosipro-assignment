import { StateScreen } from '@/components/ui/state-screen';

export default function TasksLoading() {
  return (
    <StateScreen
      kind="loading"
      backHref="/home/tasks"
      title="Loading tasks"
      message="Fetching categories for you."
    />
  );
}
