import { createTestRunner } from "./test-runner.js";
import { serialize } from "../utils/object.js";
/**
 * @param {{}} [options]
 * @returns {import("vite").Plugin}
 */
export default function sveltekitPluginTest(options = {}) {
    const { playwright = {} } = options;
    /** @type {import("vite").ResolvedConfig} */
    let config;
    /** @type {import("vite").ViteDevServer} */
    let server;
    return {
        name: "sveltekit-plugin-test",
        apply: "serve",
        configResolved(_config) {
            config = _config;
            playwright.use = {
                ...playwright.use,
                viteConfig: serialize(config),
            };
        },
        configureServer(_server) {
            server = _server;
            const protocol = config.server.https ? "https" : "http";
            const port = config.server.port;
            playwright.use = {
                ...playwright.use,
                baseURL: `${protocol}://localhost:${port}`,
            };
            const runner = createTestRunner({ playwright });
            server.httpServer?.once("listening", async () => {
                await runner.run();
            });
            server.watcher?.on("all", async () => {
                await runner.rerun();
            });
        },
    };
}
