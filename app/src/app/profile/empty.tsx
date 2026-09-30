import { StateScreen } from '@/components/ui/state-screen';

export default function ProfileEmpty() {
  return (
    <StateScreen
      kind="empty"
      backHref="/profile/setup"
      showBack={false}
      title="Profile incomplete"
      message="Add your details to finish setting up."
      actionLabel="Complete profile"
    />
  );
}
