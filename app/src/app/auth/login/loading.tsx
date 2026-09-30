import { StateScreen } from '@/components/ui/state-screen';

export default function LoginLoading() {
  return (
    <StateScreen
      kind="loading"
      backHref="/auth/login"
      title="Signing in"
      message="Checking your credentials."
    />
  );
}
