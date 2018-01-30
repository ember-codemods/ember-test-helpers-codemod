import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /foo', function(assert) {
  assert.equal(this.element.querySelector('.foo').value, 'foo');
});