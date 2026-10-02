import { cityById } from "../src/data/cities";
// Réservation directe : retrouve le site officiel d'un lieu via Google Places (champ "website"),
// puis redirige vers lui. Sans clé Google, redirige vers le premier résultat de recherche.
export async function handleReserve(search: URLSearchParams): Promise<{ status: number; headers: Record<string, string>; body: string }> {
  const q = (search.get("q") ?? "").slice(0, 200).trim();
  const city = cityById(search.get("city") ?? undefined);
  const fallback = `https://duckduckgo.com/?q=${encodeURIComponent(`!ducky ${q} ${city.name} site officiel`)}`;
  const redirect = (url: string) => ({ status: 302, headers: { Location: url, "Cache-Control": "private, max-age=3600" }, body: "" });
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!q) return { status: 400, headers: { "Content-Type": "text/plain" }, body: "Lieu manquant" };
  if (!key) return redirect(fallback);
  try {
    const find = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
    find.search = new URLSearchParams({ input: `${q}, ${city.name}`, inputtype: "textquery", fields: "place_id", locationbias: `circle:15000@${city.center.lat},${city.center.lng}`, key }).toString();
    const placeId = ((await (await fetch(find)).json()) as { candidates?: { place_id: string }[] }).candidates?.[0]?.place_id;
    if (!placeId) return redirect(fallback);
    const details = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    details.search = new URLSearchParams({ place_id: placeId, fields: "website,url", language: "fr", key }).toString();
    const r = ((await (await fetch(details)).json()) as { result?: { website?: string; url?: string } }).result;
    return redirect(r?.website || r?.url || fallback);
  } catch (err) {
    console.error("[reserve]", err);
    return redirect(fallback);
  }
}
