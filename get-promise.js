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
        headers: config.headers
    };

    let get = http.get(options, (response) => {
        const { statusCode } = response;
        
        if (statusCode !== 200) {
            console.error(`GET: ${options.path} - ${statusCode}`);
            response.resume();

            if (retry === 0){
                callback(null, defaultValue);
                return;   
            }
            setTimeout(function () {
                _get(path, defaultValue, --retry, callback);
            }, config.backoff);
            
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
        let retryMessage = retry > 0 ? ` (retry in ${config.backoff})`: '';
        console.error(`GET: ${options.path} - ${err.code}${retryMessage}`);

        if (retry === 0) {
            callback(null, defaultValue);
            return;
        }

        setTimeout(function () {
            _get(path, defaultValue, --retry, callback)
        }, config.backoff);
    });
    
    get.end();

};

module.exports = util.promisify(_get);