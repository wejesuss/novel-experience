const blocked = [];

chrome.runtime.onMessage.addListener(main);

function main(request, _sender, sendResponse) {
  switch (request.action) {
    case 'updateBlockedList':
      handleUpdateBlocked(request, sendResponse);
      break;
    case 'checkIsBlocked':
      checkIsBlocked(request, sendResponse);
      break;
    default:
      sendResponse('');
      break;
  }
}

function checkIsBlocked(request, sendResponse) {
  const { url } = request;
  const index = blocked.indexOf(url);

  if (index !== -1) {
    sendResponse(true);
  } else {
    sendResponse(false);
  }
}

function handleUpdateBlocked(request, sendResponse) {
  const { url, insert } = request;
  const index = blocked.indexOf(url);

  if (insert && index === -1) {
    blocked.push(url);
  }

  if (!insert && index !== -1) {
    blocked[index] = blocked[blocked.length - 1];
    blocked.pop();
  }

  sendResponse('URL updated');
}
