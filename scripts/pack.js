import { exec as _exec } from "child_process";
import util from "util";

const exec = util.promisify(_exec);

export default async function pack() {
  const { stdout, stderr } = await exec('npm pack .');
  console.log('stdout:\n', stdout);
  console.log('stderr:\n', stderr);
}
