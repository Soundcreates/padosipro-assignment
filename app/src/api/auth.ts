type RegisterResult =
  | { ok: true; email: string }
  | { ok: false; error: string };

type LoginResult =
  | { ok: true; token: string; email: string }
  | { ok: false; error: string };

const API_URL = "https://kisha-volcanologic-motherly.ngrok-free.dev";

export const register = async (
  email: string,
  password: string
): Promise<RegisterResult> => {
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return { ok: false, error: "Invalid email or password" };
  }
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message ?? "Failed to register" };
    }

    return { ok: true, email: data.user.email };
  } catch {
    return { ok: false, error: "Failed to register" };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return { ok: false, error: "Invalid email or password" };
  }
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message ?? "Failed to login" };
    }

    return { ok: true, token: data.token, email: data.user.email };
  } catch {
    return { ok: false, error: "Failed to login" };
  }
};
