let scrollSpeed = 1;
let delay = 200;
const intervalIds = [];
const url = window.location.href;

function main() {
  setScroll();
  setPercentageScroll();

  if (url.includes('wuxiaworld') || url.includes('novel')) {
    localStorage.visitedChapterSet = '';
    removeBlockingModal();
    formatParagraphs();
    setNextPrevChapter();
  }
}

function unsetAll() {
  unsetPercentageScroll();
  unsetScroll();
  unsetStopScroll();
  unsetNextPrevChapter();
}

function stopScroll(event) {
  if (event.key === 's') {
    intervalIds.forEach((id) => clearInterval(id));
  }
}

function scrollPage(speed = 1) {
  const id = setInterval(
    (speed) => {
      document.documentElement.scrollTop += speed;
    },
    delay,
    speed
  );

  return id;
}

function scrollWithKey(event) {
  if (event.key === 'k') {
    const id = scrollPage(scrollSpeed);
    intervalIds.push(id);
    setStopScroll();
  }
}

function addPercentageScroll(event) {
  const height = document.documentElement.scrollHeight;
  for (let percentage = 0; percentage < 10; percentage++) {
    if (event.key === `${percentage}`) {
      document.documentElement.scrollTop = (percentage / 10) * height;
    }
  }
}

function addNextPrevChapter(event) {
  const currentNovel = event.view.location.pathname;
  let previousChapterLink = currentNovel;
  let nextChapterLink = currentNovel;

  if (url.includes('novelmania')) {
    const prev = document.querySelector('.p-prev a');
    const next = document.querySelector('.p-next a');

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

  if (event.key === 'ArrowRight') {
    location = nextChapterLink;
  } else if (event.key === 'ArrowLeft') {
    location = previousChapterLink;
  }
}

function setStopScroll() {
  window.addEventListener('keydown', stopScroll);
}

function unsetStopScroll() {
  stopScroll({ key: 's' });
  window.removeEventListener('keydown', stopScroll);
}

function setScroll() {
  window.addEventListener('keydown', scrollWithKey);
}

function unsetScroll() {
  window.removeEventListener('keydown', scrollWithKey);
}

function setPercentageScroll() {
  window.addEventListener('keydown', addPercentageScroll);
}

function unsetPercentageScroll() {
  window.removeEventListener('keydown', addPercentageScroll);
}

function setNextPrevChapter() {
  window.addEventListener('keydown', addNextPrevChapter);
}

function unsetNextPrevChapter() {
  window.removeEventListener('keydown', addNextPrevChapter);
}

function removeBlockingModal() {
  const blockingBoxes = document.querySelectorAll('.modal-backdrop, .fade.in');
  const disabledTexts = document.querySelectorAll('.text-disabled,.no-select');

  if (blockingBoxes && disabledTexts) {
    document.body.style.overflow = 'initial';
    blockingBoxes.forEach((element) => element.remove());
    disabledTexts.forEach((element) => element.classList.remove('text-disabled', 'no-select'));
  }
}

function formatParagraphs() {
  const contentArea =
    document.querySelector('div.content-area') || document.querySelector('div.cha-words');

  if (contentArea) {
    const pTags = contentArea.querySelectorAll('p');

    pTags.forEach((p) => {
      const div = document.createElement('div');
      const br = document.createElement('br');
      const newP = p.cloneNode(true);

      div.append(newP, br);
      p.replaceWith(div);
    });
  }
}
