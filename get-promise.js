const http = require('http');
const config = require('./config');
const util = require('util');

/**
 * Normally I would do `npm i request --save`
 * @param {string} path 
 * @param {object} defaultValue if error occur
 * @param {number} retry 
 */
function _get (path, defaultValue = null, retry, callback) {
    let options = {
        host: config.host,
        path: `${config.baseUrl}/${path}`,
        headers: config.headers,
        timeout: 1000
    };

    function retry (reason) {
        let retryMessage = retry > 0 ? ` (retry in ${config.backoff})`: '';
        console.error(`${reason || ''}${retryMessage}`);

        if (retry === 0){
            callback(null, defaultValue);
            return;   
        }

        setTimeout(function () {
            _get(path, defaultValue, --retry, callback);
        }, config.backoff);
    }

    http.get(options, (response) => {
        const { statusCode } = response;
        if (statusCode === 404) {
            response.resume();
            callback(null, defaultValue);
            return;
        }
        if (statusCode !== 200) {
            response.resume();
            retry(`GET: ${options.path} - ${statusCode}`);
            return;
        }

        let body = '';
        response.on('data', (chunk) => {
            body += chunk;
        });
        
        response.on('end', () => {
            let json = JSON.parse(body);
            callback(null, json);
        });

    }).on("error", (err) => {
        retry(`GET: ${options.path} - ${err.code}`);
    });

};

module.exports = util.promisify(_get);