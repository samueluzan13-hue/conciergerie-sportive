import { useEffect, useState } from "react";
import type { Mood } from "../data/spots";
import { saveUserState, startCloud } from "./cloud";

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
  updatedAt?: number;
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

function commit(next: State, sync: boolean) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  if (sync) saveUserState(state as unknown as Record<string, unknown>);
  listeners.forEach((l) => l());
}

export function setState(update: (s: State) => State) {
  commit({ ...update(state), updatedAt: Date.now() }, true);
}

/** Connecte la base : récupère les données de l'utilisateur sauvegardées sur son compte. */
export function connectCloud() {
  startCloud((remote) => {
    if (remote && typeof remote === "object" && typeof remote.profile === "object") {
      const r = { ...DEFAULT, ...(remote as Partial<State>) } as State;
      if ((r.updatedAt ?? 0) >= (state.updatedAt ?? 0)) commit(r, false);
      else saveUserState(state as unknown as Record<string, unknown>);
    } else if (state.profile.onboarded) {
      // première connexion : on envoie ce qui existe déjà sur l'appareil
      saveUserState(state as unknown as Record<string, unknown>);
    }
  });
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
