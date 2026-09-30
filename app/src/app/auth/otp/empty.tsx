import { StateScreen } from '@/components/ui/state-screen';

export default function OtpEmpty() {
  return (
    <StateScreen
      kind="empty"
      backHref="/auth/otp"
      title="Enter a code"
      message="Type the 6-digit code from your email to continue."
    />
  );
}
