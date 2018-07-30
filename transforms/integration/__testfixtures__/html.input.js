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
