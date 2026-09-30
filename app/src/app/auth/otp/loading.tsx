import { StateScreen } from '@/components/ui/state-screen';

export default function OtpLoading() {
  return (
    <StateScreen
      kind="loading"
      backHref="/auth/otp"
      title="Verifying code"
      message="Confirming your one-time password."
    />
  );
}
