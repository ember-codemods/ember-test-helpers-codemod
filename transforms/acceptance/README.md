# acceptance


## Usage

```
npx ember-test-helpers-codemod acceptance path/of/files/ or/some**/*glob.js

# or

yarn global add ember-test-helpers-codemod
ember-test-helpers-codemod acceptance path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [andthen](#andthen)
* [attr](#attr)
* [click](#click)
* [each](#each)
* [fill-in](#fill-in)
* [get-value](#get-value)
* [get](#get)
* [has-class](#has-class)
* [html](#html)
* [key-event](#key-event)
* [length](#length)
* [nested-in-and-then](#nested-in-and-then)
* [prop](#prop)
* [route-helpers](#route-helpers)
* [selected](#selected)
* [text](#text)
* [trigger-event](#trigger-event)
* [visit](#visit)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="andthen">**andthen**</a>

**Input** (<small>[andthen.input.js](transforms/acceptance/__testfixtures__/andthen.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', function(assert) {
  visit('/foo');
  andThen(function() {
  });

  andThen(function() {
    assert.ok(true);
  });
});

test('visiting /foo', function(assert) {
  visit('/foo');
  return andThen(function() {
  });
});

test('visiting /foo', function(assert) {
  visit('/foo');
  return andThen(function() {
    assert.ok(true);
  });
});

```

**Output** (<small>[andthen.output.js](transforms/acceptance/__testfixtures__/andthen.output.js)</small>):
```js
import { visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.ok(true);
});

test('visiting /foo', async function(assert) {
  await visit('/foo');
});

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.ok(true);
});

```
---
<a id="attr">**attr**</a>

**Input** (<small>[attr.input.js](transforms/acceptance/__testfixtures__/attr.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').attr('id'), 'foo');
  assert.equal(find('.foo').attr('data-test'), 'foo');
});
```

**Output** (<small>[attr.output.js](transforms/acceptance/__testfixtures__/attr.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').id, 'foo');
  assert.equal(find('.foo').getAttribute('data-test'), 'foo');
});
```
---
<a id="click">**click**</a>

**Input** (<small>[click.input.js](transforms/acceptance/__testfixtures__/click.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', function(assert) {
  visit('/foo');

  click('#bar');
  click('.baz a:eq(12)');
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});

```

**Output** (<small>[click.output.js](transforms/acceptance/__testfixtures__/click.output.js)</small>):
```js
import { click, currentURL, findAll, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  await click('#bar');
  await click(findAll('.baz a')[12]);
  assert.equal(currentURL(), '/foo');
});

```
---
<a id="each">**each**</a>

**Input** (<small>[each.input.js](transforms/acceptance/__testfixtures__/each.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('anonymous function callback with two args', function(assert) {
  const elemIds = find('.button-class').each((index, element) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('anonymous function callback with one arg', function(assert) {
  const elemIds = find('.button-class').each((index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with two args', function(assert) {
  const elemIds = find('.button-class').each(function(i, elem) {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with one arg', function(assert) {
  const elemIds = find('.button-class').each((index) => {
    assert.equal(element.id, `button${index}`);
  });
});

```

**Output** (<small>[each.output.js](transforms/acceptance/__testfixtures__/each.output.js)</small>):
```js
import { findAll } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('anonymous function callback with two args', function(assert) {
  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('anonymous function callback with one arg', function(assert) {
  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with two args', function(assert) {
  const elemIds = findAll('.button-class').forEach(function(elem, i) {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with one arg', function(assert) {
  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});

```
---
<a id="fill-in">**fill-in**</a>

**Input** (<small>[fill-in.input.js](transforms/acceptance/__testfixtures__/fill-in.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('fillIn');

test('visiting /foo', function(assert) {
  visit('/foo');

  fillIn('#bar', 'baz');
  fillIn('#qux input:eq(5)', 'qaaz');
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});

```

**Output** (<small>[fill-in.output.js](transforms/acceptance/__testfixtures__/fill-in.output.js)</small>):
```js
import { fillIn, currentURL, findAll, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('fillIn');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  await fillIn('#bar', 'baz');
  await fillIn(findAll('#qux input')[5], 'qaaz');
  assert.equal(currentURL(), '/foo');
});

```
---
<a id="get-value">**get-value**</a>

**Input** (<small>[get-value.input.js](transforms/acceptance/__testfixtures__/get-value.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').val(), 'foo');
});
```

**Output** (<small>[get-value.output.js](transforms/acceptance/__testfixtures__/get-value.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').value, 'foo');
});
```
---
<a id="get">**get**</a>

**Input** (<small>[get.input.js](transforms/acceptance/__testfixtures__/get.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('get');

test('transforms get() correctly', function(assert) {
  assert.ok(find('.foo bar').get(3));

  const otherGet = someOtherObj.get(1);
});

```

**Output** (<small>[get.output.js](transforms/acceptance/__testfixtures__/get.output.js)</small>):
```js
import { findAll } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('get');

test('transforms get() correctly', function(assert) {
  assert.ok(findAll('.foo bar')[3]);

  const otherGet = someOtherObj.get(1);
});

```
---
<a id="has-class">**has-class**</a>

**Input** (<small>[has-class.input.js](transforms/acceptance/__testfixtures__/has-class.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.ok(find('.foo').hasClass('foo'));
});
```

**Output** (<small>[has-class.output.js](transforms/acceptance/__testfixtures__/has-class.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.ok(find('.foo').classList.contains('foo'));
});
```
---
<a id="html">**html**</a>

**Input** (<small>[html.input.js](transforms/acceptance/__testfixtures__/html.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').html().trim(), '');

  find('.foo').html('bar');

  assert.equal(find('.foo').html().trim(), 'bar');
});
```

**Output** (<small>[html.output.js](transforms/acceptance/__testfixtures__/html.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').innerHTML.trim(), '');

  find('.foo').innerHTML = 'bar';

  assert.equal(find('.foo').innerHTML.trim(), 'bar');
});
```
---
<a id="key-event">**key-event**</a>

**Input** (<small>[key-event.input.js](transforms/acceptance/__testfixtures__/key-event.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('keyEvent');

test('visiting /foo', function(assert) {
  visit('/foo');

  keyEvent('#bar', 'keypress', 13);
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});
```

**Output** (<small>[key-event.output.js](transforms/acceptance/__testfixtures__/key-event.output.js)</small>):
```js
import { keyEvent, currentURL, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('keyEvent');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  await keyEvent('#bar', 'keypress', 13);
  assert.equal(currentURL(), '/foo');
});
```
---
<a id="length">**length**</a>

**Input** (<small>[length.input.js](transforms/acceptance/__testfixtures__/length.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').length, 1);
});
```

**Output** (<small>[length.output.js](transforms/acceptance/__testfixtures__/length.output.js)</small>):
```js
import { findAll } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(findAll('.foo').length, 1);
});
```
---
<a id="nested-in-and-then">**nested-in-and-then**</a>

**Input** (<small>[nested-in-and-then.input.js](transforms/acceptance/__testfixtures__/nested-in-and-then.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /twiddles', function(assert) {
  andThen(function() {
    click('.foo');
  });

  andThen(() => {
    click('.foo');
  });

  andThen(function() {
    andThen(function() {
      andThen(function() {
        click('.foo');
      });
    });
  });

  andThen(() => {
    assert.ok(true);
  });

  andThen(() => assert.ok(true));
});

test('visiting /twiddles', function(assert) {
  andThen(() => {
    click('.foo');
  });
});

```

**Output** (<small>[nested-in-and-then.output.js](transforms/acceptance/__testfixtures__/nested-in-and-then.output.js)</small>):
```js
import { click } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /twiddles', async function(assert) {
  await click('.foo');

  await click('.foo');

  await click('.foo');

  assert.ok(true);

  assert.ok(true);
});

test('visiting /twiddles', async function(assert) {
  await click('.foo');
});

```
---
<a id="prop">**prop**</a>

**Input** (<small>[prop.input.js](transforms/acceptance/__testfixtures__/prop.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').prop('tagName'), 'DIV');
});
```

**Output** (<small>[prop.output.js](transforms/acceptance/__testfixtures__/prop.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').tagName, 'DIV');
});
```
---
<a id="route-helpers">**route-helpers**</a>

**Input** (<small>[route-helpers.input.js](transforms/acceptance/__testfixtures__/route-helpers.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', function(assert) {
  visit('/foo');
  assert.equal(currentURL(), '/foo');
  assert.equal(currentPath(), 'foo.index');
  assert.equal(currentRouteName(), 'foo');
});

```

**Output** (<small>[route-helpers.output.js](transforms/acceptance/__testfixtures__/route-helpers.output.js)</small>):
```js
import { currentURL, currentPath, currentRouteName, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.equal(currentURL(), '/foo');
  assert.equal(currentPath(), 'foo.index');
  assert.equal(currentRouteName(), 'foo');
});

```
---
<a id="selected">**selected**</a>

**Input** (<small>[selected.input.js](transforms/acceptance/__testfixtures__/selected.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('selected');

test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = find('.foo input:selected').val();
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = find('select option:selected').length;
  assert.equal(checkedCount, 3);
});

```

**Output** (<small>[selected.output.js](transforms/acceptance/__testfixtures__/selected.output.js)</small>):
```js
import { find, findAll } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('selected');

test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = find('.foo input:checked').value;
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = findAll('select option:checked').length;
  assert.equal(checkedCount, 3);
});

```
---
<a id="text">**text**</a>

**Input** (<small>[text.input.js](transforms/acceptance/__testfixtures__/text.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').text().trim(), '');
});
```

**Output** (<small>[text.output.js](transforms/acceptance/__testfixtures__/text.output.js)</small>):
```js
import { find } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').textContent.trim(), '');
});
```
---
<a id="trigger-event">**trigger-event**</a>

**Input** (<small>[trigger-event.input.js](transforms/acceptance/__testfixtures__/trigger-event.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('triggerEvent');

test('visiting /foo', function(assert) {
  visit('/foo');

  triggerEvent('input', 'focus');
  triggerEvent('input', 'blur');
  triggerEvent('#bar', 'mouseenter');
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});
```

**Output** (<small>[trigger-event.output.js](transforms/acceptance/__testfixtures__/trigger-event.output.js)</small>):
```js
import { currentURL, blur, focus, triggerEvent, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('triggerEvent');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  await focus('input');
  await blur('input');
  await triggerEvent('#bar', 'mouseenter');
  assert.equal(currentURL(), '/foo');
});
```
---
<a id="visit">**visit**</a>

**Input** (<small>[visit.input.js](transforms/acceptance/__testfixtures__/visit.input.js)</small>):
```js
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', function(assert) {
  visit('/foo');
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});

test('visiting /bar', function(assert) {
  visit('/bar');
  andThen(() => {
    assert.equal(currentURL(), '/bar');
  });
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentURL(), '/bar');
});

test('visiting /bar', async function(assert) {
  await assert.rejects(visit('/bar'));
  assert.equal(currentURL(), '/bar');
});

```

**Output** (<small>[visit.output.js](transforms/acceptance/__testfixtures__/visit.output.js)</small>):
```js
import { currentURL, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.equal(currentURL(), '/foo');
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentURL(), '/bar');
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentURL(), '/bar');
});

test('visiting /bar', async function(assert) {
  await assert.rejects(visit('/bar'));
  assert.equal(currentURL(), '/bar');
});

```
<!--FIXTURES_CONTENT_END-->