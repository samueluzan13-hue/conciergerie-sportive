import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { handleMarco } from "./server/marco";

// En dev, expose /api/marco (même logique que la fonction serverless api/marco.ts).
function marcoApi(): Plugin {
  return {
    name: "marco-api",
    configureServer(server) {
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
  };
});
