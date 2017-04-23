const textTransform = require('./lib/transforms/text');
const lengthTransform = require('./lib/transforms/length');
const hasClassTransform = require('./lib/transforms/has-class');
const clickTransform = require('./lib/transforms/click');
const focusTransform = require('./lib/transforms/focus');
const getValueTransform = require('./lib/transforms/get-value');
const setValueTransform = require('./lib/transforms/set-value');

const transforms = [
  textTransform,
  lengthTransform,
  hasClassTransform,
  clickTransform,
  focusTransform,
  getValueTransform,
  setValueTransform
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