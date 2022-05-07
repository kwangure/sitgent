import { bundleImports } from "rollup-plugin-bundle-imports";
import commonjs from "@rollup/plugin-commonjs";
import fs from "fs";
import json from "@rollup/plugin-json";
import pack from './scripts/pack.js';
import resolve from "@rollup/plugin-node-resolve";
import walk from "acorn-walk";
import MagicString from "magic-string";

export default {
    input: {
        assert: "./src/assert.js",
        dom: "./src/dom.js",
        playwright: "./src/playwright/fixtures.js",
        plugin: "./src/plugin/index.js",
        test: "./src/test.js",
    },
    output: {
        dir: "dist",
        format: "esm",
    },
    external: ["playwright", "@playwright/test"],
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
        json(),
        resolve({
            browser: true,
        }),
        patchPrettyFormat(),
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

/**
 * Remove the `pretty-format` plugin and augment playwright to make
 * the package more friendly to ESM consumers and browser environments
 * @param {{}} options
 * @returns {import("rollup").Plugin}
 */
function patchPrettyFormat(options = {}) {
    return {
        name: "plugin-patch-pretty-format",
        load(id) {
            if (id.includes("pretty-format")) {
                // Use placeholder stub for plugins.
                return "export const plugins = {};";
            }
        },
        async transform(code, id) {
            // Remove dependency `pretty-format` by changing all references.
            // `pretty-format` includes React and Node.js stuff
            if (id.includes("@testing-library/dom.esm.js")) {
                const magicString = new MagicString(code);
                walk.ancestor(this.parse(code), {
                    FunctionDeclaration(node) {
                        if (node.id.name !== "prettyDOM") return;
                        magicString.overwrite(node.start, node.end, "function prettyDOM(dom) { return dom.outerHTML; }");
                    },
                    VariableDeclarator(node) {
                        let replaceString = "";
                        switch (node.id.name) {
                            case "debug":
                                replaceString = `var debug = console.log;`;
                                break;
                            case "screen":
                                replaceString = `var screen = getQueriesForElement(document.body, queries, initialValue)`;
                                break;
                            case "DOMCollection":
                                break;
                            default:
                                return;
                        }
                        magicString.overwrite(
                            node.start - 4, // var start
                            node.end + 1, // semi colon end
                            replaceString,
                        );
                    },
                    ExportNamedDeclaration(node) {
                        node.specifiers.forEach((specifier) => {
                            if (specifier.local.name === "prettyFormat") {
                                let { end, start } = specifier;
                                // prevent double commas e.g `export { a , , b };`
                                while (code[end] === "," || code[end] === " ") end++;
                                magicString.overwrite(start, end, "");
                            }
                        });
                    },
                });
                return {
                    code: magicString.toString(),
                    map: magicString.generateMap(),
                };
            }

            if (id.includes("node_modules/playwright-core/lib/utils/stackTrace.js")) {
                const magicString = new MagicString(code);
                walk.ancestor(this.parse(code), {
                    VariableDeclarator(node) {
                        let replaceString = "";
                        switch (node.id.name) {
                            case "CORE_DIR":
                                replaceString = `var debug = console.log;`;
                                break;
                            case "screen":
                                replaceString = `var screen = getQueriesForElement(document.body, queries, initialValue)`;
                                break;
                            case "DOMCollection":
                                break;
                            default:
                                return;
                        }
                        magicString.overwrite(
                            node.start - 4, // var start
                            node.end + 1, // semi colon end
                            replaceString,
                        );
                    },
                    ExportNamedDeclaration(node) {
                        node.specifiers.forEach((specifier) => {
                            if (specifier.local.name === "prettyFormat") {
                                let { end, start } = specifier;
                                // prevent double commas e.g `export { a , , b };`
                                while (code[end] === "," || code[end] === " ") end++;
                                magicString.overwrite(start, end, "");
                            }
                        });
                    },
                });
                return {
                    code: magicString.toString(),
                    map: magicString.generateMap(),
                };
            }
        },
    };
}

