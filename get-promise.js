const http = require('http');
const config = require('./config');
const util = require('util');

/**
 * Normally I would do `npm i request --save`
 * @param {string} path 
 * @param {object} defaultValue if error occur
 * @param {number} retry 
 */
function Get (path, defaultValue = null, retry, callback) {
    let options = {
        host: config.host,
        path: `${config.baseUrl}/${path}`,
        headers: config.headers
    };
    
    let timeoutExp = false;

    function retry (reason) {
        let retryMessage = retry > 0 ? ` (retry in ${config.backoff})`: '';
        console.error(`${reason || ''}${retryMessage}`);

        if (retry === 0){
            callback(null, defaultValue);
            return;   
        }

        setTimeout(function () {
            Get(path, defaultValue, --retry, callback);
        }, config.backoff);
    }

    let request = http.get(options, (response) => {
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
        if (timeoutExp) {
            retry(`GET: ${options.path} - ${err.code} - Timeout`);
            timeoutExp = false;
            return;
        }
        console.error(err.message);
    });

    request.setTimeout(config.timeout, () => {
        timeoutExp = true;
        request.abort();
    });
};

module.exports = util.promisify(Get);