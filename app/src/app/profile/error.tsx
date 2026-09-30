import { StateScreen } from '@/components/ui/state-screen';

export default function ProfileError() {
  return (
    <StateScreen
      kind="error"
      backHref="/profile"
      showBack={false}
      title="Profile unavailable"
      message="We could not load your profile right now."
    />
  );
}
