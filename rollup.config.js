import commonjs from "@rollup/plugin-commonjs";
import fs from "fs";
import pack from "./scripts/pack.js";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";

const external = [].concat(
	Object.keys(pkg.dependencies || {}),
	Object.keys(pkg.peerDependencies || {}),
	Object.keys(process.binding("natives")),
);

export default {
    input: {
        matchers: "./src/matchers/index.js",
    },
    output: {
        dir: "dist",
        format: "esm",
    },
    external: (id) => {
        return id.startsWith("node:") || external.includes(id);
    },
    plugins: [
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
            writeBundle: pack,
        },
    ],
}
