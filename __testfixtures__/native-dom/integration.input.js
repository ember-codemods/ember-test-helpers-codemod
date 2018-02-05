import { click, find, findAll, findWithAssert, fillIn, focus, blur, triggerEvent, keyEvent, scrollTo, selectFiles, waitFor, waitUntil } from 'ember-native-dom-helpers';
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
