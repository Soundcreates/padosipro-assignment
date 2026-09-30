import { StateScreen } from '@/components/ui/state-screen';

export default function RegisterLoading() {
  return (
    <StateScreen
      kind="loading"
      backHref="/auth/register"
      title="Creating account"
      message="Setting up your PadosiPro space."
    />
  );
}
