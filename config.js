const env = process.env.NODE_ENV || 'dev';

function get(key) {
  let config = {};

  if (env !== 'production') {
    let configFile = './config.' + env + '.json';
    config = require(configFile);
    // don't cache config
    delete require.cache[require.resolve(configFile)];
  } else {
    config = JSON.parse(process.env.app_config);
  }

  return config[key] || '';
}

module.exports = {
  get
};