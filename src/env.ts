import "std/dotenv/load.ts";

const env = Deno.env.toObject();

export const HOSTNAME = Object.freeze(env["HOSTNAME"] ?? "0.0.0.0");
export const PORT = Object.freeze(parseInt(env["PORT"] ?? "80"));