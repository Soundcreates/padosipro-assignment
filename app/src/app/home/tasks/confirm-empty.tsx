import { StateScreen } from '@/components/ui/state-screen';

export default function TasksConfirmEmpty() {
  return (
    <StateScreen
      kind="empty"
      backHref="/home/tasks"
      title="Nothing selected"
      message="Pick at least one task before confirming."
      actionLabel="Choose tasks"
    />
  );
}
