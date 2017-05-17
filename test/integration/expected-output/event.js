import { triggerEvent } from 'ember-native-dom-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('it renders', async function(assert) {
  this.render(hbs`{{foo-bar}}`);

  await triggerEvent('.foo', 'change');
  await triggerEvent('.foo', 'submit');
  await triggerEvent('.foo', 'focusin');
  await triggerEvent('.foo', 'focusout');
  await triggerEvent('.foo', 'mousedown');
  await triggerEvent('.foo', 'mouseenter');
  await triggerEvent('.foo', 'mouseleave');
  await triggerEvent('.foo', 'mousemove');
  await triggerEvent('.foo', 'mouseout');
  await triggerEvent('.foo', 'mouseover');
  await triggerEvent('.foo', 'mouseup');
  await triggerEvent('.foo', 'input');
  assert.ok(true);
});
