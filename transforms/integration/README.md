# integration


## Usage

```
npx ember-test-helpers-codemod integration path/of/files/ or/some**/*glob.js

# or

yarn global add ember-test-helpers-codemod
ember-test-helpers-codemod integration path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [all](#all)
* [attr](#attr)
* [click](#click)
* [default-component-test](#default-component-test)
* [each](#each)
* [event](#event)
* [focus](#focus)
* [get-value](#get-value)
* [get](#get)
* [has-class](#has-class)
* [html](#html)
* [jq-extensions](#jq-extensions)
* [key-event](#key-event)
* [length](#length)
* [prop](#prop)
* [selected](#selected)
* [set-value](#set-value)
* [text](#text)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="all">**all**</a>

**Input** (<small>[all.input.js](transforms/integration/__testfixtures__/all.input.js)</small>):
```js
import { click } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

function fillInHelper(value) {
  this.$('.foo input').val(value);
  this.$('.foo input').change();
}

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await click('.foo');
  assert.equal(this.$('.foo').attr('id'), 'foo');
  this.$('.foo input').val('bar').change();
  assert.equal(this.$('.foo').text().trim(), 'foo');
});

test('it renders again', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  let selector = '.foo input';
  assert.equal(this.$(selector).length, 1);
  assert.equal(this.$(selector).val(), 'foo');
  assert.ok(this.$('.foo').hasClass('selected'));
});

test('and again', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('foo').click();

  fillInHelper.call(this, 'bar');
  assert.ok(this.$('.foo').hasClass('selected'));
});
```

**Output** (<small>[all.input.js](transforms/integration/__testfixtures__/all.output.js)</small>):
```js
import { click, find, findAll, fillIn, blur, triggerEvent } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

async function fillInHelper(value) {
  await fillIn('.foo input', value);
  await triggerEvent('.foo input', 'change');
}

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await click('.foo');
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

  await click('foo');

  fillInHelper.call(this, 'bar');
  assert.ok(find('.foo').classList.contains('selected'));
});
```
---
<a id="attr">**attr**</a>

**Input** (<small>[attr.input.js](transforms/integration/__testfixtures__/attr.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(this.$('.foo').attr('id'), 'foo');
  assert.equal(this.$('.foo').attr('data-test'), 'foo');
});

```

**Output** (<small>[attr.input.js](transforms/integration/__testfixtures__/attr.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(find('.foo').id, 'foo');
  assert.equal(find('.foo').getAttribute('data-test'), 'foo');
});

```
---
<a id="click">**click**</a>

**Input** (<small>[click.input.js](transforms/integration/__testfixtures__/click.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('.foo').click();
  this.$('.baz a:eq(0)').click();
  this.$('.foo .bar:eq(3)').click();
  assert.ok(true);
});

```

**Output** (<small>[click.input.js](transforms/integration/__testfixtures__/click.output.js)</small>):
```js
import { find, findAll, click } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await click('.foo');
  await click(find('.baz a'));
  await click(findAll('.foo .bar')[3]);
  assert.ok(true);
});

```
---
<a id="default-component-test">**default-component-test**</a>

**Input** (<small>[default-component-test.input.js](transforms/integration/__testfixtures__/default-component-test.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{foo-bar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#foo-bar}}
      template block text
    {{/foo-barl}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

```

**Output** (<small>[default-component-test.input.js](transforms/integration/__testfixtures__/default-component-test.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{foo-bar}}`);

  assert.equal(find('*').textContent.trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#foo-bar}}
      template block text
    {{/foo-barl}}
  `);

  assert.equal(find('*').textContent.trim(), 'template block text');
});

```
---
<a id="each">**each**</a>

**Input** (<small>[each.input.js](transforms/integration/__testfixtures__/each.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('anonymous function callback with two args', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = this.$('.button-class').each((i, val) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('anonymous function callback with one arg', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = this.$('.button-class').each((index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with two args', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = this.$('.button-class').each(function(index, element) {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with one arg', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = this.$('.button-class').each((index) => {
    assert.equal(element.id, `button${index}`);
  });
});

```

**Output** (<small>[each.input.js](transforms/integration/__testfixtures__/each.output.js)</small>):
```js
import { findAll } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('anonymous function callback with two args', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = findAll('.button-class').forEach((val, i) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('anonymous function callback with one arg', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with two args', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = findAll('.button-class').forEach(function(element, index) {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with one arg', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});

```
---
<a id="event">**event**</a>

**Input** (<small>[event.input.js](transforms/integration/__testfixtures__/event.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('.foo').change();
  this.$('.foo').submit();
  this.$('.foo').focusin();
  this.$('.foo').focusout();
  this.$('.foo').mousedown();
  this.$('.foo').mouseenter();
  this.$('.foo').mouseleave();
  this.$('.foo').mousemove();
  this.$('.foo').mouseout();
  this.$('.foo').mouseover();
  this.$('.foo').mouseup();
  this.$('.foo').trigger('input');
  this.$('.foo').trigger('click');
  assert.ok(true);
});

```

**Output** (<small>[event.input.js](transforms/integration/__testfixtures__/event.output.js)</small>):
```js
import { triggerEvent } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await triggerEvent('.foo', 'change');
  await triggerEvent('.foo', 'submit');
  await triggerEvent('.foo', 'focusin');
  await triggerEvent('.foo', 'focusout');
  await triggerEvent('.foo', 'mousedown');
  await triggerEvent('.foo', 'mouseenter');
  await triggerEvent('.foo', 'mouseleave');
  await triggerEvent('.foo', 'mousemove');
  await triggerEvent('.foo', 'mouseout');
  await triggerEvent('.foo', 'mouseover');
  await triggerEvent('.foo', 'mouseup');
  await triggerEvent('.foo', 'input');
  await click('.foo');
  assert.ok(true);
});

```
---
<a id="focus">**focus**</a>

**Input** (<small>[focus.input.js](transforms/integration/__testfixtures__/focus.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('.foo').focus();
  assert.ok(true);
});

```

**Output** (<small>[focus.input.js](transforms/integration/__testfixtures__/focus.output.js)</small>):
```js
import { focus } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await focus('.foo');
  assert.ok(true);
});

```
---
<a id="get-value">**get-value**</a>

**Input** (<small>[get-value.input.js](transforms/integration/__testfixtures__/get-value.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(this.$('.foo').val(), 'foo');
});

```

**Output** (<small>[get-value.input.js](transforms/integration/__testfixtures__/get-value.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(find('.foo').value, 'foo');
});

```
---
<a id="get">**get**</a>

**Input** (<small>[get.input.js](transforms/integration/__testfixtures__/get.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('transforms get() correctly', function(assert) {
  assert.ok(this.$('.foo').get(1));

  const otherGet = someOtherObj.get(1);
});

```

**Output** (<small>[get.input.js](transforms/integration/__testfixtures__/get.output.js)</small>):
```js
import { findAll } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('transforms get() correctly', function(assert) {
  assert.ok(findAll('.foo')[1]);

  const otherGet = someOtherObj.get(1);
});

```
---
<a id="has-class">**has-class**</a>

**Input** (<small>[has-class.input.js](transforms/integration/__testfixtures__/has-class.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.ok(this.$('div').hasClass('foo'));
});

```

**Output** (<small>[has-class.input.js](transforms/integration/__testfixtures__/has-class.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.ok(find('div').classList.contains('foo'));
});

```
---
<a id="html">**html**</a>

**Input** (<small>[html.input.js](transforms/integration/__testfixtures__/html.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(this.$('.foo').html().trim(), '');

  this.$('.bar').html('bar');

  assert.equal(this.$('.bar').html().trim(), 'bar');
});

```

**Output** (<small>[html.input.js](transforms/integration/__testfixtures__/html.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(find('.foo').innerHTML.trim(), '');

  find('.bar').innerHTML = 'bar';

  assert.equal(find('.bar').innerHTML.trim(), 'bar');
});

```
---
<a id="jq-extensions">**jq-extensions**</a>

**Input** (<small>[jq-extensions.input.js](transforms/integration/__testfixtures__/jq-extensions.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ANY_SELECTOR_AS_IMPORTED_CONST from './constants';

const JQEXTENSION_SELECTOR_AS_LOCAL_CONST = '.foo:first';
const NORMAL_SELECTOR = '.foo';
const NORMAL_PSEUDO_SELECTOR = '.foo:eq(0)';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.ok(this.$('.foo:even').length);
  assert.ok(this.$('.foo:odd').length);
  assert.ok(this.$('.foo:contains(foo)').length);
  assert.ok(this.$('.foo:has(p)').length);
  assert.ok(this.$('.foo:animated').length);
  assert.ok(this.$('.foo:checkbox').length);
  assert.ok(this.$('.foo:file').length);
  assert.ok(this.$('.foo:first').length);
  assert.ok(this.$('.foo:gt(2)').length);
  assert.ok(this.$('.foo:header').length);
  assert.ok(this.$('.foo:hidden').length);
  assert.ok(this.$('.foo:image').length);
  assert.ok(this.$('.foo:input').length);
  assert.ok(this.$('.foo:last').length);
  assert.ok(this.$('.foo:lt(2)').length);
  assert.ok(this.$('.foo:parent').length);
  assert.ok(this.$('.foo:password').length);
  assert.ok(this.$('.foo:radio').length);
  assert.ok(this.$('.foo:reset').length);
  assert.ok(this.$('.foo:selected').length);
  assert.ok(this.$('.foo:submit').length);
  assert.ok(this.$('.foo:text').length);
  assert.ok(this.$('.foo:visible').length);
  assert.ok(this.$(JQEXTENSION_SELECTOR_AS_LOCAL_CONST).length);
  assert.ok(this.$(ANY_SELECTOR_AS_IMPORTED_CONST).length);

  assert.ok(this.$('.foo:eq(0)').length);
  assert.ok(this.$('.foo:eq(1)').length);
  assert.ok(this.$('.foo:first-child').length);
  assert.ok(this.$('.foo:last-child').length);
  assert.ok(this.$(NORMAL_SELECTOR).length);
  assert.ok(this.$(NORMAL_PSEUDO_SELECTOR).length);
});

```

**Output** (<small>[jq-extensions.input.js](transforms/integration/__testfixtures__/jq-extensions.output.js)</small>):
```js
import { find, findAll } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ANY_SELECTOR_AS_IMPORTED_CONST from './constants';

const JQEXTENSION_SELECTOR_AS_LOCAL_CONST = '.foo:first';
const NORMAL_SELECTOR = '.foo';
const NORMAL_PSEUDO_SELECTOR = '.foo:eq(0)';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.ok(this.$('.foo:even').length);
  assert.ok(this.$('.foo:odd').length);
  assert.ok(this.$('.foo:contains(foo)').length);
  assert.ok(this.$('.foo:has(p)').length);
  assert.ok(this.$('.foo:animated').length);
  assert.ok(this.$('.foo:checkbox').length);
  assert.ok(this.$('.foo:file').length);
  assert.ok(this.$('.foo:first').length);
  assert.ok(this.$('.foo:gt(2)').length);
  assert.ok(this.$('.foo:header').length);
  assert.ok(this.$('.foo:hidden').length);
  assert.ok(this.$('.foo:image').length);
  assert.ok(this.$('.foo:input').length);
  assert.ok(this.$('.foo:last').length);
  assert.ok(this.$('.foo:lt(2)').length);
  assert.ok(this.$('.foo:parent').length);
  assert.ok(this.$('.foo:password').length);
  assert.ok(this.$('.foo:radio').length);
  assert.ok(this.$('.foo:reset').length);
  assert.ok(findAll('.foo:checked').length);
  assert.ok(this.$('.foo:submit').length);
  assert.ok(this.$('.foo:text').length);
  assert.ok(this.$('.foo:visible').length);
  assert.ok(this.$(JQEXTENSION_SELECTOR_AS_LOCAL_CONST).length);
  assert.ok(this.$(ANY_SELECTOR_AS_IMPORTED_CONST).length);

  assert.ok(findAll(find('.foo')).length);
  assert.ok(findAll('.foo')[1].length);
  assert.ok(findAll('.foo:first-child').length);
  assert.ok(findAll('.foo:last-child').length);
  assert.ok(findAll(NORMAL_SELECTOR).length);
  assert.ok(this.$(NORMAL_PSEUDO_SELECTOR).length);
});

```
---
<a id="key-event">**key-event**</a>

**Input** (<small>[key-event.input.js](transforms/integration/__testfixtures__/key-event.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('.foo').trigger('keydown', { keyCode: 13 });
  assert.ok(true);
});

```

**Output** (<small>[key-event.input.js](transforms/integration/__testfixtures__/key-event.output.js)</small>):
```js
import { keyEvent } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await keyEvent('.foo', 'keydown', 13);
  assert.ok(true);
});

```
---
<a id="length">**length**</a>

**Input** (<small>[length.input.js](transforms/integration/__testfixtures__/length.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(this.$('.foo').length, 1);
});

```

**Output** (<small>[length.input.js](transforms/integration/__testfixtures__/length.output.js)</small>):
```js
import { findAll } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(findAll('.foo').length, 1);
});

```
---
<a id="prop">**prop**</a>

**Input** (<small>[prop.input.js](transforms/integration/__testfixtures__/prop.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(this.$('.foo').prop('tagName'), 'DIV');
});

```

**Output** (<small>[prop.input.js](transforms/integration/__testfixtures__/prop.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(find('.foo').tagName, 'DIV');
});

```
---
<a id="selected">**selected**</a>

**Input** (<small>[selected.input.js](transforms/integration/__testfixtures__/selected.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});


test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = this.$('.foo input:selected').val();
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = this.$('select option:selected').length;
  assert.equal(checkedCount, 3);

  // Multiple jQuery selectors
  const firstChecked = this.$('.foo input:selected:eq(0)').val();
  const secondChecked = this.$('.foo input:selected:eq(2)').val();
});

```

**Output** (<small>[selected.input.js](transforms/integration/__testfixtures__/selected.output.js)</small>):
```js
import { find, findAll } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});


test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = find('.foo input:checked').value;
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = findAll('select option:checked').length;
  assert.equal(checkedCount, 3);

  // Multiple jQuery selectors
  const firstChecked = find('.foo input:checked').value;
  const secondChecked = find(findAll('.foo input:checked')[2]).value;
});

```
---
<a id="set-value">**set-value**</a>

**Input** (<small>[set-value.input.js](transforms/integration/__testfixtures__/set-value.input.js)</small>):
```js
import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('.foo').val('foo');
  this.$('.foo').val('bar').change();
  this.$('.foo').val('baz').trigger('input');
  Ember.run(() => this.$('select').val('1'));
  Ember.run(() => this.$('select').val('1').trigger('change'));
  Ember.run(() => this.$('#odd').val(10).trigger('input').trigger('blur'));
  this.$('#odd').val(10).trigger('input').trigger('blur');
  assert.ok(true);
});

```

**Output** (<small>[set-value.input.js](transforms/integration/__testfixtures__/set-value.output.js)</small>):
```js
import { fillIn, blur } from '@ember/test-helpers';
import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await fillIn('.foo', 'foo');
  await fillIn('.foo', 'bar');
  await blur('.foo');
  await fillIn('.foo', 'baz');
  Ember.run(async () => await fillIn('select', '1'));
  Ember.run(() => this.$('select').val('1').trigger('change'));
  Ember.run(() => this.$('#odd').val(10).trigger('input').trigger('blur'));
  this.$('#odd').val(10).trigger('input').trigger('blur');
  assert.ok(true);
});

```
---
<a id="text">**text**</a>

**Input** (<small>[text.input.js](transforms/integration/__testfixtures__/text.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(this.$('.foo').text().trim(), '');
});

```

**Output** (<small>[text.input.js](transforms/integration/__testfixtures__/text.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(find('.foo').textContent.trim(), '');
});

```
<!--FIXTURE_CONTENT_END-->