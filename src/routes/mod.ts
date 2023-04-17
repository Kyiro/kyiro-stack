import { Hono } from "hono/mod.ts";

export default async function() {
    const router = new Hono();
    
    router.route("/", (await import("./frontend.tsx")).router);
    
    return router;
}