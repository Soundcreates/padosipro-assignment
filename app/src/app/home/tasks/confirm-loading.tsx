import { StateScreen } from '@/components/ui/state-screen';

export default function TasksConfirmLoading() {
  return (
    <StateScreen
      kind="loading"
      backHref="/home/tasks/confirm"
      title="Saving selection"
      message="Locking in your chosen tasks."
    />
  );
}
