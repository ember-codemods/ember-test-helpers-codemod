const { makeAwait, dropAndThen, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Check if `node` is a `click(selector)` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isGlobalHelperExpression(j, node) {
  return j.CallExpression.check(node)
    && j.Identifier.check(node.callee)
    && node.callee.name === 'click';
}

/**
 * Transform `click(selector)` to `await click(selector)`, remove `andThen` calls
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
    addImportStatement(['click']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
