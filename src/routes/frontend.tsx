import { Hono } from "hono/mod.ts";
import { render } from "preact-render-to-string";
import { createElement } from "preact";
import { App } from "$/app.tsx";

function ImportMap(props: { data: string }) {
    const safe = JSON.stringify(JSON.parse(props.data));

    return <script type="importmap" dangerouslySetInnerHTML={{ __html: safe }}></script>;
}

export const router = new Hono();

router.get("*", async (c, next) => {
    const { pathname } = new URL(c.req.url);

    if (pathname.startsWith("/api")) return await next();
    
    const bodyContent = { __html: render(createElement(App, { url: pathname })) };

    const res = render(
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/style/main.scss" />
                <script async src="https://esm.sh/es-module-shims@1.7.1" type="module"></script>
                <ImportMap data={await Deno.readTextFileSync("./importMap.client.json")} />
                <script defer type="module" src="/client.tsx"></script>
            </head>
            <body dangerouslySetInnerHTML={bodyContent}>
            </body>
        </html>
    );

    return c.html("<!DOCTYPE html>" + res);
});
