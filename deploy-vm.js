'use strict';

const ts = require('./testing-services');

const environment = {
    "environment": {
        "sequences": null,
        "testsuite": null,
        "product": 57,
        "repo": 76,
        "buildjob": 2000381,
        "type": 2,
        "createdby": 733,
        "status": 3
    }
};

ts.post('/environments', null, environment)
    .then(res => console.info(`Done ${JSON.stringify(res)}`))
    .catch(e => {
        console.error(e);
        process.exit(1);
    });