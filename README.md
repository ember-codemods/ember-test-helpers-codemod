# ember-test-helpers-codemod

[![Build Status](https://travis-ci.org/simonihmig/ember-test-helpers-codemod.svg?branch=master)](https://travis-ci.org/simonihmig/ember-test-helpers-codemod)

A [jscodeshift](https://github.com/facebook/jscodeshift) based codemod to help migrating your jQuery based Ember tests to [@ember/test-helpers](https://github.com/emberjs/ember-test-helpers).

*Please note that this will not be able to cover all possible cases how jQuery based tests can be written.
Given the dynamic nature of JavaScript and the extensive API and fluent interface of jQuery, this would be impossible.
Instead this codemod focuses to cover the most common usages and do those transformations that it can safely do.
So it is likely that you will have to manually migrate some usages this tool cannot cover!*

## Usage

**This package requires Node 6 or later. Make sure you are using a newer version
of Node before installing and running this package.**

**WARNING**: `jscodeshift`, and thus this codemod, **edit your files in place**.
It does not make a copy. Make sure your code is checked into a source control
repository like Git and that you have no outstanding changes to commit before
running this tool.

```bash
npm install -g ember-test-helpers-codemod
cd my-ember-app-or-addon
ember-test-helpers-codemod --type=integration tests/integration
ember-test-helpers-codemod --type=acceptance tests/acceptance
ember-test-helpers-codemod --type=native-dom tests
```

## Transformations

### Integrations tests

This addon will perform the following transformations suitable for integration tests:

| Before                                               | After                                                                                       | Transform      |
|------------------------------------------------------|---------------------------------------------------------------------------------------------|----------------|
| `this.$('.foo').attr('id')`                          | `this.element.querySelector('.foo').id`                                                     | `attr.js`      |
| `this.$('.foo').attr('data-test')`                   | `this.element.querySelector('.foo').getAttribute('data-test')`                              | `attr.js`      |
| `this.$('.foo').click()`                             | `await click('.foo')`                                                                       | `click.js`     |
| `this.$('.foo').change()` (and more events)          | `await triggerEvent('.foo', 'change')`                                                      | `trigger-shortcut.js` |
| `this.$('.foo').trigger('input')`                    | `await triggerEvent('.foo', 'input')`                                                       | `trigger.js`   |
| `this.$('.foo').focus()`                             | `await focus('.foo')`                                                                       | `focus.js`     |
| `this.$('.foo').val()`                               | `this.element.querySelector('.foo').value`                                                  | `get-value.js` |
| `this.$('div').hasClass('foo')`                      | `this.element.querySelector('div').classList.contains('foo')`                               | `has-class.js` |
| `this.$('.foo').trigger('click')`                    | `await click('.foo')`                                                                       | `key-event.js` |
| `this.$('.foo').trigger('keydown', { keyCode: 13 })` | `await keyEvent('.foo', 'keydown', 13)`                                                     | `key-event.js` |
| `this.$('.foo').length`                              | `this.element.querySelectorAll('.foo').length`                                              | `length.js`    |
| `this.$('.foo').prop('tagName')`                     | `this.element.querySelector('.foo').tagName`                                                | `prop.js`      |
| `this.$('.foo').val('foo')`                          | `await fillIn('.foo', 'foo')`                                                               | `set-value.js` |
| `this.$('.foo').val('bar').change()`                 | `await fillIn('.foo', 'foo'); await blur('.foo');`                                          | `set-value.js` |
| `this.$('.foo').val('bar').trigger('input')`         | `await fillIn('.foo', 'foo')`                                                               | `set-value.js` |
| `this.$('.foo').text()`                              | `this.element.querySelector('.foo').textContent`                                            | `text.js`      |
| `this.$('.foo').html()`                              | `this.element.querySelector('.foo').innerHTML`                                              | `html.js`      |
| `this.$('.foo').html('foo')`                         | `this.element.querySelector('.foo').innerHTML = 'foo'`                                      | `html.js`      |
| `this.$('.foo').each((index, elem) => {...})`        | `this.element.querySelectorAll('.foo').forEach((elem, index) => {...})`                     | `each.js`      |


If you want to run only selected transforms on your code, you can pick just the needed transform:

```bash
jscodeshift -t ../ember-test-helpers-codemod/lib/transforms/integration/click.js tests/integration
```

### Acceptance tests

These transformations are available for acceptance tests:

| Before                                               | After                                                                                       | Transform      |
|------------------------------------------------------|---------------------------------------------------------------------------------------------|----------------|
| `find('.foo').attr('id')`                            | `this.element.querySelector('.foo').id`                                                     | `attr.js`      |
| `find('.foo').attr('data-test')`                     | `this.element.querySelector('.foo').getAttribute('data-test')`                              | `attr.js`      |
| `click('.foo')`                                      | `await click('.foo')`                                                                       | `click.js`     |
| `fillIn('#bar', 'baz')`                              | `await fillIn('#bar', 'baz')`                                                               | `fill-in.js`   |
| `triggerEvent('input', 'focus')`                     | `await focus('.foo')`                                                                       | `trigger-event.js` |
| `triggerEvent('input', 'blur')`                      | `await blur('.foo')`                                                                        | `trigger-event.js` |
| `triggerEvent('input', 'mouseenter')`                | `await triggerEvent('input', 'mouseenter')`                                                 | `trigger-event.js` |
| `find('.foo').val()`                                 | `this.element.querySelector('.foo').value`                                                  | `get-value.js` |
| `find('div').hasClass('foo')`                        | `this.element.querySelector('div').classList.contains('foo')`                               | `has-class.js` |
| `keyEvent('#bar', 'keypress', 13);`                  | `await keyEvent('.foo', 'keydown', 13)`                                                     | `key-event.js` |
| `find('.foo').length`                                | `this.element.querySelectorAll('.foo').length`                                              | `length.js`    |
| `find('.foo').prop('tagName')`                       | `this.element.querySelector('.foo').tagName`                                                | `prop.js`      |
| `find('.foo').text()`                                | `this.element.querySelector('.foo').textContent`                                            | `text.js`      |
| `find('.foo').html()`                                | `this.element.querySelector('.foo').innerHTML`                                              | `html.js`      |
| `find('.foo').html('foo')`                           | `this.element.querySelector('.foo').innerHTML = 'foo'`                                      | `html.js`      |
| `find('.foo').each((index, elem) => {...})`          | `this.element.querySelectorAll('.foo').forEach((elem, index) => {...})`                     | `each.js`      |

If you want to run only selected transforms on your code, you can pick just the needed transform:

```bash
jscodeshift -t ../ember-test-helpers-codemod/lib/transforms/acceptance/click.js tests/integration
```

### ember-native-dom-helpers tests

These transformations are available tests based on `ember-native-dom-helpers`:

| Before                                | After                                         | Transform      |
|---------------------------------------|-----------------------------------------------|----------------|
| `find('.foo')`                        | `this.element.querySelector('.foo')`          | `find.js`      |
| `findAll('.foo')`                     | `this.element.querySelectorAll('.foo')`       | `find.js`      |
| ```import { click, find, findAll, fillIn, focus, blur, triggerEvent, keyEvent, waitFor, waitUntil } from 'ember-native-dom-helpers';``` | ```import { click, find, findAll, fillIn, focus, blur, triggerEvent, triggerKeyEvent, waitFor, waitUntil } from '@ember/test-helpers';``` | `migrate-imports.js`     |

If you want to run only selected transforms on your code, you can pick just the needed transform:

```bash
jscodeshift -t ../ember-test-helpers-codemod/lib/transforms/native-dom/find.js tests/integration
```


