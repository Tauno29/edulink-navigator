import { useCallback, useEffect, useState } from "react";

const KEY = "eduspace-applications";

export type UploadedDoc = {
  slot: "birth" | "report" | "other";
  name: string;
  size: number;
  type: string;
  /** Local object URL for preview — not persisted. */
  url?: string;
};

export type ApplicationStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "WAITLISTED";

export type Application = {
  id: string;
  school_id: string;
  school_name: string;
  grade: string;
  stream?: string;
  learner_name: string;
  learner_dob: string;
  learner_gender: string;
  hostel: boolean;
  guardian_name: string;
  guardian_relationship: string;
  parent_whatsapp: string;
  docs_urls: { slot: string; name: string }[];
  waitlist: boolean;
  status: ApplicationStatus;
  has_priority_alerts: boolean;
  created_at: string;
};

function read(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Application[]) : [];
  } catch {
    return [];
  }
}

function write(list: Application[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export function saveApplication(app: Application) {
  write([app, ...read().filter((a) => a.id !== app.id)]);
}

export function setPriorityAlerts(id: string, value: boolean) {
  write(read().map((a) => (a.id === id ? { ...a, has_priority_alerts: value } : a)));
}

export function useApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  useEffect(() => { setApps(read()); }, []);
  const refresh = useCallback(() => setApps(read()), []);
  return { apps, refresh };
}

export function newApplicationId() {
  return `app-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const NAM_BANKS = [
  { bank: "FNB Namibia", account: "620 1234 5678", branch: "282672", ref: "Learner name + Grade" },
  { bank: "Standard Bank", account: "0424 5678 901", branch: "082372", ref: "Learner name + Grade" },
  { bank: "Bank Windhoek", account: "8000 1234 567", branch: "481972", ref: "Learner name + Grade" },
];

export const PRIORITY_FEE = 30;