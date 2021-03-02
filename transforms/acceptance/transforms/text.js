'use strict';

const { getParser } = require('codemod-cli').jscodeshift;
const {
  createFindExpression,
  isFindExpression,
  addImportStatement,
  writeImportStatements,
} = require('../../utils');

/**
 * Creates a `find(selector).textContent` expression
 *
 * @param j
 * @param findArgs
 * @returns {*}
 */
function createExpression(j, findArgs) {
  return j.memberExpression(createFindExpression(j, findArgs), j.identifier('textContent'));
}

/**
 * Check if `node` is a `this.$(selector).text()` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, node) {
  return (
    j.CallExpression.check(node) &&
    j.MemberExpression.check(node.callee) &&
    isFindExpression(j, node.callee.object) &&
    j.Identifier.check(node.callee.property) &&
    node.callee.property.name === 'text'
  );
}

/**
 * Transforms `this.$(selector).text()` to `find(selector).textContent`
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
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments));

  if (replacements.length > 0) {
    addImportStatement(['find']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
