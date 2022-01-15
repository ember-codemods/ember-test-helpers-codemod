import { click, TestContext } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';


module(
  'Integration | Component | c-pages/recommendations/collections/detail/collection-detail-card-list',
  function (hooks) {
    setupRenderingTest(hooks);

    /** @type {TestContext['setProperties']} */
    let setProperties;

    hooks.beforeEach(function () {
      setProperties = this.setProperties;

      this.owner.register(
        'service:lls-content-library@configuration',
        ConfigurationStub
      );
    });

    test('it renders detail view', async function (assert) {
      await renderComponent({
        learningCollectionItems,
        locale,
        isEditable: false
      });

      assert
        .dom(SELECTORS.DROPDOWN_BUTTON)
        .doesNotExist(
          'It does not render dropdown button when `isEditable` is falsey'
        );
    });
  }
);
