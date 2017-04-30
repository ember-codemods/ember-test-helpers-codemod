const jqExtensions = [
  /:even/,
  /:odd/,
  /:contains\(/,
  /:has\(/,
  /:animated/,
  /:checkbox/,
  /:file/,
  /:first(?!-child)/,
  /:gt\(/,
  /:header/,
  /:hidden/,
  /:image/,
  /:input/,
  /:last(?!-child)/,
  /:lt\(/,
  /:parent/,
  /:password/,
  /:radio/,
  /:reset/,
  /:selected/,
  /:submit/,
  /:text/,
  /:visible/
];

function containsJQuerySelectorExtension(string) {
  return jqExtensions.some((regex) => string.match(regex));
}

function isJQuerySelectExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && j.ThisExpression.check(node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === '$'
    && (node.arguments.length === 0
      || !j.Literal.check(node.arguments[0])
      || (
        j.Literal.check(node.arguments[0])
        && typeof node.arguments[0].value === 'string'
        && !containsJQuerySelectorExtension(node.arguments[0].value)
      )
    )
    ;
}

function migrateSelector(j, selector) {
  if (j.Literal.check(selector) && typeof selector.value === 'string') {
    let string = selector.value;
    string = string.replace(/:eq\((\d)\)/, (m, num) => `:nth-child(${parseInt(num)+1})`);
    selector.value = string;
  }
  return selector;
}

function createFindExpression(j, args) {
  args = args.length > 0 ? args.map(s => migrateSelector(j, s)) : [j.literal('*')];
  return j.callExpression(j.identifier('find'), args);
}

function createFindAllExpression(j, args) {
  args = args.length > 0 ? args.map(s => migrateSelector(j, s)) : [j.literal('*')];
  return j.callExpression(j.identifier('findAll'), args);
}

function createTriggerExpression(j, selector, eventName) {
  return j.awaitExpression(
    j.callExpression(
      j.identifier('triggerEvent'),
      [migrateSelector(j, selector), eventName]
    )
  );
}

function addImportStatement(j, root, imports) {
  let body = root.get().value.program.body;
  let importStatement = root.find(j.ImportDeclaration, {
    source: { value: 'ember-native-dom-helpers' }
  });

  if (importStatement.length === 0) {
    importStatement = createImportStatement(j, 'ember-native-dom-helpers', 'default', imports);
    body.unshift(importStatement);
  } else {
    let existingSpecifiers = importStatement.get("specifiers");

    imports.forEach(name => {
      if (existingSpecifiers.filter(exSp => exSp.value.imported.name === name).length === 0) {
        existingSpecifiers.push(j.importSpecifier(j.identifier(name)));
      }
    });
  }
}

function createImportStatement(j, source, imported, local) {
  let declaration, variable, idIdentifier, nameIdentifier;

  // if no variable name, return `import 'jquery'`
  if (!local) {
    declaration = j.importDeclaration([], j.literal(source));
    return declaration;
  }

  // multiple variable names indicates a destructured import
  if (Array.isArray(local)) {
    let variableIds = local.map(function(v) {
      return j.importSpecifier(j.identifier(v), j.identifier(v));
    });

    declaration = j.importDeclaration(variableIds, j.literal(source));
  } else {
    // else returns `import $ from 'jquery'`
    nameIdentifier = j.identifier(local); //import var name
    variable = j.importDefaultSpecifier(nameIdentifier);

    // if propName, use destructuring `import {pluck} from 'underscore'`
    if (imported && imported !== "default") {
      idIdentifier = j.identifier(imported);
      variable = j.importSpecifier(idIdentifier, nameIdentifier); // if both are same, one is dropped...
    }

    declaration = j.importDeclaration([variable], j.literal(source));
  }

  return declaration;
}

function findParentFunction(j, path) {
  while (path = path.parent) {
    if (j.FunctionExpression.check(path.node) || j.FunctionDeclaration.check(path.node) || j.ArrowFunctionExpression.check(path.node)) {
      return path;
    }
  }
}

function makeParentFunctionAsync(j, path) {
  let fn = findParentFunction(j, path);
  if (fn) {
    fn.node.async = true;
  }
}

module.exports = {
  isJQuerySelectExpression,
  createFindExpression,
  createFindAllExpression,
  createTriggerExpression,
  addImportStatement,
  createImportStatement,
  makeParentFunctionAsync,
  migrateSelector
};
