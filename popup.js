const STORAGE_ACTIVE_IN = 'readerActiveIn';
const matchDomain = /((?!-)[A-Za-z0-9-]{1,63}((?!-).)\.)+([A-Za-z]{2,6}){1}/g;

class URLButton {
  element = document.getElementById('disable-url');
  enabledText = this.element.getAttribute('data-enabled');
  disabledText = this.element.getAttribute('data-disabled');
  toggleVisibility = () => {
    const domain = activeIn[tab.foundDomain];
    const addOrRemove = domain ? domain.active : true;
    this.element.classList.toggle('hidden', !addOrRemove);
  };
}

class DomainButton {
  element = document.getElementById('disable-domain');
  enabledText = this.element.getAttribute('data-enabled');
  disabledText = this.element.getAttribute('data-disabled');
}

class StorageButton {
  element = document.getElementById('clear-storage');
}

const urlButton = new URLButton();
const domainButton = new DomainButton();
const storageButton = new StorageButton();
const buttons = [urlButton, domainButton, storageButton];
const errorContainer = document.querySelector('.error-message');

let activeIn;
let ready = false;
let error = false;
let tab = {};

chrome.storage.sync.get([STORAGE_ACTIVE_IN], gotItems);

function gotItems(items, callback) {
  activeIn = items[STORAGE_ACTIVE_IN] || {};
  console.log(activeIn);
  if (callback && typeof callback === 'function') {
    callback();
  }
}

function updateActiveIn(callback) {
  chrome.storage.sync.get([STORAGE_ACTIVE_IN], (items) => gotItems(items, callback));
}

chrome.storage.onChanged.addListener(function () {
  updateActiveIn();
});

function onClick(event, triggeredBy) {
  switch (triggeredBy) {
    case 0:
      updateActiveIn(() => urlButtonClicked(event));
      break;
    case 1:
      updateActiveIn(() => domainButtonClicked(event));
      break;
    case 2:
      updateActiveIn(() => storageButtonClicked(event));
      break;
    default:
      break;
  }
}

buttons.forEach((button, index) =>
  button.element.addEventListener('click', (e) => onClick(e, index))
);

function main() {
  getCurrentTabDomain()
    .then((value) => {
      ready = value.ready;
      error = value.error;
      tab = {
        ...value.tab,
        foundDomain: value.foundDomain,
      };
    })
    .catch((value) => {
      ready = value.ready;
      error = value.error;
      tab = {
        ...value.tab,
        foundDomain: value.foundDomain,
      };
    });
}

function sendMessagePromise(tabId, item, successCallback, errorCallback) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, item, function (response) {
      if (!chrome.runtime.lastError) {
        successCallback(response);
        resolve(response);
      } else {
        errorCallback();
        reject('Something went wrong');
      }
    });
  });
}

async function getDomain(tab) {
  let ready = false;
  let error = false;
  let foundDomain = '';

  const domains = tab.url.match(matchDomain);

  if (domains) {
    ready = true;
    return {
      ready,
      error,
      foundDomain: domains[0],
    };
  }

  await sendMessagePromise(
    tab.id,
    { get: 'domain' },
    (response) => {
      foundDomain = response;
      ready = true;
    },
    () => {
      console.log(chrome.runtime.lastError);
      const err =
        "<p>Sorry, something went wrong with this tab, maybe this action can't be completed in this tab, reload the page and try again.</p>";
      updateErrorContainer(err);
      error = true;
    }
  );

  return {
    ready,
    error,
    foundDomain,
  };
}

function getCurrentTabDomain() {
  let ready = false;
  let error = false;
  let foundDomain = '';
  let tab;

  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        try {
          if (tabs && Array.isArray(tabs) && tabs[0]) {
            getDomain(tabs[0]).then((value) => {
              foundDomain = value.foundDomain;
              ready = value.ready;
              error = value.error;

              resolve({ foundDomain, ready, error, tab });
            });

            tab = tabs[0];
          } else {
            const err =
              '<p>Sorry, something went wrong with this tab, the current tab could not be found.</p>';
            updateErrorContainer(err);
            error = true;
            reject({ foundDomain, ready, error, tab });
          }
        } catch (errorMessage) {
          console.log(errorMessage);
          const err =
            "<p>Sorry, something went wrong 🙁 maybe this action can't be completed in this tab, reload the page and try again.</p>";
          updateErrorContainer(err);
          error = true;
          reject({ foundDomain, ready, error, tab });
        }
      }
    );
  });
}

function toggleDomainPreferences(domainPreferences = { active: true, urls: [''] }) {
  let removeDomain = false;
  let disable = false;

  if (domainPreferences.active) {
    domainPreferences.active = false;
    disable = true;
  } else {
    if (domainPreferences.urls.length === 0) {
      removeDomain = true;
    }

    domainPreferences.active = true;
  }

  if (removeDomain) {
    return [undefined, disable];
  } else {
    return [domainPreferences, disable];
  }
}

function toggleUrlPreferences(domainPreferences = { active: true, urls: [''] }, url) {
  let removeDomain = false;
  let disable = false;
  const index = domainPreferences.urls.indexOf(url);

  if (index !== -1) {
    if (domainPreferences.urls.length === 1) {
      removeDomain = true;
    }

    domainPreferences.urls.splice(index, 1);
  } else {
    domainPreferences.urls.push(url);
    disable = true;
  }

  if (removeDomain) {
    return [undefined, disable];
  } else {
    return [domainPreferences, disable];
  }
}

function urlButtonClicked(event) {
  let limit = 0;

  const id = setInterval(() => {
    console.log(ready, error, tab, limit);
    if (ready || error) {
      if (tab.foundDomain && !error) {
        const url = tab.url;
        let savedPreferences = {
          active: true,
          urls: [],
          ...activeIn[tab.foundDomain],
        };

        if (savedPreferences && savedPreferences.active) {
          const [newPreferences, disable] = toggleUrlPreferences(savedPreferences, url);
          activeIn[tab.foundDomain] = newPreferences;

          chrome.storage.sync.set({ [STORAGE_ACTIVE_IN]: activeIn }, function () {
            updateButtonStyle(urlButton, disable);
            // comunicate background script
          });
        }
      }

      clearInterval(id);
    }

    if (limit >= 10) {
      const err = '<p>Sorry, something went wrong. The limit of tries was surpassed.</p>';
      updateErrorContainer(err);
      clearInterval(id);
    }

    limit++;
  }, 1000);
}

function domainButtonClicked(event) {
  let limit = 0;

  const id = setInterval(() => {
    console.log(ready, error, tab, limit);
    if (ready || error) {
      if (tab.foundDomain && !error) {
        let savedPreferences = {
          active: true,
          urls: [],
          ...activeIn[tab.foundDomain],
        };

        const [newPreferences, disable] = toggleDomainPreferences(savedPreferences);
        activeIn[tab.foundDomain] = newPreferences;

        chrome.storage.sync.set({ [STORAGE_ACTIVE_IN]: activeIn }, function () {
          updateButtonStyle(domainButton, disable);
          urlButton.toggleVisibility();
          // comunicate background script
        });
      }

      clearInterval(id);
    }

    if (limit >= 10) {
      const err = '<p>Sorry, something went wrong. The limit of tries was surpassed.</p>';
      updateErrorContainer(err);
      clearInterval(id);
    }

    limit++;
  }, 1000);
}

function storageButtonClicked(event) {
  chrome.storage.sync.clear(function () {
    console.log(activeIn);
  });
}

function updateErrorContainer(err) {
  errorContainer.innerHTML = err;
  errorContainer.classList.add('active');
}

function updateButtonStyle(button, disable) {
  if (disable) {
    button.element.classList.remove('enabled');
    button.element.innerText = button.disabledText;
  } else {
    button.element.classList.add('enabled');
    button.element.innerText = button.enabledText;
  }
}

main();
