import { useCallback, useEffect, useState } from "react";

const NAME_KEY = "eduspace-name";
const ONBOARD_KEY = "eduspace-onboarded";

export function useUserName() {
  const [name, setNameState] = useState<string>("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setNameState(localStorage.getItem(NAME_KEY) || ""); } catch { /* ignore */ }
    setReady(true);
  }, []);
  const setName = useCallback((v: string) => {
    setNameState(v);
    try { localStorage.setItem(NAME_KEY, v); } catch { /* ignore */ }
  }, []);
  return { name, setName, ready };
}

export function useOnboarding() {
  const [done, setDone] = useState(true);
  useEffect(() => {
    try { setDone(localStorage.getItem(ONBOARD_KEY) === "1"); } catch { setDone(true); }
  }, []);
  const complete = useCallback(() => {
    try { localStorage.setItem(ONBOARD_KEY, "1"); } catch { /* ignore */ }
    setDone(true);
  }, []);
  return { done, complete };
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return { text: "Good morning", period: "morning" as const };
  if (h < 17) return { text: "Good afternoon", period: "afternoon" as const };
  if (h < 21) return { text: "Good evening", period: "evening" as const };
  return { text: "Good night", period: "night" as const };
}
