// Fonction serverless : agent vocal qui appelle le restaurant pour réserver (voir server/voice.ts)
import type { IncomingMessage, ServerResponse } from "node:http";
import { handleVoice } from "../server/voice";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const url = new URL(req.url ?? "/", "http://localhost");
  const token = req.headers["x-marco-admin"];
  const { status, body } = await handleVoice(req.method ?? "GET", url.searchParams, raw, typeof token === "string" ? token : undefined);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
