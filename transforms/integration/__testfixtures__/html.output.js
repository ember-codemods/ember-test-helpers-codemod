import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  assert.equal(find('.foo').innerHTML.trim(), '');

  find('.bar').innerHTML = 'bar';

  assert.equal(find('.bar').innerHTML.trim(), 'bar');
});
