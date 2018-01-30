const { createQuerySelectorExpression, isFindExpression, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Creates a `find(selector).value` expression
 *
 * @param j
 * @param findArgs
 * @returns {*}
 */
function createExpression(j, findArgs) {
  return j.memberExpression(
    createQuerySelectorExpression(j, findArgs),
    j.identifier('value')
  );
}

/**
 * Check if `node` is a `this.$(selector).val()` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isFindExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'val'
    && node.arguments.length === 0;
}

/**
 * Transform `this.$(selector).val()` to `find(selector).value`
 *
 * @param file
 * @param api
 * @returns {*|string}
 */
function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments));

  return root.toSource({quote: 'single'});
}

module.exports = transform;
