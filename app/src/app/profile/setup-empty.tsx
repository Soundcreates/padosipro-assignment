import { StateScreen } from '@/components/ui/state-screen';

export default function ProfileSetupEmpty() {
  return (
    <StateScreen
      kind="empty"
      backHref="/profile/setup"
      title="Complete the form"
      message="Name, mobile and address are needed to continue."
    />
  );
}
