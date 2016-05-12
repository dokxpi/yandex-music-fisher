const $ = document.getElementById.bind(document);
const checkboxes = [
    'shouldDownloadCover',
    'enumerateAlbums',
    'enumeratePlaylists',
    'singleClickDownload',
    'backgroundDownload',
    'shouldUseFolder'
];
const selects = [
    'downloadThreadCount',
    'albumCoverSize',
    'albumCoverSizeId3'
];
const texts = [
    'folder'
];

let background;

function afterCheckboxChanged(checkbox) { // изменение UI
    const checked = $(checkbox).checked;

    if (checkbox === 'shouldDownloadCover') {
        if (checked) {
            $('albumCoverSize').removeAttribute('disabled');
        } else {
            $('albumCoverSize').setAttribute('disabled', 'disabled');
        }
    } else if (checkbox === 'shouldUseFolder') {
        if (checked) {
            $('folder').removeAttribute('disabled');
        } else {
            $('folder').setAttribute('disabled', 'disabled');
        }
    } else if (checkbox === 'backgroundDownload') {
        if (!PLATFORM_CHROMIUM) {
            $('backgroundDownload').parentNode.parentNode.parentNode.style.display = 'none';
            return;
        }

        const permissions = {
            permissions: ['background']
        };
        chrome.permissions.contains(permissions, (contains) => {
            if (contains && !checked) { // btnReset
                chrome.permissions.remove(permissions);
            }
        });
    }
}

checkboxes.forEach((checkbox) => {
    $(checkbox).addEventListener('click', () => {
        const checked = $(checkbox).checked;

        background.fisher.storage.setItem(checkbox, checked);
        afterCheckboxChanged(checkbox);

        if (checkbox === 'backgroundDownload') {
            if (!PLATFORM_CHROMIUM) {
                return;
            }

            const permissions = {
                permissions: ['background']
            };
            if (checked) {
                chrome.permissions.request(permissions, (granted) => {
                    if (!granted) {
                        background.fisher.storage.setItem(checkbox, false);
                    }
                });
            } else {
                chrome.permissions.remove(permissions, (removed) => {
                    if (!removed) {
                        background.fisher.storage.setItem(checkbox, false);
                    }
                });
            }
        }
    });
});

selects.forEach((select) => {
    $(select).addEventListener('click', () => {
        let value = $(select).value;

        if (select === 'downloadThreadCount') {
            value = parseInt(value, 10);
        }
        background.fisher.storage.setItem(select, value);
    });
});

texts.forEach((text) => {
    $(text).addEventListener('input', () => {
        let value = $(text).value;

        if (text === 'folder') {
            value = background.fisher.utils.clearPath(value, true);
            if (value === '') {
                return; // не сохраняем
            }
        }
        background.fisher.storage.setItem(text, value);
    });
});

$('btnReset').addEventListener('click', () => {
    background.fisher.storage.reset();
    loadOptions();
});

function getBackgroundPage() {
    return new Promise((resolve) => {
        chrome.runtime.getBackgroundPage(resolve);
    });
}

async function loadOptions() {
    background = await getBackgroundPage();

    checkboxes.forEach((checkbox) => {
        $(checkbox).checked = background.fisher.storage.getItem(checkbox);
        afterCheckboxChanged(checkbox);
    });

    selects.forEach((select) => {
        $(select).value = background.fisher.storage.getItem(select);
    });

    texts.forEach((text) => {
        $(text).value = background.fisher.storage.getItem(text);
    });
}

loadOptions();
