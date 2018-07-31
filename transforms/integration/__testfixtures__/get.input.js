import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('transforms get() correctly', function(assert) {
  assert.ok(this.$('.foo').get(1));

  const otherGet = someOtherObj.get(1);
});
