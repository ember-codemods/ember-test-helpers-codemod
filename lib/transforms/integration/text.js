const { createQuerySelectorExpression, isJQuerySelectExpression, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Creates a `find(selector).textContent` expression
 *
 * @param j
 * @param findArgs
 * @returns {*}
 */
function createExpression(j, findArgs) {
  return j.memberExpression(
    createQuerySelectorExpression(j, findArgs),
    j.identifier('textContent')
  );
}

/**
 * Check if `node` is a `this.$(selector).text()` expression
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
    && node.callee.property.name === 'text';
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
  let j = api.jscodeshift;

  let root = j(source);

  root
    .find(j.CallExpression)
    .filter((path) => isJQueryExpression(j, path))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments));

  return root.toSource({quote: 'single'});
}

module.exports = transform;
