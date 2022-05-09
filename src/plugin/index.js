import { runTests } from "./test-runner.js";

/**
 * @param {{}} [options]
 * @returns {import("vite").Plugin}
 */
 export default function sveltekitPluginTest(options = {}) {
    const { playwright } = options;
    /** @type {import("vite").ResolvedConfig} */
    let config;
    /** @type {import("vite").ViteDevServer} */
    let server;
    return {
        name: "sveltekit-plugin-test",
        apply: "serve",
        configResolved(_config) {
            config = _config;
        },
        configureServer(_server) {
            server = _server;
            server.httpServer?.once("listening", async () => {
                const protocol = config.server.https ? "https" : "http";
                const port = config.server.port;
                const baseUrl = `${protocol}://localhost:${port}`;
                await runTests({ baseUrl, playwright });
            });
        },
    };
}
