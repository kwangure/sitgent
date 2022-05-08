import { pkgPath, pkgBackupPath } from "./npm-consts.js";
import fs from "fs";

fs.copyFileSync(pkgBackupPath, pkgPath);
fs.unlinkSync(pkgBackupPath);