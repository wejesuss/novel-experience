chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request) {
    switch (request) {
      case 'domain':
        sendResponse(location.hostname);
        break;
      default:
        break;
    }
  } else {
    sendResponse('');
  }

  return true;
});

function toggleExtensionState() {
  const { hostname, url } = tab;
  const domain = {
    active: true,
    urls: [],
    ...activeIn[hostname],
  };

  if (domain.active) {
    const UrlIsBlocked = domain.urls.includes(url);
    if (UrlIsBlocked) {
      unsetAll();
    } else {
      main();
    }
  } else {
    unsetAll();
  }
}
