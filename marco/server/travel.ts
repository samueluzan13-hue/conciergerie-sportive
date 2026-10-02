// Vols et hébergements réservables directement dans Marco, via Duffel (https://duffel.com) :
// les compagnies aériennes et les hôtels sont interrogés en direct, et la réservation est créée chez Duffel.
//
//   GET  /api/voyage                         → { flights, stays, booking } : ce qui est activé
//   POST /api/voyage?action=vols             → recherche de vols, offres triables
//   POST /api/voyage?action=reserver-vol     → réserve une offre (billet émis par la compagnie)
//   POST /api/voyage?action=hebergements     → hôtels et appartements disponibles autour d'un point
//   POST /api/voyage?action=chambres         → chambres et tarifs d'un hébergement
//   POST /api/voyage?action=reserver-chambre → devis puis réservation d'un tarif
//
// Variables d'environnement :
//   DUFFEL_ACCESS_TOKEN   jeton Duffel (duffel_test_… pour les essais, duffel_live_… en production)
//   DUFFEL_STAYS=1        si l'offre hébergement de Duffel (Stays) est activée sur le compte
//   MARCO_BOOKING=1       autorise la réservation réelle. Le paiement est alors prélevé sur le solde Duffel
//                         de l'entreprise : il faut encaisser le client avant (Stripe, Duffel Payments…).
import { Duffel } from "@duffel/api";

type Res = { status: number; body: unknown };

let client: Duffel | null = null;
const duffel = () => (client ??= new Duffel({ token: process.env.DUFFEL_ACCESS_TOKEN! }));
const has = () => Boolean(process.env.DUFFEL_ACCESS_TOKEN);
const stays = () => has() && process.env.DUFFEL_STAYS === "1";
const canBook = () => process.env.MARCO_BOOKING === "1";

const s = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const date = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "");
const n = (v: unknown, min: number, max: number) => Math.min(max, Math.max(min, Math.round(Number(v)) || min));

export async function handleTravel(method: string, search: URLSearchParams, raw: string): Promise<Res> {
  if (method === "GET") return { status: 200, body: { flights: has(), stays: stays(), booking: canBook() } };
  if (method !== "POST") return { status: 405, body: { error: "method" } };
  if (!has()) return { status: 503, body: { error: "not_configured" } };
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw || "{}");
  } catch {
    return { status: 400, body: { error: "json" } };
  }
  try {
    switch (search.get("action")) {
      case "vols": return await searchFlights(b);
      case "reserver-vol": return await bookFlight(b);
      case "hebergements": return await searchStays(b);
      case "chambres": return await stayRates(b);
      case "reserver-chambre": return await bookStay(b);
      default: return { status: 400, body: { error: "action" } };
    }
  } catch (err) {
    const e = err as { errors?: { message?: string; title?: string }[]; message?: string };
    console.error("[voyage]", e.errors ?? e.message ?? err);
    return { status: 502, body: { error: "provider_error", message: e.errors?.[0]?.message ?? e.errors?.[0]?.title } };
  }
}

/* ---------------- Vols ---------------- */
async function searchFlights(b: Record<string, unknown>): Promise<Res> {
  const from = s(b.from, 3).toUpperCase(), to = s(b.to, 3).toUpperCase();
  const depart = date(b.depart), back = date(b.back);
  const adults = n(b.adults, 1, 9);
  const cabin = (["economy", "premium_economy", "business", "first"] as const).find((c) => c === b.cabin) ?? "economy";
  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) || !depart) return { status: 400, body: { error: "params" } };

  const slices = [{ origin: from, destination: to, departure_date: depart, arrival_time: null, departure_time: null }];
  if (back) slices.push({ origin: to, destination: from, departure_date: back, arrival_time: null, departure_time: null });
  const r = await duffel().offerRequests.create({
    slices,
    passengers: Array.from({ length: adults }, () => ({ type: "adult" as const })),
    cabin_class: cabin,
    return_offers: true,
    max_connections: 1,
  });
  const offers = (r.data.offers ?? []).slice(0, 60).map((o) => ({
    id: o.id,
    price: Number(o.total_amount),
    currency: o.total_currency,
    airline: { name: o.owner.name, iata: o.owner.iata_code, logo: o.owner.logo_symbol_url },
    expiresAt: o.expires_at,
    passengerIds: o.passengers.map((p) => p.id),
    refundable: Boolean(o.conditions?.refund_before_departure?.allowed),
    changeable: Boolean(o.conditions?.change_before_departure?.allowed),
    slices: o.slices.map((sl) => ({
      from: sl.origin.iata_code,
      to: sl.destination.iata_code,
      duration: sl.duration,
      stops: sl.segments.length - 1,
      departAt: sl.segments[0]?.departing_at,
      arriveAt: sl.segments[sl.segments.length - 1]?.arriving_at,
      segments: sl.segments.map((sg) => ({
        flight: `${sg.marketing_carrier.iata_code}${sg.marketing_carrier_flight_number}`,
        carrier: sg.marketing_carrier.name,
        from: sg.origin.iata_code,
        to: sg.destination.iata_code,
        departAt: sg.departing_at,
        arriveAt: sg.arriving_at,
      })),
      bags: sl.segments[0]?.passengers?.[0]?.baggages?.map((g) => `${g.quantity} ${g.type === "checked" ? "bagage en soute" : "bagage cabine"}`).join(", ") ?? "",
    })),
  }));
  return { status: 200, body: { offers } };
}

async function bookFlight(b: Record<string, unknown>): Promise<Res> {
  if (!canBook()) return { status: 403, body: { error: "booking_disabled" } };
  const offerId = s(b.offerId, 80);
  const list = Array.isArray(b.passengers) ? b.passengers.slice(0, 9) : [];
  if (!offerId || !list.length) return { status: 400, body: { error: "params" } };
  // le prix peut avoir changé : on relit l'offre juste avant de réserver
  const offer = (await duffel().offers.get(offerId)).data;
  const passengers = offer.passengers.map((p, i) => {
    const x = (list[i] ?? {}) as Record<string, unknown>;
    const gender = x.gender === "f" ? "f" : "m";
    return {
      id: p.id,
      title: (gender === "f" ? "ms" : "mr") as "ms" | "mr",
      gender: gender as "f" | "m",
      given_name: s(x.given_name, 60),
      family_name: s(x.family_name, 60),
      born_on: date(x.born_on),
      email: s(x.email, 120),
      phone_number: s(x.phone_number, 20).replace(/[^\d+]/g, ""),
    };
  });
  if (passengers.some((p) => !p.given_name || !p.family_name || !p.born_on || !/^\S+@\S+\.\S+$/.test(p.email) || !/^\+\d{8,15}$/.test(p.phone_number))) {
    return { status: 400, body: { error: "passengers" } };
  }
  const order = await duffel().orders.create({
    type: "instant",
    selected_offers: [offer.id],
    passengers,
    payments: [{ type: "balance", amount: offer.total_amount, currency: offer.total_currency }],
    metadata: { source: "marco" },
  });
  return { status: 200, body: { reference: order.data.booking_reference, orderId: order.data.id, price: Number(order.data.total_amount), currency: order.data.total_currency } };
}

/* ---------------- Hébergements ---------------- */
const APARTMENT = /appart|apartment|apartamento|apartament|aparthotel|residence|résidence|flat|loft|suites|studio|lofts|wohnung/i;

async function searchStays(b: Record<string, unknown>): Promise<Res> {
  if (!stays()) return { status: 503, body: { error: "stays_not_enabled" } };
  const lat = Number(b.lat), lng = Number(b.lng);
  const checkin = date(b.checkin), checkout = date(b.checkout);
  const adults = n(b.adults, 1, 8), rooms = n(b.rooms, 1, 4);
  if (!isFinite(lat) || !isFinite(lng) || !checkin || !checkout) return { status: 400, body: { error: "params" } };
  const r = await duffel().stays.search({
    location: { radius: n(b.radius, 1, 10), geographic_coordinates: { latitude: lat, longitude: lng } },
    check_in_date: checkin,
    check_out_date: checkout,
    rooms,
    guests: Array.from({ length: adults }, () => ({ type: "adult" as const })),
  });
  const kind = b.kind === "appartement" ? "appartement" : b.kind === "hotel" ? "hotel" : "tout";
  const results = r.data.results
    .map((x) => ({
      id: x.id,
      name: x.accommodation.name,
      stars: x.accommodation.rating,
      reviewScore: x.accommodation.review_score,
      reviewCount: x.accommodation.review_count,
      photo: x.accommodation.photos?.[0]?.url ?? null,
      address: [x.accommodation.location?.address?.line_one, x.accommodation.location?.address?.city_name].filter(Boolean).join(", "),
      lat: x.accommodation.location?.geographic_coordinates?.latitude ?? null,
      lng: x.accommodation.location?.geographic_coordinates?.longitude ?? null,
      price: Number(x.cheapest_rate_total_amount),
      currency: x.cheapest_rate_currency,
      apartment: APARTMENT.test(x.accommodation.name),
    }))
    .filter((x) => kind === "tout" || (kind === "appartement" ? x.apartment : !x.apartment))
    .slice(0, 60);
  return { status: 200, body: { results } };
}

async function stayRates(b: Record<string, unknown>): Promise<Res> {
  if (!stays()) return { status: 503, body: { error: "stays_not_enabled" } };
  const id = s(b.searchResultId, 80);
  if (!id) return { status: 400, body: { error: "params" } };
  const r = (await duffel().stays.searchResults.fetchAllRates(id)).data;
  const rooms = r.accommodation.rooms.slice(0, 12).map((room) => ({
    name: room.name,
    photo: room.photos?.[0]?.url ?? null,
    beds: room.beds?.map((bd) => `${bd.count} ${bd.type}`).join(", ") ?? "",
    rates: room.rates.slice(0, 4).map((rt) => ({
      id: rt.id,
      price: Number(rt.total_amount),
      currency: rt.total_currency,
      board: rt.board_type,
      refundable: rt.cancellation_timeline.length > 0,
      refundableUntil: rt.cancellation_timeline[0]?.before ?? null,
      payAtHotel: Number(rt.due_at_accommodation_amount ?? 0),
    })),
  }));
  return { status: 200, body: { name: r.accommodation.name, description: r.accommodation.description ?? "", checkIn: r.accommodation.check_in_information, rooms } };
}

async function bookStay(b: Record<string, unknown>): Promise<Res> {
  if (!stays()) return { status: 503, body: { error: "stays_not_enabled" } };
  if (!canBook()) return { status: 403, body: { error: "booking_disabled" } };
  const rateId = s(b.rateId, 80);
  const given = s(b.given_name, 60), family = s(b.family_name, 60), email = s(b.email, 120);
  const phone = s(b.phone_number, 20).replace(/[^\d+]/g, "");
  if (!rateId || !given || !family || !/^\S+@\S+\.\S+$/.test(email) || !/^\+\d{8,15}$/.test(phone)) return { status: 400, body: { error: "params" } };
  // le devis fige le prix et la disponibilité, puis on réserve
  const quote = (await duffel().stays.quotes.create(rateId)).data;
  const booking = (await duffel().stays.bookings.create({
    quote_id: quote.id,
    guests: [{ given_name: given, family_name: family }],
    email,
    phone_number: phone,
    accommodation_special_requests: s(b.requests, 300) || undefined,
  })).data;
  return { status: 200, body: { reference: booking.reference, bookingId: booking.id, price: Number(quote.total_amount), currency: quote.total_currency } };
}
