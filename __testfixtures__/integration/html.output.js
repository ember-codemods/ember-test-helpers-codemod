import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(this.element.querySelector('.foo').innerHTML.trim(), '');

  this.element.querySelector('.bar').innerHTML = 'bar';

  assert.equal(this.element.querySelector('.bar').innerHTML.trim(), 'bar');
});
