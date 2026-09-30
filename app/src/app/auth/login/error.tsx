import { StateScreen } from '@/components/ui/state-screen';

export default function LoginError() {
  return (
    <StateScreen
      kind="error"
      backHref="/auth/login"
      title="Sign-in failed"
      message="The server did not respond. Please try again."
    />
  );
}
