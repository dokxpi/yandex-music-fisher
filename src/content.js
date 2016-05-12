/* global externalAPI */

function injectCode(func, action) {
    const script = document.createElement('script');

    script.textContent = `'use strict';try{(${func})('${action}');}catch(e){console.log('Fisher injected error',e);};`;
    document.head.appendChild(script);
    script.parentNode.removeChild(script);
}

function dispatchCurrentTrackUrl(action) {
    let link;
    const track = externalAPI.getCurrentTrack();

    if (track && 'link' in track) {
        link = track.link;
    }
    document.dispatchEvent(new CustomEvent('fisher_injected_event', {
        detail: {action, link}
    }));
}

chrome.runtime.onMessage.addListener((action) => {
    switch (action) {
        case 'getCurrentTrackUrl':
            injectCode(dispatchCurrentTrackUrl, action);
            break;
    }
});

document.addEventListener('fisher_injected_event', (e) => chrome.runtime.sendMessage(e.detail));
