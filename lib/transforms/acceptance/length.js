const { createQuerySelectorAllExpression, isFindExpression, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Creates a `findAll(selector).length` expression
 *
 * @param j
 * @param findArgs
 * @returns {*}
 */
function createExpression(j, findArgs) {
  return j.memberExpression(
    createQuerySelectorAllExpression(j, findArgs),
    j.identifier('length')
  );
}

/**
 * Check if `node` is a `this.$(selector).length` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, node) {
  return j.MemberExpression.check(node)
    && isFindExpression(j, node.object)
    && j.Identifier.check(node.property)
    && node.property.name === 'length';
}

/**
 * Transforms `this.$(selector).length` to `findAll(selector).length`
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
    .find(j.MemberExpression)
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node.object.arguments));

  return root.toSource({quote: 'single'});
}

module.exports = transform;
