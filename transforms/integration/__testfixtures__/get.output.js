import { findAll } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('transforms get() correctly', function(assert) {
  assert.ok(findAll('.foo')[1]);

  const otherGet = someOtherObj.get(1);
});
