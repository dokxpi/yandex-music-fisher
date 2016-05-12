class storage {
    static get defaults() {
        return {
            downloadThreadCount: 4,
            shouldDownloadCover: true,
            albumCoverSize: '600x600',
            albumCoverSizeId3: '400x400',
            enumerateAlbums: true,
            enumeratePlaylists: false,
            singleClickDownload: false,
            backgroundDownload: false,
            shouldUseFolder: false,
            folder: 'music'
        };
    }

    static getItem(item) {
        const value = localStorage.getItem(item);
        return (value === null) ? this.defaults[item] : JSON.parse(value);
    }

    static setItem(item, value) {
        localStorage.setItem(item, JSON.stringify(value));
    }

    static reset() {
        localStorage.clear();
    }
}

module.exports = storage;
