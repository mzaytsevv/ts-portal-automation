'use strict';

const aws4 = require('aws4');
const rp = require('request-promise-any').defaults({ json: true });

const apiHost = '7v1xrib3nh.execute-api.us-east-1.amazonaws.com';
const apiPath = '/api';
const apiUrl = `https://${apiHost}/api`;

const username = process.env.TS_USER;
const password = process.env.TS_PASSWORD;
const loginPath = '/login';

const region = 'us-east-1';
const service = 'execute-api';
const apiKey = process.env.TS_API_KEY;

let awsCredentials;
let crypto;

async function execute(method, path, qs, body) {
    let loginPromise = awsCredentials ? Promise.resolve() : module.exports.login();

    return loginPromise.then(() => {
        qs = qs || {};
        qs.crypto = crypto;
        let qsStr = Object.keys(qs)
            .sort()
            .map(key => `${key}=${encodeURIComponent(typeof qs[key] === 'string'  ? qs[key] : JSON.stringify(qs[key]))}`)
            .join('&');

        const signed = aws4.sign({
                service: service,
                region: region,
                host: apiHost,
                path: apiPath + path + '?' + qsStr,
                method: method,
                body: typeof body === 'object' ? Buffer.from(JSON.stringify(body)) : body,
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            },
            awsCredentials
        );
        const options = {
            method: method,
            uri: apiUrl + path,
            body: body,
            qs: qs,
            headers: signed.headers
        };
        return rp(options);
    });
}

async function login () {
    return rp(
        {
            method: 'POST',
            uri: apiUrl + loginPath,
            body: {
                username: username,
                password: password
            },
            headers: {
                'x-api-key': apiKey
            }
        })
        .then((result) => {
            awsCredentials = {
                accessKeyId: result.accessKey,
                secretAccessKey: result.secretKey,
                sessionToken: result.token,
            };
            crypto = result.crypto;
            return result;
        })
}
module.exports = {
    login: login,
    get: (path, qs) => execute('GET', path, qs),
    post: (path, qs, body) => execute('POST', path, qs, body),
    delete: (path, qs) => execute('DELETE', path, qs),
    put: (path, qs) => execute('PUT', path, qs),
    execute: execute
};