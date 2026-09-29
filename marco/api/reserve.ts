// Fonction serverless : GET /api/reserve?q=Nom du lieu adresse → redirige vers le site officiel du lieu
import type { IncomingMessage, ServerResponse } from "node:http";
import { handleReserve } from "../server/reserve";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const { status, headers, body } = await handleReserve(new URL(req.url ?? "/", "http://localhost").searchParams);
  res.statusCode = status;
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(body);
}
