import { click, fillIn, blur, triggerEvent } from '@ember/test-helpers';
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
  assert.equal(this.element.querySelector('.foo').id, 'foo');
  await fillIn('.foo input', 'bar');
  await blur('.foo input');
  assert.equal(this.element.querySelector('.foo').textContent.trim(), 'foo');
});

test('it renders again', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  let selector = '.foo input';
  assert.equal(this.element.querySelectorAll(selector).length, 1);
  assert.equal(this.element.querySelector(selector).value, 'foo');
  assert.ok(this.element.querySelector('.foo').classList.contains('selected'));
});

test('and again', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await click('foo');

  fillInHelper.call(this, 'bar');
  assert.ok(this.element.querySelector('.foo').classList.contains('selected'));
});