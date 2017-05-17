import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.ok(this.$('.foo:eq(0)').length);
  assert.ok(this.$('.foo:even').length);
  assert.ok(this.$('.foo:odd').length);
  assert.ok(this.$('.foo:contains(foo)').length);
  assert.ok(this.$('.foo:has(p)').length);
  assert.ok(this.$('.foo:animated').length);
  assert.ok(this.$('.foo:checkbox').length);
  assert.ok(this.$('.foo:file').length);
  assert.ok(this.$('.foo:first').length);
  assert.ok(this.$('.foo:gt(2)').length);
  assert.ok(this.$('.foo:header').length);
  assert.ok(this.$('.foo:hidden').length);
  assert.ok(this.$('.foo:image').length);
  assert.ok(this.$('.foo:input').length);
  assert.ok(this.$('.foo:last').length);
  assert.ok(this.$('.foo:lt(2)').length);
  assert.ok(this.$('.foo:parent').length);
  assert.ok(this.$('.foo:password').length);
  assert.ok(this.$('.foo:radio').length);
  assert.ok(this.$('.foo:reset').length);
  assert.ok(this.$('.foo:selected').length);
  assert.ok(this.$('.foo:submit').length);
  assert.ok(this.$('.foo:text').length);
  assert.ok(this.$('.foo:visible').length);

  assert.ok(this.$('.foo:first-child').length);
  assert.ok(this.$('.foo:last-child').length);
});
