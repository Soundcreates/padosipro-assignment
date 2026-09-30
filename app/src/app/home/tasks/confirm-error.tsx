import { StateScreen } from '@/components/ui/state-screen';

export default function TasksConfirmError() {
  return (
    <StateScreen
      kind="error"
      backHref="/home/tasks/confirm"
      title="Save failed"
      message="Your task selection was not saved."
    />
  );
}
