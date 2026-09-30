import { StateScreen } from '@/components/ui/state-screen';

export default function ProfileSetupLoading() {
  return (
    <StateScreen
      kind="loading"
      backHref="/profile/setup"
      title="Saving profile"
      message="Writing your first-login details."
    />
  );
}
