import { click } from '@ember/test-helpers';

test('It handles switching selected option on click and fires onSelect event', async function(assert) {
    this.onSelectMock = this.sandbox.stub();
    await this.render(hbs`
      <Common::TimeCommitmentSelector @timeCommitmentOptions={{timeCommitmentOptionsMock}} @onSelect={{onSelectMock}}>
      </Common::TimeCommitmentSelector>
    `);
})
