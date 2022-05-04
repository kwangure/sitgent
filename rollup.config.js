import { bundleImports } from "rollup-plugin-bundle-imports";
import commonjs from "@rollup/plugin-commonjs";
import fs from "fs";
import pack from './scripts/pack.js';
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: {
        assert: "./src/assert.js",
        dom: "./src/dom.js",
        plugin: "./src/plugin/index.js",
        test: "./src/test.js",
    },
    output: {
        dir: "dist",
        format: "esm",
    },
    plugins: [
        bundleImports({
            options: {
                external: ["__COMPONENT_PATH__"],
                output: {
                    format: "esm",
                    preferConst: true,
                }
            },
        }),
        commonjs(),
        resolve({
            browser: true,
        }),
        {
            renderStart(outputOptions) {
                if (outputOptions.dir) {
                    fs.rmSync(outputOptions.dir, { recursive: true, force: true });
                }
            },
            resolveImportMeta(property) {
                if (property === "hot") return "import.meta.hot";
            },
            writeBundle: pack,
        },
    ],
}
