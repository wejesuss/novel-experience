const STORAGE_ACTIVE_IN = 'novelActiveIn';

const enableDisableButton = document.querySelector('input');
const disableInURL = document.querySelector('#disable-url');
const disableInDomain = document.querySelector('#disable-domain');
const clearStorage = document.querySelector('#clear-storage');

let disabledIn = {};
let currentTab = {};

chrome.storage.sync.get([STORAGE_ACTIVE_IN], function (storage) {
  disabledIn = storage[STORAGE_ACTIVE_IN];

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
          changeStyleOfButton(disableInURL, true, 'Enable at this URL');
          changeStyleOfButton(disableInDomain, true, 'Enable in this domain');
          enableDisableButton.checked = false;
        }

        const URLIsDisabled = currentDomain.urls.some((url) => url === currentTab.url);
        if (URLIsDisabled) {
          changeStyleOfButton(disableInURL, true, 'Enable at this URL');
          enableDisableButton.checked = false;
        }

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
      changeStyleOfButton(disableInDomain, false, 'Disable in this domain');
      disabledIn[hostname].disabled = false;
    } else {
      changeStyleOfButton(disableInDomain, true, 'Enable in this domain');
      disabledIn[hostname].disabled = true;
    }
  } else {
    disabledIn[hostname] = {
      disabled: false,
      urls: [],
    };
  }

  chrome.storage.sync.set({ [STORAGE_ACTIVE_IN]: disabledIn }, function () {});
});

disableInURL.addEventListener('click', (e) => {
  // verify current status
  // verify the action requested
  // perform the action
  // change text and color
});

clearStorage.addEventListener('click', () => {
  chrome.storage.sync.clear();
});

function changeStyleOfButton(elem, removeClass, text) {
  removeClass ? elem.classList.remove('enabled') : elem.classList.add('enabled');
  elem.innerHTML = text;
}
