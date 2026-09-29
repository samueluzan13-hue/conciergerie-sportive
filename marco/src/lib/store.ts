import { useEffect, useState } from "react";
import type { Mood } from "../data/spots";

export interface Profile {
  name: string;
  quartier: string;
  moods: Mood[];
  onboarded: boolean;
}

export interface SavedPlan {
  id: string;
  title: string;
  createdAt: number;
  stops: { spotId: string; time: string }[];
}

interface State {
  profile: Profile;
  saved: string[];
  history: string[];
  plans: SavedPlan[];
  streetsRead: string[];
  waitlist?: string;
}

const KEY = "marco.state.v1";
const DEFAULT: State = {
  profile: { name: "", quartier: "Le Marais", moods: [], onboarded: false },
  saved: [],
  history: [],
  plans: [],
  streetsRead: [],
};

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    /* stockage indisponible : on repart de zéro */
  }
  return DEFAULT;
}

let state: State = load();
const listeners = new Set<() => void>();

export function getState() {
  return state;
}

export function setState(update: (s: State) => State) {
  state = update(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useStore<T>(select: (s: State) => T): T {
  const [value, setValue] = useState(() => select(state));
  useEffect(() => {
    const l = () => setValue(() => select(state));
    listeners.add(l);
    return () => void listeners.delete(l);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return value;
}

export function toggleSaved(id: string) {
  setState((s) => ({
    ...s,
    saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [id, ...s.saved],
  }));
}

export function pushHistory(id: string) {
  setState((s) => ({ ...s, history: [id, ...s.history.filter((x) => x !== id)].slice(0, 12) }));
}

export function markStreetRead(id: string) {
  setState((s) => ({ ...s, streetsRead: [id, ...s.streetsRead.filter((x) => x !== id)].slice(0, 30) }));
}

export function savePlan(plan: SavedPlan) {
  setState((s) => ({ ...s, plans: [plan, ...s.plans].slice(0, 20) }));
}

export function updateProfile(p: Partial<Profile>) {
  setState((s) => ({ ...s, profile: { ...s.profile, ...p } }));
}
