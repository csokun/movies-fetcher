const env = process.env.NODE_ENV || 'dev';
let config = {};

if (env !== 'production') {
  config = require('./config.' + env + '.json');
} else {
  config = JSON.parse(process.env.app_config);
}

module.exports = config;