import { serialize } from "../utils/object.js";
import { Runner } from "./test-runner.js";
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
            const port = config.server.port || 3000;
            playwright.use = {
                ...playwright.use,
                baseURL: `${protocol}://localhost:${port}`,
            };

            const runner = new Runner();
            server.httpServer?.once("listening", async () => {
                await runner.run();
            });
            server.watcher?.on("all", async () => {
                if (runner.isRunning) {
                    await runner.teardown();
                }
                await runner.run();
            });
        },
    };
}
