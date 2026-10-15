// Thin wrappers around localStorage that never throw (private mode, quota errors).

export const loadJson = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const saveJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable; the app keeps working in memory.
  }
};

export const removeKey = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage unavailable.
  }
};
