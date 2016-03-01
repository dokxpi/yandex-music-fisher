'use strict';

const https = require('https');
const fs = require('fs');
const url = require('url');
const path = require('path');
const UriTemplate = require('uritemplate');
const tokens = require('./tokens.json');
const manifest = require('../src/manifest.json');
const assetName = `yandex-music-fisher_${manifest.version}.zip`;

function post(postUrl, type, data) {
    return new Promise((resolve, reject) => {
        const urlDetails = url.parse(postUrl);
        const options = {
            hostname: urlDetails.hostname,
            path: urlDetails.path,
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${tokens.github}`,
                'User-Agent': 'Yandex Music Fisher',
                'Content-Type': type,
                'Content-Length': Buffer.byteLength(data)
            }
        };
        const request = https.request(options, (res) => {
            let data = '';

            if (res.statusCode !== 201) {
                reject(new Error(`HTTP status: ${res.statusCode}`));
            }
            res.setEncoding('utf8');
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)))
        });

        request.write(data);
        request.end();
        request.on('error', (e) => reject(new Error(e)));
    });
}

function createGithubRelease() {
    const releasesUrl = 'https://api.github.com/repos/egoroof/yandex-music-fisher/releases';
    const data = JSON.stringify({
        tag_name: `v${manifest.version}`,
        target_commitish: "master",
        name: manifest.version,
        draft: true
    });

    return post(releasesUrl, 'application/json', data);
}

function uploadGithubAsset(uploadUrl) {
    const buffer = fs.readFileSync(path.join(path.dirname(__dirname), assetName));

    return post(uploadUrl, 'application/zip', buffer);
}

createGithubRelease()
    .then((response) => {
        const template = UriTemplate.parse(response.upload_url);
        const uploadUrl = template.expand({name: assetName});

        console.log(`GitHub release draft '${manifest.version}' was created`);
        return uploadGithubAsset(uploadUrl);
    })
    .then((response) => {
        console.log(`Asset ${assetName} was added to GitHub release draft`);
    })
    .catch((e) => console.error(e));
