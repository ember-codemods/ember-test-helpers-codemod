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
  this.$('input:eq(0)')
    .val('foo')
    .trigger('keydown')
    .focusout();
  this.$('input:eq(0)')
    .val('foo')
    .trigger('keydown')
    .blur();
  assert.ok(true);
});
