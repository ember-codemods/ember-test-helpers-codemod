'use strict';

const { getParser } = require('codemod-cli').jscodeshift;
const {
  createFindAllExpression,
  isJQuerySelectExpression,
  addImportStatement,
  writeImportStatements,
} = require('../../utils');

/**
 * Creates a `findAll(selector)[0]` expression
 *
 * @param j
 * @param findArgs
 * @param indexArg
 * @returns {*}
 */
function createExpression(j, findArgs, indexArg) {
  const index = indexArg[0] && indexArg[0].value || 0;
  return j.memberExpression(
    createFindAllExpression(j, findArgs),
    j.literal(index)
  );
}

/**
 * Check if `node` is a `this.$(selector).get(0)` expression
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
    && node.callee.property.name === 'get';
}

/**
 * Transforms `this.$(selector).get(0)` to `findAll(selector)[0]`
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
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments, node.arguments));

  if (replacements.length > 0) {
    addImportStatement(['findAll']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
