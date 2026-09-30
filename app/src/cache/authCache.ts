import { MemoryCache } from '@/cache/memoryCache';

export type CachedUser = {
  id?: number;
  email: string;
  name?: string | null;
  mobile?: string | null;
  country_code?: string | null;
  address?: string | null;
  business_name?: string | null;
  is_verified?: boolean;
};

const USER_KEY = 'auth:user';
const TOKEN_KEY = 'auth:token';
export const USER_CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new MemoryCache();

export function setCachedUser(user: CachedUser, ttlMs = USER_CACHE_TTL_MS): void {
  cache.set(USER_KEY, user, ttlMs);
}

export function patchCachedUser(partial: Partial<CachedUser>, ttlMs = USER_CACHE_TTL_MS): void {
  const current = peekCachedUser()?.value;
  if (!current && !partial.email) {
    return;
  }
  setCachedUser({ ...(current ?? { email: '' }), ...partial, email: partial.email ?? current?.email ?? '' }, ttlMs);
}

export function getCachedUser(): CachedUser | undefined {
  return cache.get<CachedUser>(USER_KEY);
}

export function peekCachedUser(): { value: CachedUser; isExpired: boolean } | undefined {
  return cache.peek<CachedUser>(USER_KEY);
}

export function setCachedToken(token: string, ttlMs = USER_CACHE_TTL_MS): void {
  cache.set(TOKEN_KEY, token, ttlMs);
}

export function getCachedToken(): string | undefined {
  return cache.get<string>(TOKEN_KEY) ?? cache.peek<string>(TOKEN_KEY)?.value;
}

export function clearAuthCache(): void {
  cache.delete(USER_KEY);
  cache.delete(TOKEN_KEY);
}
