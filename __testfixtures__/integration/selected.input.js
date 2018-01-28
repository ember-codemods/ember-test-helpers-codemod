import { find } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});


test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = this.$('.foo input:selected').val();
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = this.$('select option:selected').length;
  assert.equal(checkedCount, 3);

  // Multiple jQuery selectors
  const firstChecked = this.$('.foo input:selected:eq(0)').val();
  const secondChecked = this.$('.foo input:selected:eq(2)').val();
});
