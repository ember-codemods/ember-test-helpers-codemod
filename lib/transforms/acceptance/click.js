const { makeParentFunctionAsync, dropAndThen, addImportStatement } = require('../../utils');

/**
 * Create `await click(selector)` expression
 * @param j
 * @param args
 * @returns {*}
 */
function createExpression(j, args) {
  return j.awaitExpression(
    j.callExpression(
      j.identifier('click'),
      args
    )
  );
}

/**
 * Check if `node` is a `click(selector)` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isClickExpression(j, node) {
  return j.CallExpression.check(node)
    && j.Identifier.check(node.callee)
    && node.callee.name === 'click';
}

/**
 * Transform `this.$(selector).click()` to `await click(selector)`
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
    .filter(({ node }) => isClickExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node.arguments))
    .forEach((path) => makeParentFunctionAsync(j, path))
    ;

  if (replacements.length > 0) {
    addImportStatement(j, root, ['click']);
  }

  dropAndThen(j, root);

  return root.toSource({ quote: 'single' });
}

module.exports = transform;