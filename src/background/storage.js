const storage = {
    defaults: {
        downloadThreadCount: 4,
        shouldDownloadCover: true,
        albumCoverSize: '600x600',
        albumCoverSizeId3: '400x400',
        enumerateAlbums: true,
        enumeratePlaylists: false,
        shouldNotifyAboutUpdates: true,
        singleClickDownload: false,
        backgroundDownload: false
    },
    current: {}
};

storage.init = () => {
    const keys = Object.keys(storage.defaults);

    chrome.storage.local.get(keys, (items) => {
        for (let i = 0; i < keys.length; i++) {
            if (typeof items[keys[i]] === 'undefined') {
                storage.reset(keys[i]);
            }
        }
    });
};

storage.load = () => new Promise((resolve) => {
    chrome.storage.local.get((params) => {
        storage.current = params;
        resolve();
    });
});

storage.reset = (param) => {
    const defaultValue = storage.defaults[param];
    const data = {};

    data[param] = defaultValue;
    chrome.storage.local.set(data, storage.load);
};

storage.resetAll = () => new Promise((resolve) => {
    chrome.storage.local.clear(() => chrome.storage.local.set(storage.defaults, resolve));
});

module.exports = storage;
