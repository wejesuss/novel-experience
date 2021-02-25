const STORAGE_ACTIVE_IN = 'novelActiveIn';

const enableDisableButton = document.querySelector('input');
const disableInURL = document.querySelector('#disable-url');
const disableInDomain = document.querySelector('#disable-domain');
const clearStorage = document.querySelector('#clear-storage');

let disabledIn = {};
let currentTab = {};

chrome.storage.sync.get([STORAGE_ACTIVE_IN], function (storage) {
  disabledIn = storage[STORAGE_ACTIVE_IN] || {};

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentTab = {
      ...tabs[0],
    };

    chrome.runtime.sendMessage(
      { action: 'checkIsBlocked', url: currentTab.url },
      function (blocked) {
        enableDisableButton.checked = !blocked;
      }
    );

    updateExtensionData();
  });
});

function updateExtensionData() {
  chrome.tabs.sendMessage(currentTab.id, { get: 'hostname' }, function (response) {
    if (chrome.runtime.lastError) {
      setTimeout(updateExtensionData, 1000);
    } else {
      currentTab.hostname = response.got;

      const currentDomain = disabledIn[currentTab.hostname];
      if (currentDomain) {
        if (currentDomain.disabled) {
          changeStyleOfButton(disableInDomain, { removeEnabled: true }, 'Enable in this domain');
          enableDisableButton.checked = false;
        }

        const URLIsDisabled = currentDomain.urls.some((url) => url === currentTab.url);
        if (URLIsDisabled) {
          changeStyleOfButton(disableInURL, { removeEnabled: true }, 'Enable at this URL');
          enableDisableButton.checked = false;
        }

        currentDomain.disabled ? disableInURL.classList.add('hidden') : undefined;

        console.log(URLIsDisabled, currentTab);
      } else {
        disabledIn[currentTab.hostname] = {
          disabled: false,
          urls: [],
        };

        chrome.storage.sync.set({ [STORAGE_ACTIVE_IN]: disabledIn }, function () {});
      }

      console.log(disabledIn);
    }
  });
}

enableDisableButton.addEventListener('change', (e) => {
  const checked = e.target.checked;

  chrome.runtime.sendMessage(
    { action: 'updateBlockedList', url: currentTab.url, insert: !checked },
    function () {}
  );
});

disableInDomain.addEventListener('click', () => {
  const hostname = currentTab.hostname;
  const currentDomain = disabledIn[hostname];
  if (currentDomain) {
    if (currentDomain.disabled) {
      changeStyleOfButton(disableInDomain, { removeEnabled: false }, 'Disable in this domain');
      disableInURL.classList.remove('hidden');
      disabledIn[hostname].disabled = false;
    } else {
      changeStyleOfButton(disableInDomain, { removeEnabled: true }, 'Enable in this domain');
      disableInURL.classList.add('hidden');
      disabledIn[hostname].disabled = true;
    }
  } else {
    disableInURL.classList.remove('hidden');

    disabledIn[hostname] = {
      disabled: false,
      urls: [],
    };
  }

  chrome.storage.sync.set({ [STORAGE_ACTIVE_IN]: disabledIn }, function () {});
});

disableInURL.addEventListener('click', () => {
  const hostname = currentTab.hostname;
  const currentDomain = disabledIn[hostname];
  if (currentDomain) {
    const index = currentDomain.urls.indexOf(currentTab.url);

    if (index !== -1) {
      currentDomain.urls[index] = currentDomain.urls[currentDomain.urls.length - 1];
      currentDomain.urls.pop();
      changeStyleOfButton(disableInURL, { removeEnabled: false }, 'Disable at this URL');
    } else {
      currentDomain.urls.push(currentTab.url);
      changeStyleOfButton(disableInURL, { removeEnabled: true }, 'Enable at this URL');
    }
  } else {
    disabledIn[hostname] = {
      disabled: false,
      urls: [],
    };
  }

  chrome.storage.sync.set({ [STORAGE_ACTIVE_IN]: disabledIn }, function () {});
});

clearStorage.addEventListener('click', () => {
  chrome.storage.sync.clear();
  window.location.reload();
});

function changeStyleOfButton(elem, { removeEnabled, removeHidden = true }, text) {
  removeEnabled ? elem.classList.remove('enabled') : elem.classList.add('enabled');
  removeHidden ? elem.classList.remove('hidden') : elem.classList.add('hidden');
  elem.innerHTML = text;
}
