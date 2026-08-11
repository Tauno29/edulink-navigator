import { useCallback, useEffect, useState } from "react";

const READ_KEY = "eduspace-read-notifications";
const RECENT_KEY = "eduspace-recent-schools";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export function useReadNotifications() {
  const [read, setRead] = useState<string[]>([]);
  useEffect(() => { setRead(readJSON<string[]>(READ_KEY, [])); }, []);

  const markAll = useCallback((ids: string[]) => {
    setRead((prev) => {
      const next = Array.from(new Set([...prev, ...ids]));
      writeJSON(READ_KEY, next);
      return next;
    });
  }, []);

  const markOne = useCallback((id: string) => markAll([id]), [markAll]);
  const isRead = useCallback((id: string) => read.includes(id), [read]);
  return { read, isRead, markAll, markOne };
}

export function useRecentSchools() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => { setIds(readJSON<string[]>(RECENT_KEY, [])); }, []);

  const record = useCallback((id: string) => {
    setIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 12);
      writeJSON(RECENT_KEY, next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    writeJSON(RECENT_KEY, []);
  }, []);

  return { ids, record, clear };
}

export function recordSchoolView(id: string) {
  const prev = readJSON<string[]>(RECENT_KEY, []);
  writeJSON(RECENT_KEY, [id, ...prev.filter((x) => x !== id)].slice(0, 12));
}

export function clearAllLocalData() {
  ["eduspace-name", "eduspace-onboarded", "edulink-favorites", READ_KEY, RECENT_KEY].forEach((k) => {
    try { localStorage.removeItem(k); } catch { /* ignore */ }
  });
}
