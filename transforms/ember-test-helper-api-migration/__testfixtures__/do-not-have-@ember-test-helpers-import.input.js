import { start } from 'ember-qunit';
import { setResolver } from 'ember-test-helpers';

setResolver(engineResolverFor('shared-components')); 
 
setApplication(Application.create(config.APP)); 
preloadAssets(manifest).then(start); 
