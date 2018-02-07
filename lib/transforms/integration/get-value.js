const { createFindExpression, isJQuerySelectExpression, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Creates a `find(selector).value` expression
 *
 * @param j
 * @param findArgs
 * @returns {*}
 */
function createExpression(j, findArgs) {
  return j.memberExpression(
    createFindExpression(j, findArgs),
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
function isJQueryExpression(j, path) {
  let node = path.node;
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object, path)
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

  let replacements = root
    .find(j.CallExpression)
    .filter((path) => isJQueryExpression(j, path))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments));

  if (replacements.length > 0) {
    addImportStatement(['find']);
  }

  writeImportStatements(j, root);
  return root.toSource({quote: 'single'});
}

module.exports = transform;
