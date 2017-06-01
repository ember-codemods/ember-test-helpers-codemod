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
  Ember.run(() => this.$('select').val('1').trigger('change'));
  assert.ok(true);
});
