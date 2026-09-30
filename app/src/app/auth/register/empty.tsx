import { StateScreen } from '@/components/ui/state-screen';

export default function RegisterEmpty() {
  return (
    <StateScreen
      kind="empty"
      backHref="/auth/register"
      title="Nothing to submit"
      message="Fill in the required fields to create your account."
    />
  );
}
