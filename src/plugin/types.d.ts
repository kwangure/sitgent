export interface PluginOptions {
    files?: {
        tests?: string;
    };
    playwright?: import("@playwright/test").Config;
}

export interface RunnerOptions {
    /**
     * A function which returns a Promise that resolves to a CJS or ESM module
     */
    importFile: (file: string) => Promise<Record<string, any>>;

    /**
     * Playwright JavaScript Config
     */
    playwrightConfig: import("@playwright/test").Config;
}
