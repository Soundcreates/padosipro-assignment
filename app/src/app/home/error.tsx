import { StateScreen } from '@/components/ui/state-screen';

export default function HomeError() {
  return (
    <StateScreen
      kind="error"
      backHref="/home"
      showBack={false}
      title="Home unavailable"
      message="We could not load your task list."
    />
  );
}
