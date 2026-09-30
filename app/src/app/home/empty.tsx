import { StateScreen } from '@/components/ui/state-screen';

export default function HomeEmpty() {
  return (
    <StateScreen
      kind="empty"
      backHref="/home/tasks"
      showBack={false}
      title="No tasks selected"
      message="Choose tasks to populate your home screen."
      actionLabel="Select tasks"
    />
  );
}
