const { migrateSelector, makeParentFunctionAsync, isJQuerySelectExpression, addImportStatement } = require('../utils');

/**
 * Creates a `await fillIn(selector, value)` expression
 *
 * @param j
 * @param selector
 * @param value
 * @returns {*}
 */
function createExpression(j, selector, value) {
  return j.awaitExpression(j.callExpression(
    j.identifier('fillIn'),
    [migrateSelector(j, selector), value]
  ));
}

/**
 * Creates a `await blur(selector)` expression
 *
 * @param j
 * @param selector
 * @returns {*}
 */
function createBlurExpression(j, selector) {
  return j.awaitExpression(j.callExpression(
    j.identifier('blur'),
    [migrateSelector(j, selector)]
  ));
}

/**
 * Check if `node` is a `this.$(selector).val(someValue)` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'val'
    && node.arguments.length > 0;
}

function hasFluentTriggerCall(j, path) {
  let parent = path.parent && path.parent.node;
  let grandParent = parent && path.parent.parent.node;
  return parent
    && grandParent
    && j.MemberExpression.check(parent)
    && j.Identifier.check(parent.property)
    && parent.property.name === 'trigger'
    && j.CallExpression.check(grandParent)
    ;
}

function hasFluentChangeCall(j, path) {
  let parent = path.parent && path.parent.node;
  let grandParent = parent && path.parent.parent.node;
  return parent
    && grandParent
    && j.MemberExpression.check(parent)
    && j.Identifier.check(parent.property)
    && parent.property.name === 'change'
    && j.CallExpression.check(grandParent)
    ;
}

/**
 * Transforms `this.$(selector).val(value)` to `await fillIn(selector, value)`
 *
 * See test for more transformation examples
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
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments[0], node.arguments[0]))
    .forEach((path) => makeParentFunctionAsync(j, path));

  let triggerReplacements = replacements
    .filter((path) => hasFluentTriggerCall(j, path))
    .map((path) => path.parent.parent.parent)
    // .insertAfter((path) => j.expressionStatement(createTriggerExpression(j, path.node.expression.callee.object.argument.arguments[0], path.node.expression.arguments[0])))
    .replaceWith((path) => j.expressionStatement(path.node.expression.callee.object))
    .forEach((path) => makeParentFunctionAsync(j, path));

  let changeReplacements = replacements
    .filter((path) => hasFluentChangeCall(j, path))
    .map((path) => path.parent.parent.parent)
    .insertAfter((path) => j.expressionStatement(createBlurExpression(j, path.node.expression.callee.object.argument.arguments[0])))
    .replaceWith((path) => j.expressionStatement(path.node.expression.callee.object))
    .forEach((path) => makeParentFunctionAsync(j, path));

  if (replacements.length > 0) {
    addImportStatement(j, root, ['fillIn']);
  }

  if (changeReplacements.length > 0) {
    addImportStatement(j, root, ['blur']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;