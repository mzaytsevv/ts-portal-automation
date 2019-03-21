'use strict';

const ts = require('./testing-services');

async function main(){
    let ids = [103395, 103478, 103479, 103480, 103487];
    for(let id of ids){
        await ts.delete(`/sequences/103481`, null, null)
            .then(res => {
                console.log(res);
            });
    }
}

main();