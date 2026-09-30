import { StateScreen } from '@/components/ui/state-screen';

export default function ProfileLoading() {
  return (
    <StateScreen
      kind="loading"
      backHref="/profile"
      showBack={false}
      title="Loading profile"
      message="Fetching your details."
    />
  );
}
