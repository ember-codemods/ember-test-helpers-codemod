const textTransform = require('./lib/transforms/text');
const lengthTransform = require('./lib/transforms/length');
const hasClassTransform = require('./lib/transforms/has-class');

const transforms = [
  textTransform,
  lengthTransform,
  hasClassTransform
];

module.exports = function(file, api, options) {
  let src = file.source;
  transforms.forEach(fix => {
    if (typeof(src) === 'undefined') {
      return;
    }
    src = fix({ ...file, source: src }, api, options);
  });
  return src;
};