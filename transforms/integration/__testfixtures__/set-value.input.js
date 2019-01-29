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
