'use strict';

const ts = require('./testing-services');

const sequence = {
    "title": `Title ${Date.now()}`,
    "scope": `Scope`,
    "createby": 733,
    "product": 535,
    "repo": 767,
    "state": 1
};

async function main (){
    await ts.post('/sequences', null, { "sequence": sequence })
        .then(res => ts.get(`/sequences/${res.sequence.id}`))
        .then((res) => {
            console.log(res);
        })
        .catch(e => {
            console.error(e);
            process.exit(1);
        });

}