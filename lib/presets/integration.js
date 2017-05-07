const textTransform = require('../transforms/text');
const htmlTransform = require('../transforms/html');
const lengthTransform = require('../transforms/length');
const hasClassTransform = require('../transforms/has-class');
const clickTransform = require('../transforms/click');
const focusTransform = require('../transforms/focus');
const getValueTransform = require('../transforms/get-value');
const setValueTransform = require('../transforms/set-value');
const attrTransform = require('../transforms/attr');
const triggerShortcutTransform = require('../transforms/trigger-shortcut');
const triggerTransform = require('../transforms/trigger');
const propTransform = require('../transforms/prop');
const keyEventTransform = require('../transforms/key-event');

const transforms = [
  textTransform,
  htmlTransform,
  lengthTransform,
  hasClassTransform,
  clickTransform,
  focusTransform,
  getValueTransform,
  setValueTransform,
  attrTransform,
  triggerShortcutTransform,
  triggerTransform,
  propTransform,
  keyEventTransform
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