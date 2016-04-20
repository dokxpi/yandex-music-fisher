'use strict';

const fs = require('fs');
const path = require('path');
const DRAFT_PATH = path.join(__dirname, 'README.draft.md');
const README_PATH = path.join(path.dirname(__dirname), 'README.md');
const manifest = require('../src/manifest.json');
const JSZip = require('jszip');

function walkSync(dir, filelist) {
    const files = fs.readdirSync(dir);

    filelist = filelist || [];
    files.forEach((file) => {
        const relativePath = dir + file;

        if (fs.statSync(relativePath).isDirectory()) {
            filelist = walkSync(`${relativePath}/`, filelist);
        } else {
            filelist.push({
                path: relativePath.replace('src/', ''),
                data: fs.readFileSync(relativePath)
            });
        }
    });
    return filelist;
}

const draft = fs.readFileSync(DRAFT_PATH, 'utf8');
const readme = draft.replace(/#version#/g, manifest.version);

fs.writeFileSync(README_PATH, readme);
console.log('README.md was created');


const list = walkSync('src/');
const zip = new JSZip();
const root = zip.folder('yandex-music-fisher');

list.forEach((file) => {
    root.file(file.path, file.data);
});

zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: {
        level: 9
    }
}).then((buffer) => {
    fs.writeFileSync(`yandex-music-fisher_${manifest.version}.zip`, buffer);
    console.log(`yandex-music-fisher_${manifest.version}.zip was created`);
}).catch((e) => console.error(e));
