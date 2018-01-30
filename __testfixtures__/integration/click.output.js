import { click } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await click('.foo');
  await click('.baz a');
  await click(this.element.querySelectorAll('.foo .bar')[3]);
  assert.ok(true);
});
