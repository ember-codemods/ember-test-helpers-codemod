import { click } from 'ember-native-dom-helpers';
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