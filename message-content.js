chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request) {
    switch (request) {
      case 'domain':
        sendResponse(location.hostname);
        break;
      case 'toggleExtensionState':
        sendResponse('');
        break;
      default:
        break;
    }
  } else {
    sendResponse('');
  }

  return true;
});
