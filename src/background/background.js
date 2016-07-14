/* global ga */

require('../vendor/ga');

const utils = require('./utils');
const Yandex = require('./yandex');
const storage = require('./storage');
const downloader = require('./downloader');
const version = chrome.runtime.getManifest().version;
const fisher = {
    utils,
    yandex: new Yandex(),
    storage,
    downloader
};

window.fisher = fisher;

ga('create', 'UA-65530110-1', 'auto');
ga('set', 'checkProtocolTask', null); // разрешает протокол "chrome-extension"
ga('set', 'page', '/home');
ga('send', 'event', 'load', version);

chrome.browserAction.setBadgeBackgroundColor({
    color: [100, 100, 100, 255]
});

if (!PLATFORM_FIREFOX) {
    chrome.runtime.onInstalled.addListener((details) => { // установка или обновление расширения
        if (details.reason === 'install') {
            ga('send', 'event', 'install', version);
        } else if (details.reason === 'update' && details.previousVersion !== version) {
            ga('send', 'event', 'update', `${details.previousVersion} > ${version}`);

            const majorPrevVersion = details.previousVersion.split('.')[0];
            if (majorPrevVersion === '0' || majorPrevVersion === '1') {
                chrome.tabs.create({
                    url: '/background/migration.html'
                });
            }
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { // изменение URL
    fisher.utils.updateTabIcon(tab);
});

chrome.tabs.onActivated.addListener((activeInfo) => { // выбор другой вкладки
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }
        fisher.utils.updateTabIcon(tab);
    });
});

chrome.downloads.onChanged.addListener((delta) => {
    const entity = downloader.getEntityByBrowserDownloadId(delta.id);
    if (!entity) { // загрузка не от нашего расширения
        return;
    }

    if (!delta.state) { // состояние не изменилось (начало загрузки)
        if (PLATFORM_CHROMIUM) {
            chrome.downloads.setShelfEnabled(true);
        }
        return;
    }
    const state = delta.state.current; // in_progress -> interrupted || complete
    if (state === 'complete') {
        entity.status = downloader.STATUS.FINISHED;
        fisher.utils.updateBadge();
    } else if (state === 'interrupted') {
        entity.loadedBytes = 0;
        entity.status = downloader.STATUS.INTERRUPTED;
        console.error(delta, entity);
    }
    window.URL.revokeObjectURL(entity.browserDownloadUrl);
    chrome.downloads.erase({
        id: delta.id
    });
    downloader.activeThreadCount--;
    downloader.download();
});
