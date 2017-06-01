import { fillIn, blur } from 'ember-native-dom-helpers';
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
  Ember.run(() => this.$('select').val('1').trigger('change'));
  assert.ok(true);
});
