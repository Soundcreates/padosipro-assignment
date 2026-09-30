import {
  clearAuthCache,
  getCachedToken,
  setCachedToken,
  setCachedUser,
  type CachedUser,
} from '@/cache/authCache';

type RegisterResult =
  | { ok: true; email: string; user: CachedUser }
  | { ok: false; error: string };

type LoginResult =
  | { ok: true; token: string; email: string; user: CachedUser }
  | { ok: false; error: string; needsVerification?: boolean };

type ResendOtpResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

type VerifyOtpResult =
  | { ok: true; email: string; user: CachedUser }
  | { ok: false; error: string };

type MeResult =
  | { ok: true; user: CachedUser }
  | { ok: false; error: string };

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://kisha-volcanologic-motherly.ngrok-free.dev';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

function toCachedUser(user: Record<string, unknown>): CachedUser {
  return {
    id: typeof user.id === 'number' ? user.id : undefined,
    email: String(user.email ?? ''),
    name: (user.name as string | null | undefined) ?? null,
    mobile: (user.mobile as string | null | undefined) ?? null,
    country_code: (user.country_code as string | null | undefined) ?? null,
    address: (user.address as string | null | undefined) ?? null,
    business_name: (user.business_name as string | null | undefined) ?? null,
    is_verified: Boolean(user.is_verified ?? user.isVerified),
  };
}

export const register = async (
  email: string,
  password: string
): Promise<RegisterResult> => {
  if (!email || !password || email.trim() === '' || password.trim() === '') {
    return { ok: false, error: 'Invalid email or password' };
  }
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message ?? 'Failed to register' };
    }

    const user = toCachedUser(data.user ?? { email });
    setCachedUser(user);
    return { ok: true, email: user.email, user };
  } catch {
    return { ok: false, error: 'Failed to register' };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  if (!email || !password || email.trim() === '' || password.trim() === '') {
    return { ok: false, error: 'Invalid email or password' };
  }
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        error: data.message ?? 'Failed to login',
        needsVerification: Boolean(data.needsVerification),
      };
    }

    if (!data.token || !data.user?.email) {
      return { ok: false, error: data.message ?? 'Failed to login' };
    }

    const user = toCachedUser(data.user);
    setCachedUser(user);
    setCachedToken(data.token);
    return { ok: true, token: data.token, email: user.email, user };
  } catch {
    return { ok: false, error: 'Failed to login' };
  }
};

export const resendOtp = async (email: string): Promise<ResendOtpResult> => {
  if (!email || email.trim() === '') {
    return { ok: false, error: 'Email is required' };
  }
  try {
    const response = await fetch(`${API_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message ?? 'Failed to resend code' };
    }

    return { ok: true, message: data.message ?? 'OTP resent successfully' };
  } catch {
    return { ok: false, error: 'Failed to resend code' };
  }
};

export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResult> => {
  if (!email || !otp || email.trim() === '' || otp.trim() === '') {
    return { ok: false, error: 'Email and OTP are required' };
  }
  try {
    const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message ?? 'Failed to verify code' };
    }

    const user = toCachedUser(data.user ?? { email });
    setCachedUser(user);
    return { ok: true, email: user.email, user };
  } catch {
    return { ok: false, error: 'Failed to verify code' };
  }
};

export const fetchMe = async (): Promise<MeResult> => {
  const token = getCachedToken();
  if (!token) {
    return { ok: false, error: 'Not authenticated' };
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message ?? 'Failed to load profile' };
    }

    const user = toCachedUser(data.user ?? {});
    setCachedUser(user);
    return { ok: true, user };
  } catch {
    return { ok: false, error: 'Failed to load profile' };
  }
};

export const logout = (): void => {
  clearAuthCache();
};
