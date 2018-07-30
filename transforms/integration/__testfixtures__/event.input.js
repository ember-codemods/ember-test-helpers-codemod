import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  this.$('.foo').change();
  this.$('.foo').submit();
  this.$('.foo').focusin();
  this.$('.foo').focusout();
  this.$('.foo').mousedown();
  this.$('.foo').mouseenter();
  this.$('.foo').mouseleave();
  this.$('.foo').mousemove();
  this.$('.foo').mouseout();
  this.$('.foo').mouseover();
  this.$('.foo').mouseup();
  this.$('.foo').trigger('input');
  this.$('.foo').trigger('click');
  assert.ok(true);
});
