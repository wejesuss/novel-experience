chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (request && request.get && request.get === 'domain') {
    sendResponse(location.hostname);
  } else {
    sendResponse('');
  }

  return true;
});
