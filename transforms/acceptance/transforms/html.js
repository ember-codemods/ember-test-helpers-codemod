'use strict';

const { getParser } = require('codemod-cli').jscodeshift;
const { createFindExpression, isFindExpression, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Creates a `find(selector).innerHTML` expression
 *
 * @param j
 * @param findArgs
 * @param attr
 * @returns {*}
 */
function createExpression(j, node) {
  let findArgs = node.callee.object.arguments;
  let findExpression = j.memberExpression(
    createFindExpression(j, findArgs),
    j.identifier('innerHTML')
  );
  
  if (node.arguments.length === 0) {    
    return findExpression;
  } else {
    return j.assignmentExpression(
      '=',
      findExpression,
      node.arguments[0]
    );
  }
}

/**
 * Check if `node` is a `this.$(selector).html()` expression
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
    && node.callee.property.name === 'html';
}

/**
 * Transform `this.$(selector).html()` to `find(selector).innerHTML`
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
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node));

  if (replacements.length > 0) {
    addImportStatement(['find']);
  }

  writeImportStatements(j, root);
  return root.toSource({quote: 'single'});
}

module.exports = transform;
