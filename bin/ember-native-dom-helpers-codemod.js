#!/usr/bin/env node

const spawn = require("child_process").spawn;
const chalk = require("chalk");
const path = require("path");

try {
  let binPath = path.dirname(require.resolve("jscodeshift")) + "/bin/jscodeshift.sh";
  let transformPath = __dirname + "/../index.js";
  let targetDir = process.argv[2];
  let transform = spawn(binPath, ["-t", transformPath, targetDir], {
    stdio: "inherit",
    env: process.env
  });
} catch (e) {
  console.error(chalk.red(e.stack));
  process.exit(-1);
}