import path from "path";
import { Runner } from "./playwright-test/runner.js";

class SitgentRunner {
    constructor(options = {}) {
        this._options = resolveOptions(options);
        this._runner = new Runner(this._options);

        this.isRunning = false;
    }
    async run() {
        if (this.isRunning) {
            throw new Error("Tear down test before calling run again.");
        }
        // Only support options via Vite plugin for now.
        await this._runner.loadEmptyConfig(process.cwd());

        const results = await this._runner.runAllTests({
            listOnly: !!this._options.list,
            filePatternFilter: [],
            projectFilter: this._options.project || undefined,
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
                } catch(err) {
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

function resolveOptions(options = {}) {
    const shardPair = options.shard
        ? options.shard.split('/').map((t) => parseInt(t, 10))
        : undefined;
    const resolvedOptions = {
        forbidOnly: options.forbidOnly
            ? true
            : undefined,
        fullyParallel: options.fullyParallel
            ? true
            : undefined,
        globalTimeout: options.globalTimeout
            ? parseInt(options.globalTimeout, 10)
            : undefined,
        grep: options.grep
            ? forceRegExp(options.grep)
            : undefined,
        grepInvert: options.grepInvert
            ? forceRegExp(options.grepInvert)
            : undefined,
        maxFailures: options.x
            ? 1
            : (options.maxFailures ? parseInt(options.maxFailures, 10) : undefined),
        outputDir: options.output
            ? path.resolve(process.cwd(), options.output)
            : undefined,
        quiet: options.quiet
            ? options.quiet : undefined,
        repeatEach: options.repeatEach
            ? parseInt(options.repeatEach, 10)
            : undefined,
        retries: options.retries
            ? parseInt(options.retries, 10)
            : undefined,
        reporter: (options.reporter && options.reporter.length)
            ? options.reporter.split(',').map((r) => [resolveReporter(r)])
            : undefined,
        shard: shardPair
            ? { current: shardPair[0], total: shardPair[1] }
            : undefined,
        timeout: options.timeout
            ? parseInt(options.timeout, 10)
            : undefined,
        updateSnapshots: options.updateSnapshots
            ? 'all'
            : undefined,
        use: options.use ? options.use: {},
        workers: options.workers
            ? parseInt(options.workers, 10)
            : undefined,
    };

    if (options.debug) {
        Object.assign(resolvedOptions.use, { headless: false });
        Object.assign(resolvedOptions, { maxFailures: 1, timeout: 0, workers: 1 });
        process.env.PWDEBUG = "1";
    }

    if (resolvedOptions.browser) {
        const browserOpt = browser.toLowerCase();
        if (!["all", "chromium", "firefox", "webkit"].includes(browserOpt)) {
            throw new Error(`Unsupported browser "${opts.browser}", must be one of "all", "chromium", "firefox" or "webkit"`);
        }
        const browserNames = browserOpt === "all"
            ? ["chromium", "firefox", "webkit"]
            : [browserOpt];
        Object.assign(resolvedOptions, {
            projects: browserNames.map((name) => ({ name, use: { name } })),
        });
    }

    return resolvedOptions;
}

function forceRegExp(pattern) {
    const match = pattern.match(/^\/(.*)\/([gi]*)$/);
    if (match) {
        return new RegExp(match[1], match[2]);
    }
    return new RegExp(pattern, "gi");
}