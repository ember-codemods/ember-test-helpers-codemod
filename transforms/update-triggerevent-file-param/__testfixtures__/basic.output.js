import { triggerEvent } from '@ember/test-helpers';

test('test', async function(assert) {
    await triggerEvent('[data-test-file-upload-button__input]', 'change', {
        files: [file]
    });
    await triggerEvent('[data-test-file-upload-button__input]', 'change', {
        files: []
    });
});
