# update-triggerevent-file-param
A transform to update param in `triggerEvent` from `[ file ]` to `{ files: [ file ] }`

## Usage

```
npx ember-test-helpers-codemod update-triggerevent-file-param path/of/files/ or/some**/*glob.js

# or

yarn global add ember-test-helpers-codemod
ember-test-helpers-codemod update-triggerevent-file-param path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/update-triggerevent-file-param/__testfixtures__/basic.input.js)</small>):
```js
import { triggerEvent } from '@ember/test-helpers';

test('test', async function(assert) {
    await triggerEvent('[data-test-file-upload-button__input]', 'change', [file]);
    await triggerEvent('[data-test-file-upload-button__input]', 'change', []);
});

```

**Output** (<small>[basic.output.js](transforms/update-triggerevent-file-param/__testfixtures__/basic.output.js)</small>):
```js
import { triggerEvent } from '@ember/test-helpers';

test('test', async function(assert) {
    await triggerEvent('[data-test-file-upload-button__input]', 'change', {
        files: [file]
    });
    await triggerEvent('[data-test-file-upload-button__input]', 'change', {
        files: []
    });
});

```
<!--FIXTURES_CONTENT_END-->