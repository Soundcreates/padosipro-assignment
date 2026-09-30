import { StateScreen } from '@/components/ui/state-screen';

export default function RegisterError() {
  return (
    <StateScreen
      kind="error"
      backHref="/auth/register"
      title="Registration failed"
      message="We could not create your account right now."
    />
  );
}
