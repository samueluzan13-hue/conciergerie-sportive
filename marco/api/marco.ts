// Fonction serverless (Vercel / compatible Node) : POST /api/marco
import type { IncomingMessage, ServerResponse } from "node:http";
import { handleMarco } from "../server/marco";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const { status, body } = await handleMarco(req.method ?? "GET", raw);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}
