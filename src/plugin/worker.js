import { parentPort, workerData } from "worker_threads";
import path from "path";
import { Runner } from "./playwright-test/runner.js";

const options = workerData;
const resolvedOptions = resolveOptions(options.playwright);
const { browser } = resolvedOptions;
if (browser) {
    const browserOpt = browser.toLowerCase();
    if (!['all', 'chromium', 'firefox', 'webkit'].includes(browserOpt)) {
        throw new Error(`Unsupported browser "${opts.browser}", must be one of "all", "chromium", "firefox" or "webkit"`);
    }
    const browserNames = browserOpt === 'all'
        ? ['chromium', 'firefox', 'webkit']
        : [browserOpt];
    Object.assign(resolvedOptions, {
        projects: browserNames.map((name) => ({ name, use: { name } })),
    });
}

if (options.headed || options.debug) {
    resolvedOptions.use = { headless: false };
}

if (options.debug) {
    resolvedOptions.maxFailures = 1;
    resolvedOptions.timeout = 0;
    resolvedOptions.workers = 1;
    process.env.PWDEBUG = "1";
}

const runner = new Runner(resolvedOptions);
await runner.loadEmptyConfig(process.cwd());

// TODO: Investigate the different kinds of filters the runner offers
// The Playwright CLI adds a `filePatternFilter` here for patterns coming
// through the command line

const results = await runner.runAllTests({
    listOnly: !!options.list,
    filePatternFilter: [],
    projectFilter: options.project || undefined,
});

parentPort.postMessage(results);


function resolveOptions(options = {}) {
    const shardPair = options.shard
        ? options.shard.split('/').map((t) => parseInt(t, 10))
        : undefined;
    return {
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
        workers: options.workers
            ? parseInt(options.workers, 10)
            : undefined,
    };
}

function forceRegExp(pattern) {
    const match = pattern.match(/^\/(.*)\/([gi]*)$/);
    if (match) {
        return new RegExp(match[1], match[2]);
    }
    return new RegExp(pattern, 'gi');
}