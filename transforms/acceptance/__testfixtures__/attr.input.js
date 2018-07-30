import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').attr('id'), 'foo');
  assert.equal(find('.foo').attr('data-test'), 'foo');
});