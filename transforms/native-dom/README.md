# native-dom


## Usage

```
npx ember-test-helpers-codemod native-dom path/of/files/ or/some**/*glob.js

# or

yarn global add ember-test-helpers-codemod
ember-test-helpers-codemod native-dom path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [acceptance](#acceptance)
* [context-argument](#context-argument)
* [double-import](#double-import)
* [integration](#integration)
* [prune-import](#prune-import)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="acceptance">**acceptance**</a>

**Input** (<small>[acceptance.input.js](transforms/native-dom/__testfixtures__/acceptance.input.js)</small>):
```js
import { find, visit } from 'ember-native-dom-helpers';
import { currentURL, currentPath, currentRouteName } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.equal(currentURL(), '/foo');
  assert.ok(find('.foo'));
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentPath(), 'bar');
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentRouteName(), 'bar.index');
});

```

**Output** (<small>[acceptance.output.js](transforms/native-dom/__testfixtures__/acceptance.output.js)</small>):
```js
import { find, visit, currentURL, currentRouteName } from '@ember/test-helpers';
import { currentPath } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.equal(currentURL(), '/foo');
  assert.ok(find('.foo'));
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentPath(), 'bar');
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentRouteName(), 'bar.index');
});

```
---
<a id="context-argument">**context-argument**</a>

**Input** (<small>[context-argument.input.js](transforms/native-dom/__testfixtures__/context-argument.input.js)</small>):
```js
import { find, findAll, visit, click, fillIn } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  const foo = find('.foo');
  assert.equal(find('.bar', foo).textContent.trim(), 'bar');
  assert.equal(find('.bar', find('.foo')).textContent.trim(), 'bar');
  assert.equal(find('.bar', '.foo').textContent.trim(), 'bar');
  assert.equal(findAll('.bar', foo).length, 2);
  assert.equal(findAll('.bar', find('.foo')).length, 2);
  assert.equal(findAll('.bar', '.foo').length, 2);

  await click('button', foo);
  await click('button', { shiftKey: true });
  await click('button', foo, { shiftKey: true });
});

```

**Output** (<small>[context-argument.output.js](transforms/native-dom/__testfixtures__/context-argument.output.js)</small>):
```js
import { find, findAll, visit, click } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  const foo = find('.foo');
  assert.equal(foo.querySelector('.bar').textContent.trim(), 'bar');
  assert.equal(find('.foo').querySelector('.bar').textContent.trim(), 'bar');
  assert.equal(find('.foo .bar').textContent.trim(), 'bar');
  assert.equal(foo.querySelectorAll('.bar').length, 2);
  assert.equal(find('.foo').querySelectorAll('.bar').length, 2);
  assert.equal(findAll('.foo .bar').length, 2);

  await click(foo.querySelector('button'));
  await click('button', { shiftKey: true });
  await click(foo.querySelector('button'), { shiftKey: true });
});

```
---
<a id="double-import">**double-import**</a>

**Input** (<small>[double-import.input.js](transforms/native-dom/__testfixtures__/double-import.input.js)</small>):
```js
import { click, currentURL } from 'ember-native-dom-helpers';
import { find, visit } from 'ember-native-dom-helpers';

test('visiting /foo', async function(assert) {
  await visit('/foo');
  await click('.foo');
  assert.ok(find('.foo'));
  assert.ok(currentURL());
});

```

**Output** (<small>[double-import.output.js](transforms/native-dom/__testfixtures__/double-import.output.js)</small>):
```js
import { click, currentURL, find, visit } from '@ember/test-helpers';

test('visiting /foo', async function(assert) {
  await visit('/foo');
  await click('.foo');
  assert.ok(find('.foo'));
  assert.ok(currentURL());
});

```
---
<a id="integration">**integration**</a>

**Input** (<small>[integration.input.js](transforms/native-dom/__testfixtures__/integration.input.js)</small>):
```js
import {
  click,
  find,
  findAll,
  findWithAssert,
  fillIn,
  focus,
  blur,
  triggerEvent,
  keyEvent,
  scrollTo,
  selectFiles,
  waitFor,
  waitUntil,
} from 'ember-native-dom-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await click('.foo', {});
  assert.equal(find('.foo').id, 'foo');
  await fillIn('.foo input', 'bar');
  await blur('.foo input');
  assert.equal(find('.foo').textContent.trim(), 'foo');
});

test('it renders again', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  let selector = '.foo input';
  assert.equal(findAll(selector).length, 1);
  assert.equal(find(selector).value, 'foo');
  assert.ok(find('.foo').classList.contains('selected'));
});

test('and again', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await tap('foo');
  let el = findWithAssert('.foo input');

  await fillIn(el, value);
  await triggerEvent('.foo input', 'change');
  await keyEvent('bar', 'keypress', 13, modifiers);

  await focus('.foo input');
  await blur('.foo input');

  assert.ok(findAll('.baz')[1].classList.contains('selected'));
});

test('and yet again', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await scrollTo(document, 10, 20);
  await selectFiles('input[type=file]', [new Blob(['texters'], { type: 'plain/text' })]);
  await waitUntil(() => find('.foo.active'));
  await waitFor('.bar.selected');
  assert.ok(true);
});

```

**Output** (<small>[integration.output.js](transforms/native-dom/__testfixtures__/integration.output.js)</small>):
```js
import {
  click,
  find,
  findAll,
  fillIn,
  focus,
  blur,
  triggerEvent,
  triggerKeyEvent,
  waitFor,
  waitUntil,
} from '@ember/test-helpers';

import { findWithAssert, scrollTo, selectFiles } from 'ember-native-dom-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await click('.foo', {});
  assert.equal(find('.foo').id, 'foo');
  await fillIn('.foo input', 'bar');
  await blur('.foo input');
  assert.equal(find('.foo').textContent.trim(), 'foo');
});

test('it renders again', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  let selector = '.foo input';
  assert.equal(findAll(selector).length, 1);
  assert.equal(find(selector).value, 'foo');
  assert.ok(find('.foo').classList.contains('selected'));
});

test('and again', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await tap('foo');
  let el = findWithAssert('.foo input');

  await fillIn(el, value);
  await triggerEvent('.foo input', 'change');
  await triggerKeyEvent('bar', 'keypress', 13, modifiers);

  await focus('.foo input');
  await blur('.foo input');

  assert.ok(findAll('.baz')[1].classList.contains('selected'));
});

test('and yet again', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await scrollTo(document, 10, 20);
  await selectFiles('input[type=file]', [new Blob(['texters'], { type: 'plain/text' })]);
  await waitUntil(() => find('.foo.active'));
  await waitFor('.bar.selected');
  assert.ok(true);
});

```
---
<a id="prune-import">**prune-import**</a>

**Input** (<small>[prune-import.input.js](transforms/native-dom/__testfixtures__/prune-import.input.js)</small>):
```js
import { click } from 'ember-native-dom-helpers';

click('.foo');

```

**Output** (<small>[prune-import.output.js](transforms/native-dom/__testfixtures__/prune-import.output.js)</small>):
```js
import { click } from '@ember/test-helpers';

click('.foo');

```
<!--FIXTURES_CONTENT_END-->