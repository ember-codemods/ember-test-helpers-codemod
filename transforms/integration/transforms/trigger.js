'use strict';

const { getParser } = require('codemod-cli').jscodeshift;
const { makeParentFunctionAsync, createTriggerExpression, createClickExpression, isJQuerySelectExpression, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Check if `node` is a `this.$(selector).trigger(eventName)` expression
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
    && node.callee.property.name === 'trigger'
    && node.arguments.length === 1
    && j.Literal.check(node.arguments[0]);
}

/**
 * Transforms `this.$(selector).trigger(eventName)` to `await triggerEvent(selector, eventName)`
 * Special case: `this.$(selector).trigger('click')` is transformed to `await click(selector)`
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
    .replaceWith(({ node }) => {
      let selector = node.callee.object.arguments[0];
      let eventName = node.arguments[0];
      if (eventName && eventName.value === 'click') {
        return createClickExpression(j, node.callee.object.arguments);
      } else {
        return createTriggerExpression(j, selector, eventName);
      }
    })
    .forEach((path) => makeParentFunctionAsync(j, path))
    ;

  if (replacements.length > 0) {
    addImportStatement(['triggerEvent']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
