import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const SELECTOR_FIRST = '.foo:first';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('.foo').click();
  this.$('.baz a:eq(0)').click();
  this.$('.foo .bar:eq(3)').click();
  this.$(SELECTOR_FIRST).click();
  assert.ok(true);
});
