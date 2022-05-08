import { playwrightPkgPath, pkgPath, pkgBackupPath } from "./npm-consts.js";
import fs from "fs";

function json(file) {
    return JSON.parse(fs.readFileSync(file));
}

fs.copyFileSync(pkgPath, pkgBackupPath);

const pkg = json(pkgPath);
const playwrightPkg = json(playwrightPkgPath);
for (const key in playwrightPkg.dependencies) {
    if (pkg.dependencies[key]) {
        console.error("./package.json               ", key, pkg.dependencies[key]);
        console.error("@playwright/test/package.json", key, playwrightPkg.dependencies[key]);
        throw new Error(`Conflicting package '${key}'.`);
    }
}

Object.assign(pkg.dependencies, playwrightPkg.dependencies);
fs.writeFileSync(pkgPath, JSON.stringify(pkg));
