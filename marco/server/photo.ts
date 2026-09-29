// Photos des lieux via l'API officielle Google Places (Find Place + Place Photo).
// Nécessite GOOGLE_MAPS_API_KEY. L'image est relayée à la volée (pas de stockage), avec l'attribution
// demandée par Google renvoyée dans l'en-tête X-Photo-Attribution.
const refs = new Map<string, { ref: string; attribution: string } | null>();

export interface PhotoResponse {
  status: number;
  headers: Record<string, string>;
  body: Buffer | string;
}

const json = (status: number, data: unknown): PhotoResponse => ({
  status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export async function handlePhoto(search: URLSearchParams): Promise<PhotoResponse> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (search.get("status")) return json(200, { enabled: Boolean(key) });
  if (!key) return json(503, { error: "no_key" });
  const q = (search.get("q") ?? "").slice(0, 200).trim();
  if (!q) return json(400, { error: "missing_query" });

  try {
    if (!refs.has(q)) {
      const find = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
      find.search = new URLSearchParams({
        input: `${q}, Paris`,
        inputtype: "textquery",
        fields: "photos",
        locationbias: "circle:15000@48.8566,2.3522",
        language: "fr",
        key,
      }).toString();
      const data = (await (await fetch(find)).json()) as {
        candidates?: { photos?: { photo_reference: string; html_attributions?: string[] }[] }[];
      };
      const photo = data.candidates?.[0]?.photos?.[0];
      refs.set(q, photo ? { ref: photo.photo_reference, attribution: (photo.html_attributions ?? []).join(" ") } : null);
    }
    const hit = refs.get(q);
    if (!hit) return json(404, { error: "no_photo" });

    const img = new URL("https://maps.googleapis.com/maps/api/place/photo");
    img.search = new URLSearchParams({ maxwidth: "900", photo_reference: hit.ref, key }).toString();
    const res = await fetch(img); // suit la redirection vers l'image
    if (!res.ok) return json(502, { error: "photo_fetch_failed" });
    return {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "private, max-age=3600",
        "X-Photo-Attribution": hit.attribution.replace(/[^\x20-\x7e]/g, "").slice(0, 300),
      },
      body: Buffer.from(await res.arrayBuffer()),
    };
  } catch (err) {
    console.error("[photo]", err);
    return json(502, { error: "photo_error" });
  }
}
