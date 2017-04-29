import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('.foo:eq(0)').click();
  this.$('.foo:even').click();
  this.$('.foo:odd').click();
  this.$('.foo:contains(foo)').click();
  this.$('.foo:has(p)').click();
  this.$('.foo:animated').click();
  this.$('.foo:checkbox').click();
  this.$('.foo:file').click();
  this.$('.foo:first').click();
  this.$('.foo:gt(2)').click();
  this.$('.foo:header').click();
  this.$('.foo:hidden').click();
  this.$('.foo:image').click();
  this.$('.foo:input').click();
  this.$('.foo:last').click();
  this.$('.foo:lt(2)').click();
  this.$('.foo:parent').click();
  this.$('.foo:password').click();
  this.$('.foo:radio').click();
  this.$('.foo:reset').click();
  this.$('.foo:selected').click();
  this.$('.foo:submit').click();
  this.$('.foo:text').click();
  this.$('.foo:visible').click();
});
