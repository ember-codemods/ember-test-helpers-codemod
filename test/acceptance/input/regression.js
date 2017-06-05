test('visiting /twiddles', function(assert) {
  assert.expect(5);

  visit('/twiddles');

  andThen(function() {
    assert.equal($('.saved-twiddles-header').text().trim(), "My Saved Twiddles");

    assert.equal($('.saved-twiddles tr').length, 2);
    assert.equal($('.saved-twiddles tr').eq(0).find('.test-gist-id').text().trim(), '35de43cb81fc35ddffb2');
    assert.equal($('.saved-twiddles tr').eq(1).find('.test-gist-id').text().trim(), '74bae9a34142370ff5a3');

    // click($('.saved-twiddles tr').eq(0).find('.test-gist-twiddle-link>a')); if you uncomment this line everything breaks
  });
});