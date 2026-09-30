import { StateScreen } from '@/components/ui/state-screen';

export default function OtpError() {
  return (
    <StateScreen
      kind="error"
      backHref="/auth/otp"
      title="Code not accepted"
      message="That code looks wrong or expired. Request a new one."
    />
  );
}
