'use strict';

const { getParser } = require('codemod-cli').jscodeshift;
const { addImportStatement, writeImportStatements } = require('../utils');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  /**
   * Replace deprecated this.render() with render() from '@ember/test-helpers' package
   */
  function transform() {
    root.find(j.ExpressionStatement, {
      expression: {
        type: 'AwaitExpression',
        argument: {
        	type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'ThisExpression'
            },
            property: {
              type: 'Identifier',
              name: 'render'
            },
          },
        },
      },
    }).replaceWith(path => {
      let oldCallExpressionArguments = path.node.expression.argument.arguments;

		  return j.expressionStatement(
        j.awaitExpression(
          j.callExpression(
            j.identifier('render'), 
            oldCallExpressionArguments
          )
        )
      )
    })

    let newImports = ['render'];

    addImportStatement(newImports);
    writeImportStatements(j, root);
  }

  transform();

  return root.toSource({
    quote: 'single',
    trailingComma: true,
  });
}
