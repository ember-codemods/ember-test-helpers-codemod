'use strict';

const { getParser } = require('codemod-cli').jscodeshift;
const { addImportStatement, writeImportStatements } = require('../utils');

const importMigrations = [
  'click',
  'find',
  'findAll',
  'fillIn',
  'focus',
  'blur',
  'triggerEvent',
  ['keyEvent', 'triggerKeyEvent'],
  'waitFor',
  'waitUntil',
  'currentURL',
  'currentRouteName',
  'visit',
];
const importMigrationsLookup = importMigrations.reduce((result, specifier) => {
  let key = specifier;
  let value = specifier;
  if (Array.isArray(specifier)) {
    key = specifier[0];
    value = specifier[1];
  }
  return Object.assign(result, { [key]: value });
}, {});

function renameCallee(j, root, name, newName) {
  root
    .find(j.CallExpression, {
      callee: {
        name,
      },
    })
    .forEach(({ node }) => (node.callee.name = newName));
}

/**
 * find(selector, context) => context.querySelector(selector)
 * findAll(selector, context) => context.querySelectorAll(selector)
 * click(selector, context) => click(context.querySelector(selector))
 * click(selector, context, { ...options }) => click(context.querySelector(selector),  { ...options })
 */
function migrateHelpersWithContext(j, root, importedName) {
  switch (importedName) {
    case 'find':
      root
        .find(j.CallExpression, {
          callee: {
            name: 'find',
          },
          arguments: [{}, {}],
        })
        .replaceWith(({ node }) => {
          let [selector, context] = node.arguments;
          if (selector.type === 'StringLiteral' && context.type === 'StringLiteral') {
            return j.callExpression(j.identifier('find'), [
              j.literal(`${context.value} ${selector.value}`),
            ]);
          }
          return j.callExpression(j.memberExpression(context, j.identifier('querySelector')), [
            selector,
          ]);
        });
      break;
    case 'findAll':
      root
        .find(j.CallExpression, {
          callee: {
            name: 'findAll',
          },
          arguments: [{}, {}],
        })
        .replaceWith(({ node }) => {
          let [selector, context] = node.arguments;
          if (selector.type === 'StringLiteral' && context.type === 'StringLiteral') {
            return j.callExpression(j.identifier('findAll'), [
              j.literal(`${context.value} ${selector.value}`),
            ]);
          }
          return j.callExpression(j.memberExpression(context, j.identifier('querySelectorAll')), [
            selector,
          ]);
        });
      break;
    case 'click':
      root
        .find(j.CallExpression, {
          callee: {
            name: 'click',
          },
          arguments: [{}, {}], // matches 2 or 3 arguments
        })
        .replaceWith(({ node }) => {
          let [selector, context, options] = node.arguments;
          if (context.type === 'ObjectExpression') {
            // click(selector, { ...options })
            return node;
          }
          if (selector.type === 'StringLiteral' && context.type === 'StringLiteral') {
            return j.callExpression(j.identifier('click'), [
              j.literal(`${context.value} ${selector.value}`),
            ]);
          }
          return j.callExpression(
            j.identifier('click'),
            [
              j.callExpression(j.memberExpression(context, j.identifier('querySelector')), [
                selector,
              ]),
              options,
            ].filter(Boolean)
          );
        });
      break;
  }
}

/**
 * Transform imports from ember-native-dom-helpers to @ember/test-helpers
 *
 * @param file
 * @param api
 * @returns {*|string}
 */
function transform(file, api) {
  let source = file.source;
  let j = getParser(api);
  let root = j(source);

  let nativeDomImportStatements = root.find(j.ImportDeclaration, {
    source: { value: 'ember-native-dom-helpers' },
  });
  if (nativeDomImportStatements.length === 0) {
    return root.toSource({ quote: 'single' });
  }

  let newImports = [];

  nativeDomImportStatements.forEach((importStatement) => {
    let oldSpecifiers = importStatement.get('specifiers');

    let newSpecifiers = [];
    oldSpecifiers.each(({ node: specifier }) => {
      let importedName = specifier.imported.name;
      if (importedName in importMigrationsLookup) {
        let mappedName = importMigrationsLookup[importedName];
        // @todo local != imported
        // let localName = specifier.local.name;
        newImports.push(mappedName);
        if (importedName !== mappedName) {
          renameCallee(j, root, importedName, mappedName);
        }
        migrateHelpersWithContext(j, root, importedName);
      } else {
        newSpecifiers.push(specifier);
      }
    });

    if (newSpecifiers.length > 0) {
      oldSpecifiers.replace(newSpecifiers);
    } else {
      importStatement.prune();
    }
  });

  addImportStatement(newImports);
  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
