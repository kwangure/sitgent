import path from "path";
import { Worker } from "worker_threads";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
/**
 * // TODO: Finish adding in the list of `PlaywrightConfigOptions`
 *
 * @param {{
 *     baseUrl: string;
 *     playwright: import("./types").PlaywrightConfigOptions;
 * }} options
 */
export function createTestRunner(options = {}) {
    let isRerun = false;
    let status;
    let worker;

    function run() {
        status = "running";
        return new Promise((resolve, reject) => {
            worker = new Worker(path.resolve(__dirname, "./worker.js"), { workerData: options });
            worker.on("message", (results) => {
                ({ status } = results);
                resolve();
            });
            worker.on("error", (error) => {
                // Same `status` used by Playwright Test for failed tests
                status = "failed";
                reject(error);
            });
            worker.on("exit", (code) => {
                if (isRerun) {
                    // Same `status` used by Playwright Test for SIGINTs
                    status = "interrupted";
                    isRerun = false;
                    return resolve();
                }

                reject(new Error(`stopped with  ${code} exit code`));
            });
        });
    }

    return {
        run,
        async rerun() {
            if (!worker) return;

            isRerun = true;
            await worker.terminate();
            run();
        },
        get status() {
            return status;
        },
    };
}
