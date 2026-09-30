import { StateScreen } from '@/components/ui/state-screen';

export default function HomeLoading() {
  return (
    <StateScreen
      kind="loading"
      backHref="/home"
      showBack={false}
      title="Loading home"
      message="Gathering your selected tasks."
    />
  );
}
