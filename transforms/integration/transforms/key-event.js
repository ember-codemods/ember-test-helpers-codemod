'use strict';

const { getParser } = require('codemod-cli').jscodeshift;
const {
  migrateSelector,
  makeParentFunctionAsync,
  isJQuerySelectExpression,
  addImportStatement,
  writeImportStatements,
} = require('../../utils');

/**
 * Creates a `await keyEvent(selector, eventName, keyCode)` expression
 *
 * @param j
 * @param selector
 * @param eventName
 * @param keyCode
 * @returns {*}
 */
function createExpression(j, selector, eventName, keyCode) {
  return j.awaitExpression(
    j.callExpression(j.identifier('keyEvent'), [migrateSelector(j, selector), eventName, keyCode])
  );
}

/**
 * Check if `node` is a `this.$(selector).trigger(eventName, { keyCode: num })` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, path) {
  let node = path.node;
  return (
    j.CallExpression.check(node) &&
    j.MemberExpression.check(node.callee) &&
    isJQuerySelectExpression(j, node.callee.object, path) &&
    j.Identifier.check(node.callee.property) &&
    node.callee.property.name === 'trigger' &&
    node.arguments.length === 2 &&
    j.ObjectExpression.check(node.arguments[1]) &&
    node.arguments[1] &&
    j.Identifier.check(node.arguments[1].properties[0].key) &&
    node.arguments[1].properties[0].key.name === 'keyCode'
  );
}

/**
 * Transforms `this.$(selector).trigger(eventName, { keyCode: num })` to `await keyEvent(selector, eventName, keyCode)`
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
    .replaceWith(({ node }) =>
      createExpression(
        j,
        node.callee.object.arguments[0],
        node.arguments[0],
        node.arguments[1].properties[0].value
      )
    )
    .forEach((path) => makeParentFunctionAsync(j, path));
  if (replacements.length > 0) {
    addImportStatement(['keyEvent']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
