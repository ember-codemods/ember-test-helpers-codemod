const { createQuerySelectorExpression, createPropExpression, isJQuerySelectExpression, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Creates a `find(selector).getAttribute(attr)` expression
 *
 * @param j
 * @param findArgs
 * @param attr
 * @returns {*}
 */
function createAttributeExpression(j, findArgs, attr) {
  return j.callExpression(
    j.memberExpression(
      createQuerySelectorExpression(j, findArgs),
      j.identifier('getAttribute')
    ), [attr]
  );
}

/**
 * Check if `node` is a `this.$(selector).attr('foo')` expression
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
    && node.callee.property.name === 'attr'
    && node.arguments.length === 1;
}
/**
 * Should we translate this to a `.getAttribute('foo')` or a `.foo` expression?
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isPropertyAccessPreferred(j, node) {
  let arg = node.arguments[0];
  return j.Literal.check(arg) && arg.value === 'id';
}

/**
 * Transform `this.$(selector).attr('foo')` to `find(selector).getAttribute(attr)`
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
    .filter(({ node }) => isPropertyAccessPreferred(j, node))
    .replaceWith(({ node }) => createPropExpression(j, node.callee.object.arguments, node.arguments[0].value));

  root
    .find(j.CallExpression)
    .filter((path) => isJQueryExpression(j, path))
    .filter(({ node }) => !isPropertyAccessPreferred(j, node))
    .replaceWith(({ node }) => createAttributeExpression(j, node.callee.object.arguments, node.arguments[0]));

  return root.toSource({ quote: 'single' });
}

module.exports = transform;
