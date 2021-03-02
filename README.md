# ember-test-helpers-codemod

[![Build Status](https://travis-ci.org/ember-codemods/ember-test-helpers-codemod.svg?branch=master)](https://travis-ci.org/ember-codemods/ember-test-helpers-codemod)
[![Build status](https://ci.appveyor.com/api/projects/status/fadn7iu9fl53qb6k/branch/master?svg=true)](https://ci.appveyor.com/project/simonihmig/ember-test-helpers-codemod/branch/master)
[![npm version](https://badge.fury.io/js/ember-test-helpers-codemod.svg)](https://badge.fury.io/js/ember-test-helpers-codemod)

A [jscodeshift](https://github.com/facebook/jscodeshift) based codemod to help migrating your jQuery or 
`ember-native-dom-helpers` based Ember tests to [`@ember/test-helpers`](https://github.com/emberjs/ember-test-helpers).

*Please note that this will not be able to cover all possible cases how jQuery based tests can be written.
Given the dynamic nature of JavaScript and the extensive API and fluent interface of jQuery, this would be impossible.
Instead this codemod focuses to cover the most common usages and do those transformations that it can safely do.
So it is likely that you will have to manually migrate some usages this tool cannot cover!*

## Usage

**WARNING**: `jscodeshift`, and thus this codemod, **edits your files in place**.
It does not make a copy. Make sure your code is checked into a source control
repository like Git and that you have no outstanding changes to commit before
running this tool.

```bash
cd my-ember-app-or-addon
npx ember-test-helpers-codemod integration tests/integration
npx ember-test-helpers-codemod acceptance tests/acceptance
npx ember-test-helpers-codemod native-dom tests
```

## Transformations

### Integration tests

This addon will perform the following transformations suitable for integration tests:

| Before                                               | After                                                                 | Transform      |
|------------------------------------------------------|-----------------------------------------------------------------------|----------------|
| `this.$('.foo').attr('id')`                          | `find('.foo').id`                                                     | `attr.js`      |
| `this.$('.foo').attr('data-test')`                   | `find('.foo').getAttribute('data-test')`                              | `attr.js`      |
| `this.$('.foo').click()`                             | `await click('.foo')`                                                 | `click.js`     |
| `this.$('.foo').change()` (and more events)          | `await triggerEvent('.foo', 'change')`                                | `trigger-shortcut.js` |
| `this.$('.foo').trigger('input')`                    | `await triggerEvent('.foo', 'input')`                                 | `trigger.js`   |
| `this.$('.foo').focus()`                             | `await focus('.foo')`                                                 | `focus.js`     |
| `this.$('.foo').val()`                               | `find('.foo').value`                                                  | `get-value.js` |
| `this.$('div').hasClass('foo')`                      | `find('div').classList.contains('foo')`                               | `has-class.js` |
| `this.$('.foo').trigger('click')`                    | `await click('.foo')`                                                 | `key-event.js` |
| `this.$('.foo').trigger('keydown', { keyCode: 13 })` | `await keyEvent('.foo', 'keydown', 13)`                               | `key-event.js` |
| `this.$('.foo').length`                              | `findAll('.foo').length`                                              | `length.js`    |
| `this.$('.foo').prop('tagName')`                     | `find('.foo').tagName`                                                | `prop.js`      |
| `this.$('.foo').val('foo')`                          | `await fillIn('.foo', 'foo')`                                         | `set-value.js` |
| `this.$('.foo').val('bar').change()`                 | `await fillIn('.foo', 'foo'); await blur('.foo');`                    | `set-value.js` |
| `this.$('.foo').val('bar').trigger('input')`         | `await fillIn('.foo', 'foo')`                                         | `set-value.js` |
| `this.$('.foo').text()`                              | `find('.foo').textContent`                                            | `text.js`      |
| `this.$('.foo').html()`                              | `find('.foo').innerHTML`                                              | `html.js`      |
| `this.$('.foo').html('foo')`                         | `find('.foo').innerHTML = 'foo'`                                      | `html.js`      |
| `this.$('.foo').each((index, elem) => {...})`        | `findAll('.foo').forEach((elem, index) => {...})`                     | `each.js`      |
| `this.$('.foo').get(3)`                              | `findAll('.foo')[3]`                                                  | `get.js`     |


If you want to run only selected transforms on your code, you can pick just the needed transform:

```bash
jscodeshift -t path/to/ember-test-helpers-codemod/transforms/integration/transforms/click.js tests/integration
```

See also docs for [`integration` transform](transforms/integration).

### Acceptance tests

These transformations are available for acceptance tests:

| Before                                               | After                                                                 | Transform      |
|------------------------------------------------------|-----------------------------------------------------------------------|----------------|
| `find('.foo').attr('id')`                            | `find('.foo').id`                                                     | `attr.js`      |
| `find('.foo').attr('data-test')`                     | `find('.foo').getAttribute('data-test')`                              | `attr.js`      |
| `click('.foo')`                                      | `await click('.foo')`                                                 | `click.js`     |
| `fillIn('#bar', 'baz')`                              | `await fillIn('#bar', 'baz')`                                         | `fill-in.js`   |
| `triggerEvent('input', 'focus')`                     | `await focus('.foo')`                                                 | `trigger-event.js` |
| `triggerEvent('input', 'blur')`                      | `await blur('.foo')`                                                  | `trigger-event.js` |
| `triggerEvent('input', 'mouseenter')`                | `await triggerEvent('input', 'mouseenter')`                           | `trigger-event.js` |
| `find('.foo').val()`                                 | `find('.foo').value`                                                  | `get-value.js` |
| `find('div').hasClass('foo')`                        | `find('div').classList.contains('foo')`                               | `has-class.js` |
| `keyEvent('#bar', 'keypress', 13);`                  | `await keyEvent('.foo', 'keydown', 13)`                               | `key-event.js` |
| `find('.foo').length`                                | `findAll('.foo').length`                                              | `length.js`    |
| `find('.foo').prop('tagName')`                       | `find('.foo').tagName`                                                | `prop.js`      |
| `find('.foo').text()`                                | `find('.foo').textContent`                                            | `text.js`      |
| `find('.foo').html()`                                | `find('.foo').innerHTML`                                              | `html.js`      |
| `find('.foo').html('foo')`                           | `find('.foo').innerHTML = 'foo'`                                      | `html.js`      |
| `find('.foo').each((index, elem) => {...})`          | `findAll('.foo').forEach((elem, index) => {...})`                     | `each.js`      |
| `find('.foo').get(3)`                                | `findAll('.foo')[3]`                                                  | `get.js`     |

If you want to run only selected transforms on your code, you can pick just the needed transform:

```bash
jscodeshift -t ../ember-test-helpers-codemod/transforms/acceptance/transforms/click.js tests/integration
```

See also docs for [`acceptance` transform](transforms/acceptance).

### ember-native-dom-helpers tests

These transformations are available for tests based on `ember-native-dom-helpers`:

| Before                                | After                   | Transform      |
|---------------------------------------|-------------------------|----------------|
| ```import { click, find, findAll, fillIn, focus, blur, triggerEvent, keyEvent, waitFor, waitUntil } from 'ember-native-dom-helpers';``` | ```import { click, find, findAll, fillIn, focus, blur, triggerEvent, triggerKeyEvent, waitFor, waitUntil } from '@ember/test-helpers';``` |
| `find('.foo', context)`                      | `context.querySelector('.foo')`                            |
| `find('.foo', '.context')`                   | `find('.context .foo')`                                    |
| `findAll('.foo', context)`                   | `context.querySelectorAll('.foo')`                         |
| `click('.foo', context)`                     | `click(context.querySelector('.foo'))`                     |
| `click('.foo', context, { shiftKey: true })` | `click(context.querySelector('.foo'), { shiftKey: true })` |

See also docs for [`native-dom` transform](transforms/native-dom).

### Replace find/findAll

By default this codemod will use the `find()` and `findAll()` helpers from `@ember/test-helpers` where required. 
If you want to use the native query functions `this.element.querySelector()` / `this.element.querySelectorAll()` instead, 
you can use the `find.js` transform after you have run the other transformations:

```bash
npx ember-test-helpers-codemod find tests
```

| Before               | After                                   | Transform      |
|----------------------|-----------------------------------------|----------------|
| `find('.foo')`       | `this.element.querySelector('.foo')`    | `find.js`      |
| `findAll('.foo')`    | `this.element.querySelectorAll('.foo')` | `find.js`      |

Note that this will require all instances of `find`/`findAll` to have the correct `this` context, otherwise you will run
into `Cannot read property 'querySelector' of undefined` exceptions, as `this.element` will not be defined. This can 
happen outside of the main `test` function, for example inside of custom test helper functions.

See also docs for [`find` transform](transforms/find).

### Replace deprecated `ember-test-helpers` package

Replace all imports of `ember-test-helpers` to `@ember/test-helpers`. 

See docs for [`ember-test-helper-api-migration` transform](transforms/ember-test-helper-api-migration).

### Replace deprecated `this.render()` with `render()`

Replace all uses of `this.render()` with `render()`.

See docs for [`this-render-migration` transform](transforms/this-render-migration).