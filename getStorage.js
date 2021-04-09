const STORAGE_ACTIVE_IN = 'readerActiveIn';

let activeIn = {};
let tab = {
  hostname: location.hostname,
  url: location.href,
};

chrome.storage.onChanged.addListener(updateActiveIn);

function updateActiveIn() {
  chrome.storage.sync.get([STORAGE_ACTIVE_IN], function (items) {
    activeIn = items[STORAGE_ACTIVE_IN] || {};
  });
}

updateActiveIn();
