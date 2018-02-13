#!/usr/bin/env node

const execa = require("execa");
const chalk = require("chalk");
const path = require("path");

try {
  let binPath = path.dirname(require.resolve("jscodeshift")) + "/bin/jscodeshift.sh";
  let transformPath = __dirname + "/../index.js";
  let type = process.argv[2];
  let targetDir = process.argv[3];
  execa(binPath, ["-t", transformPath, targetDir, type], {
    stdio: "inherit",
    env: process.env
  });
} catch (e) {
  console.error(chalk.red(e.stack));
  process.exit(-1);
}