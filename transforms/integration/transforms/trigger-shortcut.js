'use strict';

const { getParser } = require('codemod-cli').jscodeshift;
const { makeParentFunctionAsync, createTriggerExpression, isJQuerySelectExpression, addImportStatement, writeImportStatements } = require('../../utils');

const triggerShortcuts = [
  'change',
  'submit',
  'focusout',
  'focusin',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup'
];

/**
 * Check if `node` is a `this.$(selector).change()`or some other trigger shortcut  expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, path) {
  let node = path.node;
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object, path)
    && j.Identifier.check(node.callee.property)
    && triggerShortcuts.indexOf(node.callee.property.name) !== -1;
}

/**
 * Transforms `this.$(selector).<eventName>()` to `await triggerEvent(selector, eventName)`
 *
 * @param file
 * @param api
 * @returns {*|string}
 */
function transform(file, api) {
  let source = file.source;
  let j = getParser(api);

  let root = j(source);

  let replacements = root
      .find(j.CallExpression)
      .filter((path) => isJQueryExpression(j, path))
      .replaceWith(({ node }) => createTriggerExpression(j, node.callee.object.arguments[0], j.literal(node.callee.property.name)))
      .forEach((path) => makeParentFunctionAsync(j, path))
    ;

  if (replacements.length > 0) {
    addImportStatement(['triggerEvent']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
