const https = require('https');
const urlParser = require('url');
const MIN_SIZE = 10;
const MAX_SIZE = 1000;
const SIZE_INCREMENT = 5;
const coverUrl = 'https://avatars.yandex.net/get-music-content/d880c58e.a.2256742-1/';
let chain = Promise.resolve();

function httpsHead(url) {
    return new Promise((resolve, reject) => {
        const urlDetails = urlParser.parse(url);
        const options = {
            method: 'HEAD',
            hostname: urlDetails.hostname,
            path: urlDetails.path
        };
        const request = https.request(options, (res) => {
            if (res.statusCode === 200) {
                resolve();
            } else {
                reject(new Error('HTTP bad status'));
            }
        });
        request.on('error', (e) => reject(new Error(e)));
        request.end();
    });
}

console.log('Started looking for cover sizes');

for (let i = MIN_SIZE; i <= MAX_SIZE; i += SIZE_INCREMENT) {
    const size = `${i}x${i}`;

    chain = chain.then(() => httpsHead(coverUrl + size))
        .then(() => console.log(size))
        .catch((e) => {
            if (e.message !== 'HTTP bad status') {
                console.error(size, e.message);
            }
        });
}

chain.then(() => console.log('Finished'));
