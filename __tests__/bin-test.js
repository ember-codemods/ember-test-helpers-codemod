'use strict';

const path = require('path');
const fs = require('fs-extra');
const cp = require('child_process');
const tmp = require('tmp');

const originalCwd = process.cwd();

let tmpPath;

function run(type, dir) {
  let stdout = '';
  let stderr = '';

  return new Promise(resolve => {
    let ps = cp.spawn('node', [
      path.join(originalCwd, 'bin/ember-test-helpers-codemod'),
      `--type=${type}`,
      dir
    ], {
      cwd: tmpPath
    });

    ps.stdout.on('data', data => {
      stdout += data.toString();
    });

    ps.stderr.on('data', data => {
      stderr += data.toString();
    });

    ps.on('exit', code => {
      resolve({
        exitCode: code,
        stdout,
        stderr
      });
    });
  });
}

const testScenarios = [
  {
    type: 'integration',
    inputFile: path.join(originalCwd, '__testfixtures__/integration/all.input.js'),
    outputFile: path.join(originalCwd, '__testfixtures__/integration/all.output.js')
  },
  {
    type: 'acceptance',
    inputFile: path.join(originalCwd, '__testfixtures__/acceptance/visit.input.js'),
    outputFile: path.join(originalCwd, '__testfixtures__/acceptance/visit.output.js')
  },
  {
    type: 'native-dom',
    inputFile: path.join(originalCwd, '__testfixtures__/native-dom/acceptance.input.js'),
    outputFile: path.join(originalCwd, '__testfixtures__/native-dom/acceptance.output.js')
  },
  {
    type: 'find',
    inputFile: path.join(originalCwd, '__testfixtures__/find.input.js'),
    outputFile: path.join(originalCwd, '__testfixtures__/find.output.js')
  }
];

describe('bin acceptance', function() {
  let tmpPackageJson;

  beforeEach(function() {
    tmpPath = tmp.dirSync().name;

    process.chdir(tmpPath);

    tmpPackageJson = path.join(process.cwd(), 'package.json');
  });

  afterAll(function() {
    process.chdir(originalCwd);
  });

  testScenarios.forEach(scenario => {
    describe(scenario.type, function() {
      let tmpFile;

      beforeEach(function() {
        fs.ensureDirSync(path.join(tmpPath, 'tests'));

        tmpFile = path.join(tmpPath, 'tests/test-file.js');

        fs.copySync(
          scenario.inputFile,
          tmpFile
        );
      });

      it('works', function() {
        return run(scenario.type, tmpPath).then(result => {
          let exitCode = result.exitCode;

          expect(exitCode).toEqual(0);
          expect(fs.readFileSync(tmpFile, 'utf8')).toEqual(fs.readFileSync(scenario.outputFile, 'utf8'));
        });
      }, 20000);
    });
  });
});