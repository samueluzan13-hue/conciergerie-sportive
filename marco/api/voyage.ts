// Fonction serverless : vols et hébergements réservables dans Marco (voir server/travel.ts)
import type { IncomingMessage, ServerResponse } from "node:http";
import { handleTravel } from "../server/travel";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const { status, body } = await handleTravel(req.method ?? "GET", new URL(req.url ?? "/", "http://localhost").searchParams, raw);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
