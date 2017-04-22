function isJQuerySelectExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && j.ThisExpression.check(node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === '$'
    ;
}

function createFindExpression(j, args) {
  args = args.length > 0 ? args : [j.literal('*')];
  return j.callExpression(j.identifier('find'), args);
}

function createFindAllExpression(j, args) {
  args = args.length > 0 ? args : [j.literal('*')];
  return j.callExpression(j.identifier('findAll'), args);
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
      if (existingSpecifiers.filter(exSp => exSp.value.local.name === name).length === 0) {
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
    let variableIds = local.map(function (v) {
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

module.exports = {
  isJQuerySelectExpression,
  createFindExpression,
  createFindAllExpression,
  addImportStatement,
  createImportStatement
};
