import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /twiddles', function(assert) {
  andThen(function() {
    click('.foo');
  });

  andThen(function() {
    andThen(function() {
      andThen(function() {
        click('.foo');
      });
    });
  });
});