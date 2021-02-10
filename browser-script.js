const STORAGE_ACTIVE_IN = 'novelActiveIn';

const enableDisableButton = document.querySelector('input');
const disableInURL = document.querySelector('#disable-url');
const disableInDomain = document.querySelector('#disable-domain');

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
        console.log({ blocked });
        enableDisableButton.checked = !blocked;
      }
    );

    chrome.tabs.sendMessage(currentTab.id, { get: 'hostname' }, function (response) {
      currentTab.hostname = response.got;

      const currentDomain = disabledIn[currentTab.hostname];
      if (currentDomain) {
        if (currentDomain.disabled) {
          disableInURL.classList.remove('enabled');
          disableInURL.innerHTML = 'Enable in this URL';

          disableInDomain.classList.remove('enabled');
          disableInDomain.innerHTML = 'Enable in this domain';
        }

        const URLIsDisabled = currentDomain.urls.some((url) => url === currentTab.url);
        if (URLIsDisabled) {
          disableInURL.classList.remove('enabled');
          disableInURL.innerHTML = 'Enable in this URL';
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
    });
  });
});

enableDisableButton.addEventListener('change', (e) => {
  const checked = e.target.checked;

  chrome.runtime.sendMessage(
    { action: 'updateBlockedList', url: currentTab.url, insert: !checked },
    function (response) {}
  );
});
