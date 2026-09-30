type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, value: T, ttlMs: number): void {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry || entry.expiresAt < Date.now()) {
      return undefined;
    }
    return entry.value as T;
  }

  peek<T>(key: string): { value: T; isExpired: boolean } | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }
    return {
      value: entry.value as T,
      isExpired: entry.expiresAt < Date.now(),
    };
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}
