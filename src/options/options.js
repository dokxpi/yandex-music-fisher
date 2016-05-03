const $ = document.getElementById.bind(document);
const checkboxes = [
    'shouldDownloadCover',
    'enumerateAlbums',
    'enumeratePlaylists',
    'shouldNotifyAboutUpdates',
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

let backgroundPage;

function saveSetting(setting, value) {
    const options = {};

    options[setting] = value;
    chrome.storage.local.set(options, backgroundPage.fisher.storage.load);
}

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
        const permissions = {
            permissions: ['background']
        };

        chrome.permissions.contains(permissions, (contains) => {
            if ('lastError' in chrome.runtime) { // opera
                backgroundPage.console.info(chrome.runtime.lastError.message);
                $('backgroundDownload').parentNode.parentNode.parentNode.style.display = 'none';
            }
            if (contains && !checked) { // btnReset
                chrome.permissions.remove(permissions);
            }
        });
    }
}

checkboxes.forEach((checkbox) => {
    $(checkbox).addEventListener('click', () => {
        const checked = $(checkbox).checked;

        saveSetting(checkbox, checked);
        afterCheckboxChanged(checkbox);

        if (checkbox === 'backgroundDownload') {
            const permissions = {
                permissions: ['background']
            };

            if (checked) {
                chrome.permissions.request(permissions, (granted) => {
                    if (!granted) {
                        saveSetting(checkbox, false);
                    }
                });
            } else {
                chrome.permissions.remove(permissions, (removed) => {
                    if (!removed) {
                        saveSetting(checkbox, false);
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
        saveSetting(select, value);
    });
});

texts.forEach((text) => {
    $(text).addEventListener('input', () => {
        let value = $(text).value;

        if (text === 'folder') {
            value = backgroundPage.fisher.utils.clearPath(value, true);
            if (value === '') {
                return; // не сохраняем
            }
        }
        saveSetting(text, value);
    });
});

$('btnReset').addEventListener('click', async() => {
    await backgroundPage.fisher.storage.resetAll();
    backgroundPage.fisher.storage.load();
    location.reload();
});

function getBackgroundPage() {
    return new Promise((resolve) => {
        chrome.runtime.getBackgroundPage(resolve);
    });
}

async function loadOptions() {
    backgroundPage = await getBackgroundPage();

    checkboxes.forEach((checkbox) => {
        $(checkbox).checked = backgroundPage.fisher.storage.current[checkbox];
        afterCheckboxChanged(checkbox);
    });

    selects.forEach((select) => {
        $(select).value = backgroundPage.fisher.storage.current[select];
    });

    texts.forEach((text) => {
        $(text).value = backgroundPage.fisher.storage.current[text];
    });
}

loadOptions();
