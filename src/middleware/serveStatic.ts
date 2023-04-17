import type { Context } from "hono/context.ts";
import type { Next } from "hono/types.ts";
import { getFilePath } from "hono/utils/filepath.ts";
import { getMimeType } from "hono/utils/mime.ts";
import * as esbuild from "esbuild";
import sass from "denosass/mod.ts";

export type ServeStaticOptions = {
    root?: string;
    path?: string;
    tsconfig?: string;
};

const DEFAULT_DOCUMENT = "index.html";

export const serveStatic = (options: ServeStaticOptions = { root: "" }) => {
    const tsconfig = {
        ...JSON.parse(options.tsconfig ? Deno.readTextFileSync(options.tsconfig) : "{}"),
        compilerOptions: {
            jsxImportSource: "preact"
        }
    };

    return async (c: Context, next: Next) => {
        // Do nothing if Response is already set
        if (c.finalized) {
            await next();
            return;
        }

        const url = new URL(c.req.url);

        const path = `./${
            getFilePath({
                filename: options.path ?? decodeURI(url.pathname),
                root: options.root,
                defaultDocument: DEFAULT_DOCUMENT,
            })
        }`;

        let content: string | Uint8Array | null = await Deno.readFile(path)
            .catch(() => null);

        if (!content) return await next();

        let mimeType = getMimeType(path);

        if ([".ts", ".tsx", ".jsx"].find((i) => path.endsWith(i))) {
            mimeType = "text/javascript";

            const res = await esbuild.transform(content, {
                jsx: "automatic",
                minify: true,
                tsconfigRaw: tsconfig as string,
                loader: "tsx",
            });

            content = res.code;
        } else if ([".scss", ".sass"].find((i) => path.endsWith(i))) {
            mimeType = "text/css";

            const res = sass(content, {
                load_paths: options.root ? [options.root] : undefined,
                quiet: true,
            });

            content = res.to_string() as string;
        }

        if (mimeType) {
            c.header("Content-Type", mimeType);
        }

        return c.body(content);
    };
};
