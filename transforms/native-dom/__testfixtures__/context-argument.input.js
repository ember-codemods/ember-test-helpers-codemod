import { find, findAll, visit, click, fillIn } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  const foo = find('.foo');
  assert.equal(find('.bar', foo).textContent.trim(), 'bar');
  assert.equal(find('.bar', find('.foo')).textContent.trim(), 'bar');
  assert.equal(find('.bar', '.foo').textContent.trim(), 'bar');
  assert.equal(findAll('.bar', foo).length, 2);
  assert.equal(findAll('.bar', find('.foo')).length, 2);
  assert.equal(findAll('.bar', '.foo').length, 2);

  await click('button', foo);
  await click('button', { shiftKey: true });
  await click('button', foo, { shiftKey: true });
});
