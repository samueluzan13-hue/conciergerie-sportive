// Fonction serverless : SMS de confirmation / refus de réservation (voir server/sms.ts)
import type { IncomingMessage, ServerResponse } from "node:http";
import { handleSms } from "../server/sms";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const token = req.headers["x-marco-admin"];
  const { status, body } = await handleSms(req.method ?? "GET", raw, typeof token === "string" ? token : undefined);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
