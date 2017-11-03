import { findAll, click } from 'ember-native-dom-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const SELECTOR_FIRST = '.foo:first';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await click('.foo');
  await click('.baz a');
  await click(findAll('.foo .bar')[3]);
  this.$(SELECTOR_FIRST).click();
  assert.ok(true);
});
