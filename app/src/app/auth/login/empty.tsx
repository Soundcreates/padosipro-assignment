import { StateScreen } from '@/components/ui/state-screen';

export default function LoginEmpty() {
  return (
    <StateScreen
      kind="empty"
      backHref="/auth/login"
      title="No account found"
      message="We could not find a matching account for that email."
    />
  );
}
