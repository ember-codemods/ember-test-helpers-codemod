const integrationPreset = require('./lib/presets/integration');
const acceptancePreset = require('./lib/presets/acceptance');

module.exports = function(file, api, options) {
  switch (options.type) {
    case 'acceptance':
      return acceptancePreset(file, api, options);
    case 'integration':
    default:
      return integrationPreset(file, api, options);
  }
};