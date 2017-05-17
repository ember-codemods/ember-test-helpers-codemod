const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const temp = require('temp').track();

const jscodeshiftPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'jscodeshift');
const tempPath = temp.mkdirSync('ember-native-dom-helpers-codemod');

const TIMEOUT = 10000;
const VERBOSE_ENV_VAR = 'VERBOSE_JSCODESHIFT';

module.exports = function(type) {
  console.log(`Running tests. Run with ${VERBOSE_ENV_VAR} to see jscodeshift output.`);

  let inputPath = path.join(__dirname, '..', type, 'input');
  let expectedPath = path.join(__dirname, '..', type, 'expected-output');
  let transformPath = path.join(__dirname, '..', '..', 'lib', 'presets', `${type}.js`);

  function assertFilesEqual(file) {
    let expected = fs.readFileSync(expectedPath + '/' + file);
    let actual = fs.readFileSync(tempPath + '/' + file);

    if (!actual.equals(expected)) {
      throw new FilesDoNotMatchError(file, actual, expected);
    }
  }

  function jscodeshiftArgs(file) {
    return ['-t', transformPath, file];
  }

  let files = fs.readdirSync(inputPath);

  files.forEach(function(file) {
    copy(inputPath + '/' + file, tempPath + '/' + file);

    it(`${file} input and output should match`, function(done) {
      this.timeout(TIMEOUT);

      let jscodeshift = spawn(jscodeshiftPath, jscodeshiftArgs(file), {
        stdio: process.env[VERBOSE_ENV_VAR] === 'true' ? 'inherit' : 'ignore',
        cwd: tempPath
      });

      jscodeshift.on('error', function(err) {
        done(err);
      });

      jscodeshift.on('exit', function(code) {
        if (code !== 0) {
          done(new Error(`Non-zero exit code from jscodeshift for ${file}`));
        } else {
          assertFilesEqual(file);
          done();
        }
      });
    });
  });
}


function FilesDoNotMatchError(file, actual, expected) {
  this.message = `Expected transformed ${file} to match.`;
  this.actual = actual.toString();
  this.expected = expected.toString();
}

FilesDoNotMatchError.prototype = new Error();

function copy(source, dest) {
  let buf = fs.readFileSync(source);
  fs.writeFileSync(dest, buf);
}