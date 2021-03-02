'use strict';

const path = require('path');
const fs = require('fs');

module.exports = function (type) {
  let transformPath = path.join(__dirname, type, 'transforms');

  return function (file, api, options) {
    let src = file.source;
    let error;

    fs.readdirSync(transformPath).forEach((fileName) => {
      let fix = require(path.join(transformPath, fileName));
      if (typeof src === 'undefined') {
        return;
      }
      try {
        src = fix(Object.assign({}, file, { source: src }), api, options);
      } catch (e) {
        error = new Error(
          `Transformation ${fileName} errored on file ${file.path}. Reason ${e}. Please report this in https://github.com/simonihmig/ember-test-helpers-codemod/issues\n\nStack trace:\n${e.stack}\n\nSource:\n${src}`
        );
      }
    });

    if (error) {
      throw error;
    }
    return src;
  };
};
