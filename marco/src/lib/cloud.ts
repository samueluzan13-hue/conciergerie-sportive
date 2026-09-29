// Base de données de Marco.
// Dans l'aperçu claude.ai, la page reçoit une base (capacité `db`), l'identité du visiteur (`user`)
// et l'IA (`sample`). Ailleurs (site classique), tout ça est absent et l'app utilise ses données intégrées.
import { useEffect, useState } from "react";
import { SPOTS, type Category, type Mood, type Spot } from "../data/spots";
import { STREETS, type StreetStory } from "../data/streets";
import { WEBSITES } from "../data/websites";
import { log, setDiagSink } from "./diag";

/* ---------- Types minimaux des capacités (voir la doc du runtime) ---------- */
interface DocSnap { id: string; exists: boolean; data(): Record<string, unknown> | undefined }
interface QuerySnap { docs: DocSnap[] }
interface DocRef {
  get(): Promise<DocSnap>;
  set(d: Record<string, unknown>): Promise<void>;
  update(d: Record<string, unknown>): Promise<void>;
  delete(): Promise<void>;
  onSnapshot(next: (s: DocSnap) => void, err?: (e: { code: string }) => void): () => void;
}
interface ColRef {
  doc(id?: string): DocRef;
  orderBy(field: string, dir?: "asc" | "desc"): ColRef;
  onSnapshot(next: (s: QuerySnap) => void, err?: (e: { code: string }) => void): () => void;
}
interface Db { doc(p: string): DocRef; collection(p: string): ColRef }
interface User { id(): Promise<string | null>; canEdit(): Promise<boolean>; can(n: string): Promise<boolean | null> }
export interface SampleFn {
  (input: string | { role: "user" | "assistant"; content: string }[], opts?: { onText?: (e: { text: string }) => void; modelTier?: string; cache?: boolean; signal?: AbortSignal }): Promise<{ text: string }>;
}
declare global {
  interface Window { claude?: { use(name: string): Promise<unknown> } }
}

const use = <T,>(name: string): Promise<T | null> =>
  window.claude?.use ? (window.claude.use(name) as Promise<T | null>).catch(() => null) : Promise.resolve(null);

/* ---------- État de la connexion ---------- */
export interface CloudState {
  /** base disponible dans cette vue */
  db: boolean;
  /** données chargées depuis la base (sinon : données intégrées) */
  fromDb: boolean;
  isAdmin: boolean;
  canWrite: boolean;
  userId: string | null;
  /** augmente à chaque changement des lieux / rues */
  version: number;
  suggestions: Suggestion[];
}

export interface Suggestion {
  id: string;
  name: string;
  address: string;
  quartier: string;
  why: string;
  createdAt: number;
}

let cloud: CloudState = { db: false, fromDb: false, isAdmin: false, canWrite: false, userId: null, version: 0, suggestions: [] };
const listeners = new Set<() => void>();
const emit = (patch: Partial<CloudState>) => {
  cloud = { ...cloud, ...patch };
  listeners.forEach((l) => l());
};

export function useCloud() {
  const [s, set] = useState(cloud);
  useEffect(() => {
    const l = () => set(cloud);
    listeners.add(l);
    set(cloud);
    return () => void listeners.delete(l);
  }, []);
  return s;
}

let dbRef: Db | null = null;

/* ---------- Validation (les données partagées ne sont jamais fiables) ---------- */
const CATS: Category[] = ["resto", "bar", "cafe", "culture", "nature", "insolite", "activite"];
const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.slice(0, max) : "");
const num = (v: unknown, d = 0) => (typeof v === "number" && isFinite(v) ? v : d);
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, Math.round(n)));

export function toSpot(id: string, d: Record<string, unknown>): Spot | null {
  const name = str(d.name, 120);
  const category = CATS.includes(d.category as Category) ? (d.category as Category) : null;
  const lat = num(d.lat), lng = num(d.lng);
  if (!name || !category || !lat || !lng) return null;
  return {
    id,
    name,
    category,
    quartier: str(d.quartier, 80),
    arrondissement: clamp(num(d.arrondissement, 1), 1, 20),
    address: str(d.address, 200),
    lat, lng,
    price: clamp(num(d.price, 2), 1, 3) as Spot["price"],
    hidden: clamp(num(d.hidden, 2), 1, 3) as Spot["hidden"],
    moods: Array.isArray(d.moods) ? (d.moods.filter((m) => typeof m === "string") as Mood[]) : [],
    pitch: str(d.pitch, 600),
    tip: str(d.tip, 600),
    duration: clamp(num(d.duration, 60), 10, 300),
    bookable: d.bookable === "table" || d.bookable === "activite" ? d.bookable : undefined,
    diet: Array.isArray(d.diet) ? (d.diet.filter((x) => x === "casher" || x === "halal") as Spot["diet"]) : undefined,
    photo: typeof d.photo === "string" && (/^[0-9a-f]{32}$/.test(d.photo) || /^https:\/\//.test(d.photo)) ? d.photo : undefined,
    photoCredit: str(d.photoCredit, 120) || undefined,
    website: (typeof d.website === "string" && /^https:\/\/[^\s]+$/.test(d.website) ? d.website.slice(0, 300) : "") || WEBSITES[id],
  };
}

export function toStreet(id: string, d: Record<string, unknown>): StreetStory | null {
  const name = str(d.name, 120);
  const fait = (d.fait ?? {}) as Record<string, unknown>;
  if (!name || !str(d.histoire)) return null;
  return {
    id,
    name,
    aliases: Array.isArray(d.aliases) ? d.aliases.filter((a) => typeof a === "string").slice(0, 10) : [],
    arrondissement: str(d.arrondissement, 40),
    lat: num(d.lat, 48.8566), lng: num(d.lng, 2.3522),
    histoire: str(d.histoire),
    fait: { annee: str(fait.annee, 20), texte: str(fait.texte) },
    anecdote: str(d.anecdote),
    aVoir: Array.isArray(d.aVoir) ? d.aVoir.filter((a) => typeof a === "string").slice(0, 6) : [],
  };
}

/** Remplace le contenu d'une liste ; renvoie false si rien n'a changé (évite de redessiner l'app pour rien). */
const replace = <T,>(arr: T[], items: T[]) => {
  if (JSON.stringify(arr) === JSON.stringify(items)) return false;
  arr.splice(0, arr.length, ...items);
  return true;
};

/* ---------- Démarrage ---------- */
let started = false;
export async function startCloud(onUserState: (state: Record<string, unknown> | null) => void) {
  if (started) return;
  started = true;
  log("cloud:start", { hasClaude: Boolean(window.claude?.use) });
  const [db, user] = await Promise.all([use<Db>("db"), use<User>("user")]);
  log("cloud:caps", { db: Boolean(db), user: Boolean(user) });
  if (!db) return;
  dbRef = db;
  const [userId, isAdmin, canWrite] = await Promise.all([
    user?.id().catch(() => null) ?? null,
    user?.canEdit().catch(() => false) ?? false,
    user?.can("data.write").catch(() => null) ?? null,
  ]);
  emit({ db: true, userId, isAdmin, canWrite: canWrite ?? true });
  log("cloud:user", { userId: Boolean(userId), isAdmin, canWrite });
  if (userId) {
    let writing: Promise<void> = Promise.resolve();
    const ref = db.doc(`data/users/${userId}/diag`);
    // on garde aussi les sessions précédentes (les 150 derniers événements) pour pouvoir diagnostiquer après coup
    const previous = ref.get().then((d) => {
      const e = d.data()?.entries;
      return Array.isArray(e) ? e.slice(-120) : [];
    }).catch(() => []);
    setDiagSink((entries) => {
      writing = writing.then(async () => {
        const all = [...(await previous), { t: "", ev: "---- session" }, ...entries].slice(-150);
        await ref.set({ entries: all, updatedAt: Date.now() }).catch(() => {});
      });
    });
  }

  db.collection("lieux").onSnapshot((snap) => {
    log("db:lieux", snap.docs.length);
    const items = snap.docs.map((d) => toSpot(d.id, d.data() ?? {})).filter((x): x is Spot => !!x);
    if (items.length && replace(SPOTS, items)) emit({ fromDb: true, version: cloud.version + 1 });
  }, (e) => log("db:lieux:error", e.code));
  db.collection("rues").onSnapshot((snap) => {
    const items = snap.docs.map((d) => toStreet(d.id, d.data() ?? {})).filter((x): x is StreetStory => !!x);
    if (items.length && replace(STREETS, items.sort((a, b) => a.name.localeCompare(b.name, "fr")))) emit({ fromDb: true, version: cloud.version + 1 });
  }, (e) => log("db:rues:error", e.code));
  if (isAdmin) {
    db.collection("suggestions").onSnapshot((snap) => {
      emit({
        suggestions: snap.docs
          .map((d) => {
            const x = d.data() ?? {};
            return { id: d.id, name: str(x.name, 120), address: str(x.address, 200), quartier: str(x.quartier, 80), why: str(x.why, 600), createdAt: num(x.createdAt) };
          })
          .filter((s) => s.name)
          .sort((a, b) => b.createdAt - a.createdAt),
      });
    });
  }

  if (userId) {
    try {
      const snap = await db.doc(`data/users/${userId}/etat`).get();
      onUserState(snap.exists ? snap.data() ?? null : null);
    } catch {
      onUserState(null);
    }
  }
}

/* ---------- Écritures ---------- */
let saveTimer: ReturnType<typeof setTimeout> | undefined;
let saving: Promise<void> = Promise.resolve();
/** Sauvegarde (regroupée) des données personnelles de l'utilisateur. */
export function saveUserState(state: Record<string, unknown>) {
  if (!dbRef || !cloud.userId) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const ref = dbRef!.doc(`data/users/${cloud.userId}/etat`);
    saving = saving.then(() => ref.set(JSON.parse(JSON.stringify(state))).catch(() => {}));
  }, 900);
}

const slug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || `id-${Date.now()}`;

function strip<T extends { id: string }>(x: T) {
  const { id: _id, ...rest } = x;
  return JSON.parse(JSON.stringify(rest)) as Record<string, unknown>;
}

export async function saveSpot(spot: Spot) {
  if (!dbRef) throw new Error("Base indisponible");
  const id = spot.id || slug(spot.name);
  await dbRef.collection("lieux").doc(id).set(strip({ ...spot, id }));
  return id;
}
export async function deleteSpot(id: string) {
  await dbRef?.collection("lieux").doc(id).delete();
}
export async function saveStreet(street: StreetStory) {
  if (!dbRef) throw new Error("Base indisponible");
  const id = street.id || slug(street.name);
  await dbRef.collection("rues").doc(id).set(strip({ ...street, id }));
  return id;
}
export async function deleteStreet(id: string) {
  await dbRef?.collection("rues").doc(id).delete();
}
export async function sendSuggestion(s: Omit<Suggestion, "id" | "createdAt">) {
  if (!dbRef) throw new Error("Base indisponible");
  await dbRef.collection("suggestions").doc().set({ ...s, createdAt: Date.now() });
}
export async function deleteSuggestion(id: string) {
  await dbRef?.collection("suggestions").doc(id).delete();
}

/* ---------- Récits des rues (écrits une fois par l'IA, partagés ensuite) ---------- */
const recitId = (name: string) => slug(name).slice(0, 120);

export async function getRecit(name: string): Promise<string | null> {
  if (!dbRef) return null;
  try {
    const snap = await dbRef.collection("recits").doc(recitId(name)).get();
    const text = snap.exists ? snap.data()?.text : null;
    return typeof text === "string" && text.length > 40 ? text : null;
  } catch {
    return null;
  }
}

export async function saveRecit(name: string, text: string) {
  if (!dbRef || !cloud.canWrite) return;
  try {
    await dbRef.collection("recits").doc(recitId(name)).set({ name, text: text.slice(0, 8000), createdAt: Date.now() });
  } catch {
    /* écriture refusée (droits) : pas grave, le récit reste affiché */
  }
}

/* ---------- Photos des lieux (stockées dans l'app, ajoutées par les éditeurs) ---------- */
interface Assets { upload(blob: Blob, options?: { type?: string }): Promise<{ id: string; url: string }> }
export const getAssets = () => use<Assets>("assets");

/** Réduit une image (max 1400 px, JPEG) pour qu'elle reste légère sur mobile. */
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    return blob ?? file;
  } catch {
    return file;
  }
}

/** Téléverse une photo et l'associe au lieu. Renvoie l'identifiant de la photo. */
export async function setSpotPhoto(spotId: string, file: File, credit: string) {
  const assets = await getAssets();
  if (!assets || !dbRef) throw new Error("not_granted");
  const blob = await shrink(file);
  const { id } = await assets.upload(blob, { type: blob.type || "image/jpeg" });
  await dbRef.collection("lieux").doc(spotId).update({ photo: id, photoCredit: credit.trim().slice(0, 120) });
  const spot = SPOTS.find((s) => s.id === spotId);
  if (spot) {
    spot.photo = id;
    spot.photoCredit = credit.trim() || undefined;
  }
  emit({ version: cloud.version + 1 });
  return id;
}

/* ---------- IA intégrée à l'aperçu ---------- */
export const getSample = () => use<SampleFn>("sample");

type PermState = "granted" | "prompt" | "denied" | "unavailable";
interface Permissions {
  state(name: string): Promise<PermState>;
  request(names?: string[]): Promise<Record<string, PermState>>;
}
/** Autorisation de l'IA dans l'aperçu : "granted", "prompt" (à demander), "denied", "unavailable". */
export async function aiPermission(): Promise<PermState> {
  const p = await use<Permissions>("permissions");
  return p ? p.state("sample").catch(() => "unavailable" as const) : "unavailable";
}
/** Demande l'autorisation de l'IA (une seule fenêtre ; ne rejette jamais). */
export async function requestAi(): Promise<PermState> {
  const p = await use<Permissions>("permissions");
  if (!p) return "unavailable";
  const r = await p.request(["sample"]).catch(() => ({}) as Record<string, PermState>);
  return r.sample ?? "unavailable";
}
