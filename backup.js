const STORAGE_ACTIVE_IN = 'readerActiveIn';

let scrollSpeed = 1;
let removeListenerStopScroll;

function main() {
  const url = window.location.href;
  if (url.includes('wuxiaworld')) {
    localStorage.visitedChapterSet = '';
    removeBlockingModal();
    formatParagraphs();
  }

  if (url.includes('wuxiaworld') || url.includes('novel')) {
    // const id = scrollPage(scrollSpeed);
    // console.log('To stop scroll press "s" or type:', `clearInterval(${id})`);
    // setStopScroll(id);
    // setNextPrevChapter();
  }

  setScroll();
  setPercentageScroll();
}

function removeBlockingModal() {
  const blockingBoxes = document.querySelectorAll('.modal-backdrop, .fade.in');
  const disabledTexts = document.querySelectorAll('.text-disabled');

  if (blockingBoxes && disabledTexts) {
    document.body.style.overflow = 'initial';
    blockingBoxes.forEach((element) => element.remove());
    disabledTexts.forEach((element) => {
      element.classList.remove('text-disabled');
    });
  }
}

function formatParagraphs() {
  const contentArea =
    document.querySelector('div.content-area') || document.querySelector('div.cha-words');

  if (contentArea) {
    const allPTags = contentArea.querySelectorAll('p');

    allPTags.forEach((p) => {
      const div = document.createElement('div');
      const br = document.createElement('br');
      const newP = p.cloneNode(true);

      div.append(newP, br);
      p.replaceWith(div);
    });
  }
}

function scrollPage(speed = 1) {
  const id = setInterval(
    (speed) => {
      document.documentElement.scrollTop += speed;
    },
    100,
    speed
  );

  return id;
}

function addShortCutForScroll(event) {
  if (event.key === 'k') {
    const id = scrollPage(scrollSpeed);
    console.log('To stop scroll press "s" or type:', `clearInterval(${id})`);
    removeListenerStopScroll = setStopScroll(id);
  }
}

function setScroll() {
  window.addEventListener('keydown', addShortCutForScroll);
}

function removeShortCutForScroll(id) {
  return function listenerRemoveShortCutForScroll(event) {
    if (event.key === 's') {
      clearInterval(id);
    }
  };
}

function setStopScroll(id) {
  const fn = removeShortCutForScroll(id);
  window.addEventListener('keydown', fn);
  return function removeListenerStopScroll() {
    window.removeEventListener('keydown', fn);
  };
}

function addPercentageScroll(event) {
  const height = document.documentElement.scrollHeight;
  for (let percentage = 0; percentage < 10; percentage++) {
    if (event.key === `${percentage}`) {
      document.documentElement.scrollTop = (percentage / 10) * height;
    }
  }
}

function setPercentageScroll() {
  window.addEventListener('keydown', addPercentageScroll);
}

function addNextPrevChapter(e) {
  const url = window.location.href;
  const currentNovel = e.view.location.pathname;
  let previousChapterLink = currentNovel;
  let nextChapterLink = currentNovel;

  if (url.includes('novelmania')) {
    const [prevButton, nextButton] = document.querySelectorAll('.p-prev, .p-next');
    const [prev, next] = [prevButton.querySelector('a'), nextButton.querySelector('a')];

    if (prev) {
      previousChapterLink = prev.href;
    }

    if (next) {
      nextChapterLink = next.href;
    }
  } else {
    const currentChapter = Number(currentNovel.split('-').pop());

    nextChapterLink = currentNovel.replace(currentChapter, currentChapter + 1);
    previousChapterLink = currentNovel.replace(
      currentChapter,
      currentChapter - 1 >= 0 ? currentChapter - 1 : 0
    );
  }

  if (e.key === 'ArrowRight') {
    location = nextChapterLink;
  } else if (e.key === 'ArrowLeft') {
    location = previousChapterLink;
  }
}

function setNextPrevChapter() {
  window.addEventListener('keydown', addNextPrevChapter);
}

main();
