// Fonction serverless (Vercel / compatible Node) : GET /api/photo?q=Nom du lieu adresse
import type { IncomingMessage, ServerResponse } from "node:http";
import { handlePhoto } from "../server/photo";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", "http://localhost");
  const { status, headers, body } = await handlePhoto(url.searchParams);
  res.statusCode = status;
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(body);
}
