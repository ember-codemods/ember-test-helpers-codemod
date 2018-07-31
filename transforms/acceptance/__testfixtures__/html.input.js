import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(find('.foo').html().trim(), '');

  find('.foo').html('bar');

  assert.equal(find('.foo').html().trim(), 'bar');
});