const { addImportStatement, writeImportStatements } = require('../../utils');

const importMigrations = [
  'click',
  'fillIn',
  'focus',
  'blur',
  'triggerEvent',
  ['keyEvent', 'triggerKeyEvent'],
  'waitFor',
  'waitUntil',
  'currentURL',
  'currentRouteName',
  'visit'
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
        name
      }
    })
    .forEach(({ node }) => node.callee.name = newName);
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
  let j = api.jscodeshift;
  let root = j(source);

  let nativeDomImportStatement = root.find(j.ImportDeclaration, {
    source: { value: 'ember-native-dom-helpers' }
  });
  if (nativeDomImportStatement.length === 0) {
    return root.toSource({ quote: 'single' });
  }

  let newImports = [];
  let oldSpecifiers = nativeDomImportStatement.get('specifiers');
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
    } else {
      newSpecifiers.push(specifier);
    }
  });

  if (newSpecifiers.length > 0) {
    oldSpecifiers.replace(newSpecifiers);
  } else {
    nativeDomImportStatement.remove();
  }

  addImportStatement(newImports);
  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
