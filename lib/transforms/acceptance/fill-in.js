'use strict';

const { makeAwait, dropAndThen, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Check if `node` is a `fillIn(selector)` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isGlobalHelperExpression(j, node) {
  return j.CallExpression.check(node)
    && j.Identifier.check(node.callee)
    && node.callee.name === 'fillIn';
}

/**
 * Transform `fillIn(selector)` to `await fillIn(selector)`, remove `andThen` calls
 *
 * @param file
 * @param api
 * @returns {*|string}
 */
function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;


  let root = j(source);

  let replacements = root
      .find(j.CallExpression)
      .filter(({ node }) => isGlobalHelperExpression(j, node))
    ;

  if (replacements.length > 0) {
    makeAwait(j, replacements);
    dropAndThen(j, root);
    addImportStatement(['fillIn']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
