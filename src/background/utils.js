/* global fisher */

function fetchBuffer(url, onProgress) {
    return new Promise((resolve, reject) => {
        const HTTP_STATUS_SUCCESS = 200;
        const HTTP_STATUS_REDIRECTION = 300;
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
            if (xhr.status >= HTTP_STATUS_SUCCESS && xhr.status < HTTP_STATUS_REDIRECTION) {
                if (xhr.response) {
                    resolve(xhr.response);
                } else {
                    reject(new Error('Empty result'));
                }
            } else {
                reject(new Error(`${xhr.status} (${xhr.statusText})`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        if (onProgress) {
            xhr.onprogress = onProgress;
        }
        xhr.send();
    });
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function bytesToStr(bytes) {
    const KiB = 1024;
    const MiB = 1024 * KiB;
    const GiB = 1024 * MiB;

    if (bytes < GiB) {
        return `${(bytes / MiB).toFixed(1)} МБ`;
    } else {
        return `${(bytes / GiB).toFixed(1)} ГБ`;
    }
}

function addExtraZeros(val, max) {
    const valLength = val.toString().length;
    const maxLength = max.toString().length;
    const diff = maxLength - valLength;

    let zeros = '';

    for (let i = 0; i < diff; i++) {
        zeros += '0';
    }
    return zeros + val.toString();
}

function durationToStr(duration) {
    let seconds = Math.floor(duration);
    let minutes = Math.floor(seconds / 60);

    seconds -= minutes * 60;
    const hours = Math.floor(minutes / 60);

    minutes -= hours * 60;
    return `${hours}:${addExtraZeros(minutes, 10)}:${addExtraZeros(seconds, 10)}`;
}

function clearPath(path, isDir = false) {
    const unsafeChars = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200b-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    let p = path.replace(/^\./, '_'); // первый символ - точка (https://music.yandex.ru/album/2289231/track/20208868)

    p = p.replace(/"/g, "''"); // двойные кавычки в одинарные
    p = p.replace(/\t/g, ' '); // табы в пробелы (https://music.yandex.ru/album/718010/track/6570232)
    p = p.replace(unsafeChars, '');
    p = p.replace(/[\\/:*?<>|~]/g, '_'); // запрещённые символы в винде
    if (isDir) {
        p = p.replace(/(\.| )$/, '_'); // точка или пробел в конце
        // пример папки с точкой в конце https://music.yandex.ru/album/1288439/
        // пример папки с пробелом в конце https://music.yandex.ru/album/62046/
    }
    return p;
}

function parseArtists(allArtists) {
    const VA = 'Various Artists'; // пример https://music.yandex.ru/album/718010/track/6570232
    const UA = 'Unknown Artist'; // пример https://music.yandex.ru/album/533785/track/4790215
    const composers = [];

    let artists = [];

    allArtists.forEach((artist) => {
        if (artist.composer) { // пример https://music.yandex.ru/album/717747/track/6672611
            composers.push(artist.name);
        } else if (artist.various) {
            artists.push(VA);
        } else {
            artists.push(artist.name);
        }
    });
    if (!artists.length) {
        if (composers.length) {
            artists = composers;
        } else {
            artists = [UA];
        }
    }
    return {artists, composers};
}

function getUrlInfo(url) {
    const info = {
        isMusic: false,
        isRadio: false,
        isPlaylist: false,
        isTrack: false,
        isAlbum: false,
        isArtist: false,
        isLabel: false
    };
    if (!url) {
        return info;
    }
    const urlData = new URL(url);
    const parts = urlData.pathname.split('/');
    const musicMatch = urlData.hostname.match(/^music\.yandex\.(ru|by|kz|ua)$/);
    const radioMatch = urlData.hostname.match(/^radio\.yandex\.(ru|by|kz|ua)$/);

    if (musicMatch) {
        info.isMusic = true;
        fisher.yandex.domain = musicMatch[1];
    } else if (radioMatch) {
        info.isRadio = true;
        fisher.yandex.domain = radioMatch[1];
    }
    if (info.isMusic) {
        info.isPlaylist = Boolean(parts.length === 5 && parts[1] === 'users' && parts[3] === 'playlists');
        info.isTrack = Boolean(parts.length === 5 && parts[1] === 'album' && parts[3] === 'track');
        info.isAlbum = Boolean(parts.length === 3 && parts[1] === 'album');
        info.isArtist = Boolean(parts.length > 2 && parts[1] === 'artist');
        info.isLabel = Boolean(parts.length > 2 && parts[1] === 'label');
        if (info.isPlaylist) {
            info.username = parts[2];
            info.playlistId = parts[4];
        } else if (info.isTrack) {
            info.trackId = parts[4];
            info.albumId = parts[2];
        } else if (info.isAlbum) {
            info.albumId = parts[2];
        } else if (info.isArtist) {
            info.artistId = parts[2];
        } else if (info.isLabel) {
            info.labelId = parts[2];
        }
    }
    return info;
}

function updateTabIcon(tab) {
    const page = getUrlInfo(tab.url);

    let icon = 'black';

    if (page.isPlaylist) {
        icon = 'green';
    } else if (page.isAlbum) {
        icon = 'yellow';
    } else if (page.isArtist || page.isLabel) {
        icon = 'pink';
    } else if (page.isMusic || page.isRadio) {
        icon = 'blue';
    }
    chrome.browserAction.setIcon({
        tabId: tab.id,
        path: `background/img/${icon}.png`
    });
}

function getActiveTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            if (tabs.length) {
                resolve(tabs[0]);
            } else {
                reject(new Error('No active tab'));
            }
        });
    });
}

function getDownload(downloadId) {
    return new Promise((resolve) => {
        chrome.downloads.search({
            id: downloadId
        }, (downloads) => {
            if (downloads.length && downloads[0].byExtensionName === chrome.runtime.getManifest().name) {
                resolve(downloads[0]);
            }
        });
    });
}

function updateBadge() {
    const count = window.fisher.downloader.getDownloadCount();

    let countStr = '';

    if (count) {
        countStr = count.toString();
    }
    chrome.browserAction.setBadgeText({
        text: countStr
    });
}

function parseJsonResponse(response) {
    if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
    }
    return response.json();
}

module.exports = {
    fetchBuffer,
    delay,
    bytesToStr,
    addExtraZeros,
    durationToStr,
    clearPath,
    parseArtists,
    getUrlInfo,
    updateTabIcon,
    getActiveTab,
    getDownload,
    updateBadge,
    parseJsonResponse
};
