import { StateScreen } from '@/components/ui/state-screen';

export default function TasksError() {
  return (
    <StateScreen
      kind="error"
      backHref="/home/tasks"
      title="Could not load tasks"
      message="Check your connection and try again."
    />
  );
}
