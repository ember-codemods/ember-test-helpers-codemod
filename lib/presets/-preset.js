const path = require('path');
const fs = require('fs');

module.exports = function(type) {
  let transformPath = path.join(__dirname, '..', 'transforms', type);

  return function(file, api, options) {
    let src = file.source;

    fs.readdirSync(transformPath)
      .map((fileName) => require(path.join(transformPath, fileName)))
      .forEach(fix => {
        if (typeof(src) === 'undefined') {
          return;
        }
        src = fix({ ...file, source: src }, api, options);
      });
    return src;
  };
}