const https = require('https');
const urlParser = require('url');

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        const urlDetails = urlParser.parse(url);
        const options = {
            hostname: urlDetails.hostname,
            path: urlDetails.path,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Yandex Music Fisher'
            }
        };
        const request = https.request(options, (res) => {
            let data = '';

            if (res.statusCode !== 200) {
                reject(new Error(`HTTP status: ${res.statusCode}`));
            }
            res.setEncoding('utf8');
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });

        request.on('error', reject);
        request.end();
    });
}

httpsGet('https://api.github.com/repos/egoroof/yandex-music-fisher/releases')
    .then((response) => {
        let totalCount = 0;

        console.log('GitHub download statistics');
        response.forEach((release) => {
            console.log(`--- ${release.name} ---`);
            let count = 0;
            release.assets.forEach((asset) => {
                count += asset.download_count;
                console.log(`${asset.name}: ${asset.download_count}`);
            });

            totalCount += count;
            console.log('');
        });
        console.log(`Total: ${totalCount}`);
    })
    .catch((e) => console.error(e));
