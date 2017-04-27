import { click } from 'ember-native-dom-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

function fillInHelper(selector, value) {
  this.$(selector).val(value);
  this.$(selector).change();
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

  assert.equal(this.$('.foo input').length, 1);
  assert.equal(this.$('.foo input').val(), 'foo');
  assert.ok(this.$('.foo').hasClass('selected'));
});

test('and again', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('foo').click();

  fillInHelper.call(this, '.foo input', 'bar');
  assert.ok(this.$('.foo').hasClass('selected'));
});