import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { handleMarco } from "./server/marco";
import { handlePhoto } from "./server/photo";
import { handleReserve } from "./server/reserve";
import { handleVoice } from "./server/voice";

// En dev, expose /api/marco (même logique que la fonction serverless api/marco.ts).
function marcoApi(): Plugin {
  return {
    name: "marco-api",
    configureServer(server) {
      server.middlewares.use("/api/appel", async (req, res) => {
        let raw = "";
        for await (const chunk of req) raw += chunk;
        const token = req.headers["x-marco-admin"];
        const { status, body } = await handleVoice(req.method ?? "GET", new URL(req.url ?? "/", "http://localhost").searchParams, raw, typeof token === "string" ? token : undefined);
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      });
      server.middlewares.use("/api/reserve", async (req, res) => {
        const { status, headers, body } = await handleReserve(new URL(req.url ?? "/", "http://localhost").searchParams);
        res.statusCode = status;
        for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
        res.end(body);
      });
      server.middlewares.use("/api/photo", async (req, res) => {
        const { status, headers, body } = await handlePhoto(new URL(req.url ?? "/", "http://localhost").searchParams);
        res.statusCode = status;
        for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
        res.end(body);
      });
      server.middlewares.use("/api/marco", async (req, res) => {
        let raw = "";
        for await (const chunk of req) raw += chunk;
        const { status, body } = await handleMarco(req.method ?? "GET", raw);
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    plugins: [react(), marcoApi()],
    server: { port: 5174 },
    // `vite build --mode preview` : un seul fichier JS (pour l'aperçu en page unique)
    ...(mode === "preview" && {
      define: { "import.meta.env.VITE_PREVIEW": "true" },
      build: { outDir: "dist-preview", rolldownOptions: { output: { inlineDynamicImports: true } } },
    }),
  };
});
