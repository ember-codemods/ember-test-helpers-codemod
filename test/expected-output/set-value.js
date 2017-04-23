import { fillIn, triggerEvent } from 'ember-native-dom-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await fillIn('.foo', 'foo');
  await fillIn('.foo', 'bar');
  await triggerEvent('.foo', 'change');
  await fillIn('.foo', 'baz');
  await triggerEvent('.foo', 'input');
  assert.ok(true);
});
