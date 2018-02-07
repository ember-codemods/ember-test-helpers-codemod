const integrationPreset = require('./lib/presets/integration');
const acceptancePreset = require('./lib/presets/acceptance');
const nativeDomPreset = require('./lib/presets/native-dom');
const findTransform = require('./lib/transforms/find');

module.exports = function(file, api, options) {
  switch (options.type) {
    case 'find':
      return findTransform(file, api, options);
    case 'native-dom':
      return nativeDomPreset(file, api, options);
    case 'acceptance':
      return acceptancePreset(file, api, options);
    case 'integration':
    default:
      return integrationPreset(file, api, options);
  }
};