import fs from "fs";
import path from "path";

/** @param {string} dir */
export function mkdirp(dir) {
    try {
        fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
        if (e.code === "EEXIST") return;
        throw e;
    }
}

/** @param {string} path */
export function rimraf(path) {
    (fs.rmSync || fs.rmdirSync)(path, { recursive: true, force: true });
}

/**
 * @param {string} from
 * @param {string} to
 * @param {{
 *     filter: (basename: string) => boolean;
 *     transform: (from: string, contents: string) => string;
 * }} filter
 */
export function copy(from, to, {
    filter = () => true,
    transform = (_from, x) => x,
} = {}) {
    if (!fs.existsSync(from)) return [];
    if (!filter(path.basename(from))) return [];

    const files = [];
    const stats = fs.statSync(from);

    if (stats.isDirectory()) {
        fs.readdirSync(from).forEach((file) => {
            files.push(...copy(path.join(from, file), path.join(to, file), { transform }));
        });
    } else {
        const contents = fs.readFileSync(from, "utf-8");
        write(to, transform(from, contents));
    }

    return files;
}

/**
 * @param {string} file
 * @param {string} contents
 */
export function write(file, contents) {
    mkdirp(path.dirname(file));
    fs.writeFileSync(file, contents);
}

/**
 * @param {string} file
 * @returns {string}
 */
 export function read(file) {
    return fs.readFileSync(file, "utf-8");
}
