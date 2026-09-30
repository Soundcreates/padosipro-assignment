import { StateScreen } from '@/components/ui/state-screen';

export default function ProfileSetupError() {
  return (
    <StateScreen
      kind="error"
      backHref="/profile/setup"
      title="Could not save"
      message="Your profile was not saved. Try again."
    />
  );
}
