import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', function(assert) {
  visit('/foo');
  assert.equal(currentURL(), '/foo');
  assert.equal(currentPath(), 'foo.index');
  assert.equal(currentRouteName(), 'foo');
});
