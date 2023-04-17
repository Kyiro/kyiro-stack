import { Logger } from "optic/mod.ts";
import { serve } from "std/http/mod.ts";
import { Hono } from "hono/mod.ts";
import { serveStatic } from "./middleware/serveStatic.ts";
import { HOSTNAME, PORT } from "./env.ts";
import router from "./routes/mod.ts";

const app = new Hono();
const logger = new Logger();

app.get(
    "*",
    serveStatic({
        root: "./frontend",
        tsconfig: "./deno.json",
    }),
);

app.route("/", await router());

// temp fix for deno watch mode breaking
const abortController = new AbortController();

serve(app.fetch, {
    hostname: HOSTNAME,
    port: PORT,
    signal: abortController.signal,
    onListen: (x) => logger.info(`Listening on ${x.hostname}:${x.port}`),
});

globalThis.addEventListener("unload", () => abortController.abort());
