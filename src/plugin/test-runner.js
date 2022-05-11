import { Runner } from "./playwright-test/runner.js";

class SitgentRunner {
    /**
     * @param {import("./types").RunnerOptions} options
     */
    constructor(options) {
        const { importFile, playwrightConfig } = options;
        this._playwrightOptions = playwrightConfig;
        this._runner = new Runner(this._playwrightOptions);
        this._runner._loader._requireOrImport = importFile;

        this.isRunning = false;
    }
    async run() {
        if (this.isRunning) {
            throw new Error("Tear down test before calling run again.");
        }
        // Only support options via Vite plugin for now.
        await this._runner.loadEmptyConfig(process.cwd());

        const results = await this._runner.runAllTests({
            listOnly: !!this._playwrightOptions.list,
            filePatternFilter: [],
            projectFilter: this._playwrightOptions.project || undefined,
        });

        return results;
    }

    async teardown() {
        if (!this.isRunning) {
            throw new Error("Only call teardown AFTER calling run, and only call it once.");
        }
        await this._teardown();
        this._teardown = null;
    }

    _patchGlobalSetup() {
        // We keep a reference of the teardown function so that
        // we can terminate tests on the fly
        const { _performGlobalSetup } = this._runner;
        this._runner._performGlobalSetup = async (...args) => {
            const teardown = await _performGlobalSetup.apply(this._runner, ...args);
            if (!teardown) return;
            this.isRunning = true;
            this._teardown = async (...args) => {
                try {
                    await teardown(...args);
                } catch (err) {
                    throw err;
                } finally {
                    this.isRunning = false;
                }
            }
            return teardown;
        };
    }
}

export { SitgentRunner as Runner };
