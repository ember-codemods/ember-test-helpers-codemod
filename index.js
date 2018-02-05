const integrationPreset = require('./lib/presets/integration');
const acceptancePreset = require('./lib/presets/acceptance');
const nativeDomPreset = require('./lib/presets/native-dom');

module.exports = function(file, api, options) {
  switch (options.type) {
    case 'native-dom':
      return nativeDomPreset(file, api, options);
    case 'acceptance':
      return acceptancePreset(file, api, options);
    case 'integration':
    default:
      return integrationPreset(file, api, options);
  }
};