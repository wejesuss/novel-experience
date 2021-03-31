const STORAGE_ACTIVE_IN = 'readerActiveIn';
const matchDomain = /((?!-)[A-Za-z0-9-]{1,63}((?!-).)\.)+([A-Za-z]{2,6}){1}/g;

class URLButton {
  element = document.getElementById('disable-url');
  enabledText = this.element.getAttribute('data-enabled');
  disabledText = this.element.getAttribute('data-disabled');
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

chrome.storage.sync.get(STORAGE_ACTIVE_IN, gotItems);

// console.log({
//   'www.wuxiaworld.com': {
//     active: true,
//     urls: ['https://www.wuxiaworld.com/novel/against-the-gods/atg-chapter-702'],
//   },
// });

function gotItems(items, callback) {
  console.log(items);
  activeIn = items;
  if (callback && typeof callback === 'function') {
    callback();
  }
}

function updateActiveIn(callback) {
  chrome.storage.sync.get(STORAGE_ACTIVE_IN, (items) => gotItems(items, callback));
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
    foundDomain = domains[0];
    ready = true;
    return {
      ready,
      error,
      foundDomain,
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

function urlButtonClicked(event) {
  let ready = false;
  let error = false;
  let foundDomain = '';
  let tab;
  let limit = 0;

  getCurrentTabDomain()
    .then((value) => {
      ready = value.ready;
      error = value.error;
      foundDomain = value.foundDomain;
      tab = value.tab;
    })
    .catch((value) => {
      ready = value.ready;
      error = value.error;
      foundDomain = value.foundDomain;
      tab = value.tab;
    });

  const id = setInterval(() => {
    console.log(foundDomain, ready, error, tab);
    if (ready || error) {
      if (foundDomain && !error) {
        // verify if this button could be clicked
        // get hostname and url
        // add/remove to/from storage
        // if removed and there is only this url, also remove the domain
        // change button style
        // comunicate background script
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
  console.log(activeIn);
  // get hostname and url
  // verify if this button could be clicked
  // add/remove to/from storage
  // if removed and there is only this url, also remove the domain
  // change button style
  // comunicate background script
}

function storageButtonClicked(event) {
  console.log(activeIn);
  // verify if this button could be clicked
  // get hostname and url
  // add/remove to/from storage
  // if removed and there is only this url, also remove the domain
  // change button style
  // comunicate background script
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
