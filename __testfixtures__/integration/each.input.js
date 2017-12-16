import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('anonymous function callback with two args', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = this.$('.button-class').each((i, val) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('anonymous function callback with one arg', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = this.$('.button-class').each((index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with two args', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = this.$('.button-class').each(function(index, element) {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with one arg', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = this.$('.button-class').each((index) => {
    assert.equal(element.id, `button${index}`);
  });
});
